# Spacing + nav + footer polish audit — design

**Date:** 2026-05-17
**Branch:** `feature/plan-7-world-reach` (and pushed fallback `feature/plan-7-audit-pickup`)
**Trigger:** User noted that sitewide spacing / margins / padding / whitespace "looks off all over the website," and specifically that body content should align with Nav and Footer, but Nav and Footer themselves also need polish. Picked option 3 (audit-first, deliver a punch list, user picks fixes).

## Status at end of 2026-05-17 session

**This is a brainstorming spec — no audit run yet, no code touched.**

The audit shape is locked. Tomorrow's session reads this doc and produces the audit output. The audit output is itself a punch-list doc that further sessions cherry-pick from for implementation.

## Audit goal

Produce a written, finding-by-finding punch list covering five lanes of sitewide polish:

1. **A — Token coherence:** `DESIGN.md §82-99` vs `tailwind.config.cjs` vs in-component usage. Documented-but-not-wired tokens (`head-to-content`, `card-*-gap`), raw `sp-N` usage that should be semantic, orphan pixel literals.
2. **B — Sitewide horizontal alignment** (the priority concern):
   - Nav uses `px-page-x` (56/20px responsive).
   - Footer uses `.stage-grid col-start-2` — which positions content one column *further inward* from the gutter than Nav.
   - Body sections mix `.px-page-x` and `.stage-grid`.
   - Result: a vertical scan down the page shows nav left-edge, body content, and footer content at three different horizontal positions on the same viewport.
   - Audit: identify every section's primitive, propose one unifying approach.
3. **C — Nav internal polish:** `py-sp-4` (16px) vs editorial norm (20-24px). Touch-target inconsistency (lang toggle 40px vs CTA 44px). Logo height, gap rhythm, RTL parity.
4. **D — Footer internal polish:** `pt-section-y / pb-sp-7` (144/48px) asymmetry, link list `leading-[2.15]` hack to hit 44px touch target, column placement at 1024-1280 viewport width, newsletter form vertical rhythm, colophon row spacing.
5. **E — Section rhythm sitewide:** DESIGN.md §99 mandates *"Vary spacing for rhythm. Same padding everywhere is monotony."* Audit each home section's `py-section-y` use — flag where rhythm has flattened. Hero-to-section-1 join. Section-to-footer join.

## Audit deliverable shape

**Output file:** `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md` (new directory).

**Per-finding format:**
- **ID** (A1, A2, B1, C1...) for cross-reference
- **Severity:** P0 (ships-broken / visibly wrong) · P1 (polish-worthy) · P2 (nice-to-have)
- **Description** (1-3 sentences)
- **File:line evidence** (concrete pointer)
- **Proposed fix** (concrete, not vague)

**Summary table at top** so the user can skim and tick items.

**Recommended fix order** with note of which items unlock which (e.g., "fix B1 before C3 — touch-target spec depends on chosen Nav padding").

**Estimated size:** 25-40 findings across the five lanes, ~5-8 P0/P1.

## Audit scope

**In scope (full audit):**
- `src/components/global/{Nav,Footer,MobileNavDrawer,HamburgerButton,UtilityBar,Breadcrumb,CaptionStrip}.astro`
- All `src/components/home/*.astro` sections
- `src/styles/{tokens.css,global.css}` + `tailwind.config.cjs`
- `DESIGN.md §82-100` (spacing + layout primitives)
- Spot-checks: `/about`, `/partners`, `/partners/[slug]`, `/products`, `/products/[line]`, `/contact`, `/field-reports` (index only)

**Out of scope (separate audits later if needed):**
- Product detail pages `/products/[line]/[slug]` — own internal rhythm
- Field-report detail pages `/field-reports/[slug]` — long-form prose layout, different concern
- Typography polish — separate from spacing
- Color / motion polish — separate
- AR vs EN visual parity at narrow viewports — already partly covered by Plan 7

## Deliverable contract

1. I produce the audit doc.
2. User reads it, picks items (single, batched, or all).
3. Each picked item or batch becomes its own brainstorm → spec → plan → implementation cycle in a follow-up session.
4. The audit doc itself is committed but does not drive code changes directly.

## To pick up tomorrow

1. Read this spec.
2. Run the audit by reading every file in the "In scope" list.
3. Write `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md` with the structure above.
4. Commit + present punch list to user.
5. User picks → brainstorm the chosen item(s) → spec → plan → implement.

## Other open items from earlier in this session

These are committed as specs but still need implementation:

- **`docs/superpowers/specs/2026-05-17-env-gate-scope-note-design.md`** (commit `6857db1`) — env-gate `SHOW_SCOPE_NOTE` in WorldReach.astro using `PUBLIC_DEMO_MODE`. Plan not yet written. Quick win (~3 file edits + new `.env.example`). Could be paired with any unrelated work.

## Open items from the earlier `dfa78b7` WIP commit

- ~~Differentiate China aggregate slot~~ ✓ closed (commit `642e21a`)
- ~~Retire broader "7/12" framing site-wide~~ ✓ closed (commits `e37247c`, `22da1b3`, `b610e15`, `d6f87c3`)
- Env-gate SHOW_SCOPE_NOTE — **spec written, plan pending** (`6857db1`)
- Native AR review of slot_partial, scope_note_body, credentials_label + the new strings from the copy-nuance pass — **client task, not engineering**
- Sudan inset map (optional) — **deferred**
- `git tag plan-7-world-reach` once all follow-ups are signed off — **deferred until audit + env-gate land**

## Notes for tomorrow's session start

- Working tree should be clean. Branch `feature/plan-7-world-reach` is the canonical local branch (currently 127 commits ahead of main).
- Remote fallback branches on `origin` for safety:
  - `feature/plan-7-world-reach` (frozen at WIP commit `dfa78b7`)
  - `feature/plan-7-aggregate-slot` (post-round-1)
  - `feature/plan-7-copy-nuance` (post-round-2, before env-gate)
  - `feature/plan-7-audit-pickup` (post-this-session — the latest, contains everything)
- Tests at session end: 94/94 passing. Build: 100 pages clean.
