# Veil — PM Review (CROPs Design Thinking Framework)
**Reviewed by:** TARS, PM Agent — Dot Dash Engineering  
**Date:** 2026-03-18  
**Hackathon:** The Synthesis — "Agents that Keep Secrets" track  
**Framework:** CROPs (Censorship Resistance, Open Source, Privacy, Security) × JTBD  

---

## Executive Summary

Veil is a genuinely novel project with a compelling core thesis: flip the data monetization model so users — not platforms — capture value from their own credentials. The concept is strong. The execution at D2 is further along than most hackathon projects at this stage: deployed contract, 34 tests passing, 3-screen frontend, working agent scaffold.

**The core risk isn't the concept — it's the gap between the narrative and the implementation.** Several integrations that define Veil's prize eligibility (ZK proofs, ERC-8004, Venice AI, Locus API) exist in the README but not yet in the code. Judges will look at guardian.ts and find `const proof = "0x"`. That single line costs credibility across every prize track.

This review maps the gaps and prioritizes the actions with highest prize leverage.

---

## 1. JTBD Map

### Primary Job-to-be-Done

> **"When I'm forced to hand over personal data just to prove eligibility for a service, I want my agent to selectively disclose verified YES/NO answers without exposing the underlying data, so I can access services on my terms while retaining sovereignty over my own information."**

This is the core job. Everything else is secondary.

### Secondary JTBDs

| # | When... | I want to... | So I can... | Maps to Feature |
|---|---------|-------------|-------------|-----------------|
| S1 | A service repeatedly queries my credentials | Let my agent respond autonomously, 24/7 | Earn passive income without manual effort | Guardian agent + monitorQueries() |
| S2 | I have valuable personal data | Set my own price per query | Capture fair value from my own information | Custom query fees |
| S3 | A service asks a question about me | Have a cryptographic audit trail | Prove what was asked and answered, with no data leakage | Query event logs + ZK proofs |
| S4 | I want to revoke access | Deactivate a credential instantly | Stop queries without losing my other data | active flag on Credential struct |
| S5 | A query goes unanswered | Get the payment refunded automatically | Not lose money from unresponsive agents | queryExpiry + refund logic |
| S6 | I'm a service that needs to verify user claims | Pay a small fee and get a trustless YES/NO | Run compliance checks without storing PII | requester flow in VeilVault.sol |

### Jobs Veil Currently MISSES

- **"When I want to audit who has queried my data and why"** — No query intent metadata; `queryHash` is opaque to the user
- **"When I want to share credentials selectively across multiple contexts"** — Single vault, single credential type per user (no multi-profile support)
- **"When I want to delegate my agent's answering authority temporarily"** — No time-bound delegation system

---

## 2. Persona Coverage Matrix

CROPs framework defines 10 canonical personas. Here's where Veil lands.

| Persona | Profile | Fit | Reasoning |
|---------|---------|-----|-----------|
| **Priya** | Tech-savvy privacy advocate, developer | 🟢 Strong | Core user. Understands ZK proofs, values data sovereignty, comfortable with Web3. Veil was built for Priya. |
| **Marcus** | Data rights activist, non-technical | 🟡 Partial | Wants the outcome but the UX still requires wallet setup + Base Sepolia. Onboarding friction loses Marcus unless gasless UX is added. |
| **Daniela** | DeFi native, yield-maximizer | 🟢 Strong | Sees credential monetization as a new yield source. Earnings dashboard speaks her language directly. |
| **Kai** | Developer building on Web3 infra | 🟡 Partial | More likely to integrate Veil as a query service (the requester side) than be a data owner. SDK/API docs needed. |
| **Amara** | Journalist/activist in high-risk environment | 🔴 Weak | Her threat model requires identity protection from state actors. ZK proofs on Base don't cover traffic analysis or account correlation. Risk of false promise. |
| **Tomasz** | SMB owner needing KYC/compliance | 🟡 Partial | Good fit as a *requester* — pays for verified YES/NO answers without storing user PII. Poor fit as data owner (no business credential use case). |
| **Lena** | Healthcare worker, sensitive data handler | 🔴 Weak | Healthcare credentials (HIPAA territory) require far more than keccak256 commitments. Don't position Veil here at hackathon stage. |
| **Ravi** | Gig economy worker, income verification | 🟡 Partial | Income credential type exists. But gig worker income verification requires dynamic data (changes monthly). Static commitments break down. |
| **Sofia** | Academic researcher, open data | ⬜ Not Addressed | Data sharing rather than data protection. Inverse use case. |
| **Jin** | Enterprise compliance officer | ⬜ Not Addressed | Enterprise needs audit trails, SLAs, and compliance documentation. MVP not positioned here. |

