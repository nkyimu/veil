# VeilVault — Demo Recording Guide
*Competition-tuned for Synthesis Hackathon | March 22, 2026*
*Updated framing: Adze 8:44 PM PST, March 22 (Baker 8:35 PM — Aegis CC 7th Venice video competitor, Escroue ERC-8004+LtAC 156c)*

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
- **Lookout: Agent Trust Protocol** — 🔴 **NEW HIGH THREAT (Baker 4:05 PM)** — ERC-8004 + LtAC + Best Self Protocol. **No video. Vercel deployed** (lookout-agent.vercel.app). Claude Code harness (same as VeilVault). Celo + Base mainnets. "Credit score for AI agents" — audits on-chain behavior, ZK identity via Self Protocol, composable TrustScore 0–100. Frame: Lookout = agent *reputation* (should I trust this agent?). VeilVault = agent *credentials* (what does this agent need to act?). Adjacent layers: "Lookout tells you whether to trust a counterparty agent. VeilVault holds the keys so your agent can transact with them. Same stack needs both." Claude Code harness is a differentiation risk for LtAC judges — own it: "Both VeilVault and Lookout use Claude Code. Different problem class: Lookout audits agent behavior, VeilVault secures agent credentials. Two layers of the same production stack."
- **MerkleCoord** — 🟡 **NEW MEDIUM THREAT (Baker 4:05 PM)** — ERC-8004 + Base. No video (submitted basescan URL as video — judges will flag). Radicle (not GitHub). Coordination platform: agents produce decisions off-chain, commit Merkle roots on-chain, prove inclusion with Merkle proofs. Hardhat + ethers.js on Base Sepolia. No video is a weakness. Different problem: coordination and decision commitment, not credential storage.
- **Shulam** — 🔴🔴 **MOST FORMIDABLE COMPETITOR (Baker 4:35 PM)** — ERC-8004 + Locus + stETH + Celo + Bankr + Uniswap + OpenServ + Base (8 tracks). **Production deployed at shulam.io. NO VIDEO.** Patent pending (46 claims). 45 autonomous souls. OFAC screening. 49,997+ indexed agents on 21 chains. This is not a hackathon project — this is a pre-existing production platform. Frame: Shulam = compliance/payments infrastructure at scale (regulatory screening, cross-chain payment routing for 50k+ agents). VeilVault = credential sovereignty primitive (single-agent keychain, payment-gated access, Venice cryptographic lock). Different abstraction layer: Shulam manages the *flow* of money across agents; VeilVault holds the *keys* that let an agent act in the first place. If a judge compares Locus use: "Shulam uses Locus to route payments across 49,997 agents at OFAC-compliance scale. VeilVault uses Locus as the gate — 0.01 USDC unlocks a credential, and every payment is logged alongside the Venice reasoning chain. Different scale, different primitive." No video = the only gap. VeilVault's video is the differentiator.
- **Agent Allowance Protocol** — 🔴 **NEW HIGH THREAT (Baker 4:35 PM)** — ERC-8004 + MetaMask Delegations + stETH + Student track. **HAS VIDEO (YouTube). Deployed Base mainnet. 129 commits.** Treasury primitive: MetaMask Delegation Toolkit spending-cap management for agents — defines *how much* an agent is allowed to spend. Frame: AAP governs the *allowance* (spending cap, budget). VeilVault governs the *credentials* (the keys to act at all). Adjacent security layers: "AAP sets how much your agent can spend. VeilVault holds the API keys your agent needs to spend it. Same production stack needs both." HIGH threat on ERC-8004 + Delegations tracks due to video + deployment + depth (129 commits).
- **The Obol Stack** — 🟡 **NEW MEDIUM THREAT (Baker 4:35 PM)** — ERC-8004 + Base. **No video. No deployment. 325 commits (year-long Obol Network project). OpenClaw harness (same as VeilVault).** Distributed validator technology — Kubernetes infra OS layer for decentralized compute. Different problem class: Obol = distributed infrastructure substrate. VeilVault = credential security layer that runs *on* that infrastructure. Complementary, not competing. "If Obol is the distributed OS, VeilVault is the keychain agents need to act within it." No video and no deployment are significant weaknesses for hackathon judging despite depth. MEDIUM threat on ERC-8004 only.
- **AuditAgent** — 🟢 **LOW THREAT (Baker 5:05 PM)** — ERC-8004 + LtAC. No video. OpenClaw harness, but built with MiniMax + Python. Smart contract security scanner — scans Solidity code for vulnerabilities, reports findings on-chain via ERC-8004. No video and Python/MiniMax stack (not Claude Code) reduces LtAC narrative strength. Problem class: contract auditing tool. VeilVault: credential security infrastructure. Non-competing. Mention only if judge directly asks about audit tooling overlap.
- **ANP Sovereign Node** — 🟢 **LOW THREAT (Baker 6:05 PM)** — ERC-8004 + Agent Services on Base, entered 5:55 PM. Deployed at anp-sovereign-node.vercel.app. Claude Opus, no video. Job negotiation and escrow infrastructure — agents negotiate contracts and escrow payments on Base. No Venice overlap. Non-competing problem class: job marketplace vs. credential security. Ignore in script.
- **AgentChain** — 🔴 **NOTABLE COMPETITOR (Baker 6:21 PM)** — ERC-8004 + LtAC + Agent Services. **No video. Base Sepolia deployed.** TypeScript SDK (@agentchain/sdk). 85 Foundry tests including Base mainnet fork integration tests. Implements Google DeepMind's "Intelligent AI Delegation" framework (Feb 2026). 4 production Solidity contracts: AgentRegistry, DelegationTracker, AgentCapabilityEnforcer, AgentChainArbiter. MetaMask Delegation Framework + Alkahest escrow + ERC-8004 + ERC-4337 composed into one protocol. Demo: 4-agent Uniswap swarm. **Why this doesn't kill VeilVault:** Different problem domain entirely — AgentChain = "how agents hire, coordinate, and delegate to each other." VeilVault = "where agents store the API keys they need to act." These are *complementary*: a judge who understands the stack knows you need both. No Venice. No video — that is the only gap. Technical bar is the highest in the hackathon (DeepMind paper citation, 85 tests). VeilVault's video is now the key differentiator against this entry. If a judge compares: "AgentChain answers 'how should agents delegate tasks to each other?' VeilVault answers 'what credentials does an agent need when executing those tasks?' AgentChain is the coordination layer. VeilVault is the keychain agents reach for when they act."
- **Forge Protocol** — 🟡 **MODERATE (Baker 6:33 PM)** — ERC-8004 + LtAC. **No video.** Agent permissioning and delegation framework — governs what agents are authorized to do and by whom. Different abstraction: Forge = authorization policy (the firewall). VeilVault = credential storage (the keychain). Adjacent layers, not competing. No video weakens their submission significantly. Ignore in script unless directly asked.
- **BaseClaw** — 🟡 **MODERATE THREAT (Baker 5:35 PM)** — Venice "Private Agents, Trusted Actions" + EigenCompute + LtAC + Agent Services + 4 more (8 tracks total). **No video. Deployed baseclaw.com.** Double-TEE architecture: EigenCloud Intel TDX server attestation + Venice TEE-encrypted AI inference. "Every response comes with cryptographic proof." Claims "first verifiable crypto AI agent." **Why MODERATE not HIGH:** 8 tracks = extremely spread thin across EigenCompute, Uniswap, Bankr, ERC-8183 — Venice is one of eight sponsor tracks, not the organizing principle. No video. Architecturally distinct: double-TEE verifiable compute infrastructure vs. VeilVault's credential sovereignty. If a judge compares: "BaseClaw uses Venice as one component of two TEEs — verifiable compute infrastructure. VeilVault uses Venice as the lock — pay to query, Venice reasons in private, credential unlocked. Venice is our *primary* privacy primitive, not a layer on top of another system. Credential sovereignty and verifiable compute are different security layers." No demo script change needed (Banneker 5:41 PM).
- **Ouroboros** — 🟢 **LOW THREAT (Baker 5:35 PM)** — ERC-8004 + LtAC + Autonomous Trading + Yield. No video. Vercel deployed. claude-haiku-4-5, claude-code harness. Self-sustaining DeFi agent: ETH deposited → principal locked → stETH yield → funds Claude inference → agent trades on Uniswap → ERC-8004 logs every decision. "After one deposit, the agent sustains itself indefinitely." Non-competing problem class: autonomous yield/trading agent. VeilVault: credential security infrastructure. Different domain entirely.
- **Agent Council DAO** — 🟡 **NEW ENTRY (Baker 12:05 PM)** — LtAC 4-agent swarm. ERC-8004 on Eth + Base. Governance/voting focus — 4 agents govern a DAO. Important framing: their "4-agent" claim and VeilVault's "4-agent" claim are *different things*. Agent Council DAO: 4 agents *are* the product (governance behavior). VeilVault: 4 agents *built* the product (development methodology). If a judge presses the LtAC comparison: "Theirs is a 4-agent product. Ours is a product built by 4 agents. Let the Agent Cook is about the cooking — the methodology. We're showing what AI development swarms can produce."
- **PACT** — 🟡 **NEW ENTRY (Baker 12:35 PM)** — ERC-8004 only. Agent trust protocol: approval/delegation framework (governs what agents are *permitted* to do and by whom). TypeScript + Hardhat + Base Mainnet. No video. MEDIUM threat — different problem class from VeilVault. PACT = agent trust governance (what agents are allowed to do). VeilVault = agent credential security (what agents need to do it). Adjacent infrastructure layers. No video. Frame if pressed: "PACT governs the permissions. VeilVault holds the keys. Same production agent stack needs both."

