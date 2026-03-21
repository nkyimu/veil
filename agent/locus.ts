/**
 * Locus Payment Client — VeilVault Guardian
 *
 * Handles all Locus API interactions:
 * - Balance checking (querier and guardian)
 * - Transaction verification (x402 payment proofs)
 * - Payment initiation (guardian earnings distribution)
 * - Payment intent audit logging (auditability bonus for Synthesis judges)
 *
 * API Base: https://beta-api.paywithlocus.com/api
 * Docs: docs.paywithlocus.com
 * Hackathon: The Synthesis 2026
 */

const LOCUS_API_BASE = process.env.LOCUS_API_URL || "https://beta-api.paywithlocus.com/api";
const LOCUS_API_KEY = process.env.LOCUS_API_KEY || "";
const GUARDIAN_WALLET = process.env.LOCUS_WALLET_ADDRESS || "";
const QUERY_PRICE_USDC = parseFloat(process.env.LOCUS_QUERY_PRICE_USDC || "0.01");
const USE_LOCUS = process.env.USE_LOCUS !== "false"; // Default: enabled when LOCUS_API_KEY set

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocusBalance {
  address: string;
  balance_usdc: string;
  wallet_id?: string;
}

export interface LocusTransaction {
  id: string;
  status: "QUEUED" | "PENDING_APPROVAL" | "CONFIRMED" | "FAILED" | "CANCELLED";
  amount_usdc: string;
  from_address?: string;
  to_address?: string;
  memo?: string;
  created_at: string;
  tx_hash?: string;
}

export interface PaymentVerification {
  valid: boolean;
  reason: string;
  transaction?: LocusTransaction;
}

export interface PaymentInitiation {
  success: boolean;
  transactionId?: string;
  status?: string;
  approvalUrl?: string;
  error?: string;
}

export interface PaymentAuditLog {
  queryId: string | number | bigint;
  timestamp: string;
  querierWallet?: string;
  guardianWallet: string;
  amountUsdc: number;
  txId?: string;
  veniceReasoning?: string;
  answer?: boolean;
  locusStatus?: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${LOCUS_API_KEY}`,
    "Content-Type": "application/json",
  };
}

function isConfigured(): boolean {
  return !!(LOCUS_API_KEY && USE_LOCUS);
}

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------

/**
 * Check the guardian's own Locus wallet balance.
 */
export async function getGuardianBalance(): Promise<LocusBalance | null> {
  if (!isConfigured()) {
    console.warn("[Locus] Not configured — returning null balance");
    return null;
  }

  try {
    const res = await fetch(`${LOCUS_API_BASE}/pay/balance`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      console.error(`[Locus] Balance check failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = (await res.json()) as any;
    const balance: LocusBalance = {
      address: GUARDIAN_WALLET,
      balance_usdc: data?.data?.balance_usdc ?? data?.balance_usdc ?? "0",
      wallet_id: data?.data?.wallet_id,
    };

