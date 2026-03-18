# Veil — CROPs Design Thinking Review
> Design Director: Emory / AMANTU Cognitive Assemblage  
> Date: March 18, 2026  
> Track: "Agents that Keep Secrets" — The Synthesis Hackathon  
> Framework: CROPs Design Thinking (Empathize → Define → Ideate → Prototype → Test)

---

## 1. CROPS Design Thinking Scorecard

| Phase | Score | Verdict |
|-------|-------|---------|
| **Empathize** | 3/5 | Pain understood, but persona is implied not named |
| **Define** | 4/5 | Problem statement is sharp — insight is genuinely non-obvious |
| **Ideate** | 4/5 | Strong filter score; solution choice earns the Ethereum infrastructure |
| **Prototype** | 3/5 | Scope is right, but the CROPS moment is buried in abstraction |
| **Test** | 3/5 | Pitch-ready on paper; demo gap is a real risk to judge confidence |

**Total: 17/25** — A strong concept with an execution gap in the final mile. The idea would win a pitch competition; the demo needs to close the deal.

---

## 2. Persona Gap Analysis

### CROPs Persona Mapping

**WELL SERVED (strong signal):**

| Persona | Why Veil fits | Signal in the build |
|---------|--------------|-------------------|
| **Priya the Freelancer** ⭐ | Priya's primary pain: she needs to verify her credit range or location to clients without sharing a full credit report. Veil's "Is credit above 700?" YES/NO model is a direct solve. She earns on every verification instead of giving it away. | Income + CreditRange credential types exist in VeilVault.sol |
| **Jin the Creator** ⭐ | Jin needs age verification for brand partnerships, platform monetization, and gated content access. Veil enables her to prove "18+" to any service without storing her birthdate anywhere. | Age credential is the first type, the demo query is age-based |
| **Marcus the Researcher** | Marcus handles sensitive subject data. Veil's credential commitment model (hash only on-chain) maps to research anonymization workflows. His use case is less about earning, more about control. | Not explicit in the build, but the architecture supports it |

**PARTIAL FIT (needs a nudge):**

| Persona | Gap | Fix |
|---------|-----|-----|
| **Tomasz the Activist** | Tomasz fears surveillance. Veil is anti-surveillance by design, but the UI doesn't speak to threat models — it speaks to revenue. He needs reassurance, not a price card. | Add one line in the UI: "Your data never touches our servers." |
| **Amara the Delegator** | Amara wants her agent to handle administrative data (insurance, identity, employment). Veil's agent model is perfect — but the onboarding assumes technical literacy. | The "Store Credential" UI needs a non-technical copy pass |
| **Sofia the Parent** | Sofia manages child safety data. Parental consent verifications are a high-value query type. Not in the credential schema at all. | Out of scope for hackathon — flag as post-MVP |

**MISSED OPPORTUNITY:**

The build is implicitly designed for the **data seller** (the person who stores credentials and earns). But there's an entire **data buyer** persona missing from the design — the service that submits queries. Right now, `submitQuery` exists in the contract, but there's no UI or flow for the buyer side. This isn't a flaw for D2, but it means the demo can only show half the loop unless the query side is simulated.

**Primary Persona Recommendation:**  
**Name her "Priya."** She's a 29-year-old UX designer who freelances for fintech companies. They ask for her credit score, her location, her income — she gives them everything, gets nothing. With Veil, she sets her fee, her agent answers YES/NO, and she earns $0.02 per verification. The demo should open on her story, not on a blank wallet connection prompt.

---

## 3. Problem Statement Assessment

### Current (inferred from README):
> "Your personal data is scattered across hundreds of services. They monetize it. You get nothing."

This is accurate but reads as a political manifesto, not a design problem statement. It's true for everyone, which means it's specific to no one.

### Refined "[Person] needs..." Statement:

> **"Priya the Freelancer needs a way to answer 'Is your credit score above 700?' without sharing her actual score — because every time she sends a full credit report, she loses control of her data permanently and earns nothing from the transaction."**

The non-obvious insight isn't "data is valuable" (everyone knows this). The insight is: **verification requests are binary questions that don't require raw data — but the entire industry acts like they do.** Veil exploits that gap.

### How Might We Question:

> "How might we let people monetize verified claims about themselves without ever exposing the underlying data?"

This is clean and judge-ready. It distinguishes Veil from "data marketplace" projects (which sell raw data) and from "privacy coins" (which are about transactions). The YES/NO-with-proof framing is the design insight.

---

## 4. CROPS Filter Results

### C — Censorship Resistance

**Score: 3/5**

The contract is deployed on Base (Ethereum L2). Queries are on-chain. No central server can block a query from being submitted or answered. The commitment store is permissionless.

**Gap:** The guardian agent (`guardian.ts`) runs as a local process. If the user's machine is offline, queries expire unanswered. This is a liveness risk, not a censorship risk — but a judge who conflates the two might ding it. 

**Mitigation:** The "query auto-refunds after expiry" design is actually the right censorship-resistance answer. Services can't permanently block access to your data by submitting and never paying — the escrow model protects data owners.

