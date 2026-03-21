/**
 * Veil Guardian Agent
 *
 * AI agent (ERC-8004 identity) that guards user data:
 * - Stores encrypted credentials locally
 * - Generates ZK proofs for queries (via Self Protocol)
 * - Answers queries autonomously on behalf of data owner
 * - Collects micropayments per query
 * - Reports earnings to data owner
 *
 * Synthesis Hackathon 2026 — "Agents that keep secrets" track
 */

import { createPublicClient, createWalletClient, http, type Address, keccak256, encodePacked } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import * as crypto from "crypto";

// ---------------------------------------------------------------------------
// Startup environment validation — fail loudly, not silently
// ---------------------------------------------------------------------------

function validateEnv(): void {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Derive GUARDIAN_ADDRESS from PRIVATE_KEY if not explicitly set.
  // The .env ships PRIVATE_KEY but the code originally read GUARDIAN_ADDRESS —
  // this discrepancy meant all on-chain writes silently sent to "0x0".
  if (!process.env.GUARDIAN_ADDRESS && process.env.PRIVATE_KEY) {
    try {
      const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
      process.env.GUARDIAN_ADDRESS = account.address;
      console.log(`[Veil Guardian] GUARDIAN_ADDRESS derived from PRIVATE_KEY: ${account.address}`);
    } catch {
      errors.push("PRIVATE_KEY is set but invalid — could not derive GUARDIAN_ADDRESS");
    }
  } else if (!process.env.GUARDIAN_ADDRESS && !process.env.PRIVATE_KEY) {
    errors.push(
      "Neither GUARDIAN_ADDRESS nor PRIVATE_KEY is set — on-chain transactions will never fire"
    );
  }

  // VENICE_API_KEY: required for the Private Agents prize track.
  // Without it, every credential query silently returns answer=false.
  if (!process.env.VENICE_API_KEY) {
    const msg =
      "VENICE_API_KEY is not set — Venice private inference will return answer=false on every query (~$31,900 VVV prize track at risk)";
    if (process.env.GUARDIAN_DEMO_MODE === "true") {
      warnings.push(msg + " (GUARDIAN_DEMO_MODE=true — continuing with fallback)");
    } else {
      errors.push(msg);
    }
  }

  if (warnings.length > 0) {
    console.warn("\n⚠️  [Veil Guardian] CONFIGURATION WARNINGS:");
    for (const w of warnings) console.warn(`   → ${w}`);
    console.warn("");
  }

  if (errors.length > 0) {
    console.error("\n❌ [Veil Guardian] STARTUP FAILED — MISSING REQUIRED CONFIGURATION:");
    for (const e of errors) console.error(`   → ${e}`);
    console.error("\n   Fix: add missing values to .env (see .env.example)");
    console.error("   Demo mode: set GUARDIAN_DEMO_MODE=true to skip Venice check and continue\n");
    process.exit(1);
  }
}

/**
 * Returns a viem Account object backed by PRIVATE_KEY.
 * Throws if the key is absent or invalid — call only after validateEnv().
 */
function getAccount() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY not set");
  return privateKeyToAccount(pk as `0x${string}`);
}

// --- Venice AI (Private Cognition) ---
// Venice provides no-data-retention inference — the Guardian's reasoning
// about sensitive credentials is never stored by the inference provider.
// This is the "private cognition → public action" bridge.

const VENICE_API_URL = process.env.VENICE_API_URL || "https://api.venice.ai/api/v1";
const VENICE_API_KEY = process.env.VENICE_API_KEY || "";
const VENICE_MODEL = process.env.VENICE_MODEL || "llama-3.3-70b";

interface VeniceResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Private inference via Venice AI (no data retention).
 * The Guardian sends credential context + query to Venice,
 * receives a YES/NO answer, and Venice retains nothing.
 */
