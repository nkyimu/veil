export const VEIL_VAULT_ADDRESS = process.env.NEXT_PUBLIC_VEIL_VAULT_CONTRACT as `0x${string}`;
export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
export const CHAIN_ID = 84532; // Base Sepolia

export const CREDENTIAL_TYPES = ["Age", "CreditRange", "Location", "Income", "Custom"] as const;
export const DEFAULT_QUERY_FEE = 20000n; // 0.02 USDC (in 6-decimal wei)
export const QUERY_EXPIRY = 86400n; // 24 hours

// ─── Demo data — shown when Base Sepolia has no on-chain events ─────────────
// Represents the Amara persona + two peers to give judges a working demo.
export type DemoCredential = {
  owner: `0x${string}`;
  credType: number;
  credTypeName: string;
  queryCount: bigint;
  queryFee: bigint;
  isDemo: true;
  persona: string;
};

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    owner: "0x742d35Cc6634C0532925a3b8D4C9E7d5B8E2a1F4" as `0x${string}`,
    credType: 0, // Age
    credTypeName: "Age",
    queryCount: 7n,
    queryFee: 20000n, // $0.02 USDC
    isDemo: true,
    persona: "Amara",
  },
  {
    owner: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72" as `0x${string}`,
    credType: 1, // CreditRange
    credTypeName: "CreditRange",
    queryCount: 3n,
    queryFee: 50000n, // $0.05 USDC
    isDemo: true,
    persona: "Jordan",
  },
  {
    owner: "0x23c5a38d6Ba2c7BEF7DC7B51Ab7e02c9C2bB03b" as `0x${string}`,
    credType: 2, // Location
    credTypeName: "Location",
    queryCount: 12n,
    queryFee: 20000n, // $0.02 USDC
    isDemo: true,
    persona: "Kai",
  },
];

export type DemoAnswer = {
  queryId: bigint;
  answer: boolean;
  requester: `0x${string}`;
  dataOwner: `0x${string}`;
  credType: number;
  credTypeName: string;
  answeredAt: bigint;
  isDemo: true;
};

// Simulated answered queries for the Browse page "Recent Answers" section
export const DEMO_ANSWERS: DemoAnswer[] = [
  {
    queryId: 3n,
    answer: true,
    requester: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as `0x${string}`,
    dataOwner: "0x742d35Cc6634C0532925a3b8D4C9E7d5B8E2a1F4" as `0x${string}`,
    credType: 0,
    credTypeName: "Age",
    answeredAt: BigInt(Math.floor(Date.now() / 1000) - 120), // 2 min ago
    isDemo: true,
  },
  {
    queryId: 2n,
    answer: true,
    requester: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B" as `0x${string}`,
    dataOwner: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72" as `0x${string}`,
    credType: 1,
    credTypeName: "CreditRange",
    answeredAt: BigInt(Math.floor(Date.now() / 1000) - 900), // 15 min ago
    isDemo: true,
  },
  {
    queryId: 1n,
    answer: false,
    requester: "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6" as `0x${string}`,
    dataOwner: "0x23c5a38d6Ba2c7BEF7DC7B51Ab7e02c9C2bB03b" as `0x${string}`,
    credType: 2,
    credTypeName: "Location",
    answeredAt: BigInt(Math.floor(Date.now() / 1000) - 3600), // 1 hr ago
    isDemo: true,
  },
];

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
