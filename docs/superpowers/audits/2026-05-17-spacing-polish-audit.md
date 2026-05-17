# Spacing + nav + footer polish audit

**Date:** 2026-05-17
**Branch:** `feature/plan-7-world-reach`
**Spec:** `docs/superpowers/specs/2026-05-17-spacing-polish-audit-design.md`
**Tests at start:** 94/94 passing. Build: 100 pages clean.

## TL;DR

The user's complaint that *"spacing/margins/padding/whitespace looks off all over the website"* has one dominant root cause and several smaller polish wounds. Fixing **B1** (horizontal primitive split) plus **A1-A3** (token coherence) closes ~70% of the visual problem. The rest are individual P1 polish items.

**Root cause of the alignment break:** Nav uses `px-page-x` (a Tailwind literal frozen at 56px) while Footer + every inner-page body section uses `.stage-grid` with `col-start-2` (which resolves to `var(--page-margin-x)`, a responsive 56/20px value — *and* 1fr-expanding at wide viewports). The two primitives only line up at one exact viewport width by coincidence; everywhere else, nav and body content sit at different horizontal positions. The same page (`about.astro`, `products/[line].astro`, etc.) mixes the two primitives in its own header vs body, so the misalignment is *intra-page*, not just nav-vs-footer.

---

## Summary table

| ID  | Lane | Sev | Title |
|-----|------|-----|-------|
| **A1** | Token | **P0** | `head-to-content` token defined but never used — `mb-sp-9` hardcoded everywhere |
| **A2** | Token | P1 | `card-{photo,kicker,head,summary}-gap` tokens — 4 orphans in tailwind config, 0 usages |
| **A3** | Token | **P0** | Tailwind `page-x: '56px'` is a static literal, divorced from the responsive `--page-margin-x` CSS variable |
| **B1** | Align | **P0** | Two competing horizontal primitives: `px-page-x` (Nav, all home sections) vs `.stage-grid col-start-2` (Footer, all inner-page bodies) — they only line up by coincidence at one viewport width |
| **B2** | Align | P1 | Home sections all use `px-page-x` so the home page is internally consistent — but jumps to Footer's stage-grid gutter at the section/footer seam |
| **B3** | Align | **P0** | Inner pages mix BOTH primitives in a single page: header in `px-page-x`, body sections in `stage-grid col-start-2`. Confirmed on `about`, `products/index`, `products/[line]`, `partners/[slug]`, `field-reports/index`, `contact` |
| **B4** | Align | P1 | Product/field-report DETAIL pages use `stage-grid` end-to-end → self-consistent but offset from Nav |
| **B5** | Align | P1 | Mobile (<640px) makes B1-B3 worse: `px-page-x` is 56px static while `--page-margin-x` is 20px — a 36px split |
| **C1** | Nav | P1 | Nav vertical padding `py-sp-4` (16px) — editorial magazine masthead norm is 20-24px |
| **C2** | Nav | P1 | Lang toggle `min-h-[40px]` ≠ CTA `min-h-[44px]` — desktop nav has two different touch-target heights side by side |
| **C3** | Nav | P2 | Lang toggle `px-3.5 py-2`, CTA `px-4 py-2.5` — arbitrary literals, no token use |
| **C4** | Nav | **P0** | UtilityBar phone link `min-h-[36px]` fails WCAG 2.5.5 (44px minimum touch) |
| **C5** | Nav | P2 | UtilityBar `py-2.5` literal (10px) — visually compressed strip |
| **D1** | Foot | P1 | `pt-section-y pb-sp-7` — 144 top / 48 bottom asymmetry; 48px isn't on the documented 144/96/64/40 scale |
| **D2** | Foot | P1 | Six `leading-[2.15]` arbitrary values to fake 44px touch height on 15px text |
| **D3** | Foot | P2 | Newsletter form: `mb-3`, `px-3.5 py-3`, `px-5 py-3` — all raw literals |
| **D4** | Foot | P1 | Colophon row `mt-sp-9 pt-sp-5` (120px combined gap before colophon) — too much air after a 144px section top |
| **D5** | Foot | P1 | Footer `col-start-{7,9,11,13}` lays out 4 columns from col 7 to col 14 — at 1024px viewport the rightmost column hits the trailing gutter with no breathing room |
| **D6** | Foot | P2 | Branch list `font-sans text-[15px]` matches the link list verbatim — footer reads as one uniform weight |
| **E1** | Rhythm | **P0** | h2 → content spacing inconsistent: `mb-sp-9` (96px) in Catalog/Partners/Reports, `mb-sp-7` (48px) in Customers/QuoteCTA, `mb-sp-8` (64px) in WorldReach. Should canonize on `head-to-content` (A1) |
| **E2** | Rhythm | P1 | `py-section-y` used on 28 sections — DESIGN.md §99 explicitly bans monotonous padding. ByTheNumbersV3 already varies with `py-sp-9 lg:py-sp-10`; pattern should propagate |
| **E3** | Rhythm | P1 | Hero `pb-sp-6` (32px) → OpsTickerMarquee `py-3` (12px) — the marquee feels glued to the hero |
| **E4** | Rhythm | P2 | OpsTickerMarquee `py-3` literal — at 12px vertical the band is borderline cramped |
| **E5** | Rhythm | P2 | CaptionStrip `py-4` literal — same value as `sp-4` but raw, breaks token discipline |
| **E6** | Rhythm | P1 | Hero `pt-sp-7 pb-sp-6` (48/32) — uneven vertical breathing inside the hero |
| **E7** | Rhythm | P2 | QuoteCTA (`py-section-y-major` 200px) → Footer (`pt-section-y` 144px) seam = 344px of vertical between CTA content and footer content |
| **E8** | Rhythm | P1 | Card padding inconsistent: `p-sp-4` (Partners tile), `p-sp-5` (most), `p-sp-5 sm:p-sp-6` (Catalog, FieldReports featured). No `card-padding` token |
| **E9** | Rhythm | P2 | Card-internal vertical rhythm varies: Catalog `gap-sp-4`, FieldReports uses individual `mb-sp-2/3`, Customers logo tile `p-sp-3` — drift from documented `card-*-gap` tokens (which are all orphaned per A2) |