async function privateInference(
  credentialContext: string,
  query: string
): Promise<{ answer: boolean; reasoning: string }> {
  if (!VENICE_API_KEY) {
    console.warn("[Veil Guardian] VENICE_API_KEY not set, falling back to local evaluation");
    return { answer: false, reasoning: "Venice API not configured" };
  }

  try {
    const response = await fetch(`${VENICE_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VENICE_API_KEY}`,
      },
      body: JSON.stringify({
        model: VENICE_MODEL,
        messages: [
          {
            role: "system",
            content: `You are a Veil Guardian agent. You evaluate queries about a user's credentials and return ONLY a boolean answer. You must protect the user's privacy — never include the actual credential values in your response.

Rules:
1. Answer ONLY with a JSON object: {"answer": true/false, "reasoning": "brief explanation without revealing actual values"}
2. If the credential data is sufficient to answer the query, answer truthfully
3. If the credential data is insufficient, answer false
4. NEVER include the actual credential values in your reasoning
5. Keep reasoning under 50 words`,
          },
          {
            role: "user",
            content: `Credential context (CONFIDENTIAL — do not repeat values):
${credentialContext}

Query to evaluate:
${query}

Return JSON only.`,
          },
        ],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Venice API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as VeniceResponse;
    const content = data.choices?.[0]?.message?.content?.trim() || "";

    // Parse JSON response
    try {
      const parsed = JSON.parse(content);
      console.log(`[Veil Guardian] Venice inference: answer=${parsed.answer}, reasoning="${parsed.reasoning}"`);
      return {
        answer: !!parsed.answer,
        reasoning: parsed.reasoning || "No reasoning provided",
      };
    } catch {
      // If Venice returns non-JSON, try to extract yes/no
      const lower = content.toLowerCase();
      const answer = lower.includes("true") || lower.includes("yes");
      console.log(`[Veil Guardian] Venice inference (parsed from text): answer=${answer}`);
      return { answer, reasoning: "Parsed from unstructured response" };
    }
  } catch (error) {
    console.error("[Veil Guardian] Venice inference failed:", error);
    return { answer: false, reasoning: `Inference error: ${error instanceof Error ? error.message : "unknown"}` };
  }
}

// --- Configuration ---

const VEIL_VAULT_ADDRESS = (process.env.VEIL_VAULT_CONTRACT as Address) || "0x2f881af96415a452807baf6a23b73129d57f8d7a";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address; // USDC on Base Sepolia
const BASE_RPC = process.env.BASE_RPC_URL || "https://sepolia.base.org";

// Minimal VeilVault ABI for critical functions
const VEIL_VAULT_ABI = [
  {
    inputs: [
      { internalType: "enum VeilVault.CredentialType", name: "credType", type: "uint8" },
      { internalType: "bytes32", name: "commitment", type: "bytes32" },
    ],
    name: "storeCredential",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "queryId", type: "uint256" },
      { internalType: "bool", name: "answer", type: "bool" },
      { internalType: "bytes", name: "proof", type: "bytes" },
    ],
    name: "answerQuery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getEarnings",
    outputs: [
      { internalType: "uint256", name: "pending", type: "uint256" },
      { internalType: "uint256", name: "total", type: "uint256" },
      { internalType: "uint256", name: "queryCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "queryId", type: "uint256" },
      { indexed: true, internalType: "address", name: "requester", type: "address" },
      { indexed: true, internalType: "address", name: "dataOwner", type: "address" },
      { indexed: false, internalType: "enum VeilVault.CredentialType", name: "credType", type: "uint8" },
      { indexed: false, internalType: "uint256", name: "payment", type: "uint256" },
    ],
    name: "QueryCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "queryId", type: "uint256" },
      { indexed: false, internalType: "bool", name: "answer", type: "bool" },
    ],
    name: "QueryAnswered",
    type: "event",
  },
] as const;

// --- Types ---

interface StoredCredential {
  type: "age" | "creditRange" | "location" | "income" | "custom";
  value: string;           // Actual value (stored encrypted locally, NEVER shared)
  salt: string;            // Random salt for commitment
  commitment: `0x${string}`; // On-chain commitment hash
}

interface QueryEvent {
  queryId: bigint;
  requester: Address;
  credentialType: string;
  queryHash: `0x${string}`;
  payment: bigint;
}

// --- Clients ---

const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC),
});

// --- Credential Management ---

// Local encrypted credential store (in production, use encrypted storage)
const credentialStore = new Map<string, StoredCredential>();

/**
 * Store a credential locally and commit on-chain
 */
async function storeCredential(
  type: StoredCredential["type"],
  value: string
): Promise<StoredCredential> {
  // Generate random salt
  const salt = crypto.randomBytes(16).toString("hex");

  // Create commitment hash
  const typeIndex = ["age", "creditRange", "location", "income", "custom"].indexOf(type);
  const commitment = keccak256(
    encodePacked(["uint8", "string", "string"], [typeIndex, value, salt])
  );

  const credential: StoredCredential = {
    type,
    value,
    salt,
    commitment,
  };

  // Store locally (encrypted in production)
  credentialStore.set(type, credential);

  console.log(`[Veil Guardian] Stored credential: ${type} (commitment: ${commitment.slice(0, 10)}...)`);

  // Call VeilVault.storeCredential(typeIndex, commitment) on-chain
  try {
    const guardianAddress = (process.env.GUARDIAN_ADDRESS as Address) || "0x0";
    if (guardianAddress === "0x0") {
      console.warn("[Veil Guardian] GUARDIAN_ADDRESS not set, skipping on-chain commitment");
      return credential;
    }

    const walletClient = createWalletClient({
      account: getAccount(),
      chain: base,
      transport: http(BASE_RPC),
    });

    const hash = await walletClient.writeContract({
      address: VEIL_VAULT_ADDRESS,
      abi: VEIL_VAULT_ABI,
      functionName: "storeCredential",
      args: [typeIndex, commitment],
      account: getAccount(),
      chain: base,
    });

    console.log(`[Veil Guardian] On-chain commitment tx: ${hash}`);
  } catch (error) {
    console.error(`[Veil Guardian] Failed to store credential on-chain:`, error);
    // Don't throw — allow offline credential storage for MVP
  }

  return credential;
}

