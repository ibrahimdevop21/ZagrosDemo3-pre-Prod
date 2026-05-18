# Sitewide responsiveness audit

**Date:** 2026-05-18
**Branch:** `feature/plan-7-world-reach`
**Trigger:** User reported `/products` "looks broken on mobile" and asked for a sitewide audit covering nav, body, filters, footer at every breakpoint.
**Method:** 4 parallel sonnet agents, one per lane (chrome / pages / filters / RTL). Each agent read in-scope files and produced ranked findings. This doc merges all 4 reports.

## TL;DR

**Three structural root causes** explain most of what the user is seeing:

1. **F-1 + F-2 — horizontal scroll on `/products` mobile.** `ProductsToolbar` has `min-w-[260px]` on its search row plus no `overflow-x: hidden` guard sitewide. At 360px the toolbar children can't shrink below their minimum content width, the row tries to be wider than the viewport, and the entire page horizontally scrolls. This is the literal cause of "broken on mobile."
2. **PG-1 + PG-2 — flat section padding tokens.** `--section-y` (144px) and `--head-to-content` (96px) have no responsive override. Every section eats 288px of vertical chrome at mobile — 36% of an 800px-tall phone, per section. The site reads as tall, cramped, and lifeless on phones. This affects **every page**, not just `/products`.
3. **RTL-1 → RTL-5 — RTL grid auto-placement collisions.** Wherever `<div lg:col-start-N>` shares a grid row with a sibling that has no `col-start`, RTL renders the two on top of each other (auto-placement runs from the physical right; `col-start-N` is physical-left-anchored). Affects `CompatibilityMatrix`, `ProductLinesTable`, `SeedDetail`, `PesticideDetail`, the fertilizer-detail header, `field-reports/[slug]`, and `ReportHero`. Arabic users see overlapping content on every product and field-report detail page.

Beyond these three, **57 findings total · 7 P0 · 31 P1 · 19 P2** across 4 lanes.

## Summary table — all findings ranked

