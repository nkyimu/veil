# Veil Persona Mapping — Synthesis Hackathon

## Primary Personas (Direct Fit)

### 🎯 Amara — "The Person Who Just Wants AI to Handle Their Life"
**Why she's our hero persona:**
- Marketing manager in Lagos, non-technical
- Delegates everything to her AI agent — subscriptions, scheduling, finances
- **Core pain:** "I want convenience without creating a surveillance profile I didn't consent to"
- She doesn't audit what her agent shares. She CAN'T — that defeats the purpose of delegation.
- After a data breach, she has no idea which services have her data or what they know.

**Veil solves her problem:**
- Her Guardian agent stores her credentials locally, only commitments go on-chain
- Services query her agent ("Is Amara over 25?") and get YES/NO — never the raw data
- She earns USDC for every query. Her data works FOR her, not against her.
- She doesn't have to audit anything — the Guardian handles it autonomously.

**JTBD:** "When I delegate my daily tasks to an AI agent, I want it to handle everything without creating a surveillance profile of my life that I didn't consent to and can't control."

**HMW:** "How might we let Amara get full AI delegation without every service learning everything about her?"

---

### 🔬 Marcus — "The Researcher Accessing Sensitive Data"
**Secondary persona — stretches into academic/sensitive use:**
- PhD candidate researching authoritarian governance
- Every database query creates a trail linked to his identity
- Combined queries paint a complete picture of what he's studying

**Veil angle:**
- Marcus stores his academic credentials in Veil
- His Guardian answers institutional queries ("Is this person affiliated with an accredited university?") without revealing his specific research focus
- The on-chain commitment proves he has the credential; the query log doesn't reveal what he's researching

---

### 🏍️ Ravi — "The Gig Worker in an Emerging Economy"
**Tertiary persona — portable reputation:**
- Delivery driver in Hyderabad, works across 3 platforms
- Gets deactivated, loses all ratings, starts from zero
- "My reputation exists only inside platforms that can erase me"

**Veil angle:**
- Ravi stores his work history, ratings, and earnings as Veil credentials
- New platforms query his Guardian: "Does this worker have 4.5+ rating across 500+ deliveries?" → YES
- His reputation is sovereign — no platform can erase it

**JTBD:** "I want my reputation, work history, and earnings to belong to me and move with me."

---

## Theme Alignment → CROPS

| CROPS Value | Veil Implementation |
|-------------|-------------------|
| **Privacy** | ZK-style yes/no answers. Raw data never leaves the user. Guardian answers queries without revealing underlying values. |
| **Censorship Resistance** | On-chain credential commitments. No centralized identity provider can revoke your credentials or block queries. |
| **Open Source** | Entire stack is open source — VeilVault.sol, Guardian agent, frontend. |
| **Security** | Data stored locally + encrypted. Only cryptographic commitments go on-chain. Guardian validates queries against local data. |

## 60-Second User Journey (Amara)

1. **Amara connects wallet** → Veil dashboard loads
2. **Stores credentials** → Age (28), Credit Range (700-750), Location (Lagos) — hashed & committed on-chain
3. **Guardian activates** → Watches for incoming queries, ready to answer
4. **Lending protocol queries** → "Is credit score > 650?" → Guardian checks local data → answers YES on-chain → collects 0.02 USDC
5. **Amara checks earnings** → Sees 12 queries answered, $0.24 earned → withdraws to wallet
6. **Her actual data?** → Never left her device. The lending protocol got what it needed. Nothing more.

## Design Coach Checklist (from coach SKILL.md)

- [x] Named human at the center (Amara, Marcus, Ravi)
- [x] Problem that exists TODAY (KYC overexposure, data breaches, platform lock-in)
- [x] Clear reason Ethereum matters (censorship-resistant credential storage, no centralized identity provider)
- [x] User journey in 60 seconds (see above)
- [x] CROPS as structural decisions (Privacy = ZK answers, CR = on-chain storage, Security = local data)
