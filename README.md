# Veil

> Your AI agent guards your personal data and charges other services to ask it questions — you monetize your own data without ever exposing it.

**Synthesis Hackathon 2026** — "Agents that keep secrets" track

## The Problem

Your personal data is scattered across hundreds of services. They monetize it. You get nothing. When a service needs to verify something about you ("Is this user over 18?"), the entire answer (your exact birthdate) gets shared.

## The Solution

Veil flips the model: **you** own your data, **your agent** guards it, and **services pay you** for verified answers.

```
Service: "Is this user over 18?"
    ↓
Veil Agent (your guardian):
  → Checks your encrypted credentials
  → Generates ZK proof: YES
  → Service pays $0.02 USDC
  → You earn revenue
  → Your actual age? Never exposed.
```

## How It Works

1. **Store credentials** — Tell your agent your age, credit range, location, etc.
2. **Agent commits hashes on-chain** — Only cryptographic commitments stored publicly
3. **Services submit queries** — "Is user over 18?" with a USDC payment attached
4. **Agent answers** — YES/NO with a ZK proof, collects payment
5. **You earn** — Revenue accumulates, withdraw anytime

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard (Next.js)                                     │
│  - Credential management                                 │
│  - Query log                                             │
│  - Earnings tracker                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  VeilVault.sol (Base Mainnet)                            │
│  - Credential commitment storage                         │
│  - Query payment escrow                                  │
│  - ZK proof verification                                 │
│  - Revenue distribution                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Guardian Agent (ERC-8004)                               │
│  - Encrypted credential storage                          │
│  - Auto-answer queries with ZK proofs                    │
│  - Revenue collection                                    │
│  - Data owner notifications                              │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Smart Contract | Solidity (Foundry) — VeilVault.sol |
| Chain | Base (Ethereum L2) |
| ZK Proofs | Self Protocol (credential verification) |
| Payments | Locus API (USDC micropayments on Base) |
| Agent Identity | ERC-8004 |
| Frontend | Next.js + Tailwind CSS |
| Agent | TypeScript (viem) |

## Quick Start

### Contracts

```bash
cd contracts
forge install
forge build
forge test
```

### Frontend

```bash
npm install
npm run dev
```

## Deployed Contracts

| Contract | Address | Chain |
|----------|---------|-------|
| VeilVault | `TBD` | Base Mainnet |

## Query Types

| Credential | Example Query | Response |
|-----------|--------------|----------|
| Age | "Is user over 18?" | YES/NO |
| Credit Range | "Is credit score above 700?" | YES/NO |
| Location | "Is user in the US?" | YES/NO |
| Income | "Is income above $50K?" | YES/NO |
| Custom | Any verifiable claim | YES/NO |

## Revenue Model

- Services pay per query (default: configurable USDC fee)
- Data owners set their own query prices
- Platform takes a small fee (configurable, max 10%)
- Unanswered queries auto-refund after expiry

## Human-Agent Collaboration

This project was built through human-agent collaboration. See the `conversationLog/` directory for the full process documentation.

## License

MIT

## Credits

- Privacy via [Self Protocol](https://self.xyz)
- Payments via [Locus](https://paywithlocus.com)
- Agent identity via ERC-8004
- Ethereum knowledge via [ethskills](https://ethskills.com)
