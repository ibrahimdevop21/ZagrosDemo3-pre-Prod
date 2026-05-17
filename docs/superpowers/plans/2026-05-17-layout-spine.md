# Layout Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended for a 30-file refactor) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate ~30 files to a single `.container-spine` horizontal-alignment primitive plus `py-section-y` as the single vertical rhythm token. Retire `px-page-x` and `.stage-grid` after the migration. One commit per phase, 7 phases.

**Architecture:** Spec at `docs/superpowers/specs/2026-05-17-layout-spine-design.md`. The spine is a Tailwind utility class declared in `global.css`. No Astro component needed — Astro components opt in by wrapping their content in `<div class="container-spine">`. Sections get full-bleed backgrounds with constrained content; 12-col internal grids nest inside when needed.

**Tech Stack:** Astro 5, Tailwind v3, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-05-17-layout-spine-design.md`
**Foundation commit:** `e13b5ea` (quick-wins A3 + A1 + C4 + D2 — already landed)
**Branch:** `feature/plan-7-world-reach`

---

## Phase 1 — Add `.container-spine` primitive

**Files:**
- Modify: `src/styles/global.css` (add class declaration)

- [ ] **Step 1: Add `.container-spine` to global.css `@layer components`**

Edit `src/styles/global.css`. After the `.stage-grid` block at line 109-117 (before `.kicker` at line 119), add:

```css
  /* Layout spine — single horizontal-alignment primitive sitewide.
     Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md
     Uses three already-declared tokens: --stage-max-width,
     --page-margin-x, --section-y. RTL-safe via inline logical
     properties. Migration in progress; .stage-grid + px-page-x
     retired in Phase 7. */
  .container-spine {
    width: 100%;
    max-width: var(--stage-max-width);
    margin-inline: auto;
    padding-inline: var(--page-margin-x);
  }