---

### R — Open Source

**Score: 5/5**

Repo is public (`nkyimu/veil`). MIT license. Foundry tests are shipping (34 passing). The guardian agent is readable TypeScript. The contract is clean, well-commented Solidity.

No notes — this is the cleanest score in the review.

---

### O — Open Protocol / Open Standards

**Score: 4/5**

ERC-8004 for agent identity is the right call — it's an emerging open standard that positions Veil ahead of the "AI wallet" curve. Self Protocol for ZK credential verification is open. USDC on Base is standard.

**Gap:** The query hash scheme (`keccak256(type, value, salt)`) is custom and undocumented. If another service wants to interoperate — submit a query against a Veil credential — they need to know the hash construction. This is an interoperability gap that matters for the protocol vision.

**Fix:** Document the query hash schema in the README. One paragraph. This is a 10-minute task that signals "protocol thinking" to judges.

---

### P — Privacy

**Score: 4/5**

This is Veil's core proposition and the design is solid:
- Raw data never leaves the client
- Only `keccak256(credType, value, salt)` is on-chain — genuinely private
- Agent answers YES/NO + ZK proof — no raw data in the response
- Salt prevents rainbow table attacks on common values

**Gap (significant):** The ZK proof is currently a TODO. The contract has:
```solidity
// TODO: Verify ZK proof via Self Protocol verifier
// For MVP, we trust the data owner / agent to answer honestly
```

For the Venice Privacy prize ($11.5K), this is the gap that loses the prize. A judge who reads the contract will find this comment. The privacy claim is architecturally correct but not cryptographically enforced in the demo.

**Mitigation options (prioritized):**
1. Ship a stub Self Protocol verifier that at least demonstrates the verification flow, even if it accepts any proof in testnet mode
2. In the pitch, frame this explicitly: "The ZK verification is wired for Self Protocol — here's the architecture, here's what the production verifier checks"
3. If neither is achievable, the verbal pitch must address it proactively ("Our testnet runs in trust-the-agent mode; the production deployment connects to Self Protocol's on-chain verifier")

---

### S — Security

**Score: 4/5**

The contract shows solid defensive patterns:
- `ReentrancyGuard` on all state-changing functions
- `SafeERC20` for payment token transfers
- Platform fee capped at 10% (`require(bps <= 1000, "Max 10%")`)
- Query expiry prevents infinite escrow
- Agent authorization check: `msg.sender == q.dataOwner || msg.sender == userAgents[q.dataOwner]`

**Gap:** The `storeCredential` function accepts any commitment bytes32 without verifying that the caller generated it correctly. A service could spam credential commitments for an address they don't control (they'd need the private key to answer queries about it, but the spam creates noise). This is a minor attack surface, not a showstopper.

**Gap (UX security):** The frontend stores credential values in component state (`content` textarea) before hashing. A browser extension with clipboard access could intercept this. Not hackathon-critical, but worth a comment in the README.

---

## 5. Hackathon Readiness

### Prize-by-Prize Analysis

**Venice Privacy ($11.5K) — Target likelihood: 65%**

The architecture is genuinely privacy-preserving. The ZK proof TODO is the primary risk. Before submission:
- [ ] Add a one-sentence README acknowledgment of the ZK gap and the production plan
- [ ] Wire at least a mock Self Protocol call so the guardian logs "ZK proof verified" even if the verifier is a stub
- [ ] In the demo, show the commitment hash on-chain via BaseScan — this is the visual proof that raw data isn't stored

**ERC-8004 ($8K) — Target likelihood: 75%**

Locus wallet is deployed. ERC-8004 integration is "planned." For this prize:
- [ ] `registerAgent` is in the contract — show it being called in the demo
- [ ] The guardian agent should self-identify via ERC-8004 in at least one logged action
- [ ] This is the cleanest prize path — the architecture is correct, it just needs to be made visible

**Open Track ($14.5K) — Target likelihood: 50%**

This is the hardest prize because the competition is widest. Veil needs a clear "why now" and "why crypto" answer that goes beyond "data monetization":
- The "why crypto" answer is: no custody, no middleman, automatic micropayments, cryptographic verifiability
- The "why now" answer is: AI agents are proliferating — services will soon be querying AI agents about users, not users directly. Veil positions data owners ahead of that curve.
- [ ] Add a one-paragraph "Why Ethereum" section to the README that makes this argument

**Locus ($3K) — Target likelihood: 80%**

Micropayments are the core mechanic. Locus is already in the stack. This is the easiest win:
- [ ] Show a real (testnet) payment flowing from service → contract → data owner in the demo
- [ ] The earnings dashboard is the right visual for this prize — lead with it

### The 60-Second User Journey (Does it exist?)

Currently: No. The frontend has three screens (Store Credential, Browse & Query, Earnings) but no onboarding flow that walks a new user through the core loop.

