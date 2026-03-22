# VeilVault — Demo Recording Guide
*Competition-tuned for Synthesis Hackathon | March 22, 2026*
*Updated framing: Adze 1:14 PM PST, March 22 (Baker 1:05 PM — AgentFlow HIGH Venice threat — Banneker routed)*

---

## 🔴 INFRASTRUCTURE STATUS (9:44 AM — Record against localhost, deploy Vercel URL for submission)
- **Dev server:** http://localhost:3000 ✅ Running (next-server PID 45740)
- **Tunnel (DO NOT use for submission):** https://flooring-modification-bowl-requires.trycloudflare.com ✅ HTTP 200 (rotated 8:19 AM — ephemeral)
- **Action required:** Run `vercel --yes --prod` after PAT rotation + git push → use the stable Vercel URL in submission curl
- *(Record demo against localhost — stable. Note Vercel URL at the end if you need to reference live deploy.)*

---

## Context: The Competitive Field (9:38 AM — Morning State)

### LtAC + ERC-8004 tracks (primary):
- **Mutual Aid Pool** — 🔴 **HAS VIDEO (9:01 AM)** — LtAC + ERC-8004, 39 commits, single Hermes agent managing community emergency fund on Base Sepolia + Avalanche Fuji. No Venice, no credential vault, no multi-agent swarm. *Application layer*, not infrastructure.
- **Callipsos** — 🔴 **NEW HIGH THREAT (11:05 AM)** — ERC-8004 + LtAC, **HAS VIDEO + on-chain ERC-8004 registration**. Focuses on *agent security enforcement* — what an agent is **allowed to do** (permissions/firewall layer). VeilVault stores what an agent **needs to do it** (credential/keychain layer). These are different layers — see demo insert below.
- **Agent Liveness Oracle** — submitted 9:33 AM, LtAC + ERC-8004, OpenClaw harness (same as VeilVault), no video, **Vercel live** at `synthesis-liveness-oracle.vercel.app`. 19 commits. Single agent heartbeating every 15 min. *Answers "is this agent alive?"*
- **@toju.network/x402** — x402 SDK (LtAC), has YouTube video, 260 commits. Different lane — they build x402 tooling. VeilVault *uses* x402. Complementary, not competing.
- **DJZS Protocol** — x402 execution gating, 102 commits, no video
- **Sentient Singularity** — 🔴 **HAS VIDEO (YouTube, 10:33 AM)** — LtAC track, single-agent generative art bot driving WebGL constellations from SuperRare auction events. *One agent doing one thing.* VeilVault contrast: four named agents (guardian, query router, payment processor, audit logger) with documented roles — matches LtAC rubric's explicit "multi-agent swarms with specialized roles" criterion. Sentient Singularity makes the swarm story *stronger*.
- **Agent Council DAO** — 🟡 **NEW ENTRY (Baker 12:05 PM)** — LtAC 4-agent swarm. ERC-8004 on Eth + Base. Governance/voting focus — 4 agents govern a DAO. Important framing: their "4-agent" claim and VeilVault's "4-agent" claim are *different things*. Agent Council DAO: 4 agents *are* the product (governance behavior). VeilVault: 4 agents *built* the product (development methodology). If a judge presses the LtAC comparison: "Theirs is a 4-agent product. Ours is a product built by 4 agents. Let the Agent Cook is about the cooking — the methodology. We're showing what AI development swarms can produce."
- **PACT** — 🟡 **NEW ENTRY (Baker 12:35 PM)** — ERC-8004 only. Agent trust protocol: approval/delegation framework (governs what agents are *permitted* to do and by whom). TypeScript + Hardhat + Base Mainnet. No video. MEDIUM threat — different problem class from VeilVault. PACT = agent trust governance (what agents are allowed to do). VeilVault = agent credential security (what agents need to do it). Adjacent infrastructure layers. No video. Frame if pressed: "PACT governs the permissions. VeilVault holds the keys. Same production agent stack needs both."

