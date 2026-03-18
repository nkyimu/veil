# Audit Exemptions — Veil

## Next.js CVE GHSA-3x4c-7xq6-9pq8 (disk cache growth)

**Status:** Pinned at next@15.5.13 — exempt until Next.js v16 app-router migration is confirmed.

**CVE severity:** Moderate. Disk cache growth only — no RCE, no data exposure.

**Upgrade attempted:** 2026-03-18  
**Result:** next@16.1.7 breaks page routing on app-router projects (build error: `Cannot find module for page: /`). This is a known Next.js v15→v16 compatibility gap.

**Risk acceptance:**
- Dev server only, no production deployment
- Disk cache growth CVE — worst case is storage exhaustion on dev machine
- Sentinel reviewed and classified Low

**Action:** Revisit when Next.js v16 publishes an app-router migration guide or when build error is resolved upstream.

**Owner:** Adze | **Reviewed by:** Sentinel (2026-03-18)