**What the 60-second journey should be:**
1. (0-10s) "Hi, I'm Priya. I get asked for my credit score constantly."
2. (10-20s) Connect wallet → Store CreditRange credential → see hash on-chain
3. (20-35s) Service submits query "Is credit > 700?" with $0.02 USDC
4. (35-50s) Guardian auto-answers YES → payment collected
5. (50-60s) Earnings dashboard shows $0.02 earned. "She earned instead of giving it away."

This journey can be demonstrated with testnet funds and a simple script to simulate the "service" side. Build the script before demo day.

### Critical Pre-Submission Tasks (Prioritized)

| Priority | Task | Time Estimate | Prize Impact |
|---------|------|--------------|-------------|
| 🔴 P0 | Build the 60-second demo script (simulate service query) | 2-3h | All |
| 🔴 P0 | Add BaseScan link to committed credential in UI | 30m | Venice |
| 🟡 P1 | Wire mock Self Protocol verification in guardian.ts | 2h | Venice |
| 🟡 P1 | Document query hash schema in README | 20m | Open Track |
| 🟡 P1 | Add "Why Ethereum" paragraph to README | 30m | Open Track |
| 🟢 P2 | Name the primary persona in the README and pitch | 15m | All (story) |
| 🟢 P2 | Show ERC-8004 `registerAgent` call in demo | 1h | ERC-8004 |
| 🟢 P3 | Pass the CROPS stress test verbally in pitch | prep | Venice |

---

## 6. Top 3 Design Recommendations

### Recommendation 1: Name Priya and Lead with Her Story

**The gap:** The current README opens with "Your personal data is scattered..." — a systemic problem statement. Judges hear this at every privacy-focused hackathon. It's true, but it's not sticky.

**The fix:** The first 10 seconds of any Veil interaction — README, pitch, demo — should be Priya's story. Not "users have a data problem." A specific person, a specific moment.

```
"Priya just landed a contract. The client asks: 'Can you verify your credit score is above 700?' 
She's sent this report to 47 clients. She's earned $0 from any of it. This time is different."
```

This costs zero engineering time. It costs 30 minutes of writing. The payoff is that every judge who has ever had to share financial data for a background check will feel this immediately.

**Where to apply it:**
- README hero paragraph (replace "Your personal data is scattered")
- Demo script opening line
- Pitch deck slide 1

---

### Recommendation 2: Make the Commitment Hash the Hero of the Privacy Claim

**The gap:** The privacy story is "your data stays private" — which is a claim. The proof is the commitment hash on-chain. But the UI currently shows the hash as a small, grayed-out `text-xs` snippet after the "✓ Stored" label. It's treated as a technical footnote.

**The fix:** Make the commitment hash the centerpiece of the "Store" success state. Full hash, clearly labeled, with a link to BaseScan.

```
CREDENTIAL STORED ✓

0x7d2e8f3a... [full hash]

This hash — and nothing else — is public.
Your actual value is mathematically unrecoverable from it.

[View on BaseScan →]
```

This transforms an abstract privacy claim into a concrete, verifiable proof. A judge can click BaseScan, see the hash, and confirm there's no "age: 29" anywhere on-chain. That's the CROPS moment for Privacy — the exact step where the Ethereum advantage is visible.

**Implementation:** Modify the success state in `src/app/page.tsx` to show the full commitment hash and add a BaseScan link. ~30 minutes.

---

### Recommendation 3: Build the Service-Side Demo Script (The Missing Half of the Loop)

**The gap:** The demo can currently show: connect wallet → store credential → see earnings. What it cannot show live: a service submitting a query and payment flowing. Without this, the core value proposition — **services pay you** — is asserted but not demonstrated.

**The fix:** A simple TypeScript script (call it `scripts/simulate-query.ts`) that:
1. Uses a second test wallet as the "service"
2. Calls `submitQuery()` with testnet USDC
3. Guardian auto-detects and answers (this already works in `guardian.ts`)
4. Earnings dashboard updates in real-time

This is the single highest-leverage engineering task remaining. The pitch without this is a slideshow about a protocol. The pitch with this is a product demo.

**Run it in a second terminal during the live demo:**
```bash
# Terminal 1: Guardian running
npx ts-node agent/guardian.ts

# Terminal 2: Simulate a service query
npx ts-node scripts/simulate-query.ts --owner 0x[priya] --type age --amount 0.02
```

The judge watches the earnings dashboard tick up. That's the close.

---

## Final Assessment

Veil is conceptually strong. The privacy architecture is correct. The contract is clean. The agent pattern is genuinely novel for a hackathon — most "data privacy" projects skip the autonomous agent piece entirely.

The risks are all in the last mile: the ZK proof TODO, the missing service-side demo, and the absent named persona. None of these require rebuilding anything. They require 4-6 hours of focused finishing work.

**The pitch in one sentence:**  
"Priya stores a hash of her credit score. A service pays $0.02 to ask 'Is it above 700?'. Her agent answers YES. Her score stays private. She earns. The transaction is on Base. The proof is on-chain. The data is nowhere."

That sentence is judge-ready. The build just needs to demonstrate it visually.

---

*Reviewed by Emory, Design Director — AMANTU Cognitive Assemblage*  
*CROPs Framework: cropsdesign.com*