```

- [ ] **Step 2: Build to verify**

Run:
```bash
npm run build
```
Expected: 100 pages, no errors.

```bash
grep -c "container-spine" dist/_astro/*.css
```
Expected: at least 1 (the class is in the CSS bundle even though no caller uses it yet — Tailwind doesn't tree-shake `@layer components` declarations).

- [ ] **Step 3: Commit Phase 1**

```bash
git add src/styles/global.css
git commit -m "$(cat <<'EOF'
spine: phase 1 — add .container-spine primitive

Single horizontal-alignment class declared in global.css
@layer components. No callers yet — that's Phase 2+.

Uses three already-declared tokens: --stage-max-width (1300px),
--page-margin-x (responsive 56/20px), --section-y (144px).
RTL-safe via inline logical properties (margin-inline,
padding-inline).

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Migrate chrome (Nav, UtilityBar, Footer, Breadcrumb, CaptionStrip)

**Files:**
- Modify: `src/components/global/UtilityBar.astro`
- Modify: `src/components/global/Nav.astro`
- Modify: `src/components/global/Footer.astro`
- Modify: `src/components/global/Breadcrumb.astro`
- Modify: `src/components/global/CaptionStrip.astro`

### UtilityBar migration

- [ ] **Step 1: Wrap UtilityBar inner content**

Current `UtilityBar.astro:12-22` is a single `<div>` with `bg-ink px-page-x py-sp-4 …`. Split into outer (full-bleed) + inner (container-spine):

Find:
```astro
<div class="bg-ink text-paper/60 px-page-x py-sp-4 font-mono text-[11px] uppercase tracking-[0.22em] flex justify-between items-center">
  <span class="inline-flex items-center gap-2.5">
    <span class="w-1.5 h-1.5 bg-signal rounded-full inline-block"></span>
    <span>{t('utility.service_area')} · {t('utility.hours_label')}</span>
  </span>
  <span class="hidden md:flex gap-5 opacity-90 items-center">
    {phone && <a href={`tel:${phoneTel}`} dir="ltr" class="inline-flex items-center min-h-[44px] text-paper/60 no-underline hover:text-paper">{phone}</a>}
    <span class="text-paper/40">·</span>
    <span>{t('utility.partners_label')}</span>
  </span>
</div>
```

Replace with:
```astro
<div class="bg-ink text-paper/60 py-sp-4">
  <div class="container-spine flex justify-between items-center font-mono text-[11px] uppercase tracking-[0.22em]">
    <span class="inline-flex items-center gap-2.5">
      <span class="w-1.5 h-1.5 bg-signal rounded-full inline-block"></span>
      <span>{t('utility.service_area')} · {t('utility.hours_label')}</span>
    </span>
    <span class="hidden md:flex gap-5 opacity-90 items-center">
      {phone && <a href={`tel:${phoneTel}`} dir="ltr" class="inline-flex items-center min-h-[44px] text-paper/60 no-underline hover:text-paper">{phone}</a>}
      <span class="text-paper/40">·</span>
      <span>{t('utility.partners_label')}</span>
    </span>
  </div>
</div>
```

(Outer keeps `bg-ink py-sp-4` for the full-bleed band. Inner gets `.container-spine` + the flex layout + font styling that used to be on the outer. `px-page-x` is gone from this file.)

### Nav migration

- [ ] **Step 2: Wrap Nav inner content**

Current `Nav.astro:30-81` has `<nav class="bg-paper border-b border-stone px-page-x py-sp-4 flex …">`. Split:

Find:
```astro
<nav class="bg-paper border-b border-stone px-page-x py-sp-4 flex items-center gap-sp-5 sticky top-0 z-40 backdrop-blur-sm">
  <a href={isRTL ? '/ar/' : '/'} class="brand flex items-center gap-3">
```

Replace with:
```astro
<nav class="bg-paper border-b border-stone py-sp-4 sticky top-0 z-40 backdrop-blur-sm">
  <div class="container-spine flex items-center gap-sp-5">
    <a href={isRTL ? '/ar/' : '/'} class="brand flex items-center gap-3">
```

Then find the closing `</nav>` at line 81:
```astro
  <div class="ms-auto lg:hidden flex items-center">
    <HamburgerButton />
  </div>
</nav>
```

Replace with:
```astro
    <div class="ms-auto lg:hidden flex items-center">
      <HamburgerButton />
    </div>
  </div>
</nav>
```

(Add a closing `</div>` for the new `.container-spine` wrapper, indent the inner content one level deeper.)

### Footer migration (the big one)

- [ ] **Step 3: Replace Footer .stage-grid with .container-spine + nested 12-col grid**

Current `Footer.astro:14-97` wraps everything in a single `.stage-grid` with `col-start-{2,7,9,11,13}` placement. Rewrite to `.container-spine` + nested `grid grid-cols-12 gap-6`.

Find:
```astro
<footer class="bg-ink text-paper border-t border-paper/10 pt-section-y pb-sp-7">
  <div class="stage-grid">
    <div class="col-span-4 col-start-2">
```

Replace with:
```astro
<footer class="bg-ink text-paper border-t border-paper/10 pt-section-y pb-sp-7">
  <div class="container-spine">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-4">
```

(Note: `col-span-4 col-start-2` in the old 14-col stage-grid meant "first content column, span 4 of 12 content cols." In the new pure 12-col grid we just do `col-span-4`. At mobile the column stacks full-width via `col-span-12 lg:col-span-4`.)

Then update each of the 4 footer columns at lines 52, 61, 70, 83:

- Line 52: `<div class="col-span-2 col-start-7 footer-col">` → `<div class="col-span-6 sm:col-span-3 lg:col-span-2 footer-col">`
- Line 61: `<div class="col-span-2 col-start-9 footer-col">` → `<div class="col-span-6 sm:col-span-3 lg:col-span-2 footer-col">`
- Line 70: `<div class="col-span-2 col-start-11 footer-col">` → `<div class="col-span-6 sm:col-span-3 lg:col-span-2 footer-col">`
- Line 83: `<div class="col-span-2 col-start-13 footer-col">` → `<div class="col-span-6 sm:col-span-3 lg:col-span-2 footer-col">`

(Mobile: each column takes half width — 2 columns per row. Tablet `sm:`: 4 across. Desktop `lg:`: matches the original 4-column row.)

Then the colophon row at line 93:
- `<div class="col-span-12 col-start-2 mt-sp-9 pt-sp-5 border-t border-paper/10 …">` → `<div class="col-span-12 mt-sp-9 pt-sp-5 border-t border-paper/10 …">`

Finally add the closing `</div>` for the new inner-grid wrapper, before `</footer>`:
- Line 97 currently: `</footer>`
- Becomes:
```astro
    </div>
  </div>
</footer>
```

(Outer `.container-spine` div + inner `grid grid-cols-12 gap-6` div both need closing.)

### Breadcrumb migration

- [ ] **Step 4: Wrap Breadcrumb in .container-spine**

Find:
```astro
<nav class="px-page-x py-sp-5 font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute" aria-label="Breadcrumb">
```

Replace with:
```astro
<nav class="py-sp-5 font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute" aria-label="Breadcrumb">
  <div class="container-spine">
```

Then before the closing `</nav>` at line 24, add the matching `</div>`:
```astro
    ))}
  </ol>
  </div>
</nav>
```

(Breadcrumb doesn't have a full-bleed background; the `.container-spine` does the centering directly inside the `<nav>`.)

### CaptionStrip migration

- [ ] **Step 5: Wrap CaptionStrip inner content**

Find:
```astro
<div class="bg-ink text-paper px-page-x py-4 font-mono text-[10.5px] tracking-[0.25em] uppercase text-paper/55 flex justify-between items-center">
  <span>
    {sectionNumber && (
      <>{t('common.section')} · {sectionNumber} · </>
    )}
    <b class="text-paper font-medium">{label}</b>
  </span>
  {subLabel && <span>{subLabel}</span>}
</div>
```

Replace with:
```astro
<div class="bg-ink text-paper py-sp-4">
  <div class="container-spine flex justify-between items-center font-mono text-[10.5px] tracking-[0.25em] uppercase text-paper/55">
    <span>
      {sectionNumber && (
        <>{t('common.section')} · {sectionNumber} · </>
      )}
      <b class="text-paper font-medium">{label}</b>
    </span>
    {subLabel && <span>{subLabel}</span>}
  </div>
</div>
```

(Outer `bg-ink py-sp-4` for the full-bleed band — also fixes audit finding E5 by replacing `py-4` literal with `py-sp-4` token. Inner `.container-spine` + flex layout + font styling.)

### Verify + commit Phase 2

- [ ] **Step 6: Verify all 5 chrome files migrated**

Run:
```bash
grep -rln "px-page-x\|stage-grid" src/components/global/
```
Expected: **no matches**. All chrome free of the old primitives.

```bash
grep -rln "container-spine" src/components/global/
```
Expected: **5 matches** — UtilityBar, Nav, Footer, Breadcrumb, CaptionStrip.

- [ ] **Step 7: Build + tests**

Run:
```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 tests green.

- [ ] **Step 8: Commit Phase 2**

```bash
git add src/components/global/
git commit -m "$(cat <<'EOF'
spine: phase 2 — migrate chrome to .container-spine

UtilityBar, Nav, Footer, Breadcrumb, CaptionStrip all wrap their
inner content in .container-spine. Full-bleed backgrounds (bg-ink,
bg-paper) stay on the outer element; horizontal alignment lives
inside the container.

Footer: the 4-column row moves from .stage-grid col-start-{7,9,11,13}
(in a 14-col grid) to a clean grid grid-cols-12 gap-6 nested inside
.container-spine. Mobile collapses to 2-up; tablet 4-up; desktop
unchanged at 4 across.

CaptionStrip py-4 literal also fixed to py-sp-4 token (audit E5).

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Migrate home sections

**Files (9):**
- Modify: `src/components/home/HeroV3.astro`
- Modify: `src/components/home/OpsTickerMarquee.astro`
- Modify: `src/components/home/ByTheNumbersV3.astro`
- Modify: `src/components/home/CatalogStrips.astro`
- Modify: `src/components/home/PartnersSection.astro`
- Modify: `src/components/home/FieldReportsTeaser.astro`
- Modify: `src/components/home/CustomersWall.astro`
- Modify: `src/components/home/WorldReach.astro`
- Modify: `src/components/home/QuoteCTA.astro`

### Pattern A — content section (paper or ink ground)

Used by: ByTheNumbersV3, CatalogStrips, PartnersSection, FieldReportsTeaser, CustomersWall, WorldReach, QuoteCTA.

Every one of these currently has the shape:
```astro
<section class="px-page-x py-section-y bg-...">
  <span class="kicker ...">{kicker}</span>
  <h2 class="...">{headline}</h2>
  <div class="grid ...">{content}</div>
</section>
```

Migrated to:
```astro
<section class="bg-... py-section-y">
  <div class="container-spine">
    <span class="kicker ...">{kicker}</span>
    <h2 class="...">{headline}</h2>
    <div class="grid ...">{content}</div>
  </div>
</section>
```

- [ ] **Step 1: Migrate ByTheNumbersV3.astro**

Find `<section class="px-page-x py-sp-9 lg:py-sp-10 bg-paper">` → replace with `<section class="bg-paper py-section-y">`, wrap inner content in `<div class="container-spine">…</div>`, close before `</section>`.

(Note: ByTheNumbersV3 currently uses `py-sp-9 lg:py-sp-10` — retired in favor of uniform `py-section-y` per the user's "one section padding" rule.)

- [ ] **Step 2: Migrate CatalogStrips.astro**

Find `<section class="px-page-x py-section-y bg-paper-light border-t border-ink">` → replace with `<section class="bg-paper-light border-t border-ink py-section-y">`, wrap inner in `.container-spine`.

- [ ] **Step 3: Migrate PartnersSection.astro**

Find `<section class="px-page-x py-section-y bg-paper border-t border-ink">` → replace with `<section class="bg-paper border-t border-ink py-section-y">`, wrap inner in `.container-spine`.

- [ ] **Step 4: Migrate FieldReportsTeaser.astro**

Find `<section class="px-page-x py-section-y bg-paper-light border-t border-ink">` → replace with `<section class="bg-paper-light border-t border-ink py-section-y">`, wrap inner in `.container-spine`.

- [ ] **Step 5: Migrate CustomersWall.astro**

Find `<section class="px-page-x py-section-y bg-ink text-paper">` → replace with `<section class="bg-ink text-paper py-section-y">`, wrap inner in `.container-spine`.

- [ ] **Step 6: Migrate WorldReach.astro**

Find `<section class="px-page-x py-section-y bg-paper border-t border-ink">` → replace with `<section class="bg-paper border-t border-ink py-section-y">`, wrap inner in `.container-spine`.

- [ ] **Step 7: Migrate QuoteCTA.astro**

Find `<section class="relative bg-ink text-paper px-page-x py-section-y-major overflow-hidden">` → replace with `<section class="relative bg-ink text-paper py-section-y overflow-hidden">`, wrap inner in `.container-spine`.

(**Retires `py-section-y-major`** — only QuoteCTA used it.)

### Pattern B — HeroV3 (lone exception)

- [ ] **Step 8: Migrate HeroV3.astro (preserves chapter-open rhythm)**

Current foreground content at line 53: `<div class="relative z-20 flex flex-col min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] px-page-x pt-sp-7 pb-sp-6">`.

Replace with:
```astro
<div class="relative z-20 flex flex-col min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] pt-sp-7 pb-sp-6">
  <div class="container-spine flex flex-col flex-1">
```

Then before `</div>` that closes the content wrapper (around line 76), close the new container-spine div. Also handle the `bottom-sp-6 end-page-x` on the progress dots at line 79 — change to use `.container-spine` if it's absolutely positioned, or rewrite to sit inside the container.

For the progress dots, change line 79 from:
```astro
<div class="hero-progress absolute bottom-sp-6 end-page-x z-30 flex gap-1.5">
```

To:
```astro
<div class="hero-progress absolute bottom-sp-6 inset-x-0 z-30">
  <div class="container-spine flex justify-end gap-1.5">
```

And add a matching `</div>` close.

(Progress dots use `.container-spine` so they sit at the same right-edge as every other content piece. The `inset-x-0` lets the inner container do the alignment.)

### Pattern C — OpsTickerMarquee (chrome band)

- [ ] **Step 9: Migrate OpsTickerMarquee.astro**

Current `<div class="px-page-x py-3 flex items-center gap-sp-5">` (line 20):

Replace with:
```astro
<div class="py-sp-3">
  <div class="container-spine flex items-center gap-sp-5">
```

And close the new container-spine div before the closing of the marquee-wrap. (Also fixes audit E4 by replacing `py-3` literal with `py-sp-3`.)

### Verify + commit Phase 3

- [ ] **Step 10: Verify all 9 home sections migrated**

Run:
```bash
grep -rln "px-page-x\|stage-grid" src/components/home/
```
Expected: **no matches**.

```bash
grep -rl "py-section-y-major" src/
```
Expected: **no matches** (retired in QuoteCTA migration).

```bash
grep -rln "container-spine" src/components/home/
```
Expected: **9 matches**.

- [ ] **Step 11: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 tests green.

- [ ] **Step 12: Commit Phase 3**

```bash
git add src/components/home/
git commit -m "$(cat <<'EOF'
spine: phase 3 — migrate home sections

All 9 home sections now wrap content in .container-spine.
Full-bleed backgrounds (bg-paper, bg-paper-light, bg-ink, hero
slideshow) stay on the outer <section>; horizontal alignment is
exclusively in the inner container.

Retirements in this phase:
  - py-section-y-major (used only by QuoteCTA → py-section-y)
  - py-sp-9 lg:py-sp-10 (ByTheNumbersV3 → py-section-y)
  - py-3 literal (OpsTickerMarquee → py-sp-3 token)

HeroV3 keeps its chapter-open rhythm (pt-sp-7 pb-sp-6) per the
locked design decision (lone exception). OpsTickerMarquee is
chrome, not a content section — slim band at py-sp-3.

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Migrate inner-page bodies (EN + AR)

**Files (EN, 8):**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/products/index.astro`
- Modify: `src/pages/products/[line].astro`
- Modify: `src/pages/products/[line]/[slug].astro`
- Modify: `src/pages/field-reports/index.astro`
- Modify: `src/pages/field-reports/[slug].astro`
- Modify: `src/pages/partners/[slug].astro`
- Modify: `src/pages/privacy.astro`, `src/pages/terms.astro`

**Files (AR, 9):**
- Modify: `src/pages/ar/about.astro`, `src/pages/ar/contact.astro`, `src/pages/ar/products/index.astro`, `src/pages/ar/products/[line].astro`, `src/pages/ar/products/[line]/[slug].astro`, `src/pages/ar/field-reports/index.astro`, `src/pages/ar/field-reports/[slug].astro`, `src/pages/ar/partners/[slug].astro`, `src/pages/ar/privacy.astro`, `src/pages/ar/terms.astro`

### Pattern — page header + body sections

Two shapes to handle:

**Shape 1: Listing/contact/about — header in `px-page-x` + body in `px-page-x` or `stage-grid`.**

Example: `contact.astro`:
```astro
<header class="px-page-x pb-sp-9">…</header>
<section class="px-page-x pb-section-y">…</section>
```

Migrate to:
```astro
<header class="pb-sp-9">
  <div class="container-spine">…</div>
</header>
<section class="pb-section-y">
  <div class="container-spine">…</div>
</section>
```

**Shape 2: About — header in `px-page-x` + body sections in `stage-grid col-start-2`.**

Example: `about.astro`:
```astro
<header class="px-page-x pb-section-y">…</header>
<CaptionStrip … />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-12 col-start-2">
      <FoundedTimeline />
    </div>
  </div>
</section>
```

Migrate to:
```astro
<header class="pb-section-y">
  <div class="container-spine">…</div>
</header>
<CaptionStrip … />
<section class="py-section-y bg-paper">
  <div class="container-spine">
    <FoundedTimeline />
  </div>
</section>
```

(The `stage-grid + col-start-2 col-span-12` indirection was just "constrain content to body width" — `.container-spine` does that natively.)

- [ ] **Step 1: Migrate src/pages/about.astro** — header + 6 body sections per Shape 2 pattern.

- [ ] **Step 2: Migrate src/pages/contact.astro** — header + form section per Shape 1 pattern.

- [ ] **Step 3: Migrate src/pages/products/index.astro** — header + lines grid per Shape 1.

- [ ] **Step 4: Migrate src/pages/products/[line].astro** — header + filter row + section list per Shape 1.

- [ ] **Step 5: Migrate src/pages/products/[line]/[slug].astro** — replace all `stage-grid + col-start-2` with `.container-spine` per Shape 2.

- [ ] **Step 6: Migrate src/pages/field-reports/index.astro** — header + grid per Shape 1.

- [ ] **Step 7: Migrate src/pages/field-reports/[slug].astro** — all stage-grid → container-spine per Shape 2.

- [ ] **Step 8: Migrate src/pages/partners/[slug].astro** — outer wrapper per Shape 1.

- [ ] **Step 9: Migrate src/pages/privacy.astro, src/pages/terms.astro** — stage-grid → container-spine per Shape 2.

- [ ] **Step 10: Mirror all 10 EN migrations to AR**

For each `src/pages/<path>.astro` migrated above, apply the identical edit to `src/pages/ar/<path>.astro`. If you have time / want to be cautious, do each AR pair right after its EN counterpart so they don't drift.

- [ ] **Step 11: Verify all inner pages migrated**

Run:
```bash
grep -rln "px-page-x\|stage-grid" src/pages/
```
Expected: **no matches** (in either EN or AR trees).

```bash
grep -rln "container-spine" src/pages/
```
Expected: at least 18 matches (one+ per page file).

- [ ] **Step 12: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 green.

- [ ] **Step 13: Commit Phase 4**

```bash
git add src/pages/
git commit -m "$(cat <<'EOF'
spine: phase 4 — migrate inner-page bodies (EN + AR)

Every src/pages/*.astro (EN + AR mirrors) now uses .container-spine
for horizontal alignment. Old patterns retired in this phase:
  - <header class="px-page-x …">    → header + inner container-spine
  - <section><div class="stage-grid"><div class="col-start-2 col-span-12">
                                     → <section><div class="container-spine">

About, products/index, products/[line], partners/[slug], contact,
field-reports/index — all now match the chrome's alignment. The
intra-page header-vs-body misalignment from audit B3 closes here.

Detail pages (products/[line]/[slug], field-reports/[slug]) also
migrate end-to-end so the detail-page article aligns to Nav and
Footer.

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — Migrate component-level callers

**Files (10):**
- `src/components/partners/ProductLinesTable.astro`
- `src/components/partners/ReportsByPartner.astro`
- `src/components/products/ApplicationRatesTable.astro`
- `src/components/products/CompatibilityMatrix.astro`
- `src/components/products/PesticideDetail.astro`
- `src/components/products/RelatedProducts.astro`
- `src/components/products/SeedDetail.astro`
- `src/components/products/WhyThisMatters.astro`
- `src/components/products/FilterPills.astro`
- `src/components/products/ProductsToolbar.astro`
- `src/components/reports/ReportHero.astro`

- [ ] **Step 1: Migrate each component**

For files using `<div class="stage-grid"><div class="col-start-2 col-span-12">`: replace with `<div class="container-spine">`.

For files using `<… class="px-page-x …">`: split into outer (no horizontal padding) + inner `<div class="container-spine">` if the component has a full-bleed background, or just replace `px-page-x` with `container-spine` if it doesn't.

Read each file first to determine which pattern applies. Verify by build.

- [ ] **Step 2: Verify**

```bash
grep -rln "px-page-x\|stage-grid" src/components/
```
Expected: **no matches** anywhere in `src/components/`.

- [ ] **Step 3: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 green.

- [ ] **Step 4: Commit Phase 5**

```bash
git add src/components/
git commit -m "$(cat <<'EOF'
spine: phase 5 — migrate component-level callers

The 10 components that referenced .stage-grid or px-page-x directly
(partners tables, product detail blocks, filter chrome, report hero)
now use .container-spine. No section-level files reference the old
primitives anymore.

After this commit, src/ has zero call sites for px-page-x or
.stage-grid — Phase 6 retires the utility definitions themselves.

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6 — Peer type-scale rationalization

**Files (~3):**
- Modify: `src/components/home/QuoteCTA.astro` (h2 align to shared clamp)
- Potentially: `src/components/home/HeroV3.astro` (h1 already at its own clamp — leave)
- Potentially: other places where a peer-element drift is found during migration

- [ ] **Step 1: Align QuoteCTA h2 to the shared section-h2 clamp**

Current `QuoteCTA.astro:27`:
```astro
<h2 class="font-display italic font-light text-[clamp(40px,7vw,84px)] leading-[1] text-paper max-w-[18ch] mb-head-to-content" …>
```

Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-paper max-w-[18ch] mb-head-to-content" …>
```

(Matches the shared section-h2 clamp `32px,5vw,56px` used by Catalog, Partners, FieldReports, Customers, WorldReach. QuoteCTA's emphasis comes from `bg-ink text-paper`, the signal-bar accent, and the signal-yellow accent word — not from a larger h2 size.)

- [ ] **Step 2: Scan for other peer-drift**

Run:
```bash
grep -rn "text-\[clamp(" src/components/home/
```
Review each match. Section h2s should all share `clamp(32px,5vw,56px)`. Card titles can vary by card class. Stat numbers have their own intentional hierarchy.

If any section h2 doesn't match — align it. Document any deliberate exception.

- [ ] **Step 3: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 green.

- [ ] **Step 4: Commit Phase 6**

```bash
git add src/components/home/
git commit -m "$(cat <<'EOF'
spine: phase 6 — peer type-scale rationalization

QuoteCTA h2 sized down from clamp(40px,7vw,84px) to the shared
section-h2 clamp(32px,5vw,56px). All 7 home section h2s now share
one size + weight + line-height. Emphasis on QuoteCTA comes from
inverted ground (bg-ink), the signal-bar accent stripe, and the
signal-yellow accent word — not from inflating the h2.

HeroV3 h1 keeps its own clamp(40px,8vw,96px) — it's chapter-open
display type, a different role from section h2s. Documented
exception.

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7 — Retire the old utilities

**Files:**
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css`
- Modify: `DESIGN.md`

- [ ] **Step 1: Remove `page-x` from tailwind.config.mjs**

Find line 57:
```js
        'page-x':          'var(--page-margin-x)',
```

Delete the line entirely.

- [ ] **Step 2: Remove `section-y-major` from tailwind.config.mjs**

Find line 51:
```js
        'section-y-major': '200px',
```

Delete the line.

- [ ] **Step 3: Remove `.stage-grid` from global.css**

Find lines 109-117 in `src/styles/global.css`:
```css
  /* 14-col stage grid — spec §3.3, reusable on any section root */
  .stage-grid {
    display: grid;
    grid-template-columns:
      minmax(var(--page-margin-x), 1fr)
      repeat(12, 1fr)
      minmax(var(--page-margin-x), 1fr);
    column-gap: 24px;
  }
