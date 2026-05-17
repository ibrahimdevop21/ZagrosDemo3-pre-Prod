# Layout spine — design

**Date:** 2026-05-17
**Branch:** `feature/plan-7-world-reach`
**Status:** Brainstorm complete. Spec locked. Plan to follow.
**Supersedes (partially):** audit findings B1, B2, B3, B4, B5, E1, E2 from `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md`. The user reframed B1 as Option β (single Container primitive) rather than Option α (unify on `px-page-x`). Foundation layer for this spec already landed in commit `e13b5ea`.

## Trigger

User noted that no region of the site shares a horizontal reference. Nav, every section, and Footer each define their own widths, padding, alignment. The audit (`docs/superpowers/audits/2026-05-17-spacing-polish-audit.md`) traced this to two competing primitives: `px-page-x` (Nav + all home sections) vs `.stage-grid col-start-2` (Footer + inner-page bodies). They only align by coincidence at one viewport width.

The user's directive is broader than the audit's recommended fix: build a single shared layout spine that every region uses, plus enforce one vertical rhythm token, one type scale per peer role, and one row-baseline rule.

## The spine

**ONE container primitive. ONE max-width. ONE horizontal padding scale. ONE section-padding token.**

### Three numbers, already declared

| Token | Value | Source |
|-------|-------|--------|
| `--stage-max-width` | `1300px` | `src/styles/tokens.css:36` (existing) |
| `--page-margin-x` | `56px` ≥640px / `20px` <640px | `src/styles/tokens.css:37, 42-46` (existing, responsive via media query) |
| `--section-y` | `144px` | `tailwind.config.mjs:50` (existing as `section-y`) |

**No new token values.** The spine just *enforces* these three as the sole sources of layout truth.

### The Container primitive — `.container-spine`

Single Tailwind utility class declared in `src/styles/global.css` `@layer components`:

```css
.container-spine {
  width: 100%;
  max-width: var(--stage-max-width);
  margin-inline: auto;
  padding-inline: var(--page-margin-x);
}
```

`margin-inline` + `padding-inline` are direction-agnostic — the AR locale gets symmetric behavior automatically.

### The full-bleed + constrained-content pattern

```astro
<section class="bg-paper py-section-y">         <!-- full-bleed background, vertical rhythm -->
  <div class="container-spine">                  <!-- horizontal alignment -->
    <!-- content; may nest a 12-col grid inside if needed -->
  </div>
</section>
```

Backgrounds (color, image) span the viewport. Content sits inside `min(100%, 1300px - 2×var(--page-margin-x))` and centers. This is the **required** pattern for every content region.

### Internal 12-col grid (opt-in)