| ID | Severity | Title | Affected viewport(s) |
|----|----------|-------|----------------------|
| **F-1** | P0 | Toolbar search row min-w-[260px] forces horizontal overflow | 360 / 390 / 414 |
| **F-2** | P0 | No `overflow-x: hidden` on body/html — body-level horizontal scroll | 360 / 390 / 414 |
| **F-3** | P0 | View-toggle "compact" mode is dead code (no `data-products-view-section` emitter) | All |
| **PG-5** | P0 | `ProductLinesTable` `<table>` has no `overflow-x-auto` wrapper | 360 / 390 / 414 |
| **CH-2** | P0 | MobileNavDrawer `lg:hidden` overridden by global CSS — can render on desktop | 1024+ |
| **RTL-1** | P0 | `CompatibilityMatrix` two col-span-6 panels overlap in RTL | 1024+ |
| **RTL-2** | P0 | `ProductLinesTable` heading overlaps table in RTL at lg+ | 1024+ |
| **PG-1** | P1 | `py-section-y` (144px) flat — no mobile reduction | 360 / 390 / 414 |
| **PG-2** | P1 | `mb-head-to-content` (96px) flat — no mobile reduction | 360 / 390 / 414 |
| **PG-3** | P1 | ByTheNumbersV3 numbers clamp produces excessive vertical stack on mobile | 360 / 390 |
| **PG-6** | P1 | `ApplicationRatesTable` has overflow-x-auto but no `min-width` — table cramps | 360 / 390 / 414 |
| **PG-7** | P1 | Field-report `[slug]` sidebar above article on mobile, no visual separator | 360 / 390 / 414 / 640 |
| **PG-9** | P1 | SeedDetail/PesticideDetail aside `p-sp-7` cramped at mobile | 360 / 390 / 414 |
| **PG-13** | P1 | WorldReach SVG renders only 144px tall at 360px — pins illegible | 360 / 390 |
| **PG-14** | P1 | WorldReach branches aside overflow risk for Arabic city names | 360 / 390 |
| **PG-18** | P1 | PartnerSpotlight `min-h-[420px]` inflates mobile card with empty space | 360 / 390 / 414 |
| **F-4** | P1 | Toolbar count `[data-products-count]` stuck at "14" (selector hits header span first) | All |
| **F-5** | P1 | `[data-products-sort]` select has no event handler — sort is dead | All |
| **F-6** | P1 | FilterDrawer `p-sp-7` leaves 220px content width at 360 — checkbox rows tight | 360 / 390 / 414 |
| **F-7** | P1 | SubcategoryGroup `h2 text-3xl` doesn't shrink at narrow widths | 360 / 390 |
| **F-8** | P1 | Card grid at 1024px renders 3-col with ~164px-wide cards — too cramped | 1024 |
| **F-9** | P1 | SeedCard inner `grid-cols-2` data table doesn't collapse to 1-col at small card sizes | 640 / mobile-card-context |
| **F-10** | P1 | FilterButton wrapper `flex lg:hidden` has no `w-full` | 360 / 390 / 414 |
| **F-11** | P1 | ProductsToolbar search `<label>` has no `min-w-0` — input can't shrink | 360 / 390 |
| **RTL-3** | P1 | Product-detail aside (`lg:col-start-9`) lands at RTL inline-start — wrong reading order | 1024+ |
| **RTL-4** | P1 | Field-report sidebar at RTL inline-start, article at inline-end — reversed reading order | 1024+ |
| **RTL-5** | P1 | ReportHero decorative issue number overlaps content in RTL | 1024+ |
| **RTL-6** | P1 | Nav active indicator uses `left-0 right-0` instead of `inset-x-0` | All RTL |
| **RTL-7** | P1 | 7+ components hardcode `→` arrow without locale gate | All AR |
| **CH-1** | P1 | UtilityBar phone link hidden 0-767px (`hidden md:flex`) — no mobile tap-to-call | 360 / 390 / 414 / 640-767 |
| **CH-3** | P1 | Footer colophon row no `flex-wrap` — overflow at narrow widths | 360 / 390 |
| **CH-5** | P1 | UtilityBar left span no truncation — Arabic wraps to 2 lines | 360 AR |
| **CH-6** | P1 | Footer newsletter input has no `min-w-0` — can shrink to zero behind submit button | 360 / 390 |
| **CH-9** | P1 | MobileNavDrawer nav links `text-3xl` overflow drawer at 360 with Arabic labels | 360 |
| **CH-4** | P2 | Nav active-state underline `left-0 right-0` (cosmetic logical-property nit) | All RTL |
| **CH-7** | P2 | CaptionStrip `flex justify-between` no `flex-wrap` | 360 / 390 |
| **CH-8** | P2 | Nav logo PNG loaded at 240px on mobile (perf, not layout) | 360-414 |
| **CH-10** | P2 | `--page-margin-x` dead zone at 640-767px (still 56px, no mid-step) | 640-767 |
| **PG-4** | P2 | ByTheNumbersV3 `sm:grid-cols-2` produces orphan stat | 640-1023 |
| **PG-8** | P2 | ReportHero large issue number desktop-only with no mobile substitute | 360-1023 |
| **PG-10** | P2 | Fertilizer detail aside mobile stacking OK but CompositionCard not audited | 360 |
| **PG-11** | P2 | WhyThisMatters `md:grid-cols-3` no `sm:` intermediate | 640-767 |
| **PG-12** | P2 | RelatedProducts / ReportsByPartner `md:grid-cols-3` tight at 768px | 768 |
| **PG-15** | P2 | About page sections no `max-w` on long-form text nodes | 360-414 |
| **PG-16** | P2 | Contact `DirectContact` phone dd may wrap at narrow | 360-414 |
| **PG-17** | P2 | CatalogStrips hero zone `min-h-[200px]` wastes space at mobile | 360 / 390 |
| **PG-19** | P2 | QuoteCTA footer line `justify-between` wraps awkwardly | 360 / 390 |
| **PG-20** | P2 | privacy/terms `pb-section-y` makes legal pages feel empty | 360 / 390 / 414 |
| **F-12** | P2 | FilterPills "Clear all" `ms-auto` placement awkward when pills wrap | 360 / 390 |
| **F-13** | P2 | ProductHero supplier pill no `truncate` — long brand names collide with bag badge | 360 / 390 |
| **F-14** | P2 | `BagMockup.astro` dead but kept — broken CSS var syntax could re-surface | All |
| **F-15** | P2 | FilterSidebar subcat label capitalization inconsistent with SubcategoryGroup | All |
| **RTL-8** | P2 | Drawer slide direction in RTL not animated — flag for future motion work | RTL mobile |
| **RTL-9** | P2 | QuoteCTA signal-bar `origin-left` no RTL override | RTL all |
| **RTL-10** | P2 | ReportHero hardcodes English "Issue" / "min read" labels | AR detail pages |
| **RTL-11** | P2 | FieldReportsTeaser hardcodes "REPORT ·" label | AR home |
| **RTL-12** | P2 | privacy/terms `lg:col-start-2` indents same physical side in both directions | AR legal |

