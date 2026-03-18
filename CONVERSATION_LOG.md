# Conversation Log — Veil Build Process

> Transparent record of how this project was designed, built, and iterated through human-agent collaboration during the Synthesis Hackathon (March 13–22, 2026).

## Build Team

- **Human Architect:** Amantu (system design, product direction, design taste)
- **Coordinator Agent:** Empa (orchestration, persona mapping, submission materials)
- **Build Agent:** Adze/Granville (smart contracts, tests, frontend, guardian agent)
- **Security Agent:** Sentinel (CVE monitoring, credential hygiene)
- **Research Agent:** Dorothy (market validation, ecosystem mapping)

## Timeline

### Day 0 — March 15: Foundation & Strategy

**Decision: Veil over SusuShield**

Two repos existed: `nkyimu/veil` (sovereign data vault) and `nkyimu/susushield` (privacy-preserving ROSCA). Evaluated both against Synthesis tracks.

```
Reasoning:
- Veil: VeilVault.sol already complete, 34 tests passing, clear privacy narrative
- SusuShield: No contract written, more complex coordination logic
- 7-day sprint → ship the one that's closest to done
- Decision: Veil first, SusuShield as stretch goal
```

**Prize Track Mapping**

Evaluated all 119 Synthesis prizes. Selected 6 tracks where Veil has natural fit:

1. **Synthesis Open Track** ($25K pool) — Community-funded, strongest overall project
2. **Private Agents, Trusted Actions** (Venice) — Privacy-preserving agent actions
3. **Agents With Receipts — ERC-8004** (Protocol Labs) — Verifiable agent identity
4. **Agent Services on Base** (Base) — x402 payments + discoverable services
5. **Best Use of Locus** (Locus) — Agent-native payment integration
6. **Let the Agent Cook** (Protocol Labs) — Autonomous end-to-end agent

**Technical Foundation (D0)**

- Cloned repo, set up credential isolation (nkyimu identity)
- Adze wrote deployment scripts (`Deploy.s.sol`, chain-aware for Base Sepolia + Mainnet)
- Adze wrote comprehensive test suite: 34 tests covering credential storage, query lifecycle, fee calculation, access control, edge cases
- All tests passing on first run
- Locus API registered, wallet deployed on Base
- Credentials stored in macOS Keychain (not in files)

```
Agent reasoning (Empa):
"Locus gives us agent-native USDC payments without needing users to pre-fund.
The wallet deployed on Base means the Guardian can receive payments directly.
Keychain storage because API keys in dotfiles is a pattern we've regressed on before."
```

### Day 1 — March 16: Deployment & Frontend

**VeilVault Deployed to Base Sepolia**

```
Contract: 0x2f881af96415a452807baf6a23b73129d57f8d7a
Chain: Base Sepolia (84532)
Constructor: defaultQueryFee=20000, platformFeeBps=250, queryExpiry=86400
Verification: https://sepolia.basescan.org/address/0x2f881af96415a452807baf6a23b73129d57f8d7a
```

**Guardian Agent Wired**

Granville (Adze sub-agent) replaced TODO stubs with real contract calls:
- `storeCredential()` — hashes user data, commits to VeilVault
- `answerQuery()` — checks local encrypted store, answers on-chain
- `getEarnings()` — reads accumulated revenue
- Event monitoring via viem `watchContractEvent`

**Frontend Scaffolded**

Three pages built with Next.js 15 + RainbowKit:
- `/` — Store Credential (hash + commit flow)
- `/queries` — Browse & answer incoming queries
- `/earnings` — Revenue dashboard + withdrawal

**SSR Issue Identified & Fixed**

RainbowKit/wagmi access `localStorage` during server-side rendering. Root cause: `WagmiProvider` initialized before client-side mount guard.

```
Fix: Wrapped entire provider tree inside ClientOnlyWrapper.
Before: WagmiProvider > ClientOnlyWrapper > children
After: ClientOnlyWrapper > WagmiProvider > children
Also: Added force-dynamic to root layout to skip static prerendering.
Build passes. All routes dynamic.
```

### Day 2–3 — March 17–18: Frontend Polish & Persona Mapping

**Design Direction Established**

Explored Variant.com community designs for aesthetic reference. Identified "Clinical Noir" as the target aesthetic — secure operations center meets minimal crypto dashboard.

