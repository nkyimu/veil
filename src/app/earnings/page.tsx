"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGetEarnings, useWithdrawRevenue } from "@/hooks/useVeilVault";
import { formatUSDA, formatAddress } from "@/lib/constants";

export default function EarningsDashboard() {
  const { address, isConnected } = useAccount();
  const { pending, total, queryCount, isLoading, refetch } = useGetEarnings(
    address
  );
  const { withdraw } = useWithdrawRevenue();
  const [withdrawing, setWithdrawing] = useState(false);
  const [successTx, setSuccessTx] = useState<string | null>(null);

  // Simulate mock query data for demo
  const mockQueries = [
    {
      id: 47,
      requester: "0x1234567890123456789012345678901234567890",
      question: "Is user over 18?",
      type: "Age",
      answer: true,
      payment: 20000n,
      time: "2 min ago",
    },
    {
      id: 46,
      requester: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      question: "Credit score above 700?",
      type: "CreditRange",
      answer: true,
      payment: 20000n,
      time: "15 min ago",
    },
    {
      id: 45,
      requester: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed",
      question: "Located in US?",
      type: "Location",
      answer: false,
      payment: 20000n,
      time: "1 hour ago",
    },
  ];

  const handleWithdraw = async () => {
    if (!address || pending === 0n) return;

    setWithdrawing(true);
    try {
      const txHash = await withdraw();
      if (txHash) {
        setSuccessTx(txHash);
        setTimeout(() => {
          setSuccessTx(null);
          refetch();
        }, 3000);
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert("Failed to withdraw revenue");
    } finally {
      setWithdrawing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-200">
          Connect your wallet to view your earnings.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-2">Earnings Dashboard</h2>
        <p className="text-gray-400 text-sm">
          Your data, your revenue. Every query earns you USDC.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-veil-400">
            {isLoading ? "..." : formatUSDA(pending)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending Revenue</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : formatUSDA(total)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Earned</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-white">
            {isLoading ? "..." : queryCount.toString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Queries</p>
        </div>
      </div>

      {/* Withdraw */}
      <div className="bg-gray-900 border border-veil-700 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-400 mb-3">
          Withdraw your pending revenue to your wallet
        </p>
        <button
          onClick={handleWithdraw}
          disabled={
            withdrawing ||
            pending === 0n ||
            !isConnected ||
            isLoading
          }
          className="bg-veil-600 hover:bg-veil-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {withdrawing
            ? "Processing..."
            : `Withdraw ${formatUSDA(pending)} USDC`}
        </button>
        <p className="text-xs text-gray-600 mt-2">Base Sepolia • Gas ~$0.01</p>

        {successTx && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 mt-3">
            <p className="text-sm text-green-400">✓ Withdrawn!</p>
            <a
              href={`https://sepolia.basescan.org/tx/${successTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-veil-400 hover:underline font-mono"
            >
              View on BaseScan
            </a>
          </div>
        )}
      </div>

      {/* Recent Queries */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Recent Queries</h3>
        <div className="flex flex-col gap-3">
          {mockQueries.map((q) => (
            <div
              key={q.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-mono">
                  #{q.id} • {formatAddress(q.requester)}
                </span>
                <span className="text-xs text-gray-500">{q.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">{q.question}</p>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        q.answer ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {q.answer ? "YES" : "NO"}
                    </span>
                    <span className="text-xs text-gray-500">{q.type}</span>
                  </div>
                </div>
                <span className="text-veil-400 font-semibold ml-4">
                  {formatUSDA(q.payment)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Info */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-veil-500 font-semibold mb-3">How You Earn</h3>
        <ul className="text-gray-400 text-sm space-y-2 list-disc list-inside">
          <li>Services query your stored credentials (e.g., "Is user 18+?")</li>
          <li>Your agent answers with a ZK proof (no raw data exposure)</li>
          <li>
            Each query earns you {formatUSDA(20000n)} USDC minus platform fee (2.5%)
          </li>
          <li>Revenue accumulates in your pending balance</li>
          <li>Withdraw anytime to your connected wallet</li>
        </ul>
      </section>
    </div>
  );
}
