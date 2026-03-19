# Veil Guardian Agent

## Description
AI agent that guards personal data and answers queries about credentials. Uses Venice AI for private inference (no data retention). Earns USDC per query answered.

## Endpoints
- `POST /query` — Answer a credential query (x402 payment required)
- `GET /health` — Health check
- `GET /earnings?dataOwner=0x...` — Check earnings
- `POST /credentials` — Store a new credential

## Payment
Queries require x402 payment of 0.001 USDC via Locus gateway.

## Example Query
```json
{
  "queryId": 1,
  "credentialType": "age",
  "question": "Is the user over 18?",
  "dataOwner": "0x2A32a443e07C7C72191FcC5c293324B2eFC02bc6",
  "requester": "0xYourAddress"
}
```

## Supported Credential Types
- `age` — User's age (numeric)
- `creditRange` — Credit score range (numeric)
- `location` — User's location (string)
- `income` — Annual income (numeric)
- `custom` — Custom credential type

## Running the Agent

### Development
```bash
cd /Users/cerebro/.openclaw/workspace/veil
bun run agent:dev
```

### Production
```bash
bun run agent
```

The agent will:
1. Initialize with demo credentials (Amara persona)
2. Start the HTTP server on port 3001
3. Monitor for incoming queries
4. Respond autonomously with encrypted answers

## Environment Variables
- `GUARDIAN_PORT` — Server port (default: 3001)
- `VENICE_API_KEY` — Venice AI API key for private inference
- `VENICE_API_URL` — Venice AI API endpoint
- `GUARDIAN_ADDRESS` — Guardian's Ethereum address
- `VEIL_VAULT_ADDRESS` — VeilVault contract address
- `RPC_URL` — Base Sepolia RPC endpoint

## Features
- **Private inference** — Venice AI processes queries without data retention
- **Zero-knowledge proofs** — Answers verified via Self Protocol
- **x402 payment** — Micropayment per query via Locus gateway
- **Autonomous response** — Agent answers on behalf of data owner
- **Earnings tracking** — Query fees collected per data owner