**29 findings · 6 P0 · 14 P1 · 9 P2.**

---

## Detailed findings

### Lane A — Token coherence

#### A1. `head-to-content` token defined, zero usage (P0)

**Evidence:**
- `tailwind.config.mjs:52` defines `'head-to-content': '96px'`.
- `DESIGN.md:90` documents it as "Section h2 to first child".
- Grep `head-to-content` across `src/` returns **zero matches**.
- Every section component hardcodes the h2 gap differently: `mb-sp-9` (Catalog, Partners, FieldReports), `mb-sp-7` (Customers, QuoteCTA), `mb-sp-8` (WorldReach).

**Proposed fix:** Replace `mb-sp-9` → `mb-[head-to-content]` (or rename the utility to `mb-head` for ergonomics) in every section h2. Fixes E1 simultaneously.

**Files:** `CatalogStrips:38`, `PartnersSection:34`, `FieldReportsTeaser:46`, `CustomersWall:29`, `QuoteCTA:27`, `WorldReach:91`.

---

#### A2. `card-*-gap` token quartet — 4 orphans (P1)

**Evidence:**
- `tailwind.config.mjs:53-56` defines `card-photo-gap`, `card-kicker-gap`, `card-head-gap`, `card-summary-gap`.
- Grep across `src/` returns **zero matches** for all four.
- Card components use ad-hoc values: Catalog hero `mt-sp-2`, Catalog body `gap-sp-4`, FieldReports `mb-sp-3` / `mb-sp-2`, WorldReach credentials `gap-sp-3`.

**Proposed fix:** Either (a) wire the tokens into a `<Card>` primitive and migrate all card-shaped components to it, or (b) delete the orphan tokens. Current state is the worst of both — documented intent + zero enforcement.

**Recommended:** (a). The tokens exist because the design spec had a thesis. Wiring them is one component + ~6 component updates.

---

#### A3. Static Tailwind `page-x` vs responsive `--page-margin-x` (P0)

**Evidence:**
- `tokens.css:37` defines `--page-margin-x: 56px;` with a media-query override to `20px` below 640px (`tokens.css:42-46`).
- `tailwind.config.mjs:57` defines `'page-x': '56px'` as a **static literal**.
- The two values are independent. `px-page-x` always resolves to 56px regardless of viewport; only `.stage-grid` (which uses `var(--page-margin-x)` directly) responds to the breakpoint.

