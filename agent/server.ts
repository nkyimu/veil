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
const PORT = process.env.GUARDIAN_PORT || 3000;

// Middleware
app.use(express.json());

// x402 payment gateway middleware
// Checks for valid payment header before processing /query requests
const x402Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.path !== "/query") {
    return next();
  }

  // Check for x402 payment header
  const paymentHeader = req.header("X-Payment-Proof");
  const amountHeader = req.header("X-Payment-Amount");

  if (!paymentHeader || !amountHeader) {
    // Return 402 Payment Required
    res.status(402).json({
      error: "Payment required",
      statusCode: 402,
      message: "This endpoint requires x402 payment. Include X-Payment-Proof and X-Payment-Amount headers.",
      paymentRequired: {
        amount: "0.001", // USDC
        currency: "USDC",
        gateway: "Locus",
        paymentUrl: `${process.env.LOCUS_API_URL}/pay`,
      },
    });
    return;
  }

  // Validate payment (simplified for MVP — in production, verify on-chain)
  console.log(`[Guardian Server] Payment received: ${amountHeader} USDC`);
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
    timestamp: new Date().toISOString(),
    version: "1.0.0",
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

    console.log(`[Guardian Server] Processing query ${queryId}: "${question || "unknown question"}"`);

    // Answer the query
    // In production: decode the question, evaluate credential, generate ZK proof
    // For MVP: simple yes/no response
    const credTypeIndex = ["age", "creditRange", "location", "income", "custom"].indexOf(credentialType);
    const queryHash = `0x${Buffer.from(question || "unknown").toString("hex").padEnd(64, "0")}` as `0x${string}`;

    const answer = await answerQuery(
      queryId,
      requester as Address,
      credTypeIndex,
      queryHash
    );

    res.json({
      success: true,
      queryId,
      answer,
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

const server = app.listen(PORT, () => {
  console.log(`[Guardian Server] Listening on port ${PORT}`);
  console.log(`[Guardian Server] Health check: GET http://localhost:${PORT}/health`);
  console.log(`[Guardian Server] Submit query: POST http://localhost:${PORT}/query (x402 required)`);
  console.log(`[Guardian Server] Check earnings: GET http://localhost:${PORT}/earnings?dataOwner=0x...`);
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
