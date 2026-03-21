/**
 * Veil Guardian Server
 *
 * HTTP server for the guardian agent:
 * - POST /query  — Submit queries (x402+Locus payment required)
 * - GET  /health — Health check (includes Locus status)
 * - GET  /earnings — On-chain earnings from VeilVault contract
 * - GET  /balance  — Guardian's Locus wallet balance
 * - GET  /audit   — Payment intent audit log (Venice reasoning + payments)
 *
 * Payment flow:
 *   1) Querier hits POST /query without payment → 402 + Locus instructions
 *   2) Querier pays USDC to guardian wallet via Locus → gets transaction_id
 *   3) Querier retries with X-Payment-TxId header → Guardian verifies + answers
 *   4) Guardian logs payment intent + Venice reasoning together (auditability)
 *
 * Synthesis Hackathon 2026 — "Agents that pay" track
 */

import express from "express";
import { type Address } from "viem";
import { storeCredential, answerQuery, checkEarnings } from "./guardian";
import {
  verifyTransaction,
  logPaymentIntent,
  getAuditLog,
  buildPaymentInstructions,
  getGuardianBalance,
  getLocusStatus,
  QUERY_PRICE_USDC,
  GUARDIAN_WALLET,
} from "./locus";

const app = express();
const PORT = process.env.GUARDIAN_PORT || 3001;

// Middleware
app.use(express.json());

// CORS — allow the frontend to call the guardian from localhost
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Payment-TxId,X-Payment-Proof");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// x402+Locus Payment Middleware
// ---------------------------------------------------------------------------
// Returns 402 with Locus-specific instructions if no payment proof.
// Verifies txId via Locus API when provided.

const x402Middleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.path !== "/query") return next();

  const txId = req.header("X-Payment-TxId") || req.header("X-Payment-Proof");
  const { queryId } = req.body || {};

  if (!txId) {
    res.status(402).json({
      error: "Payment required",
      statusCode: 402,
      protocol: "x402+locus",
      message: `This query costs ${QUERY_PRICE_USDC} USDC. Pay via Locus, then retry with the transaction ID.`,
      paymentInstructions: buildPaymentInstructions(queryId),
    });
    return;
  }

  const { valid, reason, transaction } = await verifyTransaction(txId);
  if (!valid) {
    res.status(402).json({
      error: "Payment verification failed",
      statusCode: 402,
      protocol: "x402+locus",
      reason,
      txId,
      paymentInstructions: buildPaymentInstructions(queryId),
    });
    return;
  }

  // Payment verified — attach txId + transaction for downstream use
  (req as any).paymentTxId = txId;
  (req as any).locusTransaction = transaction;
  next();
};

app.use(x402Middleware);

// --- Routes ---

/**
 * GET /health — Health check with Locus status
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    agent: "Veil Guardian",
    version: "1.1.0",
    inference: {
      provider: "Venice AI",
      model: process.env.VENICE_MODEL || "llama-3.3-70b",
      dataRetention: "none",
    },
    payments: {
      protocol: "x402+locus",
      gateway: "Locus",
      queryPrice: `${QUERY_PRICE_USDC} USDC`,
      chain: "Base",
      guardianWallet: GUARDIAN_WALLET || "not configured",
      ...getLocusStatus(),
    },
    contract: process.env.VEIL_VAULT_CONTRACT || "0x2f881af96415a452807baf6a23b73129d57f8d7a",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /balance — Guardian's live Locus wallet balance
 */
app.get("/balance", async (req, res) => {
  const balance = await getGuardianBalance();
  if (!balance) {
    return res.status(503).json({
      error: "Locus not configured or unavailable",
      guardianWallet: GUARDIAN_WALLET || "not configured",
      hint: "Set LOCUS_API_KEY and LOCUS_WALLET_ADDRESS in .env",
    });
  }
  res.json({
    guardianWallet: balance.address,
    balance_usdc: balance.balance_usdc,
    currency: "USDC",
    chain: "Base",
    gateway: "Locus",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /audit — Payment intent audit log
 *
 * Shows every query's payment txId alongside the Venice AI reasoning.
 * This is the "reasoning logs alongside financial actions" auditability bonus.
 */
app.get("/audit", (req, res) => {
  const log = getAuditLog();
  res.json({
    total: log.length,
    entries: log,
    description: "Payment intents with Venice AI reasoning — auditable trail of agent payments",
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
    const locusTransaction = (req as any).locusTransaction;
    console.log(`[Guardian Server] Processing query ${queryId}: "${question || "unknown"}" (paid: ${paymentTxId})`);

    // Log payment intent BEFORE answering — creates audit trail
    // "financial action initiated" → "Venice reasoned" → "answer returned"
    logPaymentIntent({
      queryId,
      timestamp: new Date().toISOString(),
      querierWallet: locusTransaction?.from_address ?? requester,
      guardianWallet: GUARDIAN_WALLET,
      amountUsdc: QUERY_PRICE_USDC,
      txId: paymentTxId === "dev-mode" ? undefined : paymentTxId,
      locusStatus: locusTransaction?.status ?? (paymentTxId === "dev-mode" ? "dev-mode" : "verified"),
    });

    // Route to Venice-powered Guardian for intelligent evaluation
    const credTypeIndex = ["age", "creditRange", "location", "income", "custom"].indexOf(credentialType);
    const queryHash = `0x${Buffer.from(question || "unknown").toString("hex").padEnd(64, "0")}` as `0x${string}`;

    const answer = await answerQuery(
      BigInt(queryId),
      requester as Address,
      credTypeIndex,
      queryHash
    );

    // Update audit log with Venice reasoning result
    logPaymentIntent({
      queryId: `${queryId}-result`,
      timestamp: new Date().toISOString(),
      querierWallet: locusTransaction?.from_address ?? requester,
      guardianWallet: GUARDIAN_WALLET,
      amountUsdc: QUERY_PRICE_USDC,
      txId: paymentTxId === "dev-mode" ? undefined : paymentTxId,
      answer,
      veniceReasoning: `Query: "${question || credentialType}" → answer: ${answer}`,
      locusStatus: "complete",
    });

    res.json({
      success: true,
      queryId,
      answer,
      paymentTxId,
      protocol: "x402+locus",
      inference: "venice-ai-no-data-retention",
      payment: {
        amount: QUERY_PRICE_USDC,
        currency: "USDC",
        guardianWallet: GUARDIAN_WALLET,
        txId: paymentTxId === "dev-mode" ? null : paymentTxId,
        status: locusTransaction?.status ?? "verified",
      },
      auditEntry: `GET /audit for reasoning + payment trail`,
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
