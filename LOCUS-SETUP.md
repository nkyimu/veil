# Locus API — Setup Complete

> **Registered:** 2026-03-15
> **Status:** Wallet deployed ✅

## Account Details

- **Owner Address:** `0x2A32a443e07C7C72191FcC5c293324B2eFC02bc6`
- **Wallet Address:** `0x680ab339ea34d34a939080dfb3aef932b3892b4a`
- **Chain:** Base
- **Allowance:** 10.00 USDC
- **Max Tx Size:** 5.00 USDC

## Credentials (in macOS Keychain)

All sensitive credentials stored via `security add-generic-password`:

| Keychain Service | Account | What |
|---|---|---|
| `locus-api-key` | `veil-guardian` | API key (claw_dev_...) |
| `locus-owner-private-key` | `veil-guardian` | Owner private key |
| `locus-owner-address` | `veil-guardian` | Owner address |
| `locus-wallet-address` | `veil-guardian` | Deployed wallet address |
| `locus-wallet-id` | `veil-guardian` | Wallet UUID |

**Retrieve with:**
```bash
security find-generic-password -a "veil-guardian" -s "locus-api-key" -w
```

## Claim URL (for Amantu)

Link to dashboard: `https://beta.paywithlocus.com/register/claim/VY4vUXHVT4-wWHBG9MUFXALG7X-kHDxQlTs8Vq6t_7A`

## API Base

`https://beta-api.paywithlocus.com/api`

## Key Endpoints for Veil

- `POST /api/pay/send` — Distribute query revenue
- `GET /api/pay/balance` — Check guardian balance
- `POST /api/x402/call` — Pay-per-query via x402 protocol
- `GET /api/x402/endpoints/md` — Available x402 endpoints

## Integration Notes

- x402 middleware: use `x402-express` or Locus's `/api/x402/call`
- Gas is sponsored by Locus for API-initiated calls
- USDC on Base: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (6 decimals)
