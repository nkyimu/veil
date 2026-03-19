# Veil — Deployment & Submission Checklist

## ✅ Done (No Blockers)
- [x] VeilVault.sol deployed to Base Sepolia (`0x2f881af96415a452807baf6a23b73129d57f8d7a`)
- [x] 34 Foundry tests passing
- [x] Locus API registered + wallet on Base
- [x] Guardian agent with Venice private inference (`VENICE_API_KEY` env var, graceful fallback)
- [x] Frontend: 3 pages (credentials, queries, earnings)
- [x] Wagmi + RainbowKit wallet connect
- [x] README with Amara persona + CROPS framing
- [x] CONVERSATION_LOG.md with agent reasoning traces
- [x] PERSONA-MAPPING.md (3 Synthesis personas)
- [x] DESIGN-DIRECTION.md (Clinical Noir aesthetic)
- [x] .env.example for judges
- [x] x402 paywall — Locus payment verification wired to POST /query (commit `9d56ce5`)
- [x] Guardian server deployable — `bun run agent` (commit `d7068af`, port 3001)
- [x] agent.json + agent_log.json for "Let the Agent Cook" track (commit `0a22f4e`)
- [x] agent/skill.md for OpenClaw discovery (committed)
- [x] Browse & Query page: live on-chain credentials via `eth_getLogs` (commit `c8d2534`) ⚠️ push pending
- [x] Earnings page: live on-chain query events (commit `4d20e2f`) ⚠️ push pending
- [x] Submission copy: Venice × OpenClaw "Private Agents" track narrative added

## 🔧 In Progress / Optional Polish
- [ ] Demo credential initialization (Amara's data — pre-seeded for judges)
- [ ] Frontend design polish (Clinical Noir theme from DESIGN-DIRECTION.md)

## 🚫 Blocked on Amantu
- [ ] **Synthesis API registration** ← DO THIS FIRST ($17,917+ at risk)
  - Command: `workspace-baker/overnight-output/2026-03-18-synthesis-registration-command.md`
  - Takes 2 minutes. Save returned `sk-synth-...` apiKey.
- [ ] **Venice API key** — sign up at `venice.ai/dashboard`, set `VENICE_API_KEY` in `.env`
  - Unlocks $5,750 VVV (Venice Private Agents track). 5 min.
- [ ] **Push stuck commits** (`c8d2534` + `4d20e2f` + this checklist)
  - `git push origin main` from `nkyimu` GitHub identity (not `blu3dot`)
- [ ] **Locus claim URL** — `https://beta.paywithlocus.com/register/claim/VY4vUXHVT4-wWHBG9MUFXALG7X-kHDxQlTs8Vq6t_7A`
- [ ] **ERC-8004 on-chain registration** — `npm run register-erc8004` with `GUARDIAN_PRIVATE_KEY`
  - Add track UUID `ea3b366947c54689bd82ae80bf9f3310` (Venice) + `10bd47fac07e4f85bda33ba482695b24` (Let the Agent Cook)
- [ ] **Demo video** — 3-min walkthrough as Amara, use demo script in submission copy

## Submission Deadline
- **Synthesis**: March 22, 2026 (T-3 days)
- **Potential prize range**: $10,417 – $17,917 + VVV

## Quick Start for Judges
```bash
# 1. Copy env
cp .env.example .env
# Fill in: VENICE_API_KEY, GUARDIAN_ADDRESS, GUARDIAN_PRIVATE_KEY

# 2. Start frontend
bun run dev  # http://localhost:3000

# 3. Start Guardian agent
bun run agent  # http://localhost:3001
```