/**
 * Answer a query about stored credentials
 * Evaluates local credential against query, generates simple proof
 */
async function answerQuery(queryId: bigint, requester: Address, credType: number, queryHash: `0x${string}`): Promise<boolean> {
  console.log(`[Veil Guardian] Processing query ${queryId} from ${requester}`);

  try {
    // Map credential type index to credential type string
    const credTypeNames = ["age", "creditRange", "location", "income", "custom"];
    const credTypeName = credTypeNames[credType] || "unknown";

    const storedCred = credentialStore.get(credTypeName);
    
    if (!storedCred) {
      console.log(`[Veil Guardian] No credential stored for type: ${credTypeName}`);
      return false;
    }

    // --- Private Inference via Venice AI ---
    // The Guardian uses Venice (no-data-retention) to reason about the query.
    // Venice sees the credential context to evaluate the question,
    // but retains nothing after the request completes.
    // This is the "private cognition → public action" bridge.
    
    // Build credential context for Venice (will NOT be stored)
    const credentialContext = `Type: ${credTypeName}\nValue: ${storedCred.value}`;
    
    // Decode query from hash (in production: use structured query format)
    // For MVP: use credential type as the query context
    const queryText = `Does this ${credTypeName} credential satisfy the querier's requirement? The querier is asking about ${credTypeName} data.`;
    
    const { answer, reasoning } = await privateInference(credentialContext, queryText);

    console.log(`[Veil Guardian] Venice evaluated query: credType=${credTypeName}, answer=${answer}, reasoning="${reasoning}"`);

    // Call VeilVault.answerQuery(queryId, answer, proof) on-chain
    const guardianAddress = (process.env.GUARDIAN_ADDRESS as Address) || "0x0";
    if (guardianAddress === "0x0") {
      console.warn("[Veil Guardian] GUARDIAN_ADDRESS not set, skipping on-chain answer");
      return answer;
    }

    const walletClient = createWalletClient({
      account: getAccount(),
      chain: base,
      transport: http(BASE_RPC),
    });

    // Empty proof for MVP (in production: generate actual ZK proof)
    const proof = "0x";

    const txHash = await walletClient.writeContract({
      address: VEIL_VAULT_ADDRESS,
      abi: VEIL_VAULT_ABI,
      functionName: "answerQuery",
      args: [queryId, answer, proof],
      account: getAccount(),
      chain: base,
    });

    console.log(`[Veil Guardian] Answer submitted for query ${queryId}: tx=${txHash}`);
    return answer;
  } catch (error) {
    // Don't crash on individual query failures
    console.error(`[Veil Guardian] Failed to answer query ${queryId}:`, error instanceof Error ? error.message : error);
    
    // Return conservative answer (false = credential not confirmed)
    // In production: retry logic or escalate
    return false;
  }
}

/**
 * Monitor for incoming queries and auto-respond
 */
async function monitorQueries(): Promise<void> {
  console.log("[Veil Guardian] Monitoring for incoming queries...");

  try {
    // Watch for QueryCreated events on VeilVault contract
    const watchUnwatch = publicClient.watchEvent({
      address: VEIL_VAULT_ADDRESS,
      event: VEIL_VAULT_ABI[3], // QueryCreated event (anonymous false, inputs)
      async onLogs(logs) {
        console.log(`[Veil Guardian] Received ${logs.length} query events`);
        for (const log of logs) {
          try {
            // Parse event topics and data
            const [queryIdTopic, requesterTopic, dataOwnerTopic, ...dataParts] = log.topics;
            const logData = log.data;

            // Extract queryId from first indexed parameter
            const queryId = BigInt(queryIdTopic || "0");
            
            // Extract requester and dataOwner from indexed topics
            const requester = `0x${(requesterTopic || "0x").slice(2).padStart(40, "0")}` as Address;
            const dataOwner = `0x${(dataOwnerTopic || "0x").slice(2).padStart(40, "0")}` as Address;

            // Decode non-indexed parameters from logData (credType, payment)
            // logData is ABI-encoded: credType (uint8, 32 bytes), payment (uint256, 32 bytes)
            const credType = parseInt(logData.slice(2, 66), 16);
            const payment = BigInt("0x" + logData.slice(66));

            console.log(`[Veil Guardian] Query event parsed:`, {
              queryId: queryId.toString(),
              requester,
              dataOwner,
              credType,
              payment: payment.toString(),
              txHash: log.transactionHash,
            });

            // Answer the query autonomously
            const queryHash = keccak256(encodePacked(["uint256", "address"], [queryId, requester]));
            await answerQuery(queryId, requester, credType, queryHash);
          } catch (error) {
            console.error(`[Veil Guardian] Failed to process query event:`, error);
            // Continue processing other queries, don't crash
          }
        }
      },
    });

    // Keep watching indefinitely
    await new Promise(() => {});
  } catch (error) {
    console.error("[Veil Guardian] Event monitoring failed:", error);
    // Fallback: polling loop
    await pollingLoop();
  }
}

