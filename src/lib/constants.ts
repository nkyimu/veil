export const VEIL_VAULT_ADDRESS = process.env.NEXT_PUBLIC_VEIL_VAULT_CONTRACT as `0x${string}`;
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const CHAIN_ID = 84532; // Base Sepolia

export const CREDENTIAL_TYPES = ["Age", "CreditRange", "Location", "Income", "Custom"] as const;
export const DEFAULT_QUERY_FEE = 20000n; // 0.02 USDC (in 6-decimal wei)
export const QUERY_EXPIRY = 86400n; // 24 hours

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatUSDA(wei: bigint): string {
  const decimal = Number(wei) / 1e6;
  return `$${decimal.toFixed(2)}`;
}

export function parseUSDA(amount: string): bigint {
  const num = parseFloat(amount);
  return BigInt(Math.floor(num * 1e6));
}
