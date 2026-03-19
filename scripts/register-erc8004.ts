#!/usr/bin/env tsx
/**
 * register-erc8004.ts — VeilVault ERC-8004 Identity Registry
 *
 * Registers the VeilVault Guardian agent on-chain via the ERC-8004 Identity Registry
 * deployed on Base Sepolia. Mints an ERC-721 agent identity NFT with agent.json as URI.
 *
 * Usage:
 *   GUARDIAN_PRIVATE_KEY=0x... npm run register-erc8004
 *   GUARDIAN_PRIVATE_KEY=0x... bun run scripts/register-erc8004.ts
 *
 * Env vars required:
 *   GUARDIAN_PRIVATE_KEY  — wallet private key that will own the agent identity NFT
 *
 * Optional:
 *   BASE_RPC_URL          — defaults to https://sepolia.base.org
 *   AGENT_CARD_URI        — override URI for agent metadata (defaults to inline data URI)
 *
 * Output: { tokenId, registrationTx, registryAddress } — also updates agent.json
 */

import { createWalletClient, createPublicClient, http, parseEventLogs, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import * as fs from "fs";
import * as path from "path";

// ─── Config ─────────────────────────────────────────────────────────────────

const RPC_URL = process.env.BASE_RPC_URL ?? "https://sepolia.base.org";
const PRIVATE_KEY = process.env.GUARDIAN_PRIVATE_KEY;
const AGENT_CARD_URI_OVERRIDE = process.env.AGENT_CARD_URI;

// ERC-8004 Identity Registry — Base Sepolia
// Source: https://github.com/erc-8004/erc-8004-contracts
const ERC8004_IDENTITY_REGISTRY = "0x8004A818BFB912233c491871b3d84c89A494BD9e" as const;

// ─── ABI (minimal — register + Registered event) ────────────────────────────

const IDENTITY_REGISTRY_ABI = [
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentCardUri", type: "string" }],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
  {
    name: "Registered",
    type: "event",
    inputs: [
      { name: "agentId", type: "uint256", indexed: true },
      { name: "tokenURI", type: "string", indexed: false },
      { name: "owner", type: "address", indexed: true },
    ],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildAgentCardUri(): string {
  if (AGENT_CARD_URI_OVERRIDE) {
    console.log(`Using AGENT_CARD_URI override: ${AGENT_CARD_URI_OVERRIDE}`);
    return AGENT_CARD_URI_OVERRIDE;
  }

  // Load agent.json and encode as data URI (no IPFS dependency needed for hackathon)
  const agentJsonPath = path.resolve(__dirname, "..", "agent.json");
  if (!fs.existsSync(agentJsonPath)) {
    throw new Error(`agent.json not found at ${agentJsonPath}`);
  }

  const agentJson = fs.readFileSync(agentJsonPath, "utf-8");
  // Validate JSON
  JSON.parse(agentJson);

  const encoded = Buffer.from(agentJson).toString("base64");
  const dataUri = `data:application/json;base64,${encoded}`;
  console.log(`Built inline data URI from agent.json (${agentJson.length} bytes)`);
  return dataUri;
}

function updateAgentJson(tokenId: string, registrationTx: string): void {
  const agentJsonPath = path.resolve(__dirname, "..", "agent.json");
  const agentData = JSON.parse(fs.readFileSync(agentJsonPath, "utf-8"));

  agentData.erc8004Identity = {
    tokenId,
    contractAddress: ERC8004_IDENTITY_REGISTRY,
    registrationTx,
    network: "base-sepolia",
    chainId: 84532,
    registeredAt: new Date().toISOString(),
  };

  fs.writeFileSync(agentJsonPath, JSON.stringify(agentData, null, 2) + "\n");
  console.log(`\n✅ agent.json updated with tokenId=${tokenId}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!PRIVATE_KEY) {
    console.error("Error: GUARDIAN_PRIVATE_KEY environment variable is required");
    console.error("Usage: GUARDIAN_PRIVATE_KEY=0x... npm run register-erc8004");
    process.exit(1);
  }

  const privateKey = PRIVATE_KEY.startsWith("0x")
    ? (PRIVATE_KEY as `0x${string}`)
    : (`0x${PRIVATE_KEY}` as `0x${string}`);

  const account = privateKeyToAccount(privateKey);
  console.log(`Registering from wallet: ${account.address}`);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  // Verify registry contract exists
  const code = await publicClient.getBytecode({ address: ERC8004_IDENTITY_REGISTRY });
  if (!code || code === "0x") {
    throw new Error(`No contract at ERC-8004 registry address ${ERC8004_IDENTITY_REGISTRY}`);
  }
  console.log(`✓ ERC-8004 registry verified at ${ERC8004_IDENTITY_REGISTRY}`);

  // Build agent card URI
  const agentCardUri = buildAgentCardUri();

  // Estimate gas
  console.log("\nEstimating gas...");
  const gasEstimate = await publicClient.estimateContractGas({
    address: ERC8004_IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "register",
    args: [agentCardUri],
    account: account.address,
  });
  console.log(`Gas estimate: ${gasEstimate.toString()}`);

  // Submit registration transaction
  console.log("\nSubmitting register() transaction...");
  const txHash = await walletClient.writeContract({
    address: ERC8004_IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: "register",
    args: [agentCardUri],
    gas: (gasEstimate * 120n) / 100n, // 20% buffer
  });

  console.log(`Transaction submitted: ${txHash}`);
  console.log(`View on Basescan: https://sepolia.basescan.org/tx/${txHash}`);

  // Wait for receipt
  console.log("Waiting for confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  if (receipt.status !== "success") {
    throw new Error(`Transaction reverted: ${txHash}`);
  }

  // Parse tokenId from Registered event
  let tokenId: bigint | undefined;
  try {
    const logs = parseEventLogs({
      abi: IDENTITY_REGISTRY_ABI,
      eventName: "Registered",
      logs: receipt.logs,
    });
    if (logs.length > 0) {
      tokenId = logs[0].args.agentId;
    }
  } catch {
    // Fallback: try to find Transfer event (ERC-721 mint has Transfer from 0x0)
    for (const log of receipt.logs) {
      if (
        log.address.toLowerCase() === ERC8004_IDENTITY_REGISTRY.toLowerCase() &&
        log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
        log.topics[1] === "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        tokenId = BigInt(log.topics[3] ?? "0x0");
      }
    }
  }

  if (tokenId === undefined) {
    console.warn("Warning: Could not parse tokenId from receipt logs. Check transaction manually.");
    console.log("\nResult (tokenId unknown):");
    console.log(JSON.stringify({ registrationTx: txHash, registryAddress: ERC8004_IDENTITY_REGISTRY }, null, 2));
    return;
  }

  const result = {
    tokenId: tokenId.toString(),
    registrationTx: txHash,
    registryAddress: ERC8004_IDENTITY_REGISTRY,
    network: "base-sepolia",
    basescanUrl: `https://sepolia.basescan.org/token/${ERC8004_IDENTITY_REGISTRY}?a=${tokenId}`,
  };

  console.log("\n✅ ERC-8004 registration successful!");
  console.log(JSON.stringify(result, null, 2));

  // Update agent.json
  updateAgentJson(tokenId.toString(), txHash);

  return result;
}

main().catch((err) => {
  console.error("\n❌ Registration failed:", err.message);
  process.exit(1);
});