```

Delete the entire block (the comment line above + the rule).

- [ ] **Step 4: Update DESIGN.md**

Find `DESIGN.md:101-107` (Layout primitives section):
```markdown
## Layout primitives

- `.stage-grid` — 14-column grid (`minmax(page-x, 1fr) repeat(12, 1fr) minmax(page-x, 1fr)`), 24px column gap. Editorial gutters built in. Defined `src/styles/global.css:91-100`.
- `.paper-grain` — SVG-noise paper texture overlay applied as `::after`. Use on hero or full-width sections that want depth.
- `.kicker` — small-caps mono label with a 28px leading bar.
```

Replace with:
```markdown
## Layout primitives

- `.container-spine` — single horizontal-alignment primitive sitewide. `max-width: var(--stage-max-width)` (1300px); `padding-inline: var(--page-margin-x)` (responsive 56/20px); `margin-inline: auto`. Every content region wraps in this. Full-bleed backgrounds sit on the outer element; constrained content sits inside the container. Defined in `src/styles/global.css` `@layer components`. Internal 12-col grids nest inside via `<div class="grid grid-cols-12 gap-6">` (opt-in, never overloaded onto the container itself). Spec: `docs/superpowers/specs/2026-05-17-layout-spine-design.md`.
- `.paper-grain` — SVG-noise paper texture overlay applied as `::after`. Use on hero or full-width sections that want depth.
- `.kicker` — small-caps mono label with a 28px leading bar.
```

- [ ] **Step 5: Build + tests final**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 green.

```bash
grep -rln "px-page-x\|page-x\|stage-grid\|section-y-major" src/
```
Expected: **no matches** in `src/`. The only allowed match is in `docs/`.

- [ ] **Step 6: Commit Phase 7**

```bash
git add tailwind.config.mjs src/styles/global.css DESIGN.md
git commit -m "$(cat <<'EOF'
spine: phase 7 — retire px-page-x, stage-grid, section-y-major

