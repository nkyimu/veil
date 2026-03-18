"use client";

import { useState } from "react";

import { useAccount } from "wagmi";
import { useStoreCredential, useGetCredential } from "@/hooks/useVeilVault";
import { CREDENTIAL_TYPES, formatAddress } from "@/lib/constants";


export default function CredentialManagement() {
  const { address, isConnected } = useAccount();
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [storing, setStoring] = useState(false);
  const [successTx, setSuccessTx] = useState<`0x${string}` | null>(null);

  const { store } = useStoreCredential();
  const { credential, isLoading: checkingCredential } = useGetCredential(
    address,
    selectedType
  );

  const handleStore = async () => {
    if (!address || selectedType === null || !title || !content) {
      alert("Please fill all fields");
      return;
    }

    setStoring(true);
    try {
      // Generate a random salt for this credential
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

  return (
    <div className="flex flex-col gap-8">
      {!isConnected && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-yellow-200">
          Connect your wallet to store credentials and start earning.
        </div>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-2">Store Your Credentials</h2>
        <p className="text-gray-400 text-sm mb-6">
          Your data is hashed client-side. Only the commitment (hash) is stored
          on-chain. Only your agent sees the actual values.
        </p>

        {isConnected && address && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            {/* Select Credential Type */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                Credential Type
              </label>
              <select
                value={selectedType ?? ""}
                onChange={(e) => setSelectedType(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="">Select type...</option>
                {CREDENTIAL_TYPES.map((type, idx) => (
                  <option key={idx} value={idx}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Status */}
            {selectedType !== null && (
              <div className="bg-gray-800 rounded-lg p-3">
                {checkingCredential ? (
                  <p className="text-sm text-gray-400">Checking status...</p>
                ) : isStored ? (
                  <div>
                    <p className="text-sm font-semibold text-green-400">✓ Stored</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      {credential?.commitment?.slice(0, 10)}...
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Not stored yet</p>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Age"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Value</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g., 25"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-600 h-20"
              />
            </div>

            {/* Store Button */}
            <button
              onClick={handleStore}
              disabled={storing || !selectedType || !title || !content}
              className="w-full bg-veil-600 hover:bg-veil-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {storing ? "Storing..." : "Encrypt & Store"}
            </button>

            {successTx && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                <p className="text-sm text-green-400">✓ Stored!</p>
                <a
                  href={`https://sepolia.basescan.org/tx/${successTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-veil-400 hover:underline font-mono"
                >
                  {successTx.slice(0, 20)}...
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Your Stored Credentials */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Your Credentials</h3>
        <div className="flex flex-col gap-3">
          {CREDENTIAL_TYPES.map((credType, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{credType}</h3>
                <span className="text-xs text-gray-600">
                  {idx === selectedType
                    ? isStored
                      ? `Commitment: ${credential?.commitment?.slice(0, 16)}...`
                      : "Not stored"
                    : "—"}
                </span>
              </div>
              <div>
                {idx === selectedType && isStored ? (
                  <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">
                    Stored
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">Not set</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-veil-500 font-semibold mb-3">How It Works</h3>
        <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
          <li>Store your credentials — your agent encrypts them locally</li>
          <li>
            Hashed commitments are published on-chain (your data stays private)
          </li>
          <li>Services pay USDC to ask questions about your data</li>
          <li>Your agent answers YES/NO with a ZK proof — never exposing raw data</li>
          <li>You earn revenue from every query</li>
        </ol>
      </section>
    </div>
  );
}
