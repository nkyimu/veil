# Veil Dashboard — Design Direction

> Sourced from variant.com: ADAM WEB board, AAA board, ROSA board, + community feed (Mar 15, 2026)
> Variant boards: ROSA (37 items), ADAM WEB (8 items), AAA (5 items)

## Design Language: "Clinical Noir"

A sovereign data vault should feel like a secure operations center — not a fintech app. Think NORAD meets Dieter Rams.

## Primary Reference: VERIDICAL (from ADAM WEB board)

The "VERIDICAL — AI Dispute Resolution Infrastructure" design is the strongest match:
- **System bar**: `SYSTEM.ONLINE / LATENCY: LOW` + edition/version number
- **Hero treatment**: Large monospace title with system status labels
- **Navigation**: Pill buttons (`PROTOCOL / ARBITRATION / REGISTRY / INITIATE LOGIN →`)
- **Abstract panel**: Dark card with body text + hero stats (`99.999%` uptime, `14,282` active cases)
- **Color**: Near-black bg with red accent CTA
- **Adaption for Veil**: Swap red accent → purple. Replace legal terms with data sovereignty terms.

## Secondary Reference: Acumen ADR (from AAA board)

The "Acumen ADR" dashboard is perfect for interior pages:
- **Sidebar nav**: Icon + label (Dashboard, Settings, Notifications, Security)
- **Settings panel**: Clean form inputs with labels above
- **Hero stats row**: `124 Total Cases | 82% Resolution Rate | 14.2 Avg Days | $2.4M Value`
  - → For Veil: `47 Queries | $0.94 Earned | 12 Credentials | 99.8% Uptime`
- **Step wizard**: Numbered progression (DETAILS → EVIDENCE → REVIEW)
  - → For Veil: Onboarding flow (STORE → VERIFY → EARN)
- **Platform Configuration**: AI Confidence Threshold slider
  - → For Veil: Guardian agent settings (query fee, auto-answer threshold)

## Tertiary Reference: ROSA Board (37 items)

Savings circle patterns that map to Veil:
- **Financial Policy cards**: "Primary Thresholds", "Daily Limit: 1,200 USDC/Day"
  - → For Veil: "Query Fee: $0.02 USDC", "Daily Cap: 500 queries"
- **Transaction ledger**: Endowment Stake (-500 USDC PENDING), Yield Distribution (+42.18 USDC SETTLED)
  - → For Veil: Query payments received, revenue withdrawn
- **Criteria cards**: "Origin Pass", "Tenure Standard" with radio-button selection
  - → For Veil: Credential types to store
- **Conversational AI panel**: "Welcome, traveler" + chat input
  - → For Veil: Guardian agent interaction log
- **"Define the Threshold" manifesto page**: Beautiful onboarding for values/criteria
  - → For Veil: "What data should your agent protect?"

### Core Principles (from variant.com patterns)

