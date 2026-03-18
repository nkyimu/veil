"use client";

import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { keccak256, encodePacked } from "viem";
import { VEIL_VAULT_ABI } from "@/lib/veilvault-abi";
import { VEIL_VAULT_ADDRESS } from "@/lib/constants";

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