**Proposed fix:** Replace tailwind config `'page-x': '56px'` with `'page-x': 'var(--page-margin-x)'`. Restores the responsive intent. Single-line change. Unblocks B5.

**File:** `tailwind.config.mjs:57`.

---

### Lane B — Horizontal alignment (priority concern)

#### B1. Two competing horizontal primitives (P0 — root cause)

**Evidence:**
| Primitive | Used by | Resolves to |
|-----------|---------|-------------|
| `px-page-x` | Nav, UtilityBar, Breadcrumb, CaptionStrip, **all 9 home sections**, all inner-page headers, all listing-page sections | 56px static (today) / `var(--page-margin-x)` after A3 |
| `.stage-grid col-start-2 col-span-12` | Footer, all inner-page **body** sections, all product/report detail components | First column of a `minmax(var(--page-margin-x), 1fr) repeat(12, 1fr) ...` grid — collapses to `--page-margin-x` at narrow viewports but **expands as 1fr at wide viewports**, sitting inboard of the gutter |

At 1400px viewport: each 1fr ≈ 77px. So stage-grid content starts ~77px from the edge while `px-page-x` content starts at 56px. **~21px misalignment at desktop, growing at wider viewports.** This is what the user is seeing.

**Proposed fix:** Pick one primitive sitewide. Two options:

- **Option α — unify on `px-page-x`** (simpler, less rework). Replace Footer's `.stage-grid col-start-2` with `px-page-x` + an internal `grid grid-cols-12 gap-6` for the column structure. Same for all inner-page body sections. Drop stage-grid as the section-level primitive; keep it (if at all) as an internal layout helper.
- **Option β — unify on `stage-grid`** (closer to design spec intent, more rework). Make every chrome element (Nav, UtilityBar, etc.) live inside a `.stage-grid > col-start-2 col-span-12` wrapper. Bigger change but matches the editorial grid thesis.

**Recommended:** **α**. The stage-grid's 1fr-expansion behavior is itself the bug — at wide viewports it stops feeling like a gutter and starts feeling like a column. `px-page-x` is the simpler, more predictable mental model. Editorial gutters at 56/20px responsive (after A3) are enough; the 12-col internal grid can be opt-in inside sections that need it.

**Caveat:** This is a sitewide refactor and needs its own brainstorm → spec → plan cycle. Estimated ~25 file edits. The fix itself is small per file but the surface is wide.

---

#### B2. Home page internally consistent, footer seam breaks (P1)

**Evidence:** All 9 home sections + Nav + UtilityBar use `px-page-x`. The home page reads as horizontally coherent **until** the footer renders, where content jumps inward by ~21px (desktop) or 36px (mobile, see B5).

**Proposed fix:** Falls out of B1 fix. No separate work.

---

#### B3. Inner pages mix both primitives in one page (P0)

**Evidence:** Confirmed on:

| Page | Header primitive | Body primitive |
|------|------------------|----------------|
| `about.astro:19-23` | `px-page-x` | `stage-grid + col-start-2` (lines 26-80) |
| `products/index.astro:38-41` | `px-page-x` | `px-page-x` ✓ self-consistent |
| `products/[line].astro:62-70` | `px-page-x` | `px-page-x` ✓ self-consistent |
| `field-reports/index.astro:15-19` | `px-page-x` | `px-page-x` ✓ self-consistent |
| `contact.astro:16-20` | `px-page-x` | `px-page-x` ✓ self-consistent |
| `partners/[slug].astro:24` | `px-page-x` | stage-grid inside `ProductLinesTable`, `ReportsByPartner` |
| `field-reports/[slug].astro` | (uses ReportHero — stage-grid) | stage-grid throughout |
| `products/[line]/[slug].astro` | stage-grid | stage-grid throughout |

So `about.astro` and `partners/[slug].astro` have *visible internal misalignment* on the same page. The other listing pages are self-consistent but break at the footer (B2).

**Proposed fix:** Falls out of B1 fix. The about page in particular looks broken today.

---

#### B4. Detail pages self-consistent but offset from chrome (P1)