**Totals: 57 findings · 7 P0 · 28 P1 · 22 P2.**

---

## Detailed findings — lane reports

### Lane: Chrome (CH-*)

10 findings on `Nav`, `UtilityBar`, `MobileNavDrawer`, `HamburgerButton`, `Footer`, `Breadcrumb`, `CaptionStrip`.

- **CH-1 (P1):** UtilityBar phone link `hidden md:flex` invisible on all 0-767px viewports. Sudan Android baseline (360px) has no top-bar tap-to-call. **Fix:** change to `hidden sm:flex` (exposes at 640+) and add an icon-only tap-to-call below `sm:`.
- **CH-2 (P0):** `MobileNavDrawer` has `class="lg:hidden ..."` on the `<dialog>`, but `global.css:143-146` declares `dialog[data-mobile-nav-drawer][open] { display: flex; }` with no breakpoint guard — the global rule overrides `lg:hidden` if the dialog gets opened on desktop. **Fix:** scope the global CSS to `@media (max-width: 1023px)`.
- **CH-3 (P1):** Footer colophon row `flex justify-between` with no `flex-wrap`. Two uppercase tracked spans at `text-[10.5px]` can't both fit at 360px (320px usable). **Fix:** add `flex-wrap gap-y-sp-3`.
- **CH-4 (P2):** `Nav.astro:57` active-link underline uses `left-0 right-0` instead of logical `inset-x-0`. Currently works but inconsistent with the codebase's logical-property discipline.
- **CH-5 (P1):** UtilityBar left span no truncation — Arabic locale wraps "السودان · الأحد–الخميس · ٨–٥" to two lines, pushes nav down. **Fix:** `truncate min-w-0 flex-1`.
- **CH-6 (P1):** Footer newsletter `flex gap-2` row has no `min-w-0` on the input — submit button can squeeze input to zero on narrow Arabic labels. **Fix:** `min-w-0` on input, `shrink-0` on button.
- **CH-7 (P2):** CaptionStrip no `flex-wrap` for long subLabel.
- **CH-8 (P2):** Nav logo `width="240"` PNG fetched at full size on mobile (perf, not layout). **Fix:** WebP/AVIF + srcset.
- **CH-9 (P1):** MobileNavDrawer nav links `text-3xl` (~30px) overflow drawer at 360 with long Arabic labels. Drawer content area is only ~220px wide. **Fix:** `text-2xl sm:text-3xl`.
- **CH-10 (P2):** `--page-margin-x` switches at 639px only. Dead zone 640-767px keeps 56px margins, which feels over-generous on tablet portrait.

### Lane: Pages (PG-*)

20 findings on home sections + inner pages + product detail components + partner/report sub-components.

**Structural / sitewide:**
- **PG-1 (P1):** `--section-y` (144px) flat — same value at every viewport. Across 8 home sections at 360px = 288px chrome per section. **Fix:** add `@media (max-width: 639px) { --section-y: 64px; }` to `tokens.css` (mirrors the existing `--page-margin-x` pattern).
- **PG-2 (P1):** `--head-to-content` (96px) same problem. **Fix:** add `@media (max-width: 639px) { --head-to-content: 40px; }`.