### Personas Veil Should Serve But Doesn't Yet

**The Service/Requester Persona** — Veil's pitch is entirely from the data owner's perspective. But the *requester* (the business paying $0.02 per query) is an equally important user. Their JTBD: "I need to verify a user claim for KYC/compliance without storing their raw data." This persona has no voice in the current docs, frontend, or demo flow. Adding a "for services" section strengthens the two-sided market narrative and the Open Track pitch.

---

## 3. Prize Track Readiness

### 🏆 Venice Privacy — $11,500 | "Private Agents, Trusted Actions"

**Current Fit: 4/5**

| What Venice Wants | Veil's Status | Gap |
|-------------------|--------------|-----|
| Privacy-preserving agent execution | ✅ Conceptually present | ⚠️ Agent runs locally; Venice AI inference not called |
| Agent that acts on user's behalf without exposing data | ✅ guardian.ts architecture | ⚠️ No Venice API call in current code |
| Trusted, verifiable actions | ✅ On-chain event trail | ⚠️ Proofs are `0x` (empty) |

**What's missing:** The Guardian agent's decision logic must explicitly route through Venice AI. Currently, the agent evaluates queries with `const answer = !!storedCred` — a local boolean check. The judge will ask: "Where does Venice AI come in?" There's no good answer right now.

**Actions needed:**
1. Replace the local evaluation logic in `answerQuery()` with a Venice API call: send the query hash + credential type to Venice, receive a privacy-preserving inference result
2. Use Venice for the pricing logic: "Given query history, should I adjust my fee?"
3. Add `POWERED BY VENICE AI` attribution to the Guardian status UI component

**Confidence if fixed:** High. This is the best prize fit in the portfolio.

---

### 🏆 ERC-8004 — $8,000 | "Agents With Receipts"

**Current Fit: 3/5**

| What ERC-8004 Wants | Veil's Status | Gap |
|---------------------|--------------|-----|
| Agent with on-chain identity | ⚠️ "Planned" | 🔴 Not implemented |
| Verifiable receipts for every action | ✅ QueryAnswered events logged | ⚠️ Not framed as ERC-8004 receipts |
| Agent acting with user authorization | ✅ `userAgents` mapping in contract | ⚠️ No ERC-8004 registration flow |

**What's missing:** "Planned" is not a $8K answer. The `userAgents` mapping exists in VeilVault.sol — that's the right data structure. But there's no ERC-8004 contract call, no agent registration transaction, and no ERC-8004 interface implemented.

**Actions needed:**
1. Implement ERC-8004 interface on VeilVault or a wrapper contract
2. Add agent registration transaction to the onboarding flow (Store → Register Agent → Start Earning)
3. Frame each `QueryAnswered` event explicitly as an ERC-8004 receipt in the frontend and documentation
4. Add `agent.erc8004.register()` call in guardian.ts startup

**Confidence if fixed:** Medium-High. ERC-8004 is niche enough that a working implementation wins.

---

### 🏆 Open Track — $14,500

**Current Fit: 4/5**

This is the highest-value prize and Veil's strongest overall fit. The narrative is genuinely novel, the implementation is real, and the "agents that keep secrets" framing is precise.

| Criterion | Status |
|-----------|--------|
| Novel problem | ✅ Data sovereignty + micropayments is underexplored |
| Working demo | ✅ Three screens, deployed contract, agent scaffold |
| Clear user journey | ✅ 3-minute demo documented |
| Differentiation | ⚠️ Needs sharper "unlike X, Veil does Y" framing |
| Technical depth | ⚠️ Empty ZK proofs undercut credibility |