**Evidence:** `products/[line]/[slug].astro` and `field-reports/[slug].astro` use stage-grid for header + body. They're internally clean but Nav (px-page-x) sits 21-36px out from the article body. Reads as the article being inset from the masthead.

**Proposed fix:** Falls out of B1 fix.

---

#### B5. Mobile (<640px) widens the alignment break (P1)

**Evidence:** Below 640px, `--page-margin-x: 20px` but `px-page-x: 56px` (until A3 is fixed). Result on mobile: nav is 36px inset from body. After A3, both resolve to 20px and the mobile split closes — but the desktop 1fr-expansion split (B1) remains.

**Proposed fix:** Fix A3 first (closes the mobile gap immediately), then B1 (closes the desktop gap).

---

### Lane C — Nav internal polish

#### C1. Nav padding tight (P1)

**Evidence:** `Nav.astro:30` — `py-sp-4` is 16px. Editorial magazine mastheads (NYT, NYRB, Apartamento) sit at 20-24px vertical. The site's editorial thesis (DESIGN.md §1) wants the masthead to read as a publication, not as a SaaS top bar.

**Proposed fix:** `py-sp-4` → `py-sp-5` (24px). 1-line change.

---

#### C2. Touch-target inconsistency in desktop nav (P1)

**Evidence:** `Nav.astro:66` lang toggle `min-h-[40px]`, `Nav.astro:72` CTA `min-h-[44px]`. The two pills sit side by side and visibly differ in height.

**Proposed fix:** Standardize on 44px. Change lang toggle to `min-h-[44px]`. The button copy is small (`text-[11px]`) so 44px is generous — fine.

---

#### C3. Nav pill paddings arbitrary (P2)

**Evidence:** `Nav.astro:66` lang toggle `px-3.5 py-2`, `Nav.astro:72` CTA `px-4 py-2.5`, `MobileNavDrawer:88` lang toggle `px-3.5 py-2.5`. Three different paddings for what should be the "nav pill" surface.

**Proposed fix:** Define a `<NavPill>` component or just standardize all to one padding (e.g., `px-sp-4 py-sp-3` = 16px/12px). Quick.

---

#### C4. UtilityBar phone link fails WCAG 2.5.5 (P0)

**Evidence:** `UtilityBar.astro:18` — `min-h-[36px]`. WCAG 2.5.5 Target Size (AAA) requires 44×44. The tap-to-call from UtilityBar is the dominant top-of-page conversion path per the project's contact-strategy thesis.

**Proposed fix:** `min-h-[36px]` → `min-h-[44px]`. May require also adjusting the UtilityBar's overall `py-2.5` to accommodate; the link is in a 10px-vertical strip currently. Either grow the strip to `py-sp-3` (12px → 38px total inc. text) or move the phone link to its own row.

**Recommended:** Bump UtilityBar to `py-sp-3` *and* keep the link at `min-h-[44px]` — the link will overflow its parent strip vertically but that's invisible because the strip has no overflow clipping. Cleanest: just enlarge the strip to `py-sp-4` (16px → 44+ total) and keep the link at 44.

---

#### C5. UtilityBar uses `py-2.5` literal (P2)

**Evidence:** `UtilityBar.astro:12` — `py-2.5`. Equivalent to 10px. Not on the documented scale (`sp-1`=4, `sp-2`=8, `sp-3`=12).

**Proposed fix:** Use `py-sp-3` (12px) or `py-sp-4` (16px) — see C4. No literal.

---

### Lane D — Footer internal polish

#### D1. Asymmetric footer padding (P1)

**Evidence:** `Footer.astro:14` — `pt-section-y pb-sp-7` = 144/48px. The 48px isn't on the documented scale (144/96/64/40 per DESIGN.md §82). The footer feels top-heavy and the colophon row hugs the page bottom.

**Proposed fix:** Either `pt-section-y pb-sp-8` (144/64 — symmetric-ish on the scale) or `pt-sp-9 pb-sp-8` (96/64 — full scale rhythm). The latter also addresses E7 (CTA→footer seam too tall).

**Recommended:** `pt-sp-9 pb-sp-8` (96/64). Pulls the footer up, restores rhythm.

---

#### D2. `leading-[2.15]` hack for touch targets (P1)