**ByTheNumbersV3:**
- **PG-3 (P1):** Big number `clamp(120px,22vw,280px)` = 79px at 360px. Combined with stacked smalls, the section is excessively tall. **Fix:** tighten clamp floors.
- **PG-4 (P2):** `sm:grid-cols-2` creates orphan fourth stat at 640-1023.

**Tables (P0/P1):**
- **PG-5 (P0):** `ProductLinesTable` has no `overflow-x-auto` wrapper. **Fix:** wrap the `<table>` in `<div class="overflow-x-auto">`.
- **PG-6 (P1):** `ApplicationRatesTable` has the wrapper but the `<table>` has no `min-width`. **Fix:** `min-w-[640px]` on the table so horizontal scroll actually engages.

**Detail pages:**
- **PG-7 (P1):** Field-report `[slug]` sidebar stacks above article on mobile with no visual separator. **Fix:** reverse order with `lg:order-first` on aside, or bg-tint mobile sidebar.
- **PG-8 (P2):** Issue number desktop-only — kicker text already has it, so no functional loss.
- **PG-9 (P1):** SeedDetail/PesticideDetail aside `p-sp-7` leaves only 168px inner width at 360. **Fix:** `p-sp-5 sm:p-sp-7`.
- **PG-10 (P2):** Fertilizer detail aside — verify `CompositionCard` internally.
- **PG-11/PG-12 (P2):** WhyThisMatters/RelatedProducts/ReportsByPartner jump from 1-col to 3-col with no `sm:` intermediate.

**Home sections:**
- **PG-13 (P1):** WorldReach SVG renders 144px tall at 360 (2:1 of 288px content width). Pins essentially invisible. **Fix:** `min-h-[180px]` on the SVG wrapper, or hide map below `sm:` and show only the branches list.
- **PG-14 (P1):** Branches aside three-column row may overflow with long Arabic city names. **Fix:** `truncate` on city name span.
- **PG-15 (P2):** About page sections no `max-w-prose` on text nodes — long lines at all widths.
- **PG-17 (P2):** CatalogStrips hero zone `min-h-[200px]` wastes space on mobile. **Fix:** `min-h-[160px] sm:min-h-[200px]`.
- **PG-18 (P1):** PartnerSpotlight `min-h-[420px]` is needed for `lg:row-span-2` alignment but inflates mobile with empty space.

**Misc:**
- **PG-16 (P2):** Contact DirectContact phone `dd` no `dir="ltr"` + nowrap.
- **PG-19 (P2):** QuoteCTA footer line `justify-between` wraps awkwardly — use `flex-col sm:flex-row`.
- **PG-20 (P2):** privacy/terms `pb-section-y` makes legal pages feel mostly empty — use `pb-sp-9`.

### Lane: Filters (F-*)

15 findings on the new unified products page. **This lane contains the root cause of the user's "broken on mobile" report.**

**Root cause (P0):**
- **F-1 (P0):** `ProductsToolbar` inner search row has `min-w-[260px]` + `flex-1`. At 360px the toolbar can't fit both the search and the sort+view-toggle groups; `flex-wrap` engages but the search group still demands 260px, exceeding the 320px content column. **Fix:** remove `min-w-[260px]`; let `flex-1` and `min-w-0` (see F-11) handle shrinking; restructure to stack vertically below `sm:`.
- **F-2 (P0):** No `overflow-x: hidden` on body or any layout wrapper. Any overflowing child causes body-level horizontal scroll. **Fix:** add `overflow-x: hidden` to body in `global.css`. Belt-and-suspenders: same on toolbar wrapper.
- **F-3 (P0):** View-toggle "compact" button does nothing. No component emits `[data-products-view-section]` attributes. **Fix:** either implement compact rendering or hide the toggle until built.

**Dead code (P1):**
- **F-4 (P1):** `[data-products-count]` exists twice (header span + hardcoded "14" in toolbar). FilterController uses `querySelector` (singular) — only the header span updates. Toolbar permanently shows "14". **Fix:** `querySelectorAll` + iterate; remove the hardcoded "14".
- **F-5 (P1):** `[data-products-sort]` has no event handler in FilterController. Sort dropdown is non-functional. **Fix:** add handler or hide the select.