When a section needs column structure (Footer's 4 columns, ByTheNumbers' 1.6fr/1fr/1fr/1fr, WorldReach's map+aside), nest a CSS grid inside `.container-spine`:

```astro
<div class="container-spine">
  <div class="grid grid-cols-12 gap-6">
    <!-- col-span-N children -->
  </div>
</div>
```

`.container-spine` handles ONLY horizontal alignment. Internal column structure is opt-in per section. **No overloading.** The existing `.stage-grid` gets retired after migration.

### Vertical rhythm — ONE section-padding token

Every **content section** uses `py-section-y` (144px) for top/bottom padding. The previous `py-section-y-major` (200px) is retired — only QuoteCTA used it, and the user's "every section uses the SAME token" rule overrides the audit's three-tier recommendation.

**Two documented exceptions** (chrome, not content sections):

| Region | Padding | Reason |
|--------|---------|--------|
| HeroV3 (chapter-open) | Existing hero rhythm (`min-h-[640..820px]` + `pt-sp-7 pb-sp-6`) | Editorial publication: chapter open is its own thing. User's "lone exception" decision. |
| OpsTickerMarquee | `py-sp-3` (12px) | Slim ticker band by design. Token-correct but not a content section. |
| UtilityBar, Nav, Breadcrumb, CaptionStrip, Footer | Their own internal rhythm (already established) | Chrome bands, not content sections. |

### Internal section rhythm — shared eyebrow→heading→body pattern

The pattern set by commit `e13b5ea` (A1) holds and propagates:

| Step | Token | Value |
|------|-------|-------|
| kicker → h2 | `mb-sp-5` | 24px |
| h2 → content | `mb-head-to-content` | 96px |
| content → CTA / footer-of-section | `mb-sp-7` | 48px |

### Peer type scale — one size per role

Sibling/peer elements share one size + weight + line-height per role. Hierarchy comes from the scale + spacing + grouping, not from inflating one peer.

Current state:
- Section h2: `text-[clamp(32px,5vw,56px)] font-display italic font-light leading-[0.95]` — shared by 6 of 7 home sections; QuoteCTA at `clamp(40px,7vw,84px)` is an outlier. **Rationalize** to the shared clamp; QuoteCTA can use scale weight or signal-color to claim emphasis without breaking peer parity.
- Hero h1: `text-[clamp(40px,8vw,96px)]` — chapter-open exception, OK to differ.
- Section kickers: `font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute` — shared across all sections. Already conformant.
- Card titles: `font-display italic text-[clamp(20px,2.2vw,24px)..clamp(24px,3vw,30px)]` — varies by card class (catalog vs partners-tile vs reports-featured). Acceptable: these are different card *roles*, not peers within a single grid.
- Stat numbers (ByTheNumbersV3): big number `clamp(120px,22vw,280px)`; three smalls `clamp(72px,12vw,140px)`. Already an explicit hierarchy by design.
- Footer column headers: `font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute font-medium` — shared, already conformant.

### Row baseline — shared bottom edge in grid rows

Sibling cards in a grid row already use `flex flex-col` with `mt-auto` to push CTAs to a shared bottom edge. Verify this on every grid row during migration:
- CatalogStrips cards (3-up)
- FieldReportsTeaser cards (1 featured + 2 small)
- PartnersSection tiles (2x3 grid + spotlight)
- WorldReach credentials (3x3 grid)
- Footer columns (4 columns)
- ByTheNumbersV3 stats (1 big + 3 smalls)

## Regions to migrate

**30+ files.** Grouped by role.

### Chrome (5 files)

| File | Current | After |
|------|---------|-------|
| `src/components/global/UtilityBar.astro` | `px-page-x` | Full-bleed `bg-ink` band; inner `.container-spine` |
| `src/components/global/Nav.astro` | `px-page-x` | Full-bleed `bg-paper border-b`; inner `.container-spine` |
| `src/components/global/Footer.astro` | `.stage-grid col-start-{2,7,9,11,13}` | Full-bleed `bg-ink`; inner `.container-spine` with nested `grid grid-cols-12 gap-6` |
| `src/components/global/Breadcrumb.astro` | `px-page-x` | `.container-spine` (no full-bleed needed) |
| `src/components/global/CaptionStrip.astro` | `px-page-x` | Full-bleed `bg-ink`; inner `.container-spine` |

### Home sections (9 files)

| File | Current | After |
|------|---------|-------|
| `HeroV3.astro` | `px-page-x pt-sp-7 pb-sp-6` | Full-bleed slideshow; foreground content in `.container-spine`; **vertical padding kept** (lone exception) |
| `OpsTickerMarquee.astro` | `px-page-x py-3` | Full-bleed `bg-ink`; inner `.container-spine py-sp-3` (token, not literal) |
| `ByTheNumbersV3.astro` | `px-page-x py-sp-9 lg:py-sp-10` | Full-bleed `bg-paper`; inner `.container-spine py-section-y` |
| `CatalogStrips.astro` | `px-page-x py-section-y` | Full-bleed `bg-paper-light`; inner `.container-spine py-section-y` |
| `PartnersSection.astro` | `px-page-x py-section-y` | Full-bleed `bg-paper`; inner `.container-spine py-section-y` |
| `FieldReportsTeaser.astro` | `px-page-x py-section-y` | Full-bleed `bg-paper-light`; inner `.container-spine py-section-y` |
| `CustomersWall.astro` | `px-page-x py-section-y bg-ink` | Full-bleed `bg-ink`; inner `.container-spine py-section-y` |
| `WorldReach.astro` | `px-page-x py-section-y` | Full-bleed `bg-paper`; inner `.container-spine py-section-y` |
| `QuoteCTA.astro` | `px-page-x py-section-y-major bg-ink` | Full-bleed `bg-ink`; inner `.container-spine py-section-y` (**retires section-y-major**) |

### Inner pages — EN (8 files)

| File | Migration |
|------|-----------|
| `src/pages/about.astro` | Header + 6 body sections → `.container-spine py-section-y` each |
| `src/pages/contact.astro` | Header + contact-form → `.container-spine` |
| `src/pages/products/index.astro` | Header + lines grid → `.container-spine` |
| `src/pages/products/[line].astro` | Header + subcategories + filter row → `.container-spine` |
| `src/pages/products/[line]/[slug].astro` | Existing `stage-grid` → `.container-spine` |
| `src/pages/field-reports/index.astro` | Header + grid → `.container-spine` |
| `src/pages/field-reports/[slug].astro` | Existing `stage-grid` → `.container-spine` |
| `src/pages/partners/[slug].astro` | Outer wrapper → `.container-spine` |
| `src/pages/privacy.astro`, `src/pages/terms.astro` | Existing `stage-grid` → `.container-spine` |

### Inner pages — AR mirrors (9 files)

Identical migrations to the EN counterparts in `src/pages/ar/`. The `.container-spine` is direction-agnostic via `margin-inline`/`padding-inline`.

### Component-level callers of `stage-grid` (10 files)

`src/components/partners/{ProductLinesTable,ReportsByPartner}.astro`, `src/components/products/{ApplicationRatesTable,CompatibilityMatrix,PesticideDetail,RelatedProducts,SeedDetail,WhyThisMatters,FilterPills,ProductsToolbar}.astro`, `src/components/reports/ReportHero.astro` — all switch `.stage-grid col-start-2` or `px-page-x` → `.container-spine`.

### Retire after migration

- `tailwind.config.mjs:57` — remove `'page-x': 'var(--page-margin-x)'` (kept here as the final cleanup step; intentionally NOT removed in the foundation layer so home + inner pages can migrate one at a time without breaking).
- `src/styles/global.css:110-117` — remove `.stage-grid` definition.
- `tailwind.config.mjs:51` — remove `'section-y-major': '200px'` (unused after QuoteCTA migration).

## What does NOT change

- **Content.** Source of truth at `docs/zagros-source-of-truth.md` is authoritative; no content edits.
- **Tokens' values.** All three spine numbers (`--stage-max-width`, `--page-margin-x`, `--section-y`) already exist with the right values.
- **AR locale logic.** Direction-agnostic `margin-inline`/`padding-inline` handles RTL automatically.
- **Internal card rhythm** (gap-sp-N inside cards). Audit item A2 (card-*-gap tokens) is still deferred; this spec doesn't touch it.
- **Animation, color, typography** beyond the peer-type rationalization noted above.

## Testing strategy

- **Tests stay green** — 94/94. The migration doesn't touch any test-facing logic. If a snapshot test exists for these files, regenerate after eyeballing the diff.
- **Build stays green** — 100 pages.
- **Manual visual check at 4 breakpoints:** 360, 390, 414, 1440. Mobile-first verification per user's constraint. Verify a vertical line down the page touches the Nav logo's left edge, every section's first content element, and the Footer's first column — at every breakpoint.
- **Mobile drawer:** at <1024px the hamburger button + drawer trigger work; drawer dismisses on backdrop/escape; CTA pill at the drawer foot is tappable.
- **AR locale:** load `/ar/` at the same 4 breakpoints. Same vertical-line alignment from the right edge inward.
- **WCAG re-verify:** UtilityBar phone link still 44×44 after the chrome refactor.

## Phasing (the plan will expand on this)

The migration is too large for one commit. Plan into phases, commit each:

1. **Phase 1:** Add `.container-spine` to `src/styles/global.css`. No callers yet. Build green.
2. **Phase 2:** Migrate chrome (UtilityBar, Nav, Breadcrumb, CaptionStrip, Footer). Commit.
3. **Phase 3:** Migrate home sections (8 of 9 — Hero is the exception, but still gets `.container-spine` for foreground content). Commit.
4. **Phase 4:** Migrate inner-page bodies (EN + AR + component callers). Commit.
5. **Phase 5:** Peer type-scale rationalization (QuoteCTA h2 align to shared clamp, etc.). Commit.
6. **Phase 6:** Cleanup — retire `px-page-x`, `.stage-grid`, `section-y-major`. Commit.

Each phase has its own verification gate. Between phases, build + tests must stay green.

## Risk and reversibility

- **Risk:** medium. 30+ files, ~10 commits worth of work, but every step is mechanical. The biggest unknown is how the Footer rewrite reads — moving from `col-start-{7,9,11,13}` to `grid grid-cols-12 col-span-3`-style will change column proportions subtly.
- **Reversibility:** every phase is its own commit. If Phase 4 looks wrong, revert it without losing Phase 1-3. Foundation commit `e13b5ea` (the quick-wins) is independent and stays whichever way the spine goes.

## Definition of done

1. `.container-spine` is the only horizontal-alignment primitive in `src/`.
2. Every content region uses it. Verified by `grep -rl "px-page-x\|stage-grid" src/` returning empty.
3. Every content section uses `py-section-y`. Verified by grep on `py-sp-9\|py-sp-10\|py-section-y-major` returning empty in `src/components/home/` and `src/pages/` (modulo Hero).
4. Mobile drawer works at 360px. Tests + build green.
5. Vertical-line alignment check passes at 360 / 390 / 414 / 1440 / 1440 wider — Nav logo, every section's content-start, Footer first column all on one line.
6. AR locale parity verified at same breakpoints.
7. WCAG 2.5.5 still passes on UtilityBar phone link after chrome refactor.
8. DESIGN.md updated to reflect `.container-spine` as the spine primitive (§101 new section after Layout primitives §101).

## Open items deferred from the audit

After this spec lands, the audit's still-open items shrink to:
- **A2** — `card-*-gap` orphan tokens (separate cycle)
- **C1, C2, C3, C5** — nav internal polish (Phase 5-equivalent work, separate cycle)
- **D1, D3, D4, D5, D6** — footer internal polish (some closed by the Footer rewrite in Phase 2; rest in a follow-up)
- **E3, E4, E5, E6, E7, E8, E9** — section rhythm sub-items (mostly closed by Phases 3+5; rest a follow-up)