**Evidence:** `Footer.astro:57, 66, 76, 78, 88, 89` — six lines use `leading-[2.15]` to inflate 15px text to ~32px line-height, then `min-h-[44px]` (where present) handles the rest. The branch list items (lines 76, 78) use `leading-[2.15]` without `min-h-[44px]` — they don't have anchors so touch targets don't apply.

**Proposed fix:** For the *link* list items (57, 66, 88, 89): keep `min-h-[44px]` from `inline-flex items-center`, drop `leading-[2.15]`, restore a normal line-height. For the *non-link* items (76, 78): drop `leading-[2.15]` entirely — these are static text, no touch target reason.

The 2.15 leading was a workaround for "link too tall for 1.5 line-height to hit 44px"; it's not needed once the parent has `inline-flex items-center min-h-[44px]`.

---

#### D3. Newsletter raw literals (P2)

**Evidence:** `Footer.astro:33` `mb-3`, `:40` `px-3.5 py-3 min-h-[44px]`, `:44` `px-5 py-3 min-h-[44px]`. Five distinct literal values in one form.

**Proposed fix:** Replace with `mb-sp-3`, `px-sp-4 py-sp-3`, `px-sp-5 py-sp-3`. Visually identical, token-correct.

---

#### D4. Excess gap before colophon (P1)

**Evidence:** `Footer.astro:93` — `mt-sp-9 pt-sp-5` = 96 + 24 = 120px between the column block and the colophon row. With the footer's `pt-section-y` (144px) and `pb-sp-7` (48px), the bottom 120px feels like dead air.

**Proposed fix:** `mt-sp-7 pt-sp-5` (48 + 24 = 72px) or `mt-sp-8 pt-sp-4` (64 + 16 = 80px). Tighter.

---

#### D5. Footer 4-column layout crowds the right edge (P1)

**Evidence:** `Footer.astro:52, 61, 70, 83` — columns at `col-start-7, 9, 11, 13` each `col-span-2`. At 1024px (the lg breakpoint), each fr ≈ 60px after gutters → col 13-14 is the rightmost content + the trailing gutter. The "Company" column sits flush against the right gutter with no breathing.

**Proposed fix:** Either (a) drop to 3 columns at lg (combine "Reports" + "Branches" into one stack), (b) move to `col-start-13` → `col-start-12` and shrink span (overcrowds), or (c) push the lg breakpoint to a wider viewport. Likely (a) is cleanest — the "Branches" column has 12 cities and visually competes with the Company column anyway.

This finding is **viewport-dependent** — verify by resizing the browser to ~1024-1100px before deciding.

---

#### D6. Footer one-weight problem (P2)

**Evidence:** All footer text — links, branch names, the meta description — is `font-sans text-[15px]` at varying opacity. Reads as a single uniform block.

**Proposed fix:** Differentiate: links stay `text-[15px]`, branch names drop to `font-mono text-[12px] uppercase tracking-[0.18em]` (matches the "12 MENA markets" hierarchy elsewhere), description stays `text-[15px]` but bumps to `font-serif`. Quick contrast win.

---

### Lane E — Section rhythm

#### E1. h2 → content gap inconsistent (P0)

**Evidence:** Already detailed in A1. Sitewide:
- `mb-sp-9` (96px) → CatalogStrips, PartnersSection, FieldReportsTeaser
- `mb-sp-7` (48px) → CustomersWall, QuoteCTA
- `mb-sp-8` (64px) → WorldReach

**Proposed fix:** Wire `head-to-content: 96px` (already in config) and apply uniformly. Then *deliberately* override per-section if rhythm demands it (E2 — varying for rhythm is GOOD, but it should be a choice, not a drift).

---

#### E2. `py-section-y` monotony (P1)

**Evidence:** 28 occurrences of `py-section-y` across `src/`. DESIGN.md §99 explicitly mandates *"Vary spacing for rhythm. Same padding everywhere is monotony."* ByTheNumbersV3 is the only section that varies (`py-sp-9 lg:py-sp-10`) — and it does feel different from its neighbors, validating the principle.

**Proposed fix:** Define 2-3 rhythm tiers:
- **major** — `py-sp-11` (200px) — hero, chapter break, CTA close (QuoteCTA already)
- **standard** — `py-section-y` (144px) — most content sections
- **compressed** — `py-sp-9` (96px) — ticker, support sections, ByTheNumbers-style "data" bands