Final cleanup. After Phases 2-5 migrated every call site,
the old utility definitions can now be deleted.

Removed from tailwind.config.mjs:
  - 'page-x': 'var(--page-margin-x)'  (was a Tailwind spacing key
    that resolved px-page-x; .container-spine handles this now)
  - 'section-y-major': '200px'  (only QuoteCTA used it; retired
    in Phase 3 in favor of uniform py-section-y)

Removed from global.css:
  - .stage-grid 14-col grid definition  (Footer + inner pages
    used it as the gutter+12-col primitive; .container-spine +
    nested grid grid-cols-12 replace it cleanly)

DESIGN.md §101 updated to document .container-spine as the spine
primitive. .stage-grid entry removed.

grep -rln 'px-page-x|stage-grid|section-y-major' src/  returns 0.
Single source of layout truth in src/: .container-spine.

This closes audit items B1, B2, B3, B4, B5, E1, E2 from
2026-05-17-spacing-polish-audit.md.

Spec: docs/superpowers/specs/2026-05-17-layout-spine-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Final acceptance check (after Phase 7 commit)

- [ ] **Step 1: Browser verification at all breakpoints**

Run `npm run dev`. At 360, 390, 414, 1024, 1440 viewports:
1. Open `/` and `/about` (the page with the worst pre-migration misalignment per audit B3).
2. Draw a vertical line from Nav logo's left edge straight down. It should touch every section's first content element AND Footer's first column.
3. Same on the right edge — Nav CTA, every section's right-edge content, Footer's last column.
4. Page renders correctly; no horizontal scroll; no clipped content.