**Actions needed:**
1. Write the explicit competitive differentiation statement (see Section 5)
2. Get at least one Self Protocol proof working end-to-end — even for a single credential type
3. Make the demo work flawlessly with real USDC on Base Sepolia (not mock data)

**Confidence:** High. This is the fallback win if other tracks have gaps.

---

### 🏆 Locus — $3,000 | "Best Use of Locus"

**Current Fit: 3/5**

| What Locus Wants | Veil's Status | Gap |
|-----------------|--------------|-----|
| Locus wallet integrated | ✅ "Locus wallet deployed" in brief | ⚠️ Code shows raw viem USDC transfers |
| Micropayments as core mechanic | ✅ $0.02/query is perfect use case | |
| Novel payment flow | ✅ Pay-to-query is genuinely new | |

**What's missing:** The guardian.ts uses `walletClient.writeContract()` directly with USDC. Where's the Locus API call? If Locus is just a wallet address and not the actual payment routing layer, that's not "best use of Locus."

**Actions needed:**
1. Route query payments through Locus API explicitly (not just raw USDC `transfer`)
2. Add Locus attribution to the Earnings Dashboard: "Payments via Locus"
3. Document Locus integration in README with explicit API call examples

**Confidence if fixed:** High. This is a clear, specific use case Locus would want to showcase.

---

### 🏆 Self Protocol — $1,000

**Current Fit: 2/5**

The README lists Self Protocol in the stack. The agent code has `const proof = "0x"`.

These two facts cannot coexist in a submission.

**Actions needed:**
1. Integrate Self Protocol SDK for at least one credential type (Age is the simplest)
2. Replace `"0x"` with an actual Self Protocol proof generation call
3. Add verification call to VeilVault.sol (currently contract accepts any proof bytes)

**Minimum viable Self Protocol integration for a $1K prize:** One credential type, one real proof, one on-chain verification. That's achievable in a focused session.

**Confidence if fixed:** Medium. Depends on how easy Self Protocol SDK integration is.

---

### 🏆 Status Gasless — $50

**Current Fit: 1/5**

No gasless transaction flow exists. Given the $50 prize, this is the lowest ROI fix.

**Recommendation:** Skip unless time permits after all other tracks are addressed. If you have 2 hours left and everything else is done, add EIP-2771 meta-transactions for the `storeCredential` flow. Otherwise, deprioritize completely.

---

## 4. 60-Second Pitch Draft

*Timing: ~150 words at 2.5 words/second = 60 seconds. Read at measured pace.*

---

> "Every app you've ever signed up for is monetizing your data right now. You agreed to Terms of Service you didn't read, and they sell your profile to advertisers. You get nothing.
>
> Veil flips the model.
>
> You store your credentials — age, credit range, location — as encrypted commitments on Base. Not the actual data. The math of it.
>
> A service asks: 'Is this user over 18?' Your AI guardian agent answers: YES. With a zero-knowledge proof. The service pays $0.02 USDC. Your actual birthday? Never touched. Never shared.
>
> Watch: [DEMO — store credential, receive query, agent answers, payment collected]
>
> This is live on Base Sepolia. 34 tests passing. Your data. Your agent. Your revenue.
>
> Veil — sovereign data monetization. Privacy-preserving, agent-executed, on-chain verified."

---

*Alternative opener for Venice Privacy track:*
> "Venice AI's privacy guarantees extend all the way to the inference layer. Veil extends them to the data layer — your agent reasons about your credentials without ever exposing them, even to the model."

---

## 5. Submission Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| **Contract deployed** | 🟢 Green | Base Sepolia `0x2f881af...` verified |
| **Tests passing** | 🟢 Green | 34 Foundry tests |
| **Frontend functional** | 🟢 Green | 3 screens, wired to contract |
| **60-second demo flow** | 🟢 Green | Documented in QUICK-START |
| **README quality** | 🟡 Yellow | Good coverage, missing data-flow diagram, missing requester perspective |
| **Agent autonomy** | 🟡 Yellow | `monitorQueries()` exists, but evaluation logic is trivial (`!!storedCred`) |
| **Human-agent collaboration log** | 🟡 Yellow | Only 1 entry (Day 0). Thin evidence. D1/D2 logs missing. |
| **ERC-8004 integration** | 🔴 Red | Listed in stack, not implemented in code |
| **ZK proofs (Self Protocol)** | 🔴 Red | `const proof = "0x"` in answerQuery() |
| **Venice AI integration** | 🔴 Red | Not in guardian.ts; local boolean check only |
| **Locus API integration** | 🟡 Yellow | Locus wallet deployed but payment flow unclear |
| **Gasless transactions** | 🔴 Red | Not addressed |
| **Competitive positioning doc** | 🔴 Red | No explicit "unlike X, Veil does Y" statement anywhere |

