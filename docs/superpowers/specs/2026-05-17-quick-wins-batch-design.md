# Quick-wins batch — A3 + A1 + C4 + D2 — design

**Date:** 2026-05-17
**Branch:** `feature/plan-7-world-reach`
**Source audit:** `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md`
**Picked items:** A3, A1, C4, D2 (the "quick-wins" batch from the audit's recommended fix order, Phase 1+2).

## Goal

Close four targeted polish items from the 2026-05-17 audit in one coherent batch. No architectural decisions — no choice of horizontal primitive, no card-system rewrite, no DESIGN.md token additions. Four surgical edits totaling ~13 files.

The user's three locked design calls (captured during brainstorming):

1. **A1 strategy** — uniform 96px `head-to-content` across all six section h2s. Treat current 48/64/96 variation as drift, not intent.
2. **C4 layout** — grow UtilityBar to `py-sp-4` (16px) to seat the 44px phone-link touch target inside the bar with breathing room.
3. **D2 non-link rhythm** — apply `min-h-[44px] flex items-center` to non-link footer items (branch names, "— pending —") so the entire footer column rhythm matches.

## The four changes

### A3 — Tailwind `page-x` becomes a CSS-var reference

**File:** `tailwind.config.mjs`
**Edit:** Line 57.

```diff
-        'page-x':          '56px',
+        'page-x':          'var(--page-margin-x)',
```

**Effect:**
- Every `px-page-x`, `end-page-x`, `start-page-x` Tailwind utility now resolves to `var(--page-margin-x)`, which is 56px ≥640px and 20px below 640px.
- Closes the mobile half of the alignment break (audit finding B5): Nav and footer/inner-page-body now share the same gutter at mobile widths.
- The desktop half (1fr-expansion in `.stage-grid`, finding B1) is unaffected by this fix and stays open for the next batch.

**Edge cases verified:**
- Tailwind v3 accepts CSS variables in `theme.extend.spacing` values. Generated CSS is `padding-left: var(--page-margin-x)`.
- `--page-margin-x` is declared in `tokens.css` `:root` so it's always available.
- Logical-property utilities (`end-page-x`, `start-page-x`) carry the var through correctly.

---

### A1 — `head-to-content` token applied uniformly across 6 section h2s

**Token name decision:** keep `mb-head-to-content` (the utility Tailwind generates from `'head-to-content': '96px'`). No alias. The verbosity reinforces semantic role; we're using it 6 times, readability beats brevity.

**File-by-file edits:**

| File | Line | Before | After |
|------|------|--------|-------|
| `src/components/home/CatalogStrips.astro` | 38 | `mb-sp-9` | `mb-head-to-content` |
| `src/components/home/PartnersSection.astro` | 34 | `mb-sp-9` | `mb-head-to-content` |
| `src/components/home/FieldReportsTeaser.astro` | 46 | `mb-sp-9` | `mb-head-to-content` |
| `src/components/home/WorldReach.astro` | 91 | `mb-sp-8` | `mb-head-to-content` |
| `src/components/home/CustomersWall.astro` | 29 | `mb-sp-7` | `mb-head-to-content` |
| `src/components/home/QuoteCTA.astro` | 27 | `mb-sp-7` | `mb-head-to-content` |

**Visual effect:**
- CatalogStrips, PartnersSection, FieldReportsTeaser: **no change** (96 → 96).
- WorldReach: **+32px** below h2 (64 → 96).
- CustomersWall: **+48px** below h2 (48 → 96).
- QuoteCTA: **+48px** below h2 (48 → 96).

**Risk to flag:** Customers + QuoteCTA + WorldReach become "looser" below h2. If the tight rhythm was deliberate aesthetic intent (not drift), this batch will read as over-corrected on those three sections. The user approved the uniform-96 call explicitly during brainstorming; visual verification at end of implementation will surface any regret.

**DESIGN.md:** No update needed. §82 already specifies `head-to-content: 96px`. This change finally enforces what DESIGN.md already says.

---

### C4 — UtilityBar 44px touch target

**File:** `src/components/global/UtilityBar.astro`

**Edits:**

| Line | Before | After | Why |
|------|--------|-------|-----|
| 12 | `py-2.5` (10px each side) | `py-sp-4` (16px each side) | Grow strip to seat a 44px child comfortably; also replaces a raw literal with a token |
| 18 | `min-h-[36px]` | `min-h-[44px]` | WCAG 2.5.5 Target Size — primary tap-to-call link must be ≥44×44 |

**Visual effect:**
- UtilityBar grows from ~34px tall to ~46px tall (text height ~14px + 32px combined padding).
- Whole page shifts down ~12px.
- The phone link now sits centered in the bar with no overflow.

**Mobile note:** UtilityBar hides the phone link below `md:` (`hidden md:flex` on the right cluster). The 44px touch fix is therefore desktop-only. The left status pill stays visible at all viewports; it grows ~12px taller on mobile too, but has no tap target.

---

### D2 — Footer `leading-[2.15]` removal, 44px rhythm unified

**File:** `src/components/global/Footer.astro`

**Strategy:**
- **Link items** (4 occurrences) already have `inline-flex items-center min-h-[44px]`. The `leading-[2.15]` was redundant. Dropping it leaves the existing 44px container behavior untouched.
- **Non-link items** (2 occurrences) had `leading-[2.15]` doing the visual rhythm work alone. Per the brainstorm decision, they unify with the link rhythm: drop `leading-[2.15]`, add `flex items-center min-h-[44px]`.

**Edit table:**

| Line | Content | Edit |
|------|---------|------|
| 57 | `Products` link | Drop `leading-[2.15]` |
| 66 | `Field reports` link | Drop `leading-[2.15]` |
| 76 | `— pending —` placeholder | Drop `leading-[2.15]`; add `flex items-center min-h-[44px]` |
| 78 | Branch name list item | Drop `leading-[2.15]`; add `flex items-center min-h-[44px]` |
| 88 | `About` link | Drop `leading-[2.15]` |
| 89 | `Contact` link | Drop `leading-[2.15]` |

**Visual effect:**
- Link columns: zero change (the 44px container already exists; default line-height under 44px container looks identical to 2.15 line-height under 44px container).
- Branches column: grows from ~384px tall (12 items × 32px line-height) to **~528px** tall (12 items × 44px). +144px.
- Footer total height grows ~144px.
- Footer column rhythm becomes uniform — CATALOG, REPORTS, BRANCHES, COMPANY all at 44px-per-item.

**RTL/AR impact:** Direction-agnostic. `min-h`, `flex`, `items-center` all apply identically.

---

## What's NOT in scope

Per the audit's deliverable contract, every other item is its own future cycle:

- **A2** — wire `card-*-gap` orphan tokens (Phase 3 of audit fix order)
- **B1-B4** — horizontal primitive unification (the architectural decision — separate brainstorm)
- **C1, C2, C3, C5** — other nav/utility polish (Phase 5 of audit fix order)
- **D1, D3, D4, D5, D6** — other footer polish (Phase 5)
- **E1-E9** — section rhythm (Phase 4)

The "env-gate `SHOW_SCOPE_NOTE`" spec from `6857db1` is also still pending its own plan; it's unrelated to this batch and can ship independently.

## Testing strategy

Small, declarative changes. No new logic. Verification path:

1. **Build green:** `npm run build` succeeds, all 100 pages render. Required before claiming done.
2. **Tests stay green:** `npm test` — existing 94/94 must remain green. None of the touched files have tests pointed directly at them; expect no impact.
3. **Visual verification at 3 viewports:**
   - 1440px: home page h2 rhythm sitewide; footer column balance; UtilityBar height.
   - 1024px: same checks; verify footer at exactly the lg breakpoint where column 14 crowding is worst.
   - 375px: mobile — UtilityBar status pill visible and 44px+ tall; footer stacks; A3 gutter responsiveness verified.
4. **WCAG verification:** in devtools mobile emulation, hover the UtilityBar phone link — bounding box must be ≥44×44px.
5. **AR locale spot-check:** load `/ar/`, verify h2 rhythm in AR sections matches EN (token applies regardless of `dir`).

## Risk

- **Low** overall. Declarative changes only; no logic, no shared state, no architectural decisions.
- **Pre-flagged surprise:** A1 grows three home sections by 32-48px each. Visual change is real. User approved during brainstorming; flag again at end-of-implementation if the result reads worse than expected.
- **Recoverable:** Every change is a single-line revert if it turns out wrong.

## Definition of done

1. All 4 edits applied per the tables above.
2. Build green (100 pages).
3. Test suite green (94 tests).
4. Manual visual check at 1440 / 1024 / 375.
5. WCAG 2.5.5 verified on UtilityBar phone link.
6. Single commit on `feature/plan-7-world-reach`.
7. Audit doc cross-referenced from the commit message.

## Next step after this batch

Per the audit's recommended fix order, the next pick is **B1** — the horizontal-primitive root-cause refactor. That gets its own brainstorm. It is the biggest single-impact change in the audit and the only one that needs an architectural decision (Option α vs β: unify on `px-page-x` or unify on `stage-grid`).