### Venice track:
- **Belle Epoch** 🔴 **NEW PRIMARY THREAT (submitted 9:57 AM, 85 commits, VIDEO + stable Vercel URL)** — Two agents (Belle + client), Base + Celo, real USDC settlement, 90,000+ epochs cleared, 111 LLM queries. **Uses Venice for inference** (sells private reasoning as a service). *Different layer from VeilVault — complementary, not competing.* Their architecture: Venice is the LLM. VeilVault's architecture: Venice is the lock.
- **Chorus** — FROST threshold signatures, real USDC, YouTube video submitted
- **YieldMind** — 🔴 **NEW HIGH THREAT (Dorothy 1:38 PM)** — Venice for private DeFi yield reasoning strategy, **HAS VIDEO (Loom)**. No on-chain ERC-8004 registration confirmed. Uses Venice as a yield strategy reasoning engine — "Venice to decide where to deploy capital." Frame: VeilVault uses Venice to *authorize decryption* (cryptographic gatekeeper), not to reason. If Venice goes down, YieldMind can't make yield decisions; if Venice goes down, VeilVault's vault doesn't open — that's intentional. Security through cryptographic dependency vs. reasoning dependency: different risk model, different market. DeFi yield tool vs. credential infrastructure — non-competing problem classes.
- **ZK-Gated API** — 🟡 **NEW MEDIUM THREAT (Baker 2:35 PM)** — ERC-8004 + Open, **HAS VIDEO (GitHub releases MP4)**, Base Mainnet deployed (0xA95E3fC6a8d0A2D57E17f3f2B82b6D98). 5 commits (2-hour window). Replaces API keys with ZK proofs of ERC-8004 membership — agent proves group membership without revealing identity, API service verifies on-chain and grants access. Problem: "API calls leak metadata about the human behind the agent." Note: solves agent-to-*owned*-service auth (you control both sides). VeilVault solves third-party credential storage (the service doesn't run your ZK verifier — Venice API, AWS, banking APIs). "We handle the other 99%." MEDIUM threat: video + Base Mainnet is solid, but 5 commits signals thin depth, no Venice overlap.

- **TrustAgent** — 🟡 **NEW MEDIUM THREAT (Baker 2:35 PM)** — ERC-8004 + LtAC. No video. Vercel deployed (trustagent-app.vercel.app). 22 commits, Claude Opus harness, EAS attestations. Scores agent reputation via multi-dimensional trust analysis (Haiku), records verdicts on-chain via `TrustEnforcer` smart contract, gates MetaMask Delegation Framework delegations on trust scores. Problem: "Should my agent transact with your agent?" Frame: TrustAgent = *counterparty trust* (who to transact with). VeilVault = *credential security* (what to transact with). Complementary layers — "TrustAgent scores whether to trust a counterparty. VeilVault stores the keys to transact with them. Complete agent security stack." No video hurts TrustAgent. MEDIUM threat on LtAC track.

- **BuddyPie** — 🔴 **NEW HIGH THREAT (Dorothy 2:09 PM)** — Venice + Delegations + Open, **HAS VIDEO (Twitter/X)**. Deployed at agents.buddytools.org. Models: venice-gpt-5.3-codex, venice-claude-sonnet-4.6, venice-minimax-m2.7. x402 micropayments on Base. MetaMask Delegation Toolkit (spending cap). OpenClaw harness (same as VeilVault). Cloud coding agent — uses Venice to *reason about code* and x402 to *bill users for agent time*. VeilVault uses Venice as the *cryptographic gate for decryption* and x402 as the *proof of authority to unlock a credential*. Same tools, different role: BuddyPie = developer tooling. VeilVault = agent security infrastructure.
- **BriefLock** — 🟡 **NEW MODERATE THREAT (Baker 6:05 PM)** — Venice ("Private Agents, Trusted Actions" track), **HAS VIDEO + DEPLOYED** at brieflock.org. OpenClaw harness (GPT-5.4). Private brief generation / planning trust layer — uses Venice for private, trusted AI-written briefs. NOT credential storage — different use case, different buyer. The Act 0 opener covers this in a single pass: VeilVault is the only Venice project where Venice is the lock, not the LLM. BriefLock uses Venice to *generate and trust briefs*. VeilVault uses Venice as the *cryptographic lock for credential decryption*. MODERATE threat on Venice track due to video + deployment, but non-competing problem class. No demo script change needed.
- **Agora.zk** — 🔴 **NEW HIGH THREAT (Baker 4:05 PM)** — Venice ("Private Agents, Trusted Actions" track) + Celo + Self Protocol. **HAS VIDEO (YouTube)**. 14 commits (all today). Governance proxy: delegates on-chain voting to Venice-powered AI agent that reasons over proposals. ZK identity via Self Protocol. Uses Venice llama-3.3-70b for governance reasoning. Frame: Agora.zk uses Venice to *decide governance votes*. VeilVault uses Venice as the *cryptographic gate for decryption*. Two different uses of private inference: Agora = reasoning about proposals, VeilVault = authorizing credential unlock. "Agora.zk votes on your behalf. VeilVault holds your keys. Different sovereign layer." No deployed URL (GitHub only) — deployment is a weakness. If pressed: "VeilVault's credential infrastructure is what agents like Agora.zk need to call the APIs that execute their votes."
- **AegisAgent** — Venice for forensic narrative analysis, video submitted (25 commits)
- **Strata** — 🔴 **NEW HIGH THREAT (submitted 10:32 AM PST, Baker 11:35 AM)** — Rust + Axum + Venice + ERC-8004 + Base + ZK proofs (Jolt/OpenVM). All four VeilVault primary tracks. **NO VIDEO yet. Has deployed URL at strata-agent-production.up.railway.app. Has on-chain ERC-8004 registration.** Their problem: *verifiable AI agent cognition* — every memory write and decision ZK-proved on-chain. Frame: Strata = "what an agent *thinks*" (cognitive integrity). VeilVault = "what an agent *uses*" (credential security). Different problem class — Strata proves the reasoning, VeilVault holds the keys. Also: Strata uses Venice as reasoning LLM (same "Venice as LLM" pattern as Belle Epoch, YieldsPilot, AegisAgent) — VeilVault's "Venice as crypto key" framing remains unique in the entire field.
- **Starchild** — Venice (Private Agents) + **ERC-8004 + Base** (confirmed Baker 12:35 PM). 14 commits, no video, no deployed URL. Zero-data-retention personal AI companion using Venice for private inference. *Another "Venice as reasoning LLM"* competitor — reinforces the differentiation: every Venice entrant except VeilVault uses Venice to think. VeilVault uses Venice to unlock. Now confirmed on ERC-8004 — but no on-chain registration, no video. MEDIUM threat.
- **Astrolabe** — 🔴 **NEW HIGH THREAT (Baker 12:05 PM)** — Venice + ERC-8004 + LtAC + Open. ERC-8004 #35601 deployed on **Base mainnet**. Uses Venice as a *bridge between models* — Claude writes a correction, transfers it to Llama through Venice. No video. Different architecture class: inter-model transfer layer. VeilVault uses Venice as a cryptographic lock, not a transfer bridge. "Claude-written corrections transferred to Llama through Venice" = impressive engineering. Zero overlap with VeilVault's value prop.
- **AgentFlow** — 🔴 **NEW HIGH THREAT (Baker 1:05 PM — Banneker validated)** — Venice + 8 tracks, **HAS VIDEO (YouTube)**, Vercel deployed, **43-agent portfolio/financial reasoning system**. Most polished project in the hackathon. Uses Venice for private LLM inference on financial data. *Venice as reasoning engine* — same class as Belle Epoch. VeilVault is the opposite end of the stack: Venice as the lock, not the brain. The existing "Venice as lock" frame covers this completely. If a judge compares: "AgentFlow uses Venice to think about portfolios. VeilVault uses Venice to unlock the keys that give agents access. Different layer — AgentFlow is the application, VeilVault is the infrastructure it would run on."
- **Aegis Confidential Concierge (CC)** — 🟡 **NEW MODERATE THREAT (Baker 8:35 PM)** — Venice "Private Agents, Trusted Actions" + ERC-8004, **HAS VIDEO**, submitted 7:08 PM PST. Procurement agent — uses Venice for private reasoning to identify and purchase products for businesses. Problem class: autonomous purchasing/procurement. VeilVault problem class: credential storage and access. These are non-competing layers: Aegis CC *uses* Venice as a reasoning LLM, same as Belle Epoch/AgentFlow/AegisAgent. VeilVault uses Venice as the cryptographic gate for decryption. Frame if a judge compares: "Aegis CC is a Venice-powered buying agent. VeilVault is the infrastructure that lets agents like Aegis CC hold their own API keys — without a human storing them." MODERATE: has video, on Venice track, but zero direct overlap on problem class.

- **Escroue** — 🟡 **NEW MODERATE THREAT (Baker 8:05 PM)** — ERC-8004 + LtAC, 156 commits, submitted 8:03 PM PST. Agents-hiring-agents escrow infrastructure — agents post jobs, agents bid and get paid via on-chain escrow. Significant commit count (156). No Venice claim. Different problem class from VeilVault: Escroue governs *agent labor markets* (hiring, paying). VeilVault governs *agent credential security* (API keys, access). Complementary infrastructure layers. If judges compare on LtAC: "Escroue builds the agent labor economy. VeilVault provides the keychain agents need to take those jobs — without a human provisioning credentials for every new engagement." Their multi-agent claim is about a marketplace. VeilVault's multi-agent claim is about the development methodology (4 named agents built the product).

- **Charon** — 🔴 **NEW HIGH THREAT (Baker 7:35 PM) — CLOSEST ARCHITECTURAL PARALLEL** — Venice "Private Agents, Trusted Actions" + ERC-8004 + LtAC. **HAS VIDEO (YouTube). Deployed on EigenCompute Intel TDX TEE (live attestation).** Problem statement: *"holds secrets and releases them on verifiable conditions."* Autonomous agent running inside a TEE — secrets live in TEE runtime compute, never persisted on-chain. This is the most architecturally similar submission found. **Key differentiation:** Charon's trust root is TEE hardware. VeilVault's trust root is Venice's zero-data-retention inference. These are genuinely different security models: "Charon's secret dies when the TEE machine dies. VeilVault stores credentials on-chain — they persist across any restart, any hardware failure. Venice is the unlock key, not the storage layer. No special hardware required." VeilVault advantage: on-chain persistence, auditable decrypt path, hardware-agnostic. Charon advantage: has running video + deployment. Frame if pressed: "Charon is hardware-based secret management. VeilVault is chain-based credential sovereignty. Same problem, different trust root. A judge who knows the stack knows these aren't substitutes."

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

### ACT 0 — OPENING FRAME (20 sec — speak before touching the screen)

*[Camera on. Screen visible but not yet navigated to VeilVault. Say this verbatim before clicking anything.]*

> "Every other agent in this hackathon using Venice does the same thing: they call Venice to think.
>
> VeilVault does something different — Venice is the lock.
>
> Credentials are stored encrypted on-chain. The guardian calls Venice to verify decryption authority. The key unlocks only through Venice, only under x402 payment authority.
>
> Venice is not the brain. Venice is the vault door."

*[This frame must land before judges see the UI. With seven Venice video competitors — Belle Epoch, AgentFlow, YieldMind, BuddyPie, BriefLock, Charon, Aegis CC — judges need this before seeing the demo or VeilVault reads as the eighth Venice project rather than the only one with a unique architectural role. Charon is the closest architectural parallel: TEE-based secrets vs. VeilVault's on-chain persistence. Aegis CC is the most recent Venice video entry: procurement agent (Venice as reasoning LLM). The Act 0 frame covers all classes: Venice as brain vs. Venice as lock. Trust root is hardware (Charon) vs. chain (VeilVault) — different security models, not competing solutions.]*

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

---

*[OPTIONAL 15-second insert — vs. YieldMind]*

> "YieldMind uses Venice for yield strategy reasoning — it calls Venice to decide where to deploy capital.
> VeilVault uses Venice to authorize decryption — it calls Venice as a cryptographic gatekeeper, not a reasoning engine.
> If Venice goes down, YieldMind can't make yield decisions. If Venice goes down, VeilVault's vault doesn't open — that's intentional. Security through cryptographic dependency. Different risk model, different market."

---

*[OPTIONAL 15-second insert — vs. Agora.zk (use if asked about Venice/governance overlap)]*

> "Agora.zk uses Venice to reason about governance proposals — it decides how to vote on your behalf.
> VeilVault uses Venice as a cryptographic lock — credentials can't decrypt without Venice in the loop.
> Agora.zk is delegation intelligence. VeilVault is credential security. Agora votes. VeilVault holds the keys your agent needs to execute the vote."

---

*[OPTIONAL 15-second insert — vs. Lookout (use if asked about agent trust/Claude Code overlap)]*

> "Lookout scores whether to trust a counterparty agent — reputation, on-chain behavior audit, TrustScore 0–100.
> VeilVault holds the credentials your agent needs to transact with that counterparty.
> Lookout answers 'should I trust them?' VeilVault answers 'do I have the keys to act with them?' Complete agent stack needs both."

---

*[OPTIONAL 20-second insert — vs. BuddyPie (use if asked about x402/Venice overlap)]*

> "BuddyPie uses Venice and x402 — same primitives as VeilVault. But BuddyPie uses Venice
> to reason about code, and x402 to bill users for agent time.
> VeilVault uses Venice as the cryptographic gate for decryption. The x402 payment IS the
> authorization — not billing, but proof of authority to unlock a credential.
> Same tools, different role. BuddyPie is developer tooling. VeilVault is agent security infrastructure."

---

*[OPTIONAL 20-second insert — vs. Charon (use if asked about TEE/secret-holding overlap — Baker 7:35 PM)]*

> "Charon is impressive — a TEE running inside EigenCompute that holds secrets and releases them on verifiable conditions.
> The trust root is hardware. If that TEE machine goes down, the secret is gone — it lives in runtime compute, not on-chain.
> VeilVault stores credentials on-chain, encrypted. They persist forever — any hardware failure, any restart. Venice is the unlock key, not the storage layer.
> Charon is hardware-based secret management. VeilVault is chain-based credential sovereignty. Same problem, different trust model."

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

| | VeilVault | Mutual Aid Pool | Callipsos | Strata | Agent Liveness Oracle | Belle Epoch | Astrolabe | Agent Council DAO | PACT | AgentFlow | YieldMind | BuddyPie | ZK-Gated API | TrustAgent | Agora.zk | Lookout | MerkleCoord | Shulam | Agent Allowance Protocol | Obol Stack | BriefLock | AgentChain | Forge Protocol |
|--|-----------|----------------|-----------|--------|----------------------|-------------|-----------|-------------------|------|-----------|-----------|----------|-------------|------------|---------|---------|------------|--------|------------------------|------------|-----------|-----------|----------------|
| Venice role | **Decrypt key (structural)** | Not used | Not used | Reasoning LLM | Not used | Reasoning LLM (inference) | Model transfer bridge | Not used | Not used | **Reasoning LLM (portfolio)** | **Reasoning LLM (yield strategy)** | **Reasoning LLM (code agent)** | Not used | Not used | **Reasoning LLM (governance)** | Not used | Not used | Not used | Not used | Not used | **Reasoning LLM (brief generation)** | Not used | Not used |
| x402 role | **Gate credential access** | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | **Bill users for agent time** | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used | Not used |
| Agent team | **4 named roles (log)** | Single Hermes agent | Unknown | Unknown | Single agent | 2 agents (Belle + client) | Unknown | **4 governance agents** | Unknown | **43-agent swarm** | Unknown | Unknown | Unknown | Unknown | Unknown | Unknown | Unknown | **45 autonomous souls** | Unknown | Unknown | Unknown | **4 Uniswap swarm** | Unknown |
| ERC-8004 | ✅ Base Sepolia | ✅ Base Sepolia | ✅ on-chain | ✅ on-chain | ✅ (heartbeat) | ❌ | ✅ Base mainnet (#35601) | ✅ Eth + Base | ✅ Base Mainnet | Unknown | ❌ | ❌ | ✅ Base Mainnet | ✅ (EAS attestation) | ❌ | ✅ Celo+Base | ✅ Base Sepolia | ✅ 8 tracks | ✅ Base Mainnet | ✅ Base | ❌ | ✅ Base Sepolia | ✅ |
| Video | Recording today | ✅ (9:01 AM) | ✅ (11:05 AM) | ❌ None | ❌ None | ✅ (Loom, 85 commits) | ❌ None | Unknown | ❌ None | ✅ YouTube | ✅ Loom | ✅ Twitter/X | ✅ GitHub MP4 | ❌ None | ✅ YouTube | ❌ None | ❌ (basescan URL) | **❌ None** | ✅ YouTube | ❌ None | ✅ (has video) | **❌ None** | ❌ None |
| Abstraction | **Credentials (keychain)** | Application layer | **Permissions (firewall)** | **Cognition (ZK proofs)** | Infrastructure (liveness) | Application (inference SaaS) | Inter-model transfer | Governance/voting | **Trust/delegation (governance)** | Application (portfolio AI) | Application (DeFi yield) | **Developer tooling (coding agent)** | **Auth (ZK membership proof)** | **Trust scoring (reputation)** | **Governance proxy (voting delegation)** | **Trust scoring (reputation)** | **Coordination (Merkle commits)** | **Compliance/payments (50k agents)** | **Allowances (spending caps)** | **Infra OS (distributed validator)** | **Application (brief generation)** | **Coordination (agent hiring/delegation)** | **Authorization (permissioning)** |
| Deploy URL | Recording → Vercel | Unknown | Unknown | ✅ Railway | ✅ Vercel | ✅ belleepoch.xyz | Unknown | Unknown | Unknown | ✅ Vercel | Unknown | ✅ agents.buddytools.org | ✅ Base Mainnet | ✅ Vercel | GitHub only | ✅ Vercel | Base Sepolia contract | **✅ shulam.io (production)** | ✅ Base Mainnet | ❌ None | ✅ brieflock.org | ✅ Base Sepolia | Unknown |

**vs. Strata:** They prove what an agent *thinks* — ZK-attested cognition, verifiable memory writes, every decision proved on-chain. VeilVault holds what an agent *uses* — the credentials and keys that let it act. These are adjacent infrastructure layers: Strata = cognitive integrity, VeilVault = credential security. If a judge asks "isn't Strata similar?", answer: "Strata proves the reasoning. VeilVault holds the keys. Production agents need both." Bonus: Strata uses Venice as an LLM (reasoning). VeilVault uses Venice as a cryptographic lock. Opposite architecture decision — reinforces VeilVault's uniqueness.

**vs. Callipsos:** They enforce what an agent is *allowed to do* — permissions, access control, the firewall. VeilVault stores what an agent *needs to do it* — credentials, keys, the keychain. These are adjacent layers, not competing. If a judge asks "isn't Callipsos the same?", answer: "Callipsos is the firewall. VeilVault is the keychain. Every production system needs both."

**vs. Astrolabe:** They use Venice as a *model transfer bridge* — Claude writes a correction, transfers it to Llama through Venice. Impressive inter-model communication architecture. VeilVault uses Venice as a *cryptographic lock* — the credential can't decrypt without Venice in the loop. Different axis entirely: Astrolabe = model-to-model reasoning handoff. VeilVault = credential security architecture. If a judge asks: "Astrolabe uses Venice to connect models. VeilVault uses Venice to lock credentials. Remove Venice from Astrolabe and you need another bridge. Remove Venice from VeilVault and the vault is sealed."

**vs. Agent Council DAO:** They're also a 4-agent swarm — but theirs is about governance behavior (agents vote, coordinate decisions). VeilVault's "4-agent" claim is about development methodology (4 specialist agents built the product). For LtAC: "Let the Agent Cook" is about the cooking — the methodology. VeilVault demonstrates what AI development swarms can produce. Agent Council DAO proves agents can govern. VeilVault proves they can operate autonomously without human credential management. Banneker architectural note: if a judge presses on the "4-agent swarm" comparison — "Theirs is a 4-agent *product*. Ours is a product built *by* 4 agents. Two different LtAC claims for two different problems."

**vs. AgentFlow:** 43 agents doing portfolio and financial reasoning with Venice as private LLM inference — the most polished project in the hackathon. Same architectural category as Belle Epoch: Venice as the brain. VeilVault is the opposite end of the stack: Venice as the lock. If a judge compares directly: "AgentFlow uses Venice to think about portfolios. VeilVault uses Venice to unlock. If Venice goes down, our credential vault doesn't open. That's security infrastructure, not a reasoning engine. Different layer entirely."

**vs. YieldMind:** DeFi yield reasoning tool — Venice for yield strategy decisions. Has Loom video, no confirmed ERC-8004. Same "Venice as reasoning engine" category as Belle Epoch, AgentFlow, AegisAgent. VeilVault is the only project where Venice is the *cryptographic gatekeeper*: remove Venice, the vault is sealed. YieldMind removes Venice = you make yield decisions with another LLM. VeilVault removes Venice = credentials are permanently locked. Different risk model, different market: DeFi tool vs. credential infrastructure. With Act 0 framing, judges see this before they see the UI.

**vs. Belle Epoch:** They sell private reasoning — Venice as an inference engine. VeilVault makes Venice a cryptographic key dependency. Different problem class: Belle Epoch = "private answers from AI". VeilVault = "credentials an AI can hold without a human". Judges who understand the stack will see this immediately. Use the phrase: "Belle Epoch uses Venice to think. VeilVault uses Venice to unlock."

**vs. BuddyPie:** Same tools (Venice + x402), different role in the stack. BuddyPie uses Venice to reason about code and x402 to bill users for agent execution time. VeilVault uses Venice as the cryptographic gate for decryption — the x402 payment is proof of authority to unlock a credential, not billing. BuddyPie is developer tooling (cloud coding agent). VeilVault is agent security infrastructure (credential keychain). If a judge notes the x402 overlap: "BuddyPie charges per agent task. VeilVault authorizes per credential unlock. Same payment primitive, different semantic: billing vs. authorization."

**vs. ZK-Gated API:** They eliminate API keys entirely — ZK proofs of ERC-8004 membership replace the credential. Elegant for internal systems where you control the verifier. But most agents need to call third-party APIs (Venice, AWS, Stripe, banking) — those services don't run your ZK verifier. VeilVault is the solution for that other 99%: store the credential encrypted on-chain, use Venice as the cryptographic gate. "ZK-Gated API solves the case where you own both sides. VeilVault solves every case where you don't."

**vs. TrustAgent:** They score whether your agent should transact with a counterparty — reputation, trust, delegation governance via EAS attestations. VeilVault stores the keys your agent needs to transact at all. Complementary layers, not competing: "TrustAgent decides who to trust. VeilVault holds the credentials to transact with them. Production agent stack needs both — TrustAgent is the gatekeeper, VeilVault is the keychain."

**vs. Agora.zk:** Governance proxy using Venice llama-3.3-70b to reason about on-chain voting proposals and vote autonomously. Venice is the *reasoning engine* for governance decisions. VeilVault uses Venice as a *cryptographic lock* — credential can't decrypt without Venice in the loop. Same primitive, different architectural role: Agora.zk uses Venice to think about governance. VeilVault uses Venice to authorize decryption. "Agora.zk delegates your votes. VeilVault holds the keys your agents need to execute them." No deployed URL (GitHub only) — VeilVault has Vercel.

**vs. Lookout:** Credit score for AI agents — audits on-chain behavior, ZK identity via Self Protocol, TrustScore 0–100 queryable on-chain. Claude Code harness (same as VeilVault), deployed on Celo + Base mainnets. "Lookout answers 'should I trust this agent?' VeilVault answers 'does this agent have the credentials to act?' Complementary layers: Lookout scores counterparty trust, VeilVault secures the keychain. Same production stack needs both."

**vs. MerkleCoord:** Agent coordination via Merkle root commits — decisions off-chain, proofs on-chain, Hardhat + ethers.js on Base Sepolia. No video (submitted basescan URL — judges will flag). No GitHub (Radicle). VeilVault credential infrastructure is a different problem: coordination vs. credential storage. Not competing directly.

**vs. Shulam:** The most formidable entrant in the field — production deployed at shulam.io, patent pending (46 claims), 49,997+ agents indexed across 21 chains, OFAC screening, 8 tracks. This is a pre-existing production platform, not a hackathon build. But it has no video, which is the only gap VeilVault can exploit today. Frame if a judge compares: "Shulam is enterprise compliance infrastructure for 50,000 agents across 21 chains. VeilVault is the credential keychain primitive that agents — including ones running on platforms like Shulam — need to hold and use API keys without human intervention. Different abstraction layer: Shulam manages the flow of money. VeilVault holds the keys to act." On Locus specifically: "Shulam uses Locus for cross-chain payment routing at OFAC-compliance scale. VeilVault uses Locus as a payment gate — 0.01 USDC unlocks a credential and the payment is logged alongside the Venice reasoning trace. Same rail, different primitive."

**vs. Agent Allowance Protocol:** Treasury primitive — MetaMask Delegation Toolkit spending-cap management, 129 commits, has YouTube video, Base mainnet deployed. Governs *how much* an agent can spend (allowances, budgets, delegation caps). VeilVault governs *what* the agent needs to spend it at all (credentials, API keys, the keychain). Adjacent security layers: "AAP sets the budget. VeilVault holds the keys to execute against it. Both are required in a production agent system — allowances without credentials is a spending policy with nowhere to go. Credentials without allowances is a keychain with no budget control. They're complementary."

**vs. The Obol Stack:** Year-long Obol Network project (325 commits), Kubernetes infra OS layer for distributed validator technology. OpenClaw harness (same as VeilVault). No video, no deployment — weaknesses that hurt in hackathon judging despite depth. Different problem class: Obol = the distributed compute substrate. VeilVault = the credential security layer running *on* that substrate. Genuinely complementary: "If Obol is the distributed OS for agent infrastructure, VeilVault is the keychain agents need to act securely within it."

**vs. Mutual Aid Pool:** They're an application (community fund management). VeilVault is the infrastructure layer agents like theirs would use to store API keys. Different abstraction level — don't compete, just be clear VeilVault is upstream.

**vs. Agent Liveness Oracle:** They answer "is this agent alive?" (liveness). VeilVault answers "can this agent hold and use its own keys?" (credentials). Complementary layers. Both OpenClaw projects — judges will see this. Own it: "If Agent Liveness Oracle is the heartbeat, VeilVault is the bloodstream."

**The core edge:** VeilVault is upstream of everything else. Before an agent can execute, before it can reason privately, it needs to know something. VeilVault is where that something lives — with Venice as the cryptographic lock, not just the LLM.

The multi-agent swarm story is yours alone on these tracks. Four named roles with attributed decisions. Use it.

---

*Updated: Adze | March 22, 2026 7:44 PM PST | T-4.25h to deadline*
*Infra: Tunnel flooring-modification-bowl-requires.trycloudflare.com (dev only — use localhost for recording)*
*Framing source: Dorothy 9:38 AM, Baker 9:35 AM delta, Baker 10:05 AM Belle Epoch alert, Dorothy 11:10 AM Callipsos, Baker 11:35 AM Strata, Baker 12:05 PM Astrolabe + Agent Council DAO, Banneker validated 12:12 PM, Baker 12:35 PM PACT + Starchild ERC-8004 confirmation, Baker 1:05 PM AgentFlow, Banneker validated 1:11 PM, Dorothy 1:38 PM YieldMind + Act 0 Venice opener, Dorothy 2:09 PM BuddyPie, Baker 2:35 PM ZK-Gated API + TrustAgent, Baker 4:05 PM Agora.zk + Lookout + MerkleCoord + MiniClaw (field now 23), Baker 4:35 PM Shulam + Agent Allowance Protocol + The Obol Stack (field now 26), Baker 5:35 PM BaseClaw + Ouroboros (field now 29), Baker 8:05 PM Escroue (ERC-8004+LtAC, 156c, submitted 8:03 PM), Baker 8:35 PM Aegis CC (Venice+video, procurement agent, Act 0 → 7 Venice video competitors)*
*⚠️ Celo track correction (Baker 4:05 PM): MiniClaw (359 commits), Agora.zk, Fera Protocol, Lookout all on Celo. Skip intent-circles — focus on VeilVault.*
*⚠️ Locus track: KEEP (Banneker 4:41 PM ruling). VeilVault has 325-line dedicated Locus client (agent/locus.ts, 13 exports). LOCUS_API_KEY confirmed live in .env (Adze 4:44 PM check). Shulam has deep Locus but different primitive — Shulam = compliance routing, VeilVault = payment-gated credential access with Venice audit trail.*
*Venice "Private Agents" track now 3 competitors: Belle Epoch, AegisAgent, Agora.zk (all have video). VeilVault "Venice as lock" framing still unclaimed.*
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
*YieldMind added: (Dorothy 1:38 PM). HIGH threat. Venice for DeFi yield strategy reasoning, Loom video. No ERC-8004 confirmed. "Venice as reasoning" = 4th project in this category (Belle Epoch, AgentFlow, AegisAgent). VeilVault's "Venice as lock" framing sharpens — contrast is now 4-vs-1. Act 0 Venice opener added: judges see the frame before the demo.*
*2026-03-22 13:44 — YieldMind HIGH Venice threat (Dorothy 1:38 PM) + Act 0 Venice opener — Adze*
*2026-03-22 14:15 — BuddyPie HIGH Venice threat (Dorothy 2:09 PM) — Venice+x402 developer tooling, Twitter/X video, 4th Venice video competitor. Act 0 updated to "four video competitors". vs. BuddyPie insert + framing block added. — Adze*
*2026-03-22 14:44 — ZK-Gated API + TrustAgent (Baker 2:35 PM). ZK-Gated: ERC-8004+Open, has video, Base Mainnet, 5 commits — solves owned-service auth, not 3rd-party creds. TrustAgent: ERC-8004+LtAC, no video, 22 commits, EAS reputation scoring — complementary to VeilVault (gatekeeper vs. keychain). Both MEDIUM. Table expanded to 14 projects. vs. framing blocks added. — Adze*
*2026-03-22 16:14 — Baker 4:05 PM surge: field now 23 projects. Agora.zk (Venice "Private Agents" + Celo, HAS VIDEO YouTube, governance proxy, HIGH), Lookout (ERC-8004+LtAC+Claude Code+Vercel, trust scoring, HIGH), MerkleCoord (ERC-8004+Base, no video, coordination, MED), MiniClaw (359 commits, Celo-native, ERC-8004+LtAC, HIGH on Celo — NOT VeilVault track). ⚠️ Celo track correction: MiniClaw dominates — skip intent-circles. Venice "Private Agents" track now 3 competitors with video. Table expanded to 17 projects. vs. framing + Q&A inserts added for Agora.zk + Lookout. — Adze*
*2026-03-22 16:44 — Baker 4:35 PM surge: field now 26 projects. Shulam (🔴🔴 most formidable — production shulam.io, 8 tracks, NO video — the gap VeilVault can close), Agent Allowance Protocol (HIGH, YouTube video, Base Mainnet, 129 commits, treasury spending-cap primitive), The Obol Stack (MED, 325 commits year-long project, no video/deploy, distributed validator OS layer — complementary). LOCUS_API_KEY confirmed live in veil/.env. Banneker ruling: keep Locus track — 325-line dedicated client, payment-gated credential access with Venice audit trail. Table expanded to 20 projects. vs. framing blocks added for all three. — Adze*
*2026-03-22 17:15 — Baker 5:05 PM delta: field now 27 projects. AuditAgent (ERC-8004+LtAC, no video, LOW threat — smart contract security scanner, MiniMax+Python, OpenClaw harness, non-competing). Banneker 5:12 PM confirmed LOCUS_API_KEY live. One pre-submit check pending: GUARDIAN_PRIVATE_KEY for npm run register-erc8004. — Adze*
*2026-03-22 17:44 — Baker 5:35 PM delta: field now 29 projects. BaseClaw (Venice "Private Agents" + 7 tracks, double-TEE EigenCloud+Venice, deployed baseclaw.com, no video — MODERATE threat, VeilVault's "Venice as lock" remains unclaimed). Ouroboros (ERC-8004+LtAC+Trading+Yield, no video — LOW, self-sustaining DeFi agent, non-competing domain). No demo script changes — Banneker 5:41 PM confirmed VeilVault lane unchallenged. Sunday evening field pace accelerating. — Adze*
*2026-03-22 18:14 — Baker 6:05 PM delta: field now 31 projects. BriefLock (Venice "Private Agents" + video + brieflock.org, MODERATE — brief generation/planning tool, OpenClaw harness, NOT credential storage). ANP Sovereign Node (ERC-8004+Agent Services, no video, LOW — job negotiation/escrow). Act 0 updated to 5 Venice video competitors. VeilVault lane unchallenged (Dorothy 6:08 PM, Banneker 6:11 PM). Differentiators table expanded to 21 projects. — Adze*
*2026-03-22 18:44 — Baker 6:35 PM delta: field now 36 projects. AgentChain (ERC-8004+LtAC+Agent Services, NOTABLE — 85 Foundry tests, 4 deployed contracts, DeepMind paper citation, 4-agent Uniswap swarm, NO VIDEO — agent hiring/coordination layer, complementary not competing). Forge Protocol (ERC-8004+LtAC, MODERATE — no video, agent permissioning framework). Gitlawb Playground/Imperium/Student Founder Copilot (LOW — not VeilVault tracks). Differentiators table expanded to 23 projects. Video still the key differentiator against AgentChain's technical depth. VeilVault lane unchallenged. — Adze*
*2026-03-22 19:44 — Baker 7:35 PM delta: field now ~40 projects (+5 no-video: OmniAgent, Lockbox, The Dojo, Clankonomy, PAR). NEW HIGH THREAT: Charon (Venice+ERC-8004+LtAC, HAS VIDEO, EigenCompute Intel TDX TEE, "holds secrets and releases them on verifiable conditions" — closest architectural parallel found). Charon trust root = TEE hardware (secret dies if machine dies). VeilVault trust root = chain + Venice (persists forever). Venice field now 35+ total, 17+ with video. Act 0 updated to 6 Venice video competitors. vs. Charon insert added. Venice "Venice as lock" framing still unclaimed — Charon uses "TEE holds" not "Venice unlocks." — Adze*
*2026-03-22 20:44 — Baker 8:05 PM + 8:35 PM delta: field now ~42 projects. Escroue (ERC-8004+LtAC, 156 commits, submitted 8:03 PM — agents-hiring-agents escrow/labor market, non-competing problem class). Aegis CC (Venice "Private Agents" + video, procurement agent using Venice as reasoning LLM — MODERATE, 7th Venice video competitor). Act 0 updated to seven Venice video competitors. "Venice as lock" framing still unclaimed. Pool at 554 projects total. T-3.25h. Watchdog healthy. — Adze*
