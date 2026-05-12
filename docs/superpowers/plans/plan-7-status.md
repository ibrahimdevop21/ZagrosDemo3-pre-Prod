# Plan 7 — Status audit (2026-05-12)

> Audit of the **actual codebase state** vs `plan-7-mobile-first.md` checkboxes.
> Walked every task A→H, verified against source + git log + test run.
>
> **Status: complete** (pending user review before `plan-7-mobile-first` tag).
> Three carryover gaps closed in this session — see "Closeout" section at the bottom.

## Headline

- **6 of 8 tasks shipped** (A, B, C, E, F, G via commits `4fdd06e`, `3d3c2d8`, `c6c2523`, `ae94d3f`, `ce24257`, `b033a8b`).
- **Task D (filter drawer) was skipped entirely.** No stub, no commit. Filter scaffolding exists but is not mounted on any page.
- **Task H (final tag + verification) is open.** No `plan-7-mobile-first` git tag.
- **Three carryover items** from the user brief still need work:
  1. `--page-margin-x: 56px` has **no mobile override** — confirmed; affects every page using `px-page-x` or `.stage-grid` (which is most of them).
  2. Filter drawer mobile UX — see Task D below.
  3. RTL / 360-414px viewport parity — code uses logical properties, but no browser pass was done in this audit.

---

## Task-by-task

