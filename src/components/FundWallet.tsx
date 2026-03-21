"use client";

import { useState } from "react";
import { LocusCheckout } from "@withlocus/checkout-react";

const PRESET_AMOUNTS = ["1.00", "5.00", "10.00", "25.00"];

interface FundWalletProps {
  /** Called after a confirmed on-chain payment. */
  onFunded?: (txHash: string, amount: string) => void;
}

/**
 * "Fund Wallet via Locus" panel for the Browse & Query screen.
 *
 * Flow:
 *   1. User picks a USDC amount (or types custom)
 *   2. Component calls /api/locus/checkout (server-side, key stays safe)
 *   3. Locus popup opens → user pays
 *   4. onSuccess fires, we show confirmation + txHash
 *
 * Locus Checkout SDK: @withlocus/checkout-react
 * Docs: https://docs.paywithlocus.com/checkout/index
 */
export function FundWallet({ onFunded }: FundWalletProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("5.00");
  const [customAmount, setCustomAmount] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState<{ txHash: string; amount: string } | null>(null);

  const effectiveAmount = customAmount.trim() || amount;

  const handleOpen = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/locus/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          description: `Fund VeilVault query wallet — ${effectiveAmount} USDC`,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }
      const d = await res.json();
      setSessionId(d.sessionId);
      setOpen(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (data: { txHash: string; amount: string }) => {
    setOpen(false);
    setSessionId(null);
    setPaid({ txHash: data.txHash, amount: data.amount });
    onFunded?.(data.txHash, data.amount);
  };

  const handleCancel = () => {
    setOpen(false);
    setSessionId(null);
  };

  if (paid) {
    return (
      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-green-400 font-semibold">✓ Wallet funded!</span>
          <span className="text-green-300 font-mono text-sm">{paid.amount} USDC</span>
        </div>
        <a
          href={`https://basescan.org/tx/${paid.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-veil-400 hover:underline font-mono break-all"
        >
          {paid.txHash.slice(0, 22)}…{paid.txHash.slice(-8)}
        </a>
        <button
          onClick={() => setPaid(null)}
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 block"
        >
          Fund again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">Fund Query Wallet</h4>
        <span className="text-xs text-gray-500 font-mono">via Locus · USDC on Base</span>
      </div>

      {/* Amount picker */}
      <div className="flex gap-2 flex-wrap mb-3">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => { setAmount(a); setCustomAmount(""); }}
            className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
              amount === a && !customAmount
                ? "bg-veil-700 text-white border border-veil-500"
                : "bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600"
            }`}
          >
            ${a}
          </button>
        ))}
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Custom"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white placeholder-gray-600 font-mono"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-3">⚠ {error}</p>
      )}

      <button
        onClick={handleOpen}
        disabled={loading || !effectiveAmount || parseFloat(effectiveAmount) <= 0}
        className="w-full bg-[#4101F6] hover:bg-[#5934FF] disabled:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            Creating session…
          </>
        ) : (
          <>
            <span>⚡</span>
            Fund ${effectiveAmount} USDC via Locus
          </>
        )}
      </button>

      {/* Locus Checkout popup */}
      {open && sessionId && (
        <LocusCheckout
          sessionId={sessionId}
          mode="popup"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onError={(e) => {
            setError(e.message);
            setOpen(false);
            setSessionId(null);
          }}
        />
      )}
    </div>
  );
}