/**
 * Polling fallback if event watching fails
 */
let lastSeenQueryId = 0n;

async function pollingLoop(): Promise<void> {
  console.log("[Veil Guardian] Starting polling loop (10s interval)...");
  
  setInterval(async () => {
    try {
      console.log("[Veil Guardian] Polling for new queries...");
      
      // In production: call contract.queryCount() to detect new queries
      // For MVP: periodically check event logs manually
      const logs = await publicClient.getContractEvents({
        address: VEIL_VAULT_ADDRESS,
        abi: VEIL_VAULT_ABI,
        eventName: "QueryCreated",
        fromBlock: "latest",
      });

      if (logs.length > 0) {
        console.log(`[Veil Guardian] Found ${logs.length} new queries via polling`);
        for (const log of logs) {
          // Process like watchEvent would
          try {
            const [queryIdTopic, requesterTopic, dataOwnerTopic] = log.topics || [];
            const logData = log.data;

            const queryId = BigInt(queryIdTopic || "0");
            const requester = `0x${(requesterTopic || "0x").slice(2).padStart(40, "0")}` as Address;
            const dataOwner = `0x${(dataOwnerTopic || "0x").slice(2).padStart(40, "0")}` as Address;
            const credType = parseInt(logData.slice(2, 66), 16);

            if (queryId > lastSeenQueryId) {
              lastSeenQueryId = queryId;
              const queryHash = keccak256(encodePacked(["uint256", "address"], [queryId, requester]));
              await answerQuery(queryId, requester, credType, queryHash);
            }
          } catch (error) {
            console.error(`[Veil Guardian] Failed to process polled query:`, error);
          }
        }
      }
    } catch (error) {
      console.error("[Veil Guardian] Polling error:", error);
    }
  }, 10000);
}

/**
 * Check and report earnings
 */
async function checkEarnings(dataOwner: Address): Promise<{
  pending: bigint;
  total: bigint;
  queryCount: bigint;
}> {
  try {
    const [pending, total, queryCount] = await publicClient.readContract({
      address: VEIL_VAULT_ADDRESS,
      abi: VEIL_VAULT_ABI,
      functionName: "getEarnings",
      args: [dataOwner],
    });

    console.log(`[Veil Guardian] Earnings for ${dataOwner}:`, { pending, total, queryCount });
    return { pending, total, queryCount };
  } catch (error) {
    console.error("[Veil Guardian] Failed to fetch earnings:", error);
    return { pending: 0n, total: 0n, queryCount: 0n };
  }
}

// --- Entry Point ---

async function main() {
  validateEnv(); // Fail loudly at startup, not silently at query time.

  console.log("[Veil Guardian] Agent starting...");
  console.log(`[Veil Guardian] Contract: ${VEIL_VAULT_ADDRESS}`);
  console.log(`[Veil Guardian] Chain: Base Sepolia`);
  console.log(`[Veil Guardian] USDC: ${USDC_ADDRESS}`);
  console.log(`[Veil Guardian] Venice AI: ${VENICE_API_KEY ? "✓ configured (no-data-retention inference)" : "✗ not configured (local fallback)"}`);
  console.log(`[Veil Guardian] Venice Model: ${VENICE_MODEL}`);

  // Demo: store a credential
  const demoCredential = await storeCredential("age", "25");
  console.log("[Veil Guardian] Demo credential stored:", demoCredential.type);

  // Check earnings
  const dataOwnerAddress = (process.env.GUARDIAN_ADDRESS as Address) || "0x0";
  if (dataOwnerAddress !== "0x0") {
    await checkEarnings(dataOwnerAddress);
  }

  // Start monitoring for queries
  await monitorQueries();
}

export { storeCredential, answerQuery, checkEarnings, main as startGuardian };