**Mobile drawer cramping (P1):**
- **F-6 (P1):** FilterDrawer `p-sp-7` (48px) leaves only 220px content width on 360px. Long subcategory labels overflow. **Fix:** `p-sp-5 lg:p-sp-7`, or hide the line caption inside the drawer.

**Heading + grid (P1):**
- **F-7 (P1):** SubcategoryGroup `h2 text-3xl` (30px) doesn't shrink at 360. Long titles like "§ Water-soluble NPK · 5 SKUs" wrap awkwardly. **Fix:** `text-2xl sm:text-3xl` or `text-[clamp(20px,5vw,30px)]`.
- **F-8 (P1):** At exactly 1024px the card grid has only ~164px per card (260px sidebar + 96px gap + 3-col with 32px gaps). **Fix:** `lg:grid-cols-2 xl:grid-cols-3` to defer 3-col until 1280px.
- **F-9 (P1):** SeedCard inner `grid-cols-2` data table doesn't collapse — at 2-col card grid mid-breakpoint, inner data cells become unreadable. **Fix:** `grid-cols-1 sm:grid-cols-2` on the dl.

**Misc:**
- **F-10 (P1):** FilterButton wrapper `flex lg:hidden` no `w-full`.
- **F-11 (P1):** ProductsToolbar search `<label>` no `min-w-0` — search input can't shrink below its intrinsic width.
- **F-12 (P2):** FilterPills "Clear all" `ms-auto` placement awkward when pills wrap to multiple rows.
- **F-13 (P2):** ProductHero supplier pill no truncate — long brand names collide with BAG badge.
- **F-14 (P2):** Dead `BagMockup.astro` has broken CSS-var syntax. **Fix:** delete the file.
- **F-15 (P2):** FilterSidebar uses CSS `capitalize` ("Water Soluble Npk") vs SubcategoryGroup's `toUpperCase` ("WATER SOLUBLE NPK"). Inconsistent.

### Lane: RTL (RTL-*)

12 findings — a tight class of grid-collision bugs at lg+ (where multi-column layouts engage) plus a handful of hardcoded English strings.

**Root cause: grid auto-placement collides with `lg:col-start-N` in RTL.** (P0/P1):
- **RTL-1 (P0):** CompatibilityMatrix — first panel auto-placed (no col-start), second panel `lg:col-start-7`. In RTL, auto-placement runs from physical right, so both panels target cols 7-12. They overlap.
- **RTL-2 (P0):** ProductLinesTable — same pattern. `h2 col-span-5` (auto) + `div col-span-6 col-start-7` collide in RTL.
- **RTL-3 (P1):** SeedDetail/PesticideDetail/fertilizer detail header — aside `lg:col-start-9` always at physical right, which is RTL inline-START. Arabic readers see the spec aside before the product name.
- **RTL-4 (P1):** Field-report `[slug]` — aside auto-places at physical right (RTL inline-start), article at explicit col-start-5 (physical 5-11, partially overlapping). Reading order inverted.
- **RTL-5 (P1):** ReportHero decorative issue number auto-places at physical right, content at `col-start-4` — number overlaps headline.

**Fix pattern for RTL-1 through RTL-5:** stop mixing auto-placed and explicit `col-start-N` siblings in the same grid row. Either:
- Pin both children with explicit column starts: `lg:col-start-1` + `lg:col-start-7` (LTR-style), accept the LTR/RTL symmetry (column 1 in LTR = right in RTL is acceptable for symmetric layouts).
- Wrap in a nested `lg:grid-cols-2` subgrid where both children are auto-placed and CSS handles the direction automatically.
- Use `rtl:` Tailwind variants (`lg:col-start-7 rtl:lg:col-start-1`) to mirror starts.

**Hardcoded EN strings (P1/P2):**
- **RTL-7 (P1):** 7+ components hardcode `→` for "view" links without locale gate. Affected: ReportCard, PartnerCard, ProductCardCompact, FertilizerCard, SeedCard, PesticideCard, CompositionCard, PartnerSidePanel, ContactForm. **Fix:** move arrow into the translation string (`common.view_arrow` = `→` en / `←` ar).
- **RTL-10 (P2):** ReportHero hardcodes "Issue" + "min read".
- **RTL-11 (P2):** FieldReportsTeaser hardcodes "REPORT ·".

