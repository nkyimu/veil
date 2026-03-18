# 🫥 Veil — Sovereign Data Vault

> Your AI agent guards your personal data. Services pay to ask it questions. You earn revenue. Your data never leaves.

**Synthesis Hackathon 2026** · Tracks: Agents that Keep Secrets · Private Agents, Trusted Actions · ERC-8004 · Locus · Agent Services on Base

---

## The Human Problem

**Meet Amara.** Marketing manager in Lagos. She delegates everything to her AI assistant — subscriptions, scheduling, finances. It handles her life.

But every service her agent touches learns something about her. Netflix knows her viewing habits. Her bank knows her salary. Her health app knows her sleep patterns. Her agent stitched all of these together, and now every vendor it talks to gets a piece of the composite picture.

After a data breach at one service, Amara can't even tell which services had her information, what they knew, or who else they shared it with.

**The current model is broken:** services demand your full data to verify simple facts. "Is this user over 18?" shouldn't require your exact birthdate. "Is this person creditworthy?" shouldn't require your full financial history.

## The Solution

Veil flips the model. **You** own your data. **Your Guardian agent** protects it. **Services pay you** for verified answers.

```
Lending Protocol: "Is this user's credit score > 650?"
       ↓
Amara's Guardian Agent:
  → Checks encrypted local data
  → Answers: YES ✓
  → Collects 0.02 USDC
  → Amara's actual credit score? Never exposed.
```

Your agent becomes your **data bouncer** — it decides who gets in, what they learn, and how much they pay for the privilege.

## How It Works

**1. Store your credentials**
Tell your Guardian your age, credit range, location, income — whatever you want to make queryable. Raw data stays encrypted on your device. Only cryptographic commitments go on-chain.

**2. Guardian watches for queries**
Services submit questions to the VeilVault contract with USDC payment attached. Your Guardian agent monitors the chain for incoming queries.

**3. Agent answers autonomously**
Guardian checks the query against your local data, answers YES or NO on-chain with a proof, and collects the payment. You don't have to do anything.

**4. You earn revenue**
Every answered query earns you USDC. Check your dashboard, withdraw anytime. Your data is finally working *for* you.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Dashboard (Next.js + RainbowKit)                        │
│  Store credentials · View queries · Track earnings       │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│  VeilVault.sol (Base Sepolia)                            │
│  On-chain credential commitments · Query escrow          │
│  Answer verification · Revenue distribution              │
│  34 passing tests · Audited fee logic                    │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│  Guardian Agent (ERC-8004 Identity)                       │
│  Local encrypted storage · Autonomous query answering    │
│  ZK proof generation · Revenue collection                │
│  x402 paywall on sensitive endpoints                     │
└──────────────────────────────────────────────────────────┘
```

## CROPS Alignment

Veil's architectural decisions are shaped by the CROPS values — not as marketing, but as structural constraints:

| Value | Architectural Decision |
|-------|----------------------|
| **Privacy** | Raw data never leaves the user's device. Guardian answers YES/NO queries without revealing underlying values. Credential commitments are hashed — the chain stores proofs, not data. |
| **Censorship Resistance** | Credentials are committed on-chain. No centralized identity provider can revoke your credentials, block queries, or freeze your earnings. |
| **Open Source** | Entire stack: VeilVault.sol, Guardian agent, dashboard, deployment scripts. MIT licensed. |
| **Security** | Data encrypted locally. Only cryptographic commitments on-chain. Guardian validates queries against local truth. Contract has 34 Foundry tests including edge cases and access control. |

## Who Is This For?

Veil addresses real problems for real people (personas from the Synthesis Design Coach):

- **Amara** (primary) — Non-technical user who delegates to AI. Wants convenience without surveillance. Veil lets her agent handle queries without exposing her life to every service.
- **Marcus** — Researcher studying sensitive topics. Needs to prove academic credentials without revealing research focus. Veil proves the credential, not the context.
- **Ravi** — Gig worker across multiple platforms. Needs portable, sovereign reputation that no platform can erase. Veil stores his ratings and history as credentials he controls.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Smart Contract | Solidity (Foundry) — VeilVault.sol, 34 tests |
| Chain | Base Sepolia (Ethereum L2) |
| Agent Identity | ERC-8004 on-chain registration |
| Payments | USDC micropayments via Locus API |
| Agent Runtime | TypeScript + viem |
| Frontend | Next.js 15 + Tailwind + RainbowKit |
| Wallet | wagmi + RainbowKit (MetaMask, Coinbase, WalletConnect) |

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- MetaMask or compatible wallet
- Base Sepolia test ETH + USDC ([faucet.circle.com](https://faucet.circle.com))

### Run the Dashboard
```bash
git clone https://github.com/nkyimu/veil.git
cd veil
bun install
bun run dev
# Open http://localhost:3000
```

### Run the Tests
```bash
cd contracts
forge install
forge test -vv
# 34 tests passing
```

### Deploy Contracts
```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast
```

## Deployed Contracts

| Contract | Address | Chain |
|----------|---------|-------|
| VeilVault | [`0x2f881af96415a452807baf6a23b73129d57f8d7a`](https://sepolia.basescan.org/address/0x2f881af96415a452807baf6a23b73129d57f8d7a) | Base Sepolia |

## Query Types

| Credential | Example Query | Answer |
|-----------|--------------|--------|
| Age | "Is user over 18?" | YES/NO |
| Credit Range | "Is credit score above 700?" | YES/NO |
| Location | "Is user in the US?" | YES/NO |
| Income | "Is income above $50K?" | YES/NO |
| Custom | Any verifiable claim | YES/NO |

## Revenue Model

- Services pay per query (default: 0.02 USDC, configurable per credential)
- Platform fee: 2.5% (configurable, capped at 10%)
- Unanswered queries auto-refund after 24h expiry
- Data owners withdraw accumulated earnings anytime

## Human-Agent Collaboration

This project was built through human-agent collaboration — a human architect directing AI agents through a structured sprint. See [`CONVERSATION_LOG.md`](./CONVERSATION_LOG.md) for the full build process, design decisions, and agent reasoning traces.

## License

MIT

## Acknowledgments

- [Self Protocol](https://self.xyz) — ZK credential verification
- [Locus](https://paywithlocus.com) — Agent-native USDC payments
- [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) — On-chain agent identity
- [Synthesis Design Coach](https://www.cropsdesign.com/coach/SKILL.md) — Human-centered design framework
- [ethskills](https://ethskills.com) — Ethereum development knowledge
