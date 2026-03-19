"use client";

import { useState } from "react";

import { useAccount } from "wagmi";
import {
  useSubmitQuery,
  useCredentialEvents,
  useQueryAnsweredEvents,
} from "@/hooks/useVeilVault";
import { CREDENTIAL_TYPES, formatAddress, formatUSDA } from "@/lib/constants";

export default function QueryBrowse() {
  const { address, isConnected } = useAccount();
  const [selectedDataOwner, setSelectedDataOwner] = useState("");
  const [selectedCredType, setSelectedCredType] = useState<number>(-1);
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successTx, setSuccessTx] = useState<`0x${string}` | null>(null);

  const { submit } = useSubmitQuery();
  const { credentials, loading: credsLoading, isDemo: credIsDemo } = useCredentialEvents();
  const { answers, loading: answersLoading, isDemo: answersIsDemo } = useQueryAnsweredEvents(5);
  const isDemoMode = credIsDemo || answersIsDemo;

  const handleSubmitQuery = async () => {
    if (!address || !selectedDataOwner || selectedCredType < 0 || !question) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const txHash = await submit(
        selectedDataOwner as `0x${string}`,
        selectedCredType,
        question
      );

      if (txHash) {
        setSuccessTx(txHash);
        setQuestion("");
        setTimeout(() => setSuccessTx(null), 5000);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Failed to submit query. Ensure you have USDC to pay for it.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCred = credentials.find(
    (c) => c.owner.toLowerCase() === selectedDataOwner.toLowerCase()
  );

  if (!isConnected) {
    return (
      <div className="flex flex-col gap-8">
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-200">
          Connect your wallet to query credentials. You need USDC to pay for queries.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {isDemoMode && (
        <div className="bg-veil-900/20 border border-veil-700/50 rounded-lg p-3 flex items-center gap-3">
          <span className="text-veil-400 font-mono text-xs font-bold tracking-widest">⚡ DEMO MODE</span>
          <span className="text-gray-400 text-xs">
            Showing sample credentials — no real on-chain data found yet. Store a credential first to see live data.
          </span>
        </div>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-2">Browse & Query Credentials</h2>
        <p className="text-gray-400 text-sm mb-6">
          Ask questions about users' credentials. Pay with USDC. Get instant
          answers backed by ZK proofs. No raw data is ever exposed.
        </p>
      </section>

      {/* Available Credentials */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          Available Credentials
          {!credsLoading && (
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({credentials.length} on-chain)
            </span>
          )}
        </h3>

        {credsLoading ? (
          <div className="text-gray-500 text-sm py-4">Loading on-chain credentials…</div>
        ) : credentials.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">No credentials stored yet.</p>
            <p className="text-gray-600 text-xs mt-1">
              Store a credential on the{" "}
              <a href="/" className="text-veil-400 hover:underline">
                home page
              </a>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {credentials.map((cred) => (
              <div
                key={`${cred.owner}-${cred.credType}`}
                onClick={() => {
                  setSelectedDataOwner(cred.owner);
                  setSelectedCredType(cred.credType);
                }}
                className={`rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDataOwner.toLowerCase() === cred.owner.toLowerCase()
                    ? "bg-veil-900/50 border border-veil-600"
                    : "bg-gray-900 border border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{cred.credTypeName}</p>
                      {cred.isDemo && (
                        <span className="text-[10px] font-mono font-bold text-veil-500 border border-veil-700 rounded px-1 py-px leading-none">
                          DEMO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {cred.persona ? `${cred.persona} · ` : ""}{formatAddress(cred.owner)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-veil-400 font-semibold">
                      {formatUSDA(cred.queryFee)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cred.queryCount.toString()} queries
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Query Form */}
      {selectedDataOwner && (
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Ask a Question</h3>

          {/* Credential Type — auto-set from card selection, but user can override */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">
              What credential type?
            </label>
            <select
              value={selectedCredType}
              onChange={(e) => setSelectedCredType(parseInt(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value={-1}>Select type...</option>
              {CREDENTIAL_TYPES.map((type, idx) => (
                <option key={idx} value={idx}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Is this user over 18?"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 h-16"
            />
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cost</span>
              <span className="text-veil-400 font-semibold">
                {selectedCred ? formatUSDA(selectedCred.queryFee) : "—"}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitQuery}
            disabled={
              submitting ||
              !selectedDataOwner ||
              selectedCredType < 0 ||
              !question
            }
            className="w-full bg-veil-600 hover:bg-veil-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {submitting ? "Submitting..." : "Request Answer"}
          </button>

          {successTx && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
              <p className="text-sm text-green-400">✓ Query Submitted!</p>
              <p className="text-xs text-gray-400 mt-1">
                Your query has been sent to the agent. Answer coming soon...
              </p>
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
        </section>
      )}

      {/* How It Works */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-veil-500 font-semibold mb-3">How Queries Work</h3>
        <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
          <li>Pick a user whose credential you want to query</li>
          <li>Ask a yes/no question (e.g., "Is this person over 18?")</li>
          <li>Pay the query fee in USDC</li>
          <li>The user's agent evaluates your question and responds</li>
          <li>You get a cryptographic proof (no raw data ever shared)</li>
        </ol>
      </section>

      {/* Recent Answers — live from chain */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Recent Answers</h3>
        {answersLoading ? (
          <div className="text-gray-500 text-sm py-4">Loading on-chain answers…</div>
        ) : answers.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">No answered queries yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {answers.map((a) => (
              <div
                key={a.queryId.toString()}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">#{a.queryId.toString()}</span>
                  <span className="text-xs text-gray-500">
                    {a.answeredAt > 0n
                      ? new Date(Number(a.answeredAt) * 1000).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{a.credTypeName} query</p>
                    <span className="text-xs text-gray-500 font-mono">
                      {formatAddress(a.dataOwner)}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      a.answer ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {a.answer ? "YES ✓" : "NO ✗"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
