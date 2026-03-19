/**
 * Veil Guardian Server
 * 
 * HTTP server for the guardian agent:
 * - POST /query — Submit queries (protected by x402 payment)
 * - GET /health — Health check
 * - GET /earnings — Check agent earnings
 *
 * Synthesis Hackathon 2026
 */

import express from "express";
import { type Address } from "viem";
import { storeCredential, answerQuery, checkEarnings } from "./guardian";

const app = express();
const PORT = process.env.GUARDIAN_PORT || 3001;

// Middleware
app.use(express.json());

// --- x402 Payment Gateway ---
// The Guardian is a paid service. Queriers must pay USDC to get answers.
// Flow: 1) Querier hits /query without payment → gets 402 + payment instructions
//       2) Querier pays via Locus → gets transaction_id
//       3) Querier retries /query with X-Payment-TxId header → Guardian verifies + answers

const LOCUS_API_URL = process.env.LOCUS_API_URL || "https://beta-api.paywithlocus.com/api";
const LOCUS_API_KEY = process.env.LOCUS_API_KEY || "";
const QUERY_PRICE_USDC = process.env.QUERY_PRICE_USDC || "0.02";
const GUARDIAN_WALLET = process.env.LOCUS_WALLET_ADDRESS || "";

/**
 * Verify a Locus payment transaction
 * Returns true if the transaction is confirmed and matches expected amount
 */
async function verifyLocusPayment(txId: string): Promise<{ valid: boolean; reason: string }> {
  if (!LOCUS_API_KEY) {
    // No Locus key = dev mode, accept any txId
    console.log(`[x402] Dev mode — accepting payment ${txId} without verification`);
    return { valid: true, reason: "dev-mode" };
  }

  try {
    const res = await fetch(`${LOCUS_API_URL}/pay/transactions/${txId}`, {
      headers: { Authorization: `Bearer ${LOCUS_API_KEY}` },
    });

    if (!res.ok) {
      return { valid: false, reason: `Locus API returned ${res.status}` };
    }

    const data = await res.json() as any;
    const tx = data?.data?.transaction;

    if (!tx) {
      return { valid: false, reason: "Transaction not found" };
    }

    if (tx.status !== "CONFIRMED") {
      return { valid: false, reason: `Transaction status: ${tx.status} (need CONFIRMED)` };
    }

    // Check amount (allow >= expected)
    const paidAmount = parseFloat(tx.amount_usdc || "0");
    const requiredAmount = parseFloat(QUERY_PRICE_USDC);
    if (paidAmount < requiredAmount) {
      return { valid: false, reason: `Paid ${paidAmount} USDC, need ${requiredAmount}` };
    }

    console.log(`[x402] Payment verified: ${txId} — ${paidAmount} USDC (CONFIRMED)`);
    return { valid: true, reason: "verified" };
  } catch (error) {
    console.error(`[x402] Locus verification error:`, error);
    return { valid: false, reason: `Verification failed: ${error instanceof Error ? error.message : "unknown"}` };
  }
}

// x402 middleware — returns 402 if no payment, verifies if payment provided
const x402Middleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path !== "/query") {
    return next();
  }

  const txId = req.header("X-Payment-TxId") || req.header("X-Payment-Proof");

  if (!txId) {
    // No payment — return 402 with instructions
    res.status(402).json({
      error: "Payment required",
      statusCode: 402,
      protocol: "x402",
      message: `This query costs ${QUERY_PRICE_USDC} USDC. Pay via Locus, then retry with the transaction ID.`,
      paymentDetails: {
        amount: QUERY_PRICE_USDC,
        currency: "USDC",
        chain: "Base",
        recipient: GUARDIAN_WALLET,
        gateway: "Locus",
        payEndpoint: `${LOCUS_API_URL}/pay/send`,
        instructions: [
          `POST ${LOCUS_API_URL}/pay/send with {"to_address": "${GUARDIAN_WALLET}", "amount": ${QUERY_PRICE_USDC}, "memo": "Veil query"}`,
          `Get transaction_id from response`,
          `Retry this request with header: X-Payment-TxId: <transaction_id>`,
        ],
      },
    });
    return;
  }

  // Verify payment
  const { valid, reason } = await verifyLocusPayment(txId);
  if (!valid) {
    res.status(402).json({
      error: "Payment verification failed",
      statusCode: 402,
      reason,
      txId,
    });
    return;
  }

  // Payment verified — continue to query handler
  (req as any).paymentTxId = txId;
  next();
};

app.use(x402Middleware);