**Overall submission readiness: 🟡 Yellow-Green**  
Strong foundation. Three red items are genuinely prize-critical; fixing them moves submission to strong Green.

---

## 6. Competitive Positioning

### Current Problem

There's no explicit differentiation statement anywhere in the docs. Judges will ask: "How is this different from Civic, Veramo, Reclaim, or uPort?" Without a prepared answer, the team looks like they haven't done their homework.

### Competitive Landscape

| Solution | Approach | Weakness |
|---------|---------|---------|
| **Civic** | Identity attestation | Centralized oracle, no monetization layer |
| **Veramo** | DID/VC framework | Developer library, no agent automation, no payment layer |
| **Reclaim Protocol** | ZK proofs from web2 data | Proof generation only, no autonomous agent, no marketplace |
| **uPort** | Self-sovereign identity | Deprecated, no active development |
| **Data brokers (Acxiom, etc.)** | Current workaround — sell your data for you | You still don't control it, they take most revenue |

### Recommended Positioning Statement

> *"Unlike Civic and Reclaim, which give you identity attestations you can show others, Veil gives you an autonomous agent that answers questions about you, collects payment, and reports back — without you ever being in the loop. The data stays encrypted. The agent handles everything. The money goes directly to your wallet."*

### The CROPS Differentiator

> *"Unlike existing credential solutions that require you to actively present your credentials to each service, Veil's guardian agent operates as a persistent, autonomous data market — charging for access, enforcing your pricing, and generating on-chain receipts for every query, all while keeping your actual data off-chain and encrypted."*

### Ethereum Infrastructure Advantage

The choice of Base (L2) + USDC micropayments is defensible:
- Sub-cent transaction fees make $0.02/query economically viable (impossible on mainnet)
- USDC stability prevents crypto volatility from distorting query pricing
- Base's ERC-8004 ecosystem proximity is a genuine advantage for agent identity

**What makes it defensible to judges:** The combination of ZK proofs (cryptographic privacy) + on-chain payment escrow (trustless incentive alignment) + ERC-8004 agent identity (autonomous execution) is novel as a system. No competitor has all three.

---

## 7. Top 5 PM Recommendations

Ordered by prize leverage × implementation effort.

---

### #1 — Close the ZK Proof Gap (Self Protocol)
**Impact:** High | **Effort:** Medium | **Prize leverage:** Self ($1K) + credibility for Venice ($11.5K) + Open Track ($14.5K)

`const proof = "0x"` is the single most damaging line in the codebase. It signals "this is a mockup, not a working system." Integrate Self Protocol SDK for at minimum the Age credential type. Show one real proof being generated and verified on-chain. This transforms the submission from "compelling concept" to "working system."

**Target:** One credential type, real proof, on-chain verification. Don't try to do all five credential types — perfect one.

---

### #2 — Add Venice AI to Guardian Decision Logic
**Impact:** High | **Effort:** Medium | **Prize leverage:** Venice Privacy ($11.5K)

$11.5K is the largest single prize target. The current agent does `const answer = !!storedCred` — a boolean check a middle schooler could write. Replace this with a Venice AI inference call: given the credential type and query, Venice provides a privacy-preserving evaluation. Even a simple integration (send query type → Venice → receive YES/NO recommendation → answer on-chain) qualifies. Document it clearly.

**Target:** Venice API call in answerQuery(), attribution in UI, one sentence in README explaining what Venice does in the stack.

---

### #3 — Implement ERC-8004 Agent Registration
**Impact:** High | **Effort:** Medium | **Prize leverage:** ERC-8004 ($8K) + ERC-8004 framing strengthens all other tracks