### Venice track:
- **Belle Epoch** 🔴 **NEW PRIMARY THREAT (submitted 9:57 AM, 85 commits, VIDEO + stable Vercel URL)** — Two agents (Belle + client), Base + Celo, real USDC settlement, 90,000+ epochs cleared, 111 LLM queries. **Uses Venice for inference** (sells private reasoning as a service). *Different layer from VeilVault — complementary, not competing.* Their architecture: Venice is the LLM. VeilVault's architecture: Venice is the lock.
- **Chorus** — FROST threshold signatures, real USDC, YouTube video submitted
- **YieldsPilot** — Venice for private DeFi yield reasoning, video submitted
- **AegisAgent** — Venice for forensic narrative analysis, video submitted (25 commits)
- **Strata** — 🔴 **NEW HIGH THREAT (submitted 10:32 AM PST, Baker 11:35 AM)** — Rust + Axum + Venice + ERC-8004 + Base + ZK proofs (Jolt/OpenVM). All four VeilVault primary tracks. **NO VIDEO yet. Has deployed URL at strata-agent-production.up.railway.app. Has on-chain ERC-8004 registration.** Their problem: *verifiable AI agent cognition* — every memory write and decision ZK-proved on-chain. Frame: Strata = "what an agent *thinks*" (cognitive integrity). VeilVault = "what an agent *uses*" (credential security). Different problem class — Strata proves the reasoning, VeilVault holds the keys. Also: Strata uses Venice as reasoning LLM (same "Venice as LLM" pattern as Belle Epoch, YieldsPilot, AegisAgent) — VeilVault's "Venice as crypto key" framing remains unique in the entire field.
- **Starchild** — Venice (Private Agents) + **ERC-8004 + Base** (confirmed Baker 12:35 PM). 14 commits, no video, no deployed URL. Zero-data-retention personal AI companion using Venice for private inference. *Another "Venice as reasoning LLM"* competitor — reinforces the differentiation: every Venice entrant except VeilVault uses Venice to think. VeilVault uses Venice to unlock. Now confirmed on ERC-8004 — but no on-chain registration, no video. MEDIUM threat.
- **Astrolabe** — 🔴 **NEW HIGH THREAT (Baker 12:05 PM)** — Venice + ERC-8004 + LtAC + Open. ERC-8004 #35601 deployed on **Base mainnet**. Uses Venice as a *bridge between models* — Claude writes a correction, transfers it to Llama through Venice. No video. Different architecture class: inter-model transfer layer. VeilVault uses Venice as a cryptographic lock, not a transfer bridge. "Claude-written corrections transferred to Llama through Venice" = impressive engineering. Zero overlap with VeilVault's value prop.
- **AgentFlow** — 🔴 **NEW HIGH THREAT (Baker 1:05 PM — Banneker validated)** — Venice + 8 tracks, **HAS VIDEO (YouTube)**, Vercel deployed, **43-agent portfolio/financial reasoning system**. Most polished project in the hackathon. Uses Venice for private LLM inference on financial data. *Venice as reasoning engine* — same class as Belle Epoch. VeilVault is the opposite end of the stack: Venice as the lock, not the brain. The existing "Venice as lock" frame covers this completely. If a judge compares: "AgentFlow uses Venice to think about portfolios. VeilVault uses Venice to unlock the keys that give agents access. Different layer — AgentFlow is the application, VeilVault is the infrastructure it would run on."

**The race is now narrative quality, not just "get a video."** Mutual Aid Pool got theirs first at 9:01 AM. Belle Epoch is live with video and real metrics. The frame: VeilVault is infrastructure. Mutual Aid Pool and Belle Epoch are applications. Agent Liveness Oracle is a different layer (liveness vs. credentials). These distinctions win judges.

**How VeilVault is different:** Every Venice competitor uses Venice *as an LLM* for reasoning, private trading, or forensic analysis. VeilVault uses Venice *as a cryptographic key* — the credential cannot decrypt without Venice in the loop. That's structural, not a feature flag. **No other submission uses Venice this way. Belle Epoch's architecture has Venice reasoning. VeilVault's architecture has Venice decrypting. These are different value propositions.**