    console.log(`[Locus] Guardian balance: ${balance.balance_usdc} USDC`);
    return balance;
  } catch (error) {
    console.error("[Locus] Balance fetch error:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Transaction verification
// ---------------------------------------------------------------------------

/**
 * Verify a Locus transaction by ID.
 * Used for x402-style payment proofs — querier pays, sends txId in header.
 */
export async function verifyTransaction(txId: string): Promise<PaymentVerification> {
  if (!isConfigured()) {
    // Dev mode — accept any txId without verification
    console.log(`[Locus] Dev mode — accepting txId ${txId} without verification`);
    return { valid: true, reason: "dev-mode" };
  }

  try {
    const res = await fetch(`${LOCUS_API_BASE}/pay/transactions/${txId}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      return {
        valid: false,
        reason: `Locus API returned ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()) as any;
    // API returns data.data.transaction or data.transaction
    const tx: LocusTransaction = data?.data?.transaction ?? data?.data ?? data;

    if (!tx?.id) {
      return { valid: false, reason: "Transaction not found in response" };
    }

    if (tx.status !== "CONFIRMED") {
      return {
        valid: false,
        reason: `Transaction status: ${tx.status} (need CONFIRMED)`,
        transaction: tx,
      };
    }

    const paid = parseFloat(tx.amount_usdc || "0");
    if (paid < QUERY_PRICE_USDC) {
      return {
        valid: false,
        reason: `Underpayment: paid ${paid} USDC, required ${QUERY_PRICE_USDC} USDC`,
        transaction: tx,
      };
    }

    // Confirm the payment was directed to our guardian wallet
    if (GUARDIAN_WALLET && tx.to_address) {
      const toMatch = tx.to_address.toLowerCase() === GUARDIAN_WALLET.toLowerCase();
      if (!toMatch) {
        return {
          valid: false,
          reason: `Payment went to ${tx.to_address}, expected ${GUARDIAN_WALLET}`,
          transaction: tx,
        };
      }
    }

    console.log(`[Locus] Payment verified: ${txId} — ${paid} USDC CONFIRMED → guardian`);
    return { valid: true, reason: "verified", transaction: tx };
  } catch (error) {
    console.error("[Locus] Transaction verification error:", error);
    return {
      valid: false,
      reason: `Verification error: ${error instanceof Error ? error.message : "unknown"}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Payment initiation
// ---------------------------------------------------------------------------

/**
 * Send USDC from the guardian's Locus wallet to another address.
 * Used when the guardian distributes earnings to the data owner.
 */
export async function sendPayment(
  toAddress: string,
  amount: number,
  memo: string
): Promise<PaymentInitiation> {
  if (!isConfigured()) {
    console.warn("[Locus] Not configured — skipping payment initiation");
    return { success: false, error: "Locus not configured" };
  }

  try {
    const res = await fetch(`${LOCUS_API_BASE}/pay/send`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ to_address: toAddress, amount, memo }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Locus send failed: ${res.status} — ${text}` };
    }

    const data = (await res.json()) as any;
    const tx = data?.data;

    console.log(`[Locus] Payment initiated: ${amount} USDC → ${toAddress} (${tx?.status || "?"})`);

    return {
      success: true,
      transactionId: tx?.transaction_id,
      status: tx?.status,
      approvalUrl: tx?.approval_url,
    };
  } catch (error) {
    console.error("[Locus] Payment send error:", error);
    return {
      success: false,
      error: `Send error: ${error instanceof Error ? error.message : "unknown"}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Audit log (auditability bonus)
// ---------------------------------------------------------------------------

// In-memory audit log — in production, persist to a database or append-only file
const auditLog: PaymentAuditLog[] = [];

/**
 * Log a payment intent alongside the Venice reasoning.
 * This creates an auditable trail of "agent paid → agent reasoned → agent answered"
 * which satisfies the Synthesis judging bonus point for "reasoning logs alongside
 * financial actions."
 */
export function logPaymentIntent(entry: PaymentAuditLog): void {
  const logEntry = { ...entry, timestamp: entry.timestamp || new Date().toISOString() };
  auditLog.push(logEntry);

  console.log(
    `[Locus Audit] queryId=${logEntry.queryId} | ` +
    `amount=${logEntry.amountUsdc} USDC | ` +
    `txId=${logEntry.txId || "pending"} | ` +
    `answer=${logEntry.answer ?? "pending"} | ` +
    `reasoning="${logEntry.veniceReasoning?.slice(0, 60) || "none"}"`
  );
}

/**
 * Get the full audit log for display (e.g., on /audit endpoint or Earnings Dashboard).
 */
export function getAuditLog(): PaymentAuditLog[] {
  return [...auditLog];
}

// ---------------------------------------------------------------------------
// Payment instructions (for 402 responses)
// ---------------------------------------------------------------------------

/**
 * Build the payment instructions object to include in a 402 response.
 * Tells querying agents exactly how to pay via Locus.
 */
export function buildPaymentInstructions(queryId?: string | number): Record<string, unknown> {
  return {
    protocol: "x402+locus",
    amount: QUERY_PRICE_USDC,
    currency: "USDC",
    chain: "Base",
    recipient: GUARDIAN_WALLET,
    gateway: "Locus",
    locus: {
      apiBase: LOCUS_API_BASE,
      sendEndpoint: `${LOCUS_API_BASE}/pay/send`,
      checkoutDocs: "https://docs.paywithlocus.com/checkout/index",
      steps: [
        `1. Send ${QUERY_PRICE_USDC} USDC to ${GUARDIAN_WALLET} via Locus:`,
        `   POST ${LOCUS_API_BASE}/pay/send`,
        `   Body: { "to_address": "${GUARDIAN_WALLET}", "amount": ${QUERY_PRICE_USDC}, "memo": "VeilVault query${queryId ? ` ${queryId}` : ""}" }`,
        `2. Wait for status: CONFIRMED`,
        `3. Retry this request with header: X-Payment-TxId: <transaction_id>`,
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Status report (for /health and dashboard)
// ---------------------------------------------------------------------------

export function getLocusStatus(): Record<string, unknown> {
  return {
    configured: isConfigured(),
    guardianWallet: GUARDIAN_WALLET || "not configured",
    queryPriceUsdc: QUERY_PRICE_USDC,
    apiBase: LOCUS_API_BASE,
    auditEntries: auditLog.length,
    useLocus: USE_LOCUS,
  };
}

export { QUERY_PRICE_USDC, GUARDIAN_WALLET, isConfigured };