The contract already has `mapping(address => address) public userAgents` — the data structure is right. The missing piece is the ERC-8004 interface implementation and the registration transaction. Add `registerAgent()` to the onboarding flow. Add ERC-8004 receipt framing to each QueryAnswered event. This is the difference between "planned" and "shipped."

**Target:** Agent registration tx in guardian.ts startup, ERC-8004 interface in VeilVault.sol, one "receipt" shown in the frontend per answered query.

---

### #4 — Document D1 and D2 in ConversationLog
**Impact:** Medium | **Effort:** Low | **Prize leverage:** Human-agent collaboration narrative across all tracks

The conversationLog has exactly one entry: Day 0 setup. Judges evaluating "Agents that Keep Secrets" will want to see evidence of meaningful human-agent collaboration — not just code. Write D1 and D2 entries today documenting: what architectural decisions the agent proposed, what the human accepted or rejected, what the agent learned. This takes 30 minutes and costs nothing except the time to write it.

**Target:** 2-3 conversation log entries showing genuine decision-making collaboration.

---

### #5 — Write the Explicit Competitive Positioning Statement
**Impact:** Medium | **Effort:** Low | **Prize leverage:** Open Track ($14.5K) + narrative credibility

Add one section to the README: "How is Veil different?" with the positioning statement from Section 6 above. Judges will ask this question; give them the answer before they have to ask. Include a simple 4-row comparison table (Veil vs. Civic vs. Reclaim vs. "current workaround"). This signals competitive awareness and market understanding.

**Target:** 200-word "Why Veil" section in README, comparison table, CROPS differentiator statement.

---

## Risk Assessment

### Technical Risks

| Risk | Severity | Mitigation |
|------|---------|-----------|
| ZK proofs ship as `0x` | 🔴 Critical | Self Protocol integration — highest priority |
| ERC-8004 stays "planned" | 🔴 High | Implement registration flow this session |
| Venice AI not integrated | 🔴 High | Add Venice API call to guardian decision logic |
| Locus payment routing unclear | 🟡 Medium | Confirm Locus API is in the critical payment path |
| Agent crashes on missing GUARDIAN_ADDRESS | 🟡 Medium | Add env validation at startup, not mid-flow |
| Frontend demo breaks with real wallet | 🟡 Medium | Test full flow with MetaMask + Base Sepolia before submission |

### Narrative Risks

| Risk | Severity | Mitigation |
|------|---------|-----------|
| "How is this different from Civic?" | 🔴 High | Write competitive positioning (Rec #5) |
| "The ZK proofs aren't real" | 🔴 High | Fix proofs (Rec #1) |
| "The agent just does a boolean check" | 🟡 Medium | Venice AI integration (Rec #2) |
| "The collaboration log is empty" | 🟡 Medium | Write D1/D2 entries (Rec #4) |
| "You say Base Mainnet in README but it's Sepolia" | 🟡 Medium | Fix README — says "Base Mainnet" in contract table, address is Sepolia |

### README Inconsistency — Action Required

The README says:
```
| Contract | Address | Chain |
|----------|---------|-------|
| VeilVault | `TBD` | Base Mainnet |
```

But the contract is deployed on **Base Sepolia** at `0x2f881af96415a452807baf6a23b73129d57f8d7a`. Update the README table before submission. Judges will check.

---

## Final Verdict

Veil is a strong hackathon project with a genuinely novel concept and real code behind it. The gap between the narrative ("ZK proofs, Venice AI, ERC-8004, Self Protocol") and the implementation ("0x proofs, boolean checks, no ERC-8004 calls") is real but closeable. The team has the right instincts — they just need to execute on the integrations they've already designed.

**Prize potential if recommendations are implemented:**
- Venice Privacy: High (strongest fit)
- Open Track: High (strongest narrative)
- ERC-8004: Medium-High (needs implementation)
- Locus: Medium (needs explicit API integration)
- Self Protocol: Medium (needs one real proof)

**Total addressable prize:** $37,050 across 5 tracks. Realistic expectation with all recommendations implemented: $14.5K–$23K (Open Track + Venice + one secondary track).

The work is real. Close the gaps.

---

*— TARS, PM Agent | Dot Dash Engineering | 2026-03-18*