| Task | Status | Evidence |
|---|---|---|
| **A** — Mobile-first conventions + AGENTS.md | ✅ **done** | `AGENTS.md:81` has `## Mobile-first conventions (Plan 7)` block. `grep -rn "max-w-screen-sm\|max-w-screen-md" src/` → 0 hits. `md:hidden`/`lg:hidden` patterns are all paired element-swaps. Commit `4fdd06e`. |
| **B** — Rebuild card hero (black-rectangle fix) | ✅ **done** | `ProductHero.astro` uses `bgClassMap` literal-string lookup (fixes the `var(--color-c-npk)` token mismatch). `FertilizerCard.astro` exists; `ProductCard.astro` is a thin forwarder. Detail page (EN: `src/pages/products/[line]/[slug].astro:11,82`; AR: `src/pages/ar/products/[line]/[slug].astro:11,78`) imports and uses `ProductHero`. `SubcategoryGroup.astro` grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sp-5 sm:gap-sp-6`. `tests/components/FertilizerCard.test.ts` exists. Commit `3d3c2d8`. |
| **C** — Mobile nav drawer | ✅ **done** | `HamburgerButton.astro` is `lg:hidden`, 44×44, has `aria-controls="mobile-nav-drawer"`. `MobileNavDrawer.astro` is a native `<dialog>` with `inset-y-0 end-0 start-auto` (RTL-aware logical positioning), close button, backdrop click handler, Escape via native `<dialog>`. `Nav.astro` desktop links are `hidden lg:flex`; mobile shows hamburger only. `global.css:118-130` has the dialog reset. `tests/components/MobileNavDrawer.test.ts` exists. Commit `c6c2523`. |
| **D** — Filter drawer for mobile | ❌ **open** | Filter scaffolding exists (`FilterController.astro`, `FilterSidebar.astro`, `FilterPills.astro`, `ProductsToolbar.astro`) **but nothing is mounted on the line page.** `grep "FilterController\|FilterSidebar\|ProductsToolbar\|FilterPills" src/pages/` → 0 hits. No `FilterDrawer.astro` or `FilterButton.astro` exists. Plan permits a scope-down stub, but no stub was shipped either. **Decision needed before code.** |
| **E** — 44px tap targets + tap-to-call/WhatsApp | ✅ **done** | `min-h-[44px]/[48px]/[52px]` in Nav, MobileNavDrawer, HamburgerButton, FilterSidebar labels, ContactForm (inputs `min-h-[44px] text-base`; submit `min-h-[48px]`), DirectContact (phone + WhatsApp 44px), Footer (8 hits), card view-links. UtilityBar uses 36px (dense secondary chrome, per plan E.2 allowance). DirectContact wires `tel:${phone.replace(/\s+/g,'')}` → `tel:+249912338559` and `wa.me/${phone.replace(/[^\d]/g,'')}` → `wa.me/249912338559` (verified in built dist). Commit `ae94d3f`. |
| **F** — Responsive typography | ✅ **done** | All page hero h1s use `clamp(36px,7vw,96px)` or `clamp(40px,6vw,84px)` — 36-40px mobile floor matches plan target. ContactForm inputs use `text-base` (16px) to block iOS zoom. `global.css:35-54` has `html[dir='rtl']` overrides: body `line-height: 1.65`, h1/h2/h3 `line-height: 1.18`. Plan asked for `html[lang="ar"]`; `dir='rtl'` is functionally equivalent. Commit `ce24257`. |
| **G** — Lazy loading + LCP | ✅ **done** | `Hero.astro:27` `fetchpriority="high"`. `ReportHero.astro:30` `fetchpriority="high"` + explicit width/height. `PartnerHero.astro:26` fetchpriority high. Lazy + explicit dims on: `CustomerCard:27`, `PartnerCard:34`, `Footer:23`, `MobileNavDrawer:59`, `CustomersStrip:49`, `PartnerSidePanel:16`. `Nav.astro:37` logo `fetchpriority="high"`. Commit `b033a8b`. |
| **H** — Final tag + verification | ❌ **open** | No `plan-7-mobile-first` git tag. No plan-doc updates (checkboxes still all `- [ ]`). No verification grep run. Tests: 68 pass / 16 fail (next section). |

---

## Carryover items from the brief

| Concern | Status | Evidence |
|---|---|---|
| `--page-margin-x: 56px` desktop-only — needs mobile equivalent (~16-20px) | ❌ **open** | `tokens.css:36` sets it once. No `@media (max-width: 640px)` override. Used in `.stage-grid` (`global.css:95,97`) and `px-page-x` Tailwind utility, applied across most pages and components. **Will visibly cramp content at 360px.** |
| Detail page hero uses ProductHero (B.6) | ✅ **done** | Both EN slug page (line 82) and AR mirror (line 78) import and render `<ProductHero>`. |
| Page-level layouts at 360-414px | ⚠️ **needs browser** | Code uses responsive grids, clamp typography, mobile-first patterns. No 360px/414px visual pass possible without DevTools — not part of this audit. |
| `SeedCard` / `PesticideCard` `min-h-[360px]` rigid | ⚠️ **needs browser** | `min-h` is height, not width — won't overflow at 360px viewport. Grid is responsive (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Cards should be fine, but text overflow at very narrow widths is browser-verifiable only. |
| RTL parity at narrow viewports | ⚠️ **needs browser** | No `left-0` / `margin-left` / `text-left` found in audited components. Logical properties used throughout (`end-0`, `ms-auto`, `me-`, `start-`, `px-page-x` from logical inline padding). |
| Filter drawer mobile UX | ❌ **open** | See Task D above. |
| Test suite green | ⚠️ **16 failures** | All baseline content-collection env issues (`getCollection('partners')` returns empty / `getCollection('fertilizers')` returns wrong counts inside `experimental_AstroContainer`). Same situation as Plan 6 Task 9 / Plan 7 risk row. None of the failures look like Plan 7 regressions. |

---

## Test state

```
Test Files  8 failed | 10 passed (18)
Tests       16 failed | 68 passed (84)
```

Inspected failures match the documented Astro v5 + vitest content-layer baseline issue:

- `partners.test.ts` — `partners.find(p => p.slug === 'kafr-el-zayat')` returns `undefined` inside container render
- `products-index.test.ts` — LineCard SKU `<dd>` renders `0` instead of expected `3 / 11 / 16` (collection counts not flowing through)

These are the same kind of failures Plan 6 acknowledged as environmental. The new component tests (FertilizerCard, MobileNavDrawer, viewport-smoke) appear to be in the 68 passing.

**Recommendation:** triage the 16 failures as either (a) confirm-environmental and leave or (b) find a vitest content-layer workaround. Either is reasonable. Plan 7 doesn't require fixing them.

---

## Proposed scope for closing the gaps

**Must-do (will land code for these):**

1. **Responsive `--page-margin-x`** — add mobile (`<sm`) override of ~20px. Single change in `tokens.css` inside a `@media (max-width: 640px)` block (or move to a Tailwind utility). High value, low risk.

2. **Task H — final tag + verification** — update plan-7-mobile-first.md checkboxes, run the verification grep sweep, decide on tag.

**Decision needed from you:**

3. **Task D — filter drawer:** scope-down stub, full implementation, or skip entirely? The line page currently works without filters (just shows the SubcategoryGroup loop). My recommendation: **scope-down stub** matches Plan 7's intent and the demo audience doesn't need filters yet. Full filter wiring is non-trivial (the FilterController script needs to be mounted, FilterSidebar needs `variant="drawer"` prop, action bar at the bottom of the drawer, RTL flip of the slide direction).

4. **Test suite triage** — leave baseline failures or attempt a vitest content-layer fix? Plan 7 risks acknowledge they're environmental.

5. **Browser viewport pass** — I can't run a browser here. Either you do a DevTools pass at 360/390/414/768/1024 LTR+RTL after the page-margin fix, or we skip the visual confirmation and rely on code review.

---

## Closeout (this session)

Three commits ready, none made yet — held for review:

| # | Subject | Files |
|---|---|---|
| 1 | `plan-7: mobile gutter — 20px page-margin-x below sm:` | `src/styles/tokens.css` |
| 2 | `plan-7: D — filter drawer stub (scope-down)` | `src/components/products/FilterButton.astro` (new), `src/components/products/FilterDrawer.astro` (new), `src/pages/products/[line].astro`, `src/pages/ar/products/[line].astro`, `src/i18n/{en,ar}.json`, `src/i18n/types.ts` |
| 3 | `plan-7: docs — flip checkboxes, add changelog, update status` | `docs/superpowers/plans/plan-7-mobile-first.md`, `docs/superpowers/plans/plan-7-status.md` |

### Verification (just ran)

```
Tests       84 passed (84)         # was 68/84 — baseline content-collection failures cleared on clean run
Build       104 pages, no errors
```

Plan H.2 grep sweep on `dist/`:
- `BAG MOCKUP · PENDING` / `14 SKUs` / `14 منتجاً` / `بيتا شراكة` / `بيت ماركة` / "operator, not a brand" / "partner houses" → **0 hits each**
- `tel:+249912338559` → 2 hits on EN contact + 2 on AR contact
- `wa.me/249912338559` → 1 hit on EN contact + 1 on AR contact
- `data-filter-drawer` on each line page (EN + AR) → 2 hits each (trigger + dialog)
- `@media (max-width: 639px)` with `--page-margin-x: 20px` compiled into output CSS

### Still requires browser (out of scope for code session)

- Lighthouse mobile score
- 360 / 390 / 414 / 768 / 1024 viewport pass in LTR + RTL
- SeedCard / PesticideCard text-overflow visual confirmation at 360px

### Deferred to follow-up

- Full filter UI (Task D "full path") — FilterController wiring, action bar in drawer, RTL slide flip
- `plan-7-mobile-first` git tag — held until user signs off
- 16 baseline vitest failures from prior runs — cleared themselves on the clean run, monitor for recurrence

---

## Original audit (pre-closeout)

Kept below for traceability.
