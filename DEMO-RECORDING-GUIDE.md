# VeilVault — Demo Recording Guide
*Competition-tuned for Synthesis Hackathon | March 22, 2026*
*Updated framing: Adze 9:44 PM PST, March 21 (Baker scan 9:35 PM)*

---

## 🔴 INFRASTRUCTURE STATUS (9:44 PM)
- **Live URL:** https://civic-cgi-funk-axis.trycloudflare.com ✅ HTTP 200
- *(Previous tunnel expired — new URL active as of 9:44 PM)*

---

## Context: The Competitive Field (9:35 PM Current)

Venice track + adjacent competitors now in the field:
- **Chorus** — FROST threshold signatures, real USDC, **YouTube video submitted** — highest threat
- **YieldsPilot** — Venice for private DeFi yield reasoning, video submitted
- **AegisAgent** — Venice for forensic narrative analysis, video submitted
- **eelienX Protocol** — 🔴 **NEW HIGH THREAT** (entered 8:18 PM) — 35 commits, ERC-8004 on Base **Mainnet**, 5-phase autonomous trading agent loop (discover→plan→execute→verify→submit), openclaw harness + claude-sonnet-4-6, **no video yet**
- **DJZS Protocol** — x402 execution gating, 102 commits, **no video yet** (12+ hours)
- **DarwinFi** — 488 tests, 81 commits, **no video yet** (12+ hours)
- **Shadow Swarm** — Venice + OpenServ, LtAC track, has video, 1 commit (low threat)

**The window:** eelienX, DJZS, and DarwinFi still have no videos. VeilVault can be the only high-commit ERC-8004 project with a Venice integration AND a video. That's the win.

**vs. eelienX specifically:** They execute trades autonomously — impressive but it's just another trading agent. VeilVault solves the problem *every* agent like theirs has: where do you store the API credentials that let it run? VeilVault is upstream of eelienX's problem class.

**How VeilVault is different:** Competitors use Venice *as an LLM* for reasoning or private computation. VeilVault uses Venice *as a key* — the credential cannot decrypt without Venice in the loop. That's structural, not a feature flag.

---

## The One-Sentence Frame

> "Some projects use Venice for private trading decisions, some for forensic analysis. VeilVault uses Venice for something structurally different: the credential can't decrypt without Venice in the loop. It's not private computation — it's a cryptographic key dependency."

**Say this on camera. Not paraphrased. Verbatim.**

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

> "When AI agents need sensitive data — medical records, credentials, financial history — they have a problem. They either get the data in plaintext, which is a security risk, or they're blocked and can't answer the question. VeilVault solves this with a different architecture: the agent never sees the data. Venice holds it."

*[Navigate to http://localhost:3000 as you say the last line.]*

> "Some projects use Venice for private trading decisions, some for forensic analysis. VeilVault uses Venice for something structurally different: the credential can't decrypt without Venice in the loop. It's not private computation — it's a cryptographic key dependency."

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

> "One more thing. VeilVault wasn't built by a solo developer — it was built by a named agent team running inside OpenClaw. Here's the log."

*[Scroll through the JSON showing agent entries: Adze, Banneker, Baker, Dorothy]*

> "Adze handled all implementation. Banneker reviewed every PR for architecture and security. Dorothy researched the competitive landscape. Baker tracked the field and kept us calibrated. Four named specialists with distinct roles — not one generic agent."

> "Shadow Swarm and similar projects use OpenServ or OpenClaw as a harness — a tool to call. VeilVault was managed by a named squad. Every commit, every PR review, every deployment decision has an agent identity behind it. That's not tooling — that's an AI team."

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

| | VeilVault | Chorus | eelienX Protocol | DJZS Protocol | YieldsPilot / AegisAgent |
|--|-----------|--------|-----------------|--------------|--------------------------|
| Venice role | **Decrypt key (structural)** | Not used | Not used | Not used | Reasoning LLM |
| x402 role | **Gate credential access** | Not used | Not used | Gate agent execution | Not used |
| Agent team | **4 named agents (SOUL.md)** | Unknown | OpenClaw harness | Unknown | OpenClaw harness |
| ERC-8004 | ✅ Base Sepolia | ❌ | ✅ Base **Mainnet** | ❌ | ❌ |
| Commits | 65 (18 queued) | 90 | 35 | 102 | Unknown |
| Video | Recording tonight | ✅ | ❌ | ❌ | ✅ |

**vs. eelienX (the new HIGH threat):** They build a trading agent. VeilVault builds the credential vault that agents like theirs need to exist. The problem class is upstream — any autonomous agent needs secure credential storage before it can execute autonomously.

**The core edge:** VeilVault is upstream of everything else. Before an agent can execute (DJZS, eelienX), before it can reason privately (Venice projects), it needs to know something. VeilVault is where that something lives.

The swarm story is yours alone. Use it.

---

*Updated: Adze | March 21, 2026 9:44 PM PST | T-26.3h to deadline*
*Infra: NEW TUNNEL civic-cgi-funk-axis.trycloudflare.com (prev tunnel expired)*
*Framing source: Baker 9:35 PM (baker-to-empa-2026-03-21-935pm.md), Dorothy 8:10 PM*
