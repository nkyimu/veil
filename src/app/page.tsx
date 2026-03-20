"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useStoreCredential, useGetCredential, useGetEarnings } from "@/hooks/useVeilVault";
import { CREDENTIAL_TYPES, formatAddress } from "@/lib/constants";

function StatPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-gray-800 rounded-lg px-4 py-3">
      <div className={`text-lg font-mono font-bold ${accent ? "text-veil-400" : "text-white"}`}>{value}</div>
      <div className="text-xs font-mono text-gray-600 tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

export default function CredentialManagement() {
  const { address, isConnected } = useAccount();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [storing, setStoring] = useState(false);
  const [successTx, setSuccessTx] = useState<`0x${string}` | null>(null);

  const { store } = useStoreCredential();
  const { credential, isLoading: checkingCredential } = useGetCredential(address, selectedType);
  const { pending, queryCount } = useGetEarnings(address);

  const handleStore = async () => {
    if (!address || selectedType === null || !title || !content) {
      alert("Please fill all fields");
      return;
    }

    setStoring(true);
    try {
      const salt = Math.random().toString(36).substring(2, 15);
      const txHash = await store(selectedType, content, salt);

      if (txHash) {
        setSuccessTx(txHash);
        setTitle("");
        setContent("");
        setTimeout(() => setSuccessTx(null), 5000);
      }
    } catch (error) {
      console.error("Error storing credential:", error);
      alert("Failed to store credential");
    } finally {
      setStoring(false);
    }
  };

  const isStored = credential?.active ?? false;

  // Format pending earnings (bigint in USDC with 6 decimals)
  const pendingFormatted = isConnected && pending > 0n
    ? `$${(Number(pending) / 1_000_000).toFixed(2)}`
    : "$0.00";

  const queryCountFormatted = isConnected && queryCount > 0n
    ? queryCount.toString()
    : "—";

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Hero */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Data Vault</h2>
          <p className="text-sm font-mono text-gray-600 tracking-widest mt-1">
            STORE · PROTECT · EARN
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatPill label="CREDENTIALS" value={CREDENTIAL_TYPES.length.toString()} />
          <StatPill label="QUERIES RECEIVED" value={queryCountFormatted} />
          <StatPill label="PENDING EARNINGS" value={pendingFormatted} accent />
        </div>
      </div>

      {!isConnected && (
        <div className="flex items-center gap-3 bg-amber-950/30 border border-amber-800/50 rounded-lg p-4">
          <span className="text-amber-400 font-mono text-xs tracking-widest">WALLET.REQUIRED</span>
          <span className="text-amber-200/70 text-sm">Connect your wallet to store credentials and start earning.</span>
        </div>
      )}

      {/* Store Form */}
      {isConnected && address && (
        <section>
          <h3 className="text-sm font-mono text-gray-500 tracking-widest mb-3">STORE CREDENTIAL</h3>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <label className="text-xs font-mono text-gray-500 tracking-widest block mb-2">
                CREDENTIAL TYPE
              </label>
              <select
                value={selectedType ?? ""}
                onChange={(e) => setSelectedType(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-veil-600 focus:outline-none"
              >
                <option value="">Select type...</option>
                {CREDENTIAL_TYPES.map((type, idx) => (
                  <option key={idx} value={idx}>{type}</option>
                ))}
              </select>
            </div>

            {selectedType !== null && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 flex items-center gap-2">
                {checkingCredential ? (
                  <span className="text-xs font-mono text-gray-500 tracking-widest">CHECKING...</span>
                ) : isStored ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-emerald-400 tracking-widest">STORED</span>
                    <span className="text-xs font-mono text-gray-600 ml-2">
                      {credential?.commitment?.slice(0, 14)}...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-600" />
                    <span className="text-xs font-mono text-gray-500 tracking-widest">NOT STORED</span>
                  </>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-gray-500 tracking-widest block mb-2">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Age"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:border-veil-600 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 tracking-widest block mb-2">VALUE</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., 25"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 h-20 focus:border-veil-600 focus:outline-none text-sm font-mono"
              />
              <p className="text-xs text-gray-700 mt-1 font-mono">
                Hashed client-side. Only the commitment goes on-chain.
              </p>
            </div>

            <button
              onClick={handleStore}
              disabled={storing || !selectedType || !title || !content}
              className="w-full bg-veil-600 hover:bg-veil-700 disabled:bg-gray-800 disabled:text-gray-600 text-white px-6 py-3 rounded-lg font-mono text-sm tracking-widest transition-colors"
            >
              {storing ? "ENCRYPTING..." : "ENCRYPT & STORE →"}
            </button>

            {successTx && (
              <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 tracking-widest">STORED ON-CHAIN</span>
                <a
                  href={`https://sepolia.basescan.org/tx/${successTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-veil-400 hover:underline ml-auto"
                >
                  {successTx.slice(0, 20)}... ↗
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Credential Registry */}
      <section>
        <h3 className="text-sm font-mono text-gray-500 tracking-widest mb-3">CREDENTIAL REGISTRY</h3>
        <div className="flex flex-col gap-2">
          {CREDENTIAL_TYPES.map((credType, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-sm">{credType}</span>
                {idx === selectedType && credential?.commitment && (
                  <p className="text-xs font-mono text-gray-700 mt-0.5">
                    {credential.commitment.slice(0, 18)}...
                  </p>
                )}
              </div>
              {idx === selectedType && isStored ? (
                <span className="text-xs font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded tracking-widest">
                  STORED
                </span>
              ) : (
                <span className="text-xs font-mono text-gray-700 tracking-widest">NOT SET</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Protocol Explainer */}
      <section className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h3 className="text-xs font-mono text-veil-500 tracking-widest mb-4">PROTOCOL</h3>
        <ol className="text-gray-500 text-sm space-y-2 font-mono">
          <li><span className="text-gray-700">01</span> · Store credentials — hashed locally, committed on-chain</li>
          <li><span className="text-gray-700">02</span> · Guardian monitors for incoming queries</li>
          <li><span className="text-gray-700">03</span> · Services pay USDC to ask YES/NO questions</li>
          <li><span className="text-gray-700">04</span> · Agent answers via Venice private inference — data never exposed</li>
          <li><span className="text-gray-700">05</span> · Revenue accumulates on-chain, withdraw anytime</li>
        </ol>
      </section>
    </div>
  );
}