**Smaller items:**
- **RTL-6 (P1):** Nav active indicator `left-0 right-0` should be `inset-x-0`.
- **RTL-8 (P2):** Drawer slide direction not animated; flag for future motion work.
- **RTL-9 (P2):** QuoteCTA signal-bar `origin-left` has no RTL override (hero progress dots do — pattern exists).
- **RTL-12 (P2):** privacy/terms `lg:col-start-2` indents same physical side in both directions.

---

## Recommended fix order

**Phase 1 — Stop the bleeding (the user's actual report):** F-1, F-2. ~3 line edits in `ProductsToolbar.astro` and `global.css`. Mobile horizontal scroll on `/products` stops. **Ship first, verify in browser before anything else.**

**Phase 2 — Sitewide mobile-rhythm fix:** PG-1, PG-2. Two lines in `tokens.css` adding `@media (max-width: 639px)` overrides for `--section-y` and `--head-to-content`. Every page on mobile suddenly feels right.

**Phase 3 — RTL grid-collision class fix:** RTL-1, RTL-2, RTL-3, RTL-4, RTL-5. Same pattern across 5+ components. Best handled as one coherent batch.

**Phase 4 — Dead code + broken features:** F-3 (hide view-toggle), F-4 (fix count selector), F-5 (hide or implement sort), F-14 (delete BagMockup). Quick wins, no architecture.

**Phase 5 — Table accessibility on mobile:** PG-5 (overflow wrapper), PG-6 (min-width on table).

**Phase 6 — Chrome polish:** CH-2 (drawer CSS conflict), CH-1 (mobile phone tap-to-call), CH-6 (newsletter min-w-0), CH-9 (drawer text size), CH-3 (footer colophon wrap), CH-5 (utility bar truncate).

**Phase 7 — Hero/section padding fine-tuning:** PG-3 (numbers clamp), PG-13 (WorldReach SVG mobile), PG-14 (branches truncate), PG-18 (PartnerSpotlight min-h), PG-7 (field-report sidebar mobile order).

**Phase 8 — Filter polish:** F-6 (drawer padding), F-7 (group h2 size), F-8 (3-col→2-col at lg), F-9 (SeedCard inner grid), F-10/F-11 (toolbar plumbing).

**Phase 9 — RTL strings + small fixes:** RTL-6, RTL-7, RTL-9, RTL-10, RTL-11, RTL-12, CH-4.

**Phase 10 — P2 polish wave:** Everything else not yet closed.

**Recommended quickest visible win:** Phase 1 + Phase 2 together (~5 line edits). Closes the user-reported bug AND immediately makes every page feel native on mobile.

---

## Cross-references and dependencies

- **F-1 → F-2:** Even after F-1 (removing `min-w-[260px]`), the `overflow-x: hidden` guard in F-2 is the safety net for any other component that overflows. Ship together.
- **PG-1 → PG-2:** Both edit the same `tokens.css` block. Ship together.
- **RTL-1 → RTL-5:** Same root cause, same fix pattern. Plan as one batch.
- **F-3 → F-5:** Both about features that don't work. Same commit "Phase 4 — disable dead toolbar features".
- **F-11 → F-1:** F-11 (`min-w-0` on label) is the structural fix that makes F-1's removal of `min-w-[260px]` actually flexible. Both belong to Phase 1.
- **PG-5 + PG-6:** Both about tables. Ship together.

---

## Out of scope

- The `ProductCardCompact.astro` dead file (still emits unprefixed subcategory; confirmed unused — see motion-system commits for history).
- Image optimization (CH-8) — performance audit, separate concern.
- Animation polish — covered by the motion system audit closed in `1d94db8` and `4dd37f9`.
- Color/theme audit — separate concern.

---

## Definition of done for this audit

This doc itself is the deliverable. The audit is "done" when:
1. User reads the punch list above.
2. User picks fixes (single item, phase, or batch).
3. Each pick runs through its own brainstorm → spec → plan → implement cycle.

**Recommended user starting point:** "ship Phase 1 + Phase 2 today" — closes the user-reported bug + makes every page feel native on mobile in 5 line edits.