Key patterns adopted:
- Near-black backgrounds (#0A0A0F)
- Single accent color (purple/violet)
- Monospace typography for data fields
- Status pills (STORED, PENDING, ANSWERED)
- Card-based credential display

**Persona Mapping (Design Coach Framework)**

Applied the Synthesis Design Coach skill (`cropsdesign.com/coach/SKILL.md`) to ground Veil in real human needs.

```
Agent reasoning (Empa):
"The Design Coach says judges want a named human, not 'users.'
Scanned all 10 personas. Three map directly:
- Amara (Lagos, non-technical, delegates to AI, no privacy control)
- Marcus (researcher, query trails reveal research focus)
- Ravi (gig worker, reputation locked in platforms)
Amara is the hero persona — she's the most universal case."
```

**CROPS as Structural Decisions**

Mapped each CROPS value to a specific architectural choice in Veil:
- Privacy → YES/NO answers only, raw data never on-chain
- Censorship Resistance → On-chain commitments, no centralized revocation
- Open Source → Full stack MIT licensed
- Security → Local encryption, 34 contract tests, keychain credential storage

### Day 4+ — March 19–22: Ship Week

**Remaining Work (Prioritized)**

1. ~~Frontend SSR fix~~ ✅ Done
2. ConversationLog ✅ This document
3. README with persona framing ✅ Done
4. Guardian server endpoint for x402 queries
5. Demo video (3-minute walkthrough as Amara)
6. ERC-8004 agent registration
7. Status Network gasless deployment (bonus track)

## Design Decisions Log

### Why Base (not mainnet)?
Low gas costs for micropayment queries. 0.02 USDC query fees are only viable if gas is < $0.01. Base Sepolia for hackathon, Base Mainnet for production.

### Why USDC (not ETH)?
Data owners earn predictable revenue. "You earned $2.40 this week" is comprehensible. "You earned 0.000847 ETH" is not — especially for Amara, who is non-technical.

### Why YES/NO answers (not graduated responses)?
Minimal information disclosure. A boolean answer reveals the least possible information while still being useful. "Is credit > 650?" → YES tells the querier what they need without revealing the actual number (could be 651 or 850).

### Why local storage + on-chain commitments (not full on-chain encryption)?
Defense in depth. Even if on-chain encryption is broken in the future, the raw data was never there. The commitment proves the credential existed; the local store holds the truth.

### Why ERC-8004 identity for the Guardian?
The Guardian acts autonomously — answering queries, collecting payments, managing data. It needs a verifiable on-chain identity so queriers can trust that the answers come from a legitimate agent, not a spoofed endpoint.

### Why Locus for payments?
Agent-native USDC payments on Base. The Guardian needs to receive micropayments without the user manually approving each one. Locus provides spending controls (max per tx, daily allowance) that align with the "guardrails, not permission" philosophy.

## Failure Log (Transparency)

### Browser Tool Crash — 2.5 Day Silence (March 15–18)
During design research, the browser automation tool crashed on an iframe-heavy page. The coordinator agent (Empa) went silent for 2.5 days with no fallback message or escalation. This was documented as regression REG-012. Build agent (Granville) continued working autonomously, but coordination was lost.

**Lesson:** Tool failures must never cascade into communication failures. Browser research should be non-blocking and time-boxed during sprints.

### Overnight Pipeline Miss (March 16)
Scheduled overnight tasks were written to human-readable markdown but not machine-actionable queue files. The automation loop ran correctly but had nothing to process.

**Lesson:** Intent documentation ≠ machine dispatch. Both must happen atomically.

## Agent Interaction Traces

### Credential Storage Flow
```
User → Dashboard: "Store my age (28)"
Dashboard → VeilVault.sol: storeCredential(AGE, keccak256(abi.encodePacked(28, salt)))
VeilVault → Event: CredentialStored(owner, AGE, commitment)
Guardian → Local: Encrypt and store {type: AGE, value: 28, salt: random}
```

### Query-Answer Flow
```
Querier → VeilVault.sol: submitQuery(owner, "Is age > 18?", 0.02 USDC)
VeilVault → Event: QuerySubmitted(queryId, querier, owner, fee)
Guardian → Detects event via watchContractEvent
Guardian → Local check: age=28, 28 > 18 → true
Guardian → VeilVault.sol: answerQuery(queryId, true, proof)
VeilVault → Transfers 0.02 USDC to owner (minus 2.5% platform fee)
VeilVault → Event: QueryAnswered(queryId, true)
```

### Revenue Withdrawal Flow
```
Owner → Dashboard: "Withdraw earnings"
Dashboard → VeilVault.sol: withdrawRevenue()
VeilVault → Transfers accumulated USDC to owner
VeilVault → Event: RevenueWithdrawn(owner, amount)
```

---

*This log is part of the Veil submission to The Synthesis Hackathon 2026. It documents the full human-agent collaboration process — including failures — because transparency is a CROPS value too.*