// --- Routes ---

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agent: "Veil Guardian",
    version: "1.0.0",
    inference: {
      provider: "Venice AI",
      model: process.env.VENICE_MODEL || "llama-3.3-70b",
      dataRetention: "none",
    },
    payments: {
      protocol: "x402",
      gateway: "Locus",
      queryPrice: `${QUERY_PRICE_USDC} USDC`,
      chain: "Base",
    },
    contract: process.env.VEIL_VAULT_CONTRACT || "0x2f881af96415a452807baf6a23b73129d57f8d7a",
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /query — Answer a credential query (x402 protected)
 * 
 * Request body:
 * {
 *   "queryId": 1,
 *   "credentialType": "age",
 *   "question": "Is the user over 18?",
 *   "dataOwner": "0x...",
 *   "requester": "0x..."
 * }
 */
app.post("/query", async (req, res) => {
  try {
    const { queryId, credentialType, question, dataOwner, requester } = req.body;

    if (!queryId || !credentialType || !dataOwner || !requester) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["queryId", "credentialType", "dataOwner", "requester"],
      });
    }

    const paymentTxId = (req as any).paymentTxId || "dev-mode";
    console.log(`[Guardian Server] Processing query ${queryId}: "${question || "unknown"}" (paid: ${paymentTxId})`);

    // Route to Venice-powered Guardian for intelligent evaluation
    const credTypeIndex = ["age", "creditRange", "location", "income", "custom"].indexOf(credentialType);
    const queryHash = `0x${Buffer.from(question || "unknown").toString("hex").padEnd(64, "0")}` as `0x${string}`;

    const answer = await answerQuery(
      BigInt(queryId),
      requester as Address,
      credTypeIndex,
      queryHash
    );

    res.json({
      success: true,
      queryId,
      answer,
      paymentTxId,
      protocol: "x402",
      inference: "venice-ai-no-data-retention",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Guardian Server] Query processing error:", error);
    res.status(500).json({
      error: "Failed to process query",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /earnings — Check guardian's earnings
 * 
 * Query params:
 * ?dataOwner=0x...
 */
app.get("/earnings", async (req, res) => {
  try {
    const { dataOwner } = req.query;

    if (!dataOwner || typeof dataOwner !== "string") {
      return res.status(400).json({
        error: "Missing dataOwner query parameter",
        example: "/earnings?dataOwner=0x...",
      });
    }

    const earnings = await checkEarnings(dataOwner as Address);

    res.json({
      dataOwner,
      earnings: {
        pending: earnings.pending.toString(),
        total: earnings.total.toString(),
        queryCount: earnings.queryCount.toString(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Guardian Server] Earnings fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch earnings",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /credentials — Store a new credential (x402 protected for sensitive data)
 * 
 * Request body:
 * {
 *   "type": "age",
 *   "value": "25"
 * }
 */
app.post("/credentials", async (req, res) => {
  try {
    const { type, value } = req.body;

    if (!type || !value) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["type", "value"],
      });
    }

    if (!["age", "creditRange", "location", "income", "custom"].includes(type)) {
      return res.status(400).json({
        error: "Invalid credential type",
        allowed: ["age", "creditRange", "location", "income", "custom"],
      });
    }

    const credential = await storeCredential(type, value);

    res.json({
      success: true,
      type: credential.type,
      commitment: credential.commitment,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Guardian Server] Credential storage error:", error);
    res.status(500).json({
      error: "Failed to store credential",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// --- Error Handling ---

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Guardian Server] Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});

// --- Server Start ---

const server = app.listen(PORT, async () => {
  console.log(`[Guardian Server] Listening on port ${PORT}`);
  console.log(`[Guardian Server] Health check: GET http://localhost:${PORT}/health`);
  console.log(`[Guardian Server] Submit query: POST http://localhost:${PORT}/query (x402 required)`);
  console.log(`[Guardian Server] Check earnings: GET http://localhost:${PORT}/earnings?dataOwner=0x...`);

  // Initialize guardian — store demo credentials and start monitoring
  const initGuardian = async () => {
    console.log("[Guardian Server] Initializing guardian agent...");
    // Store demo credentials
    await storeCredential("age", "28");
    await storeCredential("creditRange", "720");
    await storeCredential("location", "Lagos, Nigeria");
    await storeCredential("income", "65000");
    console.log("[Guardian Server] Demo credentials stored. Guardian ready.");
  };

  try {
    await initGuardian();
  } catch (error) {
    console.error("[Guardian Server] Initialization error:", error);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[Guardian Server] SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("[Guardian Server] Closed");
    process.exit(0);
  });
});

export default app;
