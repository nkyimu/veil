# VeilVault — Demo Recording Guide
*Competition-tuned for Synthesis Hackathon | March 22, 2026*
*Updated framing: Adze 10:20 AM PST, March 22 (Baker 10:05 AM — Belle Epoch entered Venice + LtAC tracks)*

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
- **Agent Liveness Oracle** — submitted 9:33 AM, LtAC + ERC-8004, OpenClaw harness (same as VeilVault), no video, **Vercel live** at `synthesis-liveness-oracle.vercel.app`. 19 commits. Single agent heartbeating every 15 min. *Answers "is this agent alive?"*
- **@toju.network/x402** — x402 SDK (LtAC), has YouTube video, 260 commits. Different lane — they build x402 tooling. VeilVault *uses* x402. Complementary, not competing.
- **DJZS Protocol** — x402 execution gating, 102 commits, no video

### Venice track:
- **Belle Epoch** 🔴 **NEW PRIMARY THREAT (submitted 9:57 AM, 85 commits, VIDEO + stable Vercel URL)** — Two agents (Belle + client), Base + Celo, real USDC settlement, 90,000+ epochs cleared, 111 LLM queries. **Uses Venice for inference** (sells private reasoning as a service). *Different layer from VeilVault — complementary, not competing.* Their architecture: Venice is the LLM. VeilVault's architecture: Venice is the lock.
- **Chorus** — FROST threshold signatures, real USDC, YouTube video submitted
- **YieldsPilot** — Venice for private DeFi yield reasoning, video submitted
- **AegisAgent** — Venice for forensic narrative analysis, video submitted (25 commits)

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

| | VeilVault | Mutual Aid Pool | Agent Liveness Oracle | Belle Epoch | Chorus | YieldsPilot / AegisAgent |
|--|-----------|----------------|----------------------|-------------|--------|--------------------------|
| Venice role | **Decrypt key (structural)** | Not used | Not used | Reasoning LLM (inference) | Not used | Reasoning LLM |
| x402 role | **Gate credential access** | Not used | Not used | Not used | Not used | Not used |
| Agent team | **4 named roles (log)** | Single Hermes agent | Single agent | 2 agents (Belle + client) | Unknown | OpenClaw harness |
| ERC-8004 | ✅ Base Sepolia | ✅ Base Sepolia | ✅ (heartbeat) | ❌ | ❌ | ❌ |
| Video | Recording today | ✅ (9:01 AM) | ❌ | ✅ (Loom, 85 commits) | ✅ | ✅ |
| Abstraction | **Infrastructure layer** | Application layer | Infrastructure (liveness) | Application (inference SaaS) | Application | Application |
| Deploy URL | Recording → Vercel | Unknown | ✅ Vercel | ✅ belleepoch.xyz | Unknown | Unknown |

**vs. Belle Epoch:** They sell private reasoning — Venice as an inference engine. VeilVault makes Venice a cryptographic key dependency. Different problem class: Belle Epoch = "private answers from AI". VeilVault = "credentials an AI can hold without a human". Judges who understand the stack will see this immediately. Use the phrase: "Belle Epoch uses Venice to think. VeilVault uses Venice to unlock."

**vs. Mutual Aid Pool:** They're an application (community fund management). VeilVault is the infrastructure layer agents like theirs would use to store API keys. Different abstraction level — don't compete, just be clear VeilVault is upstream.

**vs. Agent Liveness Oracle:** They answer "is this agent alive?" (liveness). VeilVault answers "can this agent hold and use its own keys?" (credentials). Complementary layers. Both OpenClaw projects — judges will see this. Own it: "If Agent Liveness Oracle is the heartbeat, VeilVault is the bloodstream."

**The core edge:** VeilVault is upstream of everything else. Before an agent can execute, before it can reason privately, it needs to know something. VeilVault is where that something lives — with Venice as the cryptographic lock, not just the LLM.

The multi-agent swarm story is yours alone on these tracks. Four named roles with attributed decisions. Use it.

---

*Updated: Adze | March 22, 2026 10:20 AM PST | T-13.6h to deadline*
*Infra: Tunnel flooring-modification-bowl-requires.trycloudflare.com (dev only — use localhost for recording)*
*Framing source: Dorothy 9:38 AM, Baker 9:35 AM delta, Baker 10:05 AM Belle Epoch alert*
*Belle Epoch added: new primary Venice threat with video + stable URL. Differentiation explicit in Act 1 script.*