1. **Dark substrate** — Near-black backgrounds (#0a0a0a to #111111), not generic "dark mode"
2. **Monospace system text** — SF Mono, JetBrains Mono, or IBM Plex Mono for data/status. Sans-serif (Inter) for headings
3. **Status indicators over colors** — Tiny uppercase labels like `STORED`, `PENDING`, `ACTIVE` with subtle background pills
4. **Grid-based card layout** — Bauhaus-influenced structured grids, not rounded blob cards
5. **Subtle borders** — 1px borders in `rgba(255,255,255,0.06)`, not gray
6. **Single accent color** — One accent (our "veil" purple/teal) used sparingly on active states and CTAs only
7. **Data-as-texture** — Show commitment hashes, query IDs, timestamps as design elements (like the hex grid in "Phase // Shift")
8. **System status bar** — Top bar showing agent status, chain connection, block height (like the "SYS.ONLINE // ENV.RENDERED" pattern)

### Specific Patterns to Steal

**From "Nodum OS" (romanxrp, 195 likes):**
- Left sidebar with collapsible sections (Knowledge Graph → Intelligence → Forge Layer)
- Card-based content feed in main area
- System ID labels on cards (`WRK-042`, `PRJ-01`)
- Status pills: `ACTIVE`, `EXPANDED`, `SHIPPED`, `BETA`
- Perfect for: Veil's credential management + query feed

**From "ORBITAL HABIT MANIFEST" (arach, 37 likes):**
- Weekly grid tracker (M/T/W/T/F/S/S columns)
- Yield metrics per row
- "ALL SYSTEMS NOMINAL" status bar
- `AUTH ID`, `STATION`, `GEO` metadata footer
- Perfect for: Veil's earnings dashboard — query count per day, revenue yield

**From "Fed Intelligence" (yilunarchi, 63 likes):**
- Clean data cards with large hero numbers (99.4%)
- Nested sub-stats (Treasury Yields with 2-Year/10-Year)
- `Live` indicator badge
- Perfect for: Veil's earnings overview — total earned, pending revenue, query count

**From "Kounter Kulture Genetics" (jrobbins, 126 likes):**
- Catalog grid with filter tabs (All / Feminized / Regular / Autoflower)
- Sort button ("Sort: THC (Desc)")
- Card items with ID labels, status pills, and spec grids
- `ADD +` action buttons
- Perfect for: Veil's credential management — filter by type, add new credentials

**From "AUDIO_IN" (Featured, 1160 likes):**
- Centered circular visualization on dark card
- Red recording indicator dot
- Status text: "Secure link established. Capturing input stream..."
- Timecode + sample rate footer
- Perfect for: Veil's guardian agent status — "Agent monitoring... 42 queries answered"

**From "BAUSTEIN" inventory (fastcarsearch, 38 likes):**
- Color-coded filter buttons
- Clean data table (Ident Nr. / Specification / Stock / Requisition)
- `[ ADD ]` actions per row
- Perfect for: Veil's query log — requester / credential type / payment / status

### Color Palette

```
--bg-primary: #0a0a0a
--bg-card: #111111
--bg-card-hover: #161616
--border: rgba(255, 255, 255, 0.06)
--border-active: rgba(255, 255, 255, 0.12)
--text-primary: #e5e5e5
--text-secondary: #888888
--text-muted: #555555
--accent: #7c3aed (veil purple — used SPARINGLY)
--accent-glow: rgba(124, 58, 237, 0.15)
--success: #22c55e
--warning: #eab308
--error: #ef4444
--mono-font: 'JetBrains Mono', 'SF Mono', monospace
--sans-font: 'Inter', system-ui, sans-serif
```

### Dashboard Layout

```
┌────────────────────────────────────────────────┐
│ ▪ VEIL          SYS.ONLINE  ◉ Base  #18293847 │  ← System bar
├──────┬─────────────────────────────────────────┤
│      │                                         │
│  📋  │  CREDENTIALS            [+ Store New]   │  ← Main content
│  🔍  │  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  💰  │  │ Age     │ │ Credit  │ │Location │  │
│  ⚙️  │  │ STORED  │ │ STORED  │ │ NOT SET │  │
│      │  │ 0x3f8a..│ │ 0x7d2e..│ │         │  │
│      │  └─────────┘ └─────────┘ └─────────┘  │
│      │                                         │
│      │  RECENT QUERIES                         │
│      │  ┌──────────────────────────────────┐  │
│      │  │ #47  Age ≥ 18?  0x1a2b..  $0.02 │  │
│      │  │      ANSWERED ✓  2m ago          │  │
│      │  ├──────────────────────────────────┤  │
│      │  │ #46  CreditRange > 700?  $0.02   │  │
│      │  │      PENDING ◉   5m ago          │  │
│      │  └──────────────────────────────────┘  │
│      │                                         │
├──────┴─────────────────────────────────────────┤
│ GUARDIAN: ACTIVE  │  QUERIES: 47  │  $0.94     │  ← Status footer
└────────────────────────────────────────────────┘
```

### Typography Scale

```
--text-xs: 0.6875rem (11px) — metadata, hashes, IDs
--text-sm: 0.75rem (12px) — labels, status pills
--text-base: 0.875rem (14px) — body text
--text-lg: 1rem (16px) — section headers
--text-xl: 1.25rem (20px) — page titles
--text-hero: 2.5rem (40px) — earnings number
```

### Key UI Components Needed

1. **SystemBar** — Chain connection, block height, agent status
2. **CredentialCard** — Type, status pill, commitment hash, store/revoke actions
3. **QueryFeed** — Live feed of incoming queries with auto-answer status
4. **EarningsPanel** — Hero number (total earned), pending, query count, weekly chart
5. **GuardianStatus** — Agent heartbeat, uptime, last query answered
6. **Sidebar** — Icon-only nav (Credentials, Queries, Earnings, Settings)

### Implementation Notes

- Use Tailwind CSS (already in project)
- No component library — raw Tailwind for full control
- framer-motion for subtle entrance animations
- recharts or lightweight custom SVG for earnings chart
- viem for live contract reads (credential status, query count, earnings)
