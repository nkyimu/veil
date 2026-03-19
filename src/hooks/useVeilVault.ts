"use client";

import { useAccount, useWriteContract, useReadContract, usePublicClient } from "wagmi";
import { keccak256, encodePacked } from "viem";
import { useState, useEffect } from "react";
import { VEIL_VAULT_ABI } from "@/lib/veilvault-abi";
import { VEIL_VAULT_ADDRESS, CREDENTIAL_TYPES } from "@/lib/constants";

export function useStoreCredential() {
  const { writeContractAsync } = useWriteContract();

  const store = async (
    credType: number,
    content: string,
    salt: string
  ): Promise<`0x${string}` | null> => {
    try {
      // Hash the content with salt using keccak256
      const commitment = keccak256(
        encodePacked(["uint8", "string", "string"], [credType, content, salt])
      );

      // Call storeCredential on-chain
      const txHash = await writeContractAsync({
        address: VEIL_VAULT_ADDRESS,
        abi: VEIL_VAULT_ABI,
        functionName: "storeCredential",
        args: [credType as 0 | 1 | 2 | 3 | 4, commitment],
      });

      return txHash;
    } catch (error) {
      console.error("Failed to store credential:", error);
      return null;
    }
  };

  return { store };
}

export function useGetCredential(owner: `0x${string}` | undefined, credType: number | null) {
  const { data: credential, isLoading } = useReadContract({
    address: VEIL_VAULT_ADDRESS,
    abi: VEIL_VAULT_ABI,
    functionName: "getCredential",
    args: owner && credType !== null ? [owner, credType as 0 | 1 | 2 | 3 | 4] : undefined,
  });

  return { credential, isLoading };
}

export function useGetEarnings(owner: `0x${string}` | undefined) {
  const { data: earnings, isLoading, refetch } = useReadContract({
    address: VEIL_VAULT_ADDRESS,
    abi: VEIL_VAULT_ABI,
    functionName: "getEarnings",
    args: owner ? [owner] : undefined,
  });

  return {
    pending: earnings?.[0] ?? 0n,
    total: earnings?.[1] ?? 0n,
    queryCount: earnings?.[2] ?? 0n,
    isLoading,
    refetch,
  };
}

export function useWithdrawRevenue() {
  const { writeContractAsync } = useWriteContract();

  const withdraw = async (): Promise<`0x${string}` | null> => {
    try {
      const txHash = await writeContractAsync({
        address: VEIL_VAULT_ADDRESS,
        abi: VEIL_VAULT_ABI,
        functionName: "withdrawRevenue",
      });
      return txHash;
    } catch (error) {
      console.error("Failed to withdraw revenue:", error);
      return null;
    }
  };

  return { withdraw };
}

export function useSubmitQuery() {
  const { writeContractAsync } = useWriteContract();

  const submit = async (
    dataOwner: `0x${string}`,
    credType: number,
    question: string
  ): Promise<`0x${string}` | null> => {
    try {
      // Hash the question to create queryHash
      const queryHash = keccak256(
        encodePacked(["address", "uint8", "string"], [dataOwner, credType, question])
      );

      const txHash = await writeContractAsync({
        address: VEIL_VAULT_ADDRESS,
        abi: VEIL_VAULT_ABI,
        functionName: "submitQuery",
        args: [dataOwner, credType as 0 | 1 | 2 | 3 | 4, queryHash],
      });
      return txHash;
    } catch (error) {
      console.error("Failed to submit query:", error);
      return null;
    }
  };

  return { submit };
}

// ─── On-chain event hooks ───────────────────────────────────────────────────

export type LiveCredential = {
  owner: `0x${string}`;
  credType: number;
  credTypeName: string;
  queryCount: bigint;
  queryFee: bigint;
};

/**
 * Fetches real CredentialStored events from Base Sepolia and enriches each
 * unique (owner, credType) pair with query count + fee from contract reads.
 */