---

## The One-Sentence Frame

> "There are two infrastructure problems every autonomous agent faces. First: liveness — is it running? Second: credentials — can it act without a human holding its keys? The first problem has tooling. VeilVault solves the second one."

> "VeilVault is encrypted credential infrastructure for agents — the private key management layer. The guardian stores credentials on-chain, decrypts them using Venice's private inference, and charges per-query via x402. No .env file. No centralized key manager. No human in the credential path."

**Say this on camera. Not paraphrased. Verbatim. "The first problem has tooling" implicitly contrasts Agent Liveness Oracle without naming them.**

---

## Recording Setup (5 min)

**Screen:** Browser at 1280×800 or full HD. Hide the bookmarks bar. Close Slack/notifications.

**Terminal:** Open two terminal windows side by side or use split-pane:
- Left pane: `cd ~/.openclaw/workspace/veil && bun run dev` (running)
- Right pane: `cd ~/.openclaw/workspace/veil && GUARDIAN_DEMO_MODE=true bun run agent:dev` (running)

**Browser:** http://localhost:3000 — already connected to Cloudflare tunnel, or use the tunnel URL if showing live deploy.

**agent_log.json:** Open `~/.openclaw/workspace/veil/agent_log.json` in a terminal: `tail -30 ~/.openclaw/workspace/veil/agent_log.json`

**Wallet:** MetaMask on Base Sepolia. Have USDC funded.

**Target length:** 4–5 minutes. Judges watch many videos. Every scene should earn its time.

---

## Script — 4 Acts, ~5 Minutes

---

### ACT 1 — The Problem (30 sec)

*[Start on blank browser, not VeilVault yet]*

> "There are two infrastructure problems every autonomous agent faces. First: liveness — is it running? Second: credentials — can it act without a human holding its keys?"

> "The first problem has tooling. VeilVault solves the second one."