- [ ] **Step 2: Mobile drawer**

At 360px, tap hamburger → drawer slides in. Drawer dismisses on backdrop click, X button, Escape key. CTA pill at bottom of drawer is tappable.

- [ ] **Step 3: AR locale**

Repeat Step 1 on `/ar/` and `/ar/about`. Same alignment from the right edge inward (RTL via inline logical properties).

- [ ] **Step 4: WCAG 2.5.5**

UtilityBar phone link still ≥44×44 (from foundation commit e13b5ea, but verify after chrome refactor in Phase 2).

- [ ] **Step 5: Hand off**

Report to user: 7 commits, ~30 files migrated, audit items B1-B5 + E1 + E2 closed. Working tree clean. Branch ready for next pick from the audit (A2 card-*-gap tokens, C1-C3 nav polish, etc.).

---

## Self-review

**1. Spec coverage:**

| Spec section | Plan phase |
|--------------|------------|
| §"The Container primitive" | Phase 1 |
| §"How it's used" (chrome) | Phase 2 |
| §"Home sections" migration | Phase 3 (incl. Hero exception, ticker chrome) |
| §"Inner pages — EN/AR" migration | Phase 4 |
| §"Component-level callers" migration | Phase 5 |
| §"Peer type scale — one size per role" | Phase 6 |
| §"Retire after migration" | Phase 7 |
| §"Testing strategy" | Verification step in each phase + Final acceptance |
| §"Mobile drawer" check | Final acceptance Step 2 |
| §"AR locale" parity | Final acceptance Step 3 |
| §"WCAG 2.5.5 re-verify" | Final acceptance Step 4 |
| §"DESIGN.md update" | Phase 7 Step 4 |

All spec items covered. ✓

**2. Placeholder scan:**

Phase 4 Steps 1-10 are "migrate file X per Shape Y pattern" without showing every diff. This is intentional given the file count (17) and the patterns are explicitly defined at the top of Phase 4 with concrete before/after examples. A reader can apply the patterns. If a file deviates, the build will tell you (broken layout or compile error).

Phase 5 Step 1 says "Read each file first to determine which pattern applies" — this is an instruction to the implementer to do quick file reads, not a placeholder. Acceptable.

✓ No placeholders.

**3. Type consistency:**

- `.container-spine` class name consistent across all 7 phases. ✓
- `var(--stage-max-width)`, `var(--page-margin-x)`, `--section-y` token names consistent with `tokens.css` and `tailwind.config.mjs`. ✓
- Tailwind utility names (`py-section-y`, `mb-head-to-content`, `mb-sp-N`) consistent. ✓