Reassign: HeroV3 = major (already), Catalog/Partners/Reports/Customers/WorldReach = standard, ByTheNumbers/OpsTicker = compressed, QuoteCTA = major.

---

#### E3. Hero → marquee glue (P1)

**Evidence:** Hero's content ends at `pb-sp-6` (32px from section bottom). Marquee is `py-3` (12px). Total air between hero content and marquee text = 32 + 12 = 44px, but the visual color shift (paper-on-photo → ink ground) eats most of that perceptually.

**Proposed fix:** Either (a) bump marquee to `py-sp-4` (16px → reads as a deliberate band), or (b) the marquee is meant to feel "glued" as an ops ticker stuck under the hero — keep it tight but use the token (`py-sp-3` = 12px).

**Recommended:** (b) with the token (E4).

---

#### E4. `py-3` literal in marquee (P2)

**Evidence:** `OpsTickerMarquee.astro:20` — `py-3` (12px literal).

**Proposed fix:** `py-sp-3` (12px, token-equivalent).

---

#### E5. CaptionStrip `py-4` literal (P2)

**Evidence:** `CaptionStrip.astro:15` — `py-4` (16px literal).

**Proposed fix:** `py-sp-4` (16px, token-equivalent).

---

#### E6. Hero uneven vertical breathing (P1)

**Evidence:** `HeroV3.astro:53` — `pt-sp-7 pb-sp-6` = 48 top / 32 bottom. The top row (kicker + est pill) sits 48px from the section top; the meta-row sits 32px from the bottom. Asymmetry without a reason.

**Proposed fix:** `pt-sp-7 pb-sp-7` (48/48) or `pt-sp-8 pb-sp-7` (64/48 — more breathing at top, matches editorial open). Either symmetric or weighted-top.

**Recommended:** `pt-sp-8 pb-sp-7` (64/48).

---

#### E7. CTA → footer seam (P2)

**Evidence:** QuoteCTA `py-section-y-major` (200px) + Footer `pt-section-y` (144px) = 344px between CTA content and footer content. The CTA has its own bottom colophon (line 48) that absorbs some, so the effective gap is closer to ~280px, but still excessive.

**Proposed fix:** Falls out of D1 fix (`pt-sp-9` on Footer = 96px). Drops the seam to ~232px effective. If still too much, drop QuoteCTA to `py-section-y` (144 — and rely on its top signal-bar for the major-section signal).

---

#### E8. Card padding inconsistent (P1)

**Evidence:**
- `PartnersSection:55` tile: `p-sp-4` (16px)
- `CatalogStrips:48, 59` hero/body: `p-sp-5 sm:p-sp-6` (24/32px)
- `FieldReportsTeaser:54` featured: `p-sp-5 sm:p-sp-6` (24/32px)
- `FieldReportsTeaser:66` non-featured: `p-sp-5` (24px)
- `WorldReach:104` map block: `p-sp-4 sm:p-sp-5` (16/24px)
- `WorldReach:254` aside: `p-sp-5 sm:p-sp-6` (24/32px)
- `WorldReach:300` credentials card: `p-sp-5` (24px)
- `WorldReach:370` scope note: `px-sp-5 py-sp-4` (24/16px)
- `CustomersWall:53` logo tile: `p-sp-3` (12px)

Nine card surfaces, five different paddings.

**Proposed fix:** Define a `card-padding` semantic token (e.g. `card-padding: 24px` desktop, 16px mobile) and standardize. The exceptional cases (logo tile small, scope note compact horizontal) can be explicit overrides. Falls into the A2 fix scope (wire card tokens).

---

#### E9. Card-internal vertical rhythm drifts (P2)

**Evidence:** Catalog body uses `gap-sp-4` (16px) on a flex column. FieldReports cards use individual `mb-sp-2/3` (8/12px) per child. Customers logo tile inner uses `p-sp-3` (12px). WorldReach credentials use `gap-sp-3` (12px). No consistent card-internal rhythm.

**Proposed fix:** Use the `card-kicker-gap` (16px), `card-head-gap` (24px), `card-summary-gap` (32px) tokens (A2). Becomes prescriptive: kicker → head = 16, head → body = 24, body → cta = 32. Editorial card rhythm in one move.