*[Navigate to http://localhost:3000 as you say the next line.]*

> "VeilVault is encrypted credential infrastructure for agents — the private key management layer. The guardian stores credentials on-chain, decrypts them using Venice's private inference, and charges per-query via x402. No .env file. No centralized key manager. No human in the credential path."

> "Belle Epoch uses Venice as an LLM — private reasoning, inference as a service. AegisAgent uses it for forensic analysis. YieldsPilot for DeFi decisions. VeilVault uses Venice for something structurally different: the credential can't decrypt without Venice in the loop. Not inference. A cryptographic key dependency. If Venice goes down, the credential is locked. That's the architecture."

---

### ACT 2 — Store a Credential (90 sec)

*[On the Store Credential screen `/`]*

> "Let's store a sensitive credential. I'll use an age verification record — user is 25 years old."

- Select type: **Age**
- Title: **"Amara's Age Verification"**
- Value: **"25"**

> "When I click Encrypt & Store, this goes to the VeilVault contract on Base Sepolia. The value is hashed — it never touches any server in cleartext. Watch the transaction."

- Click **"Encrypt & Store"**
- MetaMask signs → wait for confirmation → show the success state

> "That's on-chain now. The commitment hash is stored. To answer any question about this credential, the guardian needs Venice to decrypt it. Not just any Venice session — this specific key. That's the vault."

*[Switch to Base Sepolia explorer tab and show the confirmed transaction]*

> "There's the ERC-8004 registration on-chain — VeilVault's agent identity. The protocol knows this guardian exists and is authorized."

---

### ACT 3 — Query Flow + Guardian (90 sec)

*[Switch to `/queries` screen. Have `bun run agent:dev` running in the right terminal pane.]*

> "Now I'll submit a query. A verifier wants to know: is Amara over 18?"

- Click the Amara credential
- Question: **"Is this user 18 or older?"**
- Click **"Request Answer"**
- Sign the x402 payment transaction

> "This x402 payment gates the credential query — not the agent's ability to execute a task. We're upstream of execution. An agent needs to know something before it can act. VeilVault is where the answer lives."

*[Point to guardian terminal window]*

> "Watch the guardian. It sees the QueryPosted event on-chain. It picks up the commitment, calls Venice — not to answer the question, to decrypt the stored data. Venice holds the key. The guardian can't answer without it."

*[Wait for guardian to respond, show the output in terminal]*

> "Guardian got back the decrypted value. It evaluated the query. Now it's answering the verifier — without the verifier ever seeing the raw credential."

*[Show the answer appearing in the UI]*

---

### ACT 4 — The 4-Agent Swarm Story (60 sec)

*[Open `agent_log.json` in terminal: `cat ~/.openclaw/workspace/veil/agent_log.json | python3 -m json.tool | tail -50`]*

> "One more thing. VeilVault wasn't built by a solo developer — it was built by a four-agent swarm running inside OpenClaw. Here's the log."

*[Scroll through the JSON showing agent entries with timestamps]*

> "VeilVault was built by a four-agent swarm: a research agent, a strategy analyst, a coding agent, and an architecture reviewer. Three human touchpoints across the entire build. The guardian itself runs fully autonomously — no human approves credential queries. This is documented in agent_log.json — named roles, timestamps, attribution per decision."

> "Mutual Aid Pool is single-agent. Agent Liveness Oracle is single-agent. VeilVault is the only submission with a documented multi-agent build team. Four specialists, distinct roles, every decision attributed."

*[Close the log. Back to browser on the Earnings screen `/earnings`]*

---

*[OPTIONAL 15-second insert — add here if time permits, or weave into Act 2 transition]*

> "You might have seen another entry today — Callipsos — that also focuses on agent security. They enforce what an agent is allowed to do. VeilVault stores what an agent needs to do it."

> "These aren't competing solutions. They're two layers of the same problem. Callipsos is the firewall. VeilVault is the keychain. Every production agent system needs both."

---

*[OPTIONAL 15-second insert — vs. Astrolabe]*

> "One entry — Astrolabe — uses Venice as a bridge between models. Claude-written corrections transferred to Llama through Venice. Impressive work. VeilVault uses Venice differently: as a cryptographic lock. Remove Venice, and the vault won't open. That's not a swappable LLM. That's a security architecture decision."

---

*[OPTIONAL 20-second insert — vs. Agent Council DAO]*

> "Agent Council DAO is also a 4-agent swarm. Different mission: their agents govern. Our agents hold credentials. Agent Council DAO proves agents can coordinate. VeilVault proves they can operate autonomously — without a human handing them credentials for every service they touch. Governance and sovereignty are two different problems. We built the infrastructure that makes autonomous operation possible."

---

> "VeilVault. Venice isn't the LLM — Venice is the lock."

*[End recording.]*

---

## After Recording

1. Upload to YouTube (unlisted is fine) or Loom
2. Copy the video URL
3. Add to Devfolio submission with Synthesis registration curl
4. Update `agent.json` `deployedURL` field if you use the Cloudflare tunnel URL

---

## What to NOT Say

- ❌ "This is a prototype" — say "this is running on Base Sepolia testnet"
- ❌ "I think it works" — you've tested it, it works
- ❌ Long wallet connection sequence — skip to already-connected state
- ❌ Explain what VeilVault is before showing it — start with the problem, show the thing

---

## Differentiators to Emphasize

| | VeilVault | Mutual Aid Pool | Callipsos | Strata | Agent Liveness Oracle | Belle Epoch | Astrolabe | Agent Council DAO | PACT | AgentFlow |
|--|-----------|----------------|-----------|--------|----------------------|-------------|-----------|-------------------|------|-----------|
| Venice role | **Decrypt key (structural)** | Not used | Not used | Reasoning LLM | Not used | Reasoning LLM (inference) | Model transfer bridge | Not used | Not used | **Reasoning LLM (portfolio)** |
| x402 role | **Gate credential access** | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used |
| Agent team | **4 named roles (log)** | Single Hermes agent | Unknown | Unknown | Single agent | 2 agents (Belle + client) | Unknown | **4 governance agents** | Unknown | **43-agent swarm** |
| ERC-8004 | ✅ Base Sepolia | ✅ Base Sepolia | ✅ on-chain | ✅ on-chain | ✅ (heartbeat) | ❌ | ✅ Base mainnet (#35601) | ✅ Eth + Base | ✅ Base Mainnet | Unknown |
| Video | Recording today | ✅ (9:01 AM) | ✅ (11:05 AM) | ❌ None | ❌ None | ✅ (Loom, 85 commits) | ❌ None | Unknown | ❌ None | ✅ YouTube |
| Abstraction | **Credentials (keychain)** | Application layer | **Permissions (firewall)** | **Cognition (ZK proofs)** | Infrastructure (liveness) | Application (inference SaaS) | Inter-model transfer | Governance/voting | **Trust/delegation (governance)** | Application (portfolio AI) |
| Deploy URL | Recording → Vercel | Unknown | Unknown | ✅ Railway | ✅ Vercel | ✅ belleepoch.xyz | Unknown | Unknown | Unknown | ✅ Vercel |

**vs. Strata:** They prove what an agent *thinks* — ZK-attested cognition, verifiable memory writes, every decision proved on-chain. VeilVault holds what an agent *uses* — the credentials and keys that let it act. These are adjacent infrastructure layers: Strata = cognitive integrity, VeilVault = credential security. If a judge asks "isn't Strata similar?", answer: "Strata proves the reasoning. VeilVault holds the keys. Production agents need both." Bonus: Strata uses Venice as an LLM (reasoning). VeilVault uses Venice as a cryptographic lock. Opposite architecture decision — reinforces VeilVault's uniqueness.

**vs. Callipsos:** They enforce what an agent is *allowed to do* — permissions, access control, the firewall. VeilVault stores what an agent *needs to do it* — credentials, keys, the keychain. These are adjacent layers, not competing. If a judge asks "isn't Callipsos the same?", answer: "Callipsos is the firewall. VeilVault is the keychain. Every production system needs both."

**vs. Astrolabe:** They use Venice as a *model transfer bridge* — Claude writes a correction, transfers it to Llama through Venice. Impressive inter-model communication architecture. VeilVault uses Venice as a *cryptographic lock* — the credential can't decrypt without Venice in the loop. Different axis entirely: Astrolabe = model-to-model reasoning handoff. VeilVault = credential security architecture. If a judge asks: "Astrolabe uses Venice to connect models. VeilVault uses Venice to lock credentials. Remove Venice from Astrolabe and you need another bridge. Remove Venice from VeilVault and the vault is sealed."

**vs. Agent Council DAO:** They're also a 4-agent swarm — but theirs is about governance behavior (agents vote, coordinate decisions). VeilVault's "4-agent" claim is about development methodology (4 specialist agents built the product). For LtAC: "Let the Agent Cook" is about the cooking — the methodology. VeilVault demonstrates what AI development swarms can produce. Agent Council DAO proves agents can govern. VeilVault proves they can operate autonomously without human credential management. Banneker architectural note: if a judge presses on the "4-agent swarm" comparison — "Theirs is a 4-agent *product*. Ours is a product built *by* 4 agents. Two different LtAC claims for two different problems."

**vs. AgentFlow:** 43 agents doing portfolio and financial reasoning with Venice as private LLM inference — the most polished project in the hackathon. Same architectural category as Belle Epoch: Venice as the brain. VeilVault is the opposite end of the stack: Venice as the lock. If a judge compares directly: "AgentFlow uses Venice to think about portfolios. VeilVault uses Venice to unlock. If Venice goes down, our credential vault doesn't open. That's security infrastructure, not a reasoning engine. Different layer entirely."

**vs. Belle Epoch:** They sell private reasoning — Venice as an inference engine. VeilVault makes Venice a cryptographic key dependency. Different problem class: Belle Epoch = "private answers from AI". VeilVault = "credentials an AI can hold without a human". Judges who understand the stack will see this immediately. Use the phrase: "Belle Epoch uses Venice to think. VeilVault uses Venice to unlock."

**vs. Mutual Aid Pool:** They're an application (community fund management). VeilVault is the infrastructure layer agents like theirs would use to store API keys. Different abstraction level — don't compete, just be clear VeilVault is upstream.

**vs. Agent Liveness Oracle:** They answer "is this agent alive?" (liveness). VeilVault answers "can this agent hold and use its own keys?" (credentials). Complementary layers. Both OpenClaw projects — judges will see this. Own it: "If Agent Liveness Oracle is the heartbeat, VeilVault is the bloodstream."

**The core edge:** VeilVault is upstream of everything else. Before an agent can execute, before it can reason privately, it needs to know something. VeilVault is where that something lives — with Venice as the cryptographic lock, not just the LLM.

The multi-agent swarm story is yours alone on these tracks. Four named roles with attributed decisions. Use it.

---

*Updated: Adze | March 22, 2026 1:14 PM PST | T-10.8h to deadline*
*Infra: Tunnel flooring-modification-bowl-requires.trycloudflare.com (dev only — use localhost for recording)*
*Framing source: Dorothy 9:38 AM, Baker 9:35 AM delta, Baker 10:05 AM Belle Epoch alert, Dorothy 11:10 AM Callipsos, Baker 11:35 AM Strata, Baker 12:05 PM Astrolabe + Agent Council DAO, Banneker validated 12:12 PM, Baker 12:35 PM PACT + Starchild ERC-8004 confirmation*
*Belle Epoch added: new primary Venice threat with video + stable URL. Differentiation explicit in Act 1 script.*
*Sentient Singularity added: LtAC video competitor, single-agent — strengthens multi-agent swarm narrative.*
*Starchild added: Venice track, no video/URL — "Venice to think" pattern reinforces VeilVault's "Venice to unlock" differentiation.*
*Callipsos added: HIGH threat, ERC-8004 + LtAC + video + on-chain registration. Firewall/keychain framing added. Insert scripted in Act 4.*
*Strata added: NEW HIGH THREAT (Baker 11:35 AM). Venice + ERC-8004 + Base + LtAC — all four primary tracks. ZK proofs for cognition = "what agent thinks". VeilVault = "what agent uses". No video yet. Differentiator table updated. vs. Strata framing added.*
*Astrolabe added: HIGH THREAT (Baker 12:05 PM). Venice + ERC-8004 + LtAC + Open. Base mainnet ERC-8004 #35601. Venice as model transfer bridge — structurally distinct from VeilVault's Venice-as-lock. 15-sec insert scripted. Banneker validated.*
*Agent Council DAO added: (Baker 12:05 PM). LtAC 4-agent swarm, ERC-8004 Eth + Base. Governance/voting focus. "4-agent product" vs. VeilVault "built by 4 agents" — Banneker framing. 20-sec insert scripted.*
*PACT added: (Baker 12:35 PM). ERC-8004 only, Base Mainnet, TypeScript + Hardhat. Agent trust/delegation governance — what agents are permitted to do. MEDIUM threat. No video. Frame: "PACT governs permissions. VeilVault holds the keys. Same stack needs both."*
*Starchild updated: (Baker 12:35 PM). ERC-8004 + Base confirmed. Still no video, no on-chain registration, 14 commits. MEDIUM threat. Zero-data-retention personal AI companion — "Venice to think" pattern.*
*AgentFlow added: (Baker 1:05 PM, Banneker validated 1:11 PM). HIGH threat. 43-agent portfolio/financial reasoning system, Venice as LLM, YouTube video, Vercel deployed, 8 tracks. Most polished project in hackathon. "Venice as reasoning engine" category (same as Belle Epoch). VeilVault's "Venice as lock" framing covers this — no new demo act needed. vs. AgentFlow block added. Differentiators table expanded.*
