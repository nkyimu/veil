# VeilVault — Hackathon Quick Start

## TL;DR — Get It Running in 30 Seconds

```bash
cd /Users/cerebro/.openclaw/workspace/veil
bun run dev
# Open http://localhost:3000
# Click "Connect Wallet" (top right)
# Demo begins
```

## What You Have

✅ **Three screens, fully wired to the VeilVault contract:**

1. **`/` — Store Credential**
   - Hash & store your data on-chain
   - Form: Type + Title + Value
   - Button: "Encrypt & Store"

2. **`/queries` — Browse & Query**
   - Browse 4 demo credentials
   - Submit questions (e.g., "Is user 18+?")
   - Pay 0.02 USDC per query
   - Button: "Request Answer"

3. **`/earnings` — Earnings Dashboard**
   - See pending/total revenue
   - Withdraw USDC
   - See recent queries
   - Button: "Withdraw $X.XX"

## Demo Flow (3 Minutes)

1. **Connect Wallet** (MetaMask, etc.)
   - Top-right button
   - Sign in with Base Sepolia

2. **Store a Credential** (`/`)
   - Select "Age"
   - Title: "My Age"
   - Value: "25"
   - Click "Encrypt & Store"
   - Sign tx → See success ✓

3. **Query a Credential** (`/queries`)
   - Click a demo credential
   - Question: "Is user over 18?"
   - Click "Request Answer"
   - Sign tx → Guardian answers instantly

4. **Check Earnings** (`/earnings`)
   - See query count + revenue
   - Click "Withdraw"
   - Sign tx → Money goes to your wallet

## Requirements

- **MetaMask or compatible wallet**
- **Base Sepolia test network** (add to MetaMask)
- **~0.10 USDC** on Base Sepolia (for query fees)
- **~0.01 ETH** on Base Sepolia (for gas)

## Get Test Tokens

Go to: https://faucet.circle.com/ (USDC faucet for Base Sepolia)

## If Something Breaks

```bash
# Kill the dev server
pkill -f "npm run dev"

# Reinstall
cd /Users/cerebro/.openclaw/workspace/veil
rm -rf node_modules
bun install

# Restart
bun run dev
```

## Full Documentation

See: `/Users/cerebro/.openclaw/workspace-adze/overnight-output/2026-03-18-veil-d2-frontend.md`

## Contract Address

**VeilVault:** `0x2f881af96415a452807baf6a23b73129d57f8d7a` (Base Sepolia)

View on BaseScan: https://sepolia.basescan.org/address/0x2f881af96415a452807baf6a23b73129d57f8d7a

---

**Status:** ✅ Ready for hackathon demo  
**Time to run:** 30 seconds  
**Blockers:** None