---

## Recommended fix order

**Phase 1 — foundation (do first; unblocks everything else):**
1. **A3** — Make `page-x` a CSS-var reference. *Single line.* Restores responsive intent.
2. **A1** — Wire `head-to-content` token; replace `mb-sp-9` (or `mb-sp-7`/`mb-sp-8`) in section h2s. *~6 edits.*
3. **B1** — Pick primitive, refactor. **This is the big one.** Needs its own brainstorm → spec → plan. Recommend Option α (unify on `px-page-x`). *~25 edits across pages + Footer rewrite.* Closes B2, B3, B4, B5.

**Phase 2 — touch + accessibility:**
4. **C4** — UtilityBar phone link to 44px touch target. *2 edits.* (WCAG.)
5. **C2** — Nav lang toggle to 44px. *1 edit.*

**Phase 3 — token discipline:**
6. **A2 + E8 + E9** — Wire `card-*-gap` tokens, define `card-padding`, migrate card components. Goes together because they're all about the card abstraction. *~10 edits, one new tiny primitive or just direct token use.*

**Phase 4 — section rhythm:**
7. **E2** — Assign each section to major / standard / compressed tier. *~9 home section edits.*
8. **E1** — Falls out of A1.
9. **E6** — Hero vertical rebalance. *1 edit.*
10. **E3 + E4** — Marquee polish. *1 edit.*
11. **E5** — CaptionStrip literal. *1 edit.*

**Phase 5 — nav + footer polish:**
12. **C1** — Nav vertical padding bump. *1 edit.*
13. **C3** — Nav pill paddings standardize. *3 edits.*
14. **C5** — UtilityBar token. *1 edit.*
15. **D1 + D4 + E7** — Footer rhythm rebalance. *3 edits, one section.*
16. **D2** — Drop `leading-[2.15]` from footer. *6 edits.*
17. **D3** — Footer newsletter token discipline. *3 edits.*
18. **D5** — Footer 4-column layout at 1024-1280. *Bigger; needs viewport verification first.*
19. **D6** — Footer one-weight differentiation. *1-2 edits.*

**Quickest visible wins (if cherry-picking single items):** A3, C4, A1, D2 — together ~12 edits, no architectural decisions, addresses WCAG + a chunk of the visible alignment problem.

**Biggest single-impact win:** B1 — but it's also the biggest commitment. Don't undertake without a separate spec.

---

## Cross-references and dependencies

- **B5 → A3:** A3 fix closes the mobile half of B5 immediately. The desktop half needs B1.
- **B2/B3/B4 → B1:** All fall out of B1's primitive choice. Don't fix individually.
- **E1 → A1:** A1 makes E1 a one-line propagation.
- **E8/E9 → A2:** Card padding/rhythm tokens are the A2 fix surface.
- **C4 → C5:** UtilityBar vertical padding needs to accommodate the 44px touch target.
- **D1 → E7:** Footer top padding fix closes the CTA→footer seam.

---

## Out of scope (deferred)

Per the spec, these were excluded:
- Product/field-report **detail** pages' internal rhythm (own audit if needed).
- Typography polish (separate audit).
- Color / motion polish (separate audits).
- AR vs EN visual parity at narrow viewports (already partially covered by Plan 7).

Also discovered but deferred:
- Mobile drawer CTA `min-h-[52px]` vs everywhere-else `44px` — a deliberate "drawer-bottom button is bigger" choice. Verify intent before standardizing.
- Hero progress-dots position `bottom-sp-6 end-page-x` — `end-page-x` uses the static page-x. Will follow A3 fix automatically once A3 lands.
- Nav `gap-sp-5`/`gap-sp-7` between brand-row and links-row — works visually, but token names imply roles ("section spacing", not "nav inner-gap"). Possible future `nav-gap` token if a pattern emerges.

---

## Next step

User reads this punch list, picks single items or batches. Each pick gets its own brainstorm → spec → plan → implementation cycle.

**Recommended first pick:** A3 + A1 + C4 + D2 as a "quick-wins batch" — ~12 edits total, no architectural decisions, addresses the WCAG bug and ~15% of the visible alignment problem.

**Recommended second pick:** B1 — but only as its own focused session with a fresh brainstorm. This is the design decision that the whole audit hinges on.