export function useCredentialEvents() {
  const publicClient = usePublicClient();
  const [credentials, setCredentials] = useState<LiveCredential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    let cancelled = false;

    async function fetchCredentials() {
      try {
        const logs = await publicClient!.getContractEvents({
          address: VEIL_VAULT_ADDRESS,
          abi: VEIL_VAULT_ABI,
          eventName: "CredentialStored",
          fromBlock: BigInt(0),
          toBlock: "latest",
        });

        // Dedupe by owner+credType — last event wins (handles re-stores)
        const seen = new Map<string, { owner: `0x${string}`; credType: number }>();
        for (const log of logs) {
          const args = log.args as { owner: `0x${string}`; credType: number };
          const key = `${args.owner.toLowerCase()}-${args.credType}`;
          seen.set(key, { owner: args.owner, credType: args.credType });
        }

        const unique = Array.from(seen.values());

        // Read query counts and fees in parallel
        const enriched = await Promise.all(
          unique.map(async ({ owner, credType }) => {
            try {
              const [qCount, qFee] = await Promise.all([
                publicClient!.readContract({
                  address: VEIL_VAULT_ADDRESS,
                  abi: VEIL_VAULT_ABI,
                  functionName: "queryCount",
                  args: [owner],
                }),
                publicClient!.readContract({
                  address: VEIL_VAULT_ADDRESS,
                  abi: VEIL_VAULT_ABI,
                  functionName: "getQueryFee",
                  args: [owner],
                }),
              ]);
              return {
                owner,
                credType,
                credTypeName: CREDENTIAL_TYPES[credType] ?? "Unknown",
                queryCount: qCount as bigint,
                queryFee: qFee as bigint,
              };
            } catch {
              return {
                owner,
                credType,
                credTypeName: CREDENTIAL_TYPES[credType] ?? "Unknown",
                queryCount: 0n,
                queryFee: 20000n,
              };
            }
          })
        );

        if (!cancelled) setCredentials(enriched);
      } catch (err) {
        console.error("useCredentialEvents: fetch failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCredentials();
    return () => { cancelled = true; };
  }, [publicClient]);

  return { credentials, loading };
}

export type LiveAnswer = {
  queryId: bigint;
  answer: boolean;
  requester: `0x${string}`;
  dataOwner: `0x${string}`;
  credType: number;
  credTypeName: string;
  answeredAt: bigint;
};

export type EarningsEntry = LiveAnswer & { payment: bigint };

/**
 * Fetches recent QueryAnswered events and enriches with query details.
 * Returns up to `limit` most-recent answered queries.
 */
/**
 * Fetches QueryCreated events where the connected user is the dataOwner,
 * then enriches with answer status. Used on the Earnings page.
 */
export function useMyEarningsHistory(address: `0x${string}` | undefined, limit = 10) {
  const publicClient = usePublicClient();
  const [history, setHistory] = useState<EarningsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicClient || !address) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchHistory() {
      try {
        // Filter QueryCreated by indexed dataOwner — efficient on-chain filter
        const created = await publicClient!.getContractEvents({
          address: VEIL_VAULT_ADDRESS,
          abi: VEIL_VAULT_ABI,
          eventName: "QueryCreated",
          args: { dataOwner: address },
          fromBlock: BigInt(0),
          toBlock: "latest",
        });

        // Most recent first, capped at limit
        const recent = created.slice(-limit).reverse();

        const enriched = await Promise.all(
          recent.map(async (log) => {
            const args = log.args as {
              queryId: bigint;
              requester: `0x${string}`;
              dataOwner: `0x${string}`;
              credType: number;
              payment: bigint;
            };
            try {
              const query = await publicClient!.readContract({
                address: VEIL_VAULT_ADDRESS,
                abi: VEIL_VAULT_ABI,
                functionName: "getQuery",
                args: [args.queryId],
              }) as {
                requester: `0x${string}`;
                dataOwner: `0x${string}`;
                credType: number;
                answeredAt: bigint;
              };
              // answeredAt == 0 means not yet answered
              return {
                queryId: args.queryId,
                answer: query.answeredAt > 0n, // answered = true (answer details require QueryAnswered event lookup)
                requester: args.requester,
                dataOwner: args.dataOwner,
                credType: args.credType,
                credTypeName: CREDENTIAL_TYPES[args.credType] ?? "Unknown",
                answeredAt: query.answeredAt,
                payment: args.payment,
              };
            } catch {
              return null;
            }
          })
        );

        const valid = enriched.filter(Boolean) as EarningsEntry[];
        if (!cancelled) setHistory(valid);
      } catch (err) {
        console.error("useMyEarningsHistory: fetch failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHistory();
    return () => { cancelled = true; };
  }, [publicClient, address, limit]);

  return { history, loading };
}

export function useQueryAnsweredEvents(limit = 10) {
  const publicClient = usePublicClient();
  const [answers, setAnswers] = useState<LiveAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicClient) return;

    let cancelled = false;

    async function fetchAnswers() {
      try {
        const logs = await publicClient!.getContractEvents({
          address: VEIL_VAULT_ADDRESS,
          abi: VEIL_VAULT_ABI,
          eventName: "QueryAnswered",
          fromBlock: BigInt(0),
          toBlock: "latest",
        });

        // Most recent first, capped at `limit`
        const recent = logs.slice(-limit).reverse();

        const enriched = await Promise.all(
          recent.map(async (log) => {
            const args = log.args as { queryId: bigint; answer: boolean };
            try {
              const query = await publicClient!.readContract({
                address: VEIL_VAULT_ADDRESS,
                abi: VEIL_VAULT_ABI,
                functionName: "getQuery",
                args: [args.queryId],
              }) as {
                requester: `0x${string}`;
                dataOwner: `0x${string}`;
                credType: number;
                answeredAt: bigint;
              };
              return {
                queryId: args.queryId,
                answer: args.answer,
                requester: query.requester,
                dataOwner: query.dataOwner,
                credType: query.credType,
                credTypeName: CREDENTIAL_TYPES[query.credType] ?? "Unknown",
                answeredAt: query.answeredAt,
              };
            } catch {
              return {
                queryId: args.queryId,
                answer: args.answer,
                requester: "0x0000000000000000000000000000000000000000" as `0x${string}`,
                dataOwner: "0x0000000000000000000000000000000000000000" as `0x${string}`,
                credType: 0,
                credTypeName: "Unknown",
                answeredAt: 0n,
              };
            }
          })
        );

        if (!cancelled) setAnswers(enriched);
      } catch (err) {
        console.error("useQueryAnsweredEvents: fetch failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAnswers();
    return () => { cancelled = true; };
  }, [publicClient, limit]);

  return { answers, loading };
}
