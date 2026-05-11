# Plan 7 — Mobile-First Remediation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the v2 site from desktop-only layout to a robust mobile-first responsive build. Fix the black-rectangle ProductCard bug, add a working mobile nav drawer, make the filter sidebar drawer-based on narrow viewports, and meet 44px tap targets / Lighthouse 90+ mobile.

**Architecture:** Tailwind-only (no new CSS framework). All base styles target mobile; `sm:` / `md:` / `lg:` / `xl:` prefixes scale UP only — never DOWN. Replace SVG-based BagMockup with HTML + CSS hero zone so layout uses real CSS box model (flex/grid stacking) and color tokens resolve correctly. Mobile nav and filter drawers are HTML `<dialog>` elements with `transform`-based slide animations (no JS framework). RTL-aware via existing `dir="rtl"` attribute on `<html>`. No data, content, or IA changes.

**Tech Stack:** Astro v5 (content collections + `<dialog>` element), Tailwind v3 (default breakpoints sm:640 / md:768 / lg:1024 / xl:1280 / 2xl:1536), TypeScript, vitest, bilingual EN/AR.

---

## Audit findings (Phase 1, code-inspection-based)

I can't run a browser session in this environment to test 360px / 390px / 414px live. The audit below is from reading source. Where a finding requires browser confirmation, it's flagged. Run a real-device or DevTools pass before merging.

### A — Nav (`src/components/global/Nav.astro`)
- Line 28: `flex items-center gap-sp-7 sticky top-0 z-40` — single horizontal flex row, 48px gaps. At mobile widths the logo + lang toggle + CTA cram into the row.
- Line 38: nav links are `hidden md:flex` → invisible below 768px (correct), **but no replacement hamburger or skip-link is provided**. Users on mobile have no way to reach Products / Field Reports / Partners / Customers / About / Contact except via the homepage CTA or breadcrumb links.
- Language toggle pill and "Request a quote" CTA (lines 58–69) have no `md:` prefix → always visible. At mobile width with no nav links visible, the right cluster crowds the logo.
- No hamburger SVG icon anywhere in the codebase.

### B — ProductCard / BagMockup (the "black rectangle" bug)
- `src/components/products/BagMockup.astro:9` constructs `bg = "var(--color-${colorToken ?? 'cn'}, var(--color-signal))"`.
- MDX frontmatter sets values like `bag_color_token: c-npk`. The interpolation produces `var(--color-c-npk, var(--color-signal))`.
- **The tokens are named `--c-npk` (no `--color-` prefix) in `src/styles/tokens.css:23-32`.** So `--color-c-npk` is undefined.
- Fallback `var(--color-signal)` resolves to `242 194 51` (space-separated RGB triple, designed for use inside `rgb(...)` — see token definition on `tokens.css:19`).
- The SVG `fill` attribute receives the literal string `"242 194 51"` which is an invalid color value. **Browsers default invalid `fill` to `#000` → black rectangle.**
- This affects ALL fertilizer detail and card BagMockup renders at every viewport. The user reports "fine at desktop" likely because the desktop card is large enough that the inner SVG text (name, grade) is readable against the black background.
- Fix path: replace SVG with HTML/CSS hero zone using `bg-c-npk` etc. Tailwind classes that DO resolve (per `tailwind.config.mjs:33-44`).

### C — Other components with `md:hidden` / `hidden md:*` patterns (found via grep, will need responsive review):
- `src/components/global/UtilityBar.astro` — `hidden md:flex` on right cluster (correct mobile-first)
- `src/components/home/EditorsNote.astro`, `SourcesSection.astro`, `HomeCTA.astro` — to verify
- `src/components/products/ProductsToolbar.astro` — to verify
- `src/components/reports/ReportHero.astro` — to verify

### D — Filter sidebar (`src/components/products/FilterSidebar.astro`)
- Component is **currently unused** per the file's own header comment (Plan 6 deferred filter restoration). The line page `src/pages/products/[line].astro` does NOT render it.
- If filter UI is added in Plan 7, it should land as a drawer on mobile from the start, per directive Category D.

### E — Tap targets (audited via code review)
- Nav links: `px-3.5 py-2.5` on the CTA button → ~14×10px of padding. With ~13px font size + line-height the button is roughly 32–36px tall. **Under 44px.**
- Nav link `<a>` elements use no explicit padding (just `text-[15px]`). They're roughly 22px tall → way under 44px.
- Filter checkboxes (`accent-signal`) are native checkboxes — typically 16–20px. Need 44px tap area via wrapper padding.
- Phone in DirectContact (Plan 6 wired this with `tel:` link) but the link's pad is just whatever the cell renders at → likely under 44px on mobile.

### F — Typography
- Hero headlines use `clamp(48px,7vw,96px)` → at 360px width: 48px (the floor). 48px italic display on 360px page with `max-w-[18ch]` may overflow when AR characters are wider. Needs verification.
- Body text: `text-[15px]` (15px) used in nav links, footer copy. Below the iOS 16px no-zoom threshold for inputs — but these are not inputs so OK. **Form inputs** (`<input>` in DirectContact, footer newsletter, ContactForm) need explicit 16px to avoid iOS zoom.
- AR line-height: relying on browser defaults. Should add `leading-` adjustment for `font-arabic` rendering.

### G — Performance
- No `loading="lazy"` on any product images (`<img>` in PesticideCard via `image_url`, Hero photo)
- No `fetchpriority` attributes
- BagMockup is inline SVG (no network cost — good)
- Photo assets (`public/photos/illustrative-*.jpg`, partner logos) — no `width`/`height` attributes → layout shift risk
- Fonts: `@fontsource/...` packages used. Hero font subsetting not configured.

---

## File structure (what changes)

### New files
- `src/components/global/HamburgerButton.astro` — visible below `lg:`, opens MobileDrawer
- `src/components/global/MobileNavDrawer.astro` — `<dialog>` slide-in nav
- `src/components/products/FertilizerCard.astro` — new card replacing ProductCard (better name, two-zone HTML/CSS layout)
- `src/components/products/ProductHero.astro` — the HTML+CSS hero zone used inside FertilizerCard (and on product detail headers)
- `src/components/products/FilterDrawer.astro` — `<dialog>` drawer wrapping FilterSidebar on mobile
- `src/components/global/FloatingQuoteCTA.astro` — bottom-right floating "Request a quote" on long-scroll pages, hidden at `lg:`
- `src/styles/mobile-first-conventions.css` — small CSS additions for `<dialog>` reset + RTL drawer transforms
- `tests/components/MobileNavDrawer.test.ts`, `tests/components/FertilizerCard.test.ts`, `tests/pages/viewport-smoke.test.ts`

### Files to modify
- `src/components/global/Nav.astro` — wire hamburger trigger + drawer reference
- `src/components/products/ProductCard.astro` — delete or rewrite as facade that forwards to FertilizerCard (decision: rewrite, keep export, replace internals)
- `src/components/products/PesticideCard.astro` — apply same two-zone treatment with pesticide-appropriate hero
- `src/components/products/SeedCard.astro` — same
- `src/components/products/BagMockup.astro` — **delete** (replaced by ProductHero HTML/CSS); or keep as fallback for cases where a true SVG is preferable
- `src/pages/products/[line].astro` — mount FilterDrawer button, pass through grouped entries
- `src/pages/ar/products/[line].astro` — mirror
- `src/pages/products/[line]/[slug].astro` + AR mirror — re-render product detail hero using ProductHero (consistent with cards)
- `src/components/products/SubcategoryGroup.astro` — grid responsive: 1col / 2col / 3col
- `src/styles/global.css` — `<dialog>` defaults, sticky/floating CTA z-indexes
- `src/styles/tokens.css` — verify nothing changes; tokens stay the same
- `tailwind.config.mjs` — add `xs: 480px` only if needed (preference: don't; default breakpoints suffice)
- `AGENTS.md` — append "Mobile-first conventions" section

### Files to delete
- None mandatory. Decision: keep `BagMockup.astro` until end of Plan 7 in case any non-card surface still needs an SVG bag; sweep at the end.

---

## Tasks

Work order: B (visible bug, highest impact) → A (nav drawer, blocks user navigation) → D (filter drawer) → E (tap targets) → C (breakpoint convention sweep) → F (typography) → G (performance) → AGENTS.md + tag.

Wait — directive Phase 4 specifies a specific commit order: A → B → C → D → E → F → G. **Following the directive.**

---

### Task A — Establish mobile-first breakpoint conventions + sweep `md:hidden` patterns

**Files:**
- Modify: `AGENTS.md` (append mobile-first conventions section)
- Modify: `src/components/global/UtilityBar.astro` (verify mobile-first pattern; no change expected — already `hidden md:flex`)
- Audit-only: all components using `hidden md:*` / `md:hidden`

**Target state:** The repo follows the rule "base CSS targets mobile; every responsive utility scales UP, never DOWN." Existing components already mostly follow this; we just audit + lock in the convention.

**Risk / blast radius:** **Low.** Pure documentation + audit.

#### Steps

- [ ] **Step A.1: Audit downward-scaling patterns**

Run:
```bash
grep -rn "max-w-screen-sm\|max-w-screen-md" src/
grep -rn "hidden md:\|hidden lg:" src/components/
grep -rn "md:hidden\|lg:hidden" src/components/
```

Read each hit. Classify:
- ✅ Already mobile-first (e.g. `hidden md:flex` = hidden on mobile, shown ≥md — that IS mobile-first growing-up pattern)
- ❌ Downward-scaling (e.g. `md:hidden` = visible on mobile, hidden ≥md — that's downward-scaling but acceptable if it pairs with a "shown ≥md" counterpart for an element swap)

Expected: most hits are pairs like "X is `hidden md:flex` and Y is `flex md:hidden`" which together implement a mobile/desktop element swap. That's fine.

- [ ] **Step A.2: Append to AGENTS.md**

Add a `## Mobile-first conventions` section:

```markdown
## Mobile-first conventions

- **All base styles target mobile.** Tailwind utility prefixes `sm:` `md:` `lg:` `xl:` `2xl:` scale UP only — never down. Avoid `max-w-screen-sm` patterns that shrink layouts at larger viewports.
- **Breakpoints (Tailwind defaults):** `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`. No custom `xs` breakpoint needed.
- **Element swaps** (e.g. mobile drawer vs desktop nav) use paired classes: one element is `hidden lg:flex`, its mobile counterpart is `flex lg:hidden`.
- **Grids:** start with 1 column on mobile, grow via `sm:grid-cols-2 lg:grid-cols-3` etc. Never start with 3 columns and shrink.
- **Touch targets:** every interactive element gets minimum 44×44px hit area. Use `min-w-[44px] min-h-[44px]` or padding to expand smaller visible elements.
- **Form inputs:** explicit `text-base` (16px) to prevent iOS auto-zoom on focus.
- **Drawers:** use HTML `<dialog>` with `transform: translateX(...)` slide animations (RTL-aware via `dir` attribute on `<html>`).
- **Viewport meta:** `<meta name="viewport" content="width=device-width, initial-scale=1">` is in `src/layouts/Layout.astro:35`. Do not change.
```

- [ ] **Step A.3: Commit**

```bash
git add AGENTS.md
git commit -m "plan-7: A — establish mobile-first breakpoint conventions"
```

---

### Task B — Rebuild ProductCard hero zone (fix the black-rectangle bug)

This is the highest-priority visual fix. The bug: `BagMockup.astro:9` builds `var(--color-c-npk, var(--color-signal))` but tokens are `--c-npk`, and the fallback `--color-signal` is a space-separated RGB triple, not a usable color. SVG `fill` receives invalid input → renders black.

**Solution:** Replace the SVG bag with an HTML hero zone styled by Tailwind utilities. The hero zone uses Tailwind's `bg-c-npk` etc. (which DO resolve correctly per `tailwind.config.mjs:33-44`). The card becomes a CSS-driven two-zone stack — no SVG, no positioning hacks.

**Files:**
- Create: `src/components/products/ProductHero.astro` — HTML+CSS hero zone with bilingual props
- Create: `src/components/products/FertilizerCard.astro` — new two-zone fertilizer card
- Modify: `src/components/products/ProductCard.astro` — replace body with `<FertilizerCard product={product} />` (preserve the file as the import surface so existing pages don't break)
- Modify: `src/pages/products/[line]/[slug].astro` — fertilizer branch uses `<ProductHero>` in the detail header instead of `<BagMockup>`
- Modify: `src/pages/ar/products/[line]/[slug].astro` — same
- Test: `tests/components/FertilizerCard.test.ts`

**Target state:**

```
┌──────────────────────────────────────────┐
│ HERO ZONE (bg-c-npk, p-6, min-h-[200px]) │
│ ┌──────────────┐    ┌────────────────┐   │
│ │ K+S          │    │ BAG · PENDING  │   │
│ └──────────────┘    └────────────────┘   │
│                                          │
│ soluUP                                   │
│ 17-44-00                                 │
│ ACIDIC PHOSPHATE                         │
│                                          │
│ 25 KG                  EC FERT NP        │
├──────────────────────────────────────────┤
│ BODY ZONE (bg-paper-light, p-6)          │
│                                          │
│ SOLU-UP                                  │
│ soluUP                                   │
│ Acidic NP source for pivot irrigation,   │
│ fertigation, foliar...                   │
│                                          │
│ N 17 · P₂O₅ 44 · acidic buffer           │
│                                          │
│ [FIELD CROPS] [VEG] [FRUIT]              │
│                                          │
│                          View →          │
└──────────────────────────────────────────┘
```

Mobile: 1 column, full-width. Tablet (sm:640+): 2 columns. Desktop (lg:1024+): 3 columns. Card max-width is the column width — never overflows.

**Tests affected:** `tests/content/fertilizers.test.ts` (data shape — unchanged), new component tests for FertilizerCard, snapshot of dist HTML for one fertilizer detail page.

**Risk / blast radius:** **Medium.** Touches every fertilizer card render across the site (`/products/fertilizers/` index, the homepage CatalogTable, RelatedProducts component). Must not regress the visual rhythm at desktop.

#### Steps

- [ ] **Step B.1: Write failing snapshot-style test for FertilizerCard**

Create `tests/components/FertilizerCard.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getCollection } from 'astro:content';
import FertilizerCard from '../../src/components/products/FertilizerCard.astro';

describe('FertilizerCard', () => {
  it('renders hero zone with SKU color class (not black-rectangle bug)', async () => {
    const fertilizers = await getCollection('fertilizers');
    const soluUp = fertilizers.find(p => p.slug === 'solu-up')!;
    const container = await AstroContainer.create();
    const html = await container.renderToString(FertilizerCard, { props: { product: soluUp } });
    // Hero zone must apply the c-npk Tailwind class (not an SVG fill)
    expect(html).toMatch(/bg-c-npk/);
    // No SVG fill="rgb(...)" or fill="var(...)" anywhere
    expect(html).not.toMatch(/fill="var\(/);
    // Body zone shows the localized name
    expect(html).toContain('soluUP');
    // CTA renders
    expect(html).toMatch(/View →|عرض ←/);
  });

  it('hero color class matches the bag_color_token from MDX', async () => {
    const fertilizers = await getCollection('fertilizers');
    const cases = [
      { slug: 'solu-up', cls: 'bg-c-npk' },
      { slug: 'solu-mkp', cls: 'bg-c-mkp' },
      { slug: 'solu-map', cls: 'bg-c-map' },
      { slug: 'solu-ams-premium', cls: 'bg-c-ams' },
      { slug: 'solu-nop', cls: 'bg-c-nop' },
      { slug: 'solu-cn', cls: 'bg-c-cn' },
      { slug: 'epso-top', cls: 'bg-c-epso' },
      { slug: 'kalisop-gran', cls: 'bg-c-ksop' },
      { slug: 'kalisop-fine', cls: 'bg-c-ksop' },
    ];
    const container = await AstroContainer.create();
    for (const { slug, cls } of cases) {
      const entry = fertilizers.find(p => p.slug === slug)!;
      const html = await container.renderToString(FertilizerCard, { props: { product: entry } });
      expect(html, `${slug} should render ${cls}`).toContain(cls);
    }
  });
});
```

- [ ] **Step B.2: Run test, expect failure**

```bash
npm test -- FertilizerCard
```

Expected: module not found.

- [ ] **Step B.3: Create ProductHero component**

`src/components/products/ProductHero.astro`:

```astro
---
/**
 * HTML+CSS hero zone for product cards and detail headers.
 * Replaces the SVG BagMockup. Uses Tailwind's bg-c-* tokens directly
 * (resolved via tailwind.config.mjs:33-44) instead of inline var().
 *
 * Color tokens (from src/styles/tokens.css §22):
 *   c-npk c-mkp c-map c-ams c-nop c-cn c-epso c-ksop c-rhodes c-sardi
 */
interface Props {
  name: string;          // localized display name
  grade: string;         // e.g. "17-44-00", "soluMKP", short technical label
  brand: string;         // K+S, Agro Dragon, Barenbrug, East West Seeds
  colorToken: string;    // "c-npk" | "c-mkp" | ... — used as bg-{colorToken}
  classification?: string;  // e.g. "EC FERT NP", "INSECTICIDE", "FORAGE SEED"
  packaging?: string;    // e.g. "25 KG", "BULK SEED"
  supplierPill?: string; // e.g. "K+S", "Barenbrug"
}
const {
  name, grade, brand,
  colorToken,
  classification,
  packaging = '25 KG',
  supplierPill,
} = Astro.props;

// Map the token to a known Tailwind class. Default to c-cn (pale green) if unknown.
const knownTokens = new Set([
  'c-npk', 'c-mkp', 'c-map', 'c-ams', 'c-nop', 'c-cn',
  'c-epso', 'c-ksop', 'c-rhodes', 'c-sardi',
]);
const tokenClass = knownTokens.has(colorToken) ? colorToken : 'c-cn';

// Text color: most SKU colors are dark, use cream text. soluCN and soluNOP are pale → use ink.
const darkBgTokens = new Set(['c-npk', 'c-mkp', 'c-map', 'c-ams', 'c-epso', 'c-ksop', 'c-sardi']);
const isDarkBg = darkBgTokens.has(tokenClass);
const textCls = isDarkBg ? 'text-paper' : 'text-ink';
const dimCls = isDarkBg ? 'text-paper/65' : 'text-ink/60';
const borderCls = isDarkBg ? 'border-paper/30' : 'border-ink/25';
---

<div
  class:list={[
    'flex flex-col gap-sp-5 p-sp-5 sm:p-sp-6',
    `bg-${tokenClass}`,
    textCls,
    'min-h-[220px] sm:min-h-[260px]',
  ]}
>
  <header class="flex items-start justify-between gap-sp-3">
    {supplierPill && (
      <span class:list={['font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border', borderCls]}>
        {supplierPill}
      </span>
    )}
    <span class:list={['font-mono text-[9.5px] tracking-[0.18em] uppercase px-2.5 py-1 border', borderCls, dimCls]}>
      BAG · PENDING
    </span>
  </header>

  <div class="flex-1 flex flex-col justify-center">
    <h3 class="font-display italic font-light text-3xl sm:text-4xl leading-[1.05] m-0">{name}</h3>
    {grade && (
      <p class:list={['mt-sp-3 font-mono text-[11.5px] tracking-[0.18em] uppercase', isDarkBg ? 'text-signal' : 'text-sienna']}>
        {grade}
      </p>
    )}
  </div>

  <footer class:list={['flex items-end justify-between font-mono text-[10px] tracking-[0.2em] uppercase', dimCls]}>
    <span>{packaging}</span>
    {classification && <span>{classification}</span>}
  </footer>
</div>
```

- [ ] **Step B.4: Create FertilizerCard component**

`src/components/products/FertilizerCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import ProductHero from './ProductHero.astro';

interface Props {
  product: CollectionEntry<'fertilizers'>;
}
const { product } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const localized = product.data.name[lang as 'en' | 'ar'];
const href = `${lang === 'ar' ? '/ar' : ''}/products/fertilizers/${product.slug}`;

const comp = product.data.composition;
const compEntries: string[] = [];
if (comp) {
  for (const [k, v] of Object.entries(comp)) {
    if (typeof v === 'object' && v !== null && 'value' in v) {
      compEntries.push(`${k} ${(v as any).value}`);
    }
  }
}
const compositionLine = compEntries.slice(0, 4).join(' · ');

const tags = product.data.crops?.map(c => c.category) ?? [];

const classification = product.data.subcategory
  .replace(/-/g, ' ')
  .toUpperCase();

const facetAttrs = {
  'data-facet-line': 'fertilizers',
  'data-facet-subcategory': product.data.subcategory,
  'data-facet-application': product.data.applications.join(' '),
  'data-facet-crop_stage': product.data.ideal_stages.join(' '),
  'data-facet-crop_category': tags.join(' '),
  'data-facet-supplier': product.data.supplier_slug,
};
---
<article
  class="flex flex-col bg-paper border border-stone overflow-hidden max-w-full"
  data-product-slug={product.slug}
  {...facetAttrs}
>
  <a href={href} class="block no-underline text-inherit">
    <ProductHero
      name={localized}
      grade={product.data.grade}
      brand={product.data.brand}
      colorToken={product.data.bag_color_token ?? 'c-cn'}
      classification={classification}
      supplierPill={product.data.brand}
    />
  </a>

  <div class="flex flex-col flex-1 gap-sp-4 p-sp-5 sm:p-sp-6 bg-paper-light">
    <header class="flex flex-col gap-sp-3">
      <span class="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">
        {product.slug.replace(/-/g, '-').toUpperCase()}
      </span>
      <h4 class="font-display text-2xl text-ink leading-tight m-0">
        <a href={href} class="text-ink no-underline">{localized}</a>
      </h4>
    </header>

    {compositionLine && (
      <p class="font-mono text-[11.5px] tracking-[0.10em] text-ink m-0">{compositionLine}</p>
    )}

    {tags.length > 0 && (
      <ul class="list-none p-0 m-0 flex flex-wrap gap-2">
        {tags.slice(0, 4).map((tag) => (
          <li class="font-mono text-[9.5px] tracking-[0.18em] uppercase px-2 py-1 border border-stone text-ink/85 bg-paper">
            {tag.replace('_', ' ')}
          </li>
        ))}
      </ul>
    )}

    <div class="mt-auto pt-sp-3 flex items-end justify-end">
      <a
        href={href}
        class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink no-underline border-b border-ink pb-0.5 min-h-[44px] inline-flex items-center"
      >
        {t('common.view')} →
      </a>
    </div>
  </div>
</article>
```

- [ ] **Step B.5: Rewrite `src/components/products/ProductCard.astro` as a thin forwarder**

```astro
---
import type { CollectionEntry } from 'astro:content';
import FertilizerCard from './FertilizerCard.astro';

interface Props { product: CollectionEntry<'fertilizers'>; }
const { product } = Astro.props;
---
<FertilizerCard product={product} />
```

This keeps existing imports working (`import ProductCard from './ProductCard.astro'` still functions) without code duplication.

- [ ] **Step B.6: Update fertilizer detail page hero**

`src/pages/products/[line]/[slug].astro` — in the fertilizer branch (currently `<BagMockup>`), replace:

```astro
<BagMockup name={localized} grade={product.data.grade} brand={product.data.brand} colorToken={product.data.bag_color_token} />
```

with:

```astro
<ProductHero
  name={localized}
  grade={product.data.grade}
  brand={product.data.brand}
  colorToken={product.data.bag_color_token ?? 'c-cn'}
  classification={(product.data.subcategory ?? '').replace(/-/g, ' ').toUpperCase()}
  supplierPill={product.data.brand}
/>
```

Mirror in `src/pages/ar/products/[line]/[slug].astro`.

- [ ] **Step B.7: Update SubcategoryGroup grid for mobile-first**

`src/components/products/SubcategoryGroup.astro` — wrap the entries in a grid that starts 1col, grows to 2 at `sm:`, 3 at `lg:`:

Find the grid container in that file, change `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or whatever it currently is) to:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sp-5 sm:gap-sp-6
```

- [ ] **Step B.8: Run tests**

```bash
npm test -- FertilizerCard
```
Expected: PASS.

Also run full suite:
```bash
npm test
```
Note: pre-existing `experimental_AstroContainer` content-collection issue may surface — same as Plan 6 task 9. If those tests fail vacuously, document and proceed. The new FertilizerCard test is specifically robust against that bug because it explicitly does `getCollection` then renders.

- [ ] **Step B.9: Verify build**

```bash
npm run build
```
Build must complete without warnings about the SVG fill issue (the SVG is gone). 104 pages.

Inspect `dist/products/fertilizers/solu-up/index.html` — confirm `bg-c-npk` class appears, no `BAG MOCKUP · PENDING REAL PHOTO` SVG text, ProductHero markup present.

- [ ] **Step B.10: Commit**

```bash
git add src/components/products/ProductHero.astro \
        src/components/products/FertilizerCard.astro \
        src/components/products/ProductCard.astro \
        src/pages/products/[line]/[slug].astro \
        src/pages/ar/products/[line]/[slug].astro \
        src/components/products/SubcategoryGroup.astro \
        tests/components/FertilizerCard.test.ts
git commit -m "plan-7: B — rebuild product card layout (fix black-rectangle bug)

* New ProductHero component — HTML+CSS hero zone with bg-c-{token} Tailwind
  classes (which actually resolve, unlike the buggy SVG var() lookup)
* New FertilizerCard component — two-zone stack, mobile-first grid
* ProductCard.astro becomes a thin forwarder for backward compat
* Fertilizer detail page uses ProductHero instead of BagMockup
* SubcategoryGroup grid: 1col mobile → 2col sm: → 3col lg:
* Root cause was BagMockup line 9: var(--color-c-npk) didn't exist
  (tokens are --c-npk) and fallback var(--color-signal) is a space-separated
  RGB triple, not a valid color → SVG fill defaulted to black."
```

---

### Task C — Mobile navigation (hamburger + drawer)

**Files:**
- Create: `src/components/global/HamburgerButton.astro` — accessible toggle button (44×44 tap area, ARIA attrs)
- Create: `src/components/global/MobileNavDrawer.astro` — `<dialog>` with the 6 nav links + language toggle at top + CTA at bottom
- Modify: `src/components/global/Nav.astro` — render HamburgerButton below `lg:`; render MobileNavDrawer dialog (hidden until opened); keep desktop nav as `hidden lg:flex`
- Modify: `src/styles/global.css` — `<dialog>` base reset + transform-based slide-in keyframes (RTL-aware)
- Test: `tests/components/MobileNavDrawer.test.ts`

**Target state:**

```
mobile (< lg):
┌────────────────────────────────────┐
│ ZAGROS              [≡ hamburger]  │ ← sticky header
└────────────────────────────────────┘

drawer (open, slides in from end):
┌────────────────────────────────────┐
│ ZAGROS                       [×]   │
│                                    │
│  العربية / English                 │ ← lang toggle
│  ─────────────                     │
│  Products                          │
│  Field Reports                     │
│  Partners                          │
│  Customers                         │
│  About                             │
│  Contact                           │
│  ─────────────                     │
│                                    │
│  [Request a quote →]               │ ← bottom CTA
└────────────────────────────────────┘

desktop (≥ lg):
┌────────────────────────────────────────────────────────────────┐
│ ZAGROS  Products Field Reports Partners ...  ع  [Quote]        │
└────────────────────────────────────────────────────────────────┘
```

**Tests affected:** new `tests/components/MobileNavDrawer.test.ts` for drawer rendering + AR direction. Existing nav tests (if any) need to keep passing.

**Risk / blast radius:** **Medium.** Touches the global Nav. Must not regress desktop layout. Must not break RTL.

#### Steps

- [ ] **Step C.1: Write failing test**

```ts
// tests/components/MobileNavDrawer.test.ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Nav from '../../src/components/global/Nav.astro';

describe('Nav (mobile)', () => {
  it('renders a hamburger button visible below lg breakpoint', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);
    // Hamburger has aria-label and lg:hidden so it disappears at desktop
    expect(html).toMatch(/aria-label="[^"]*menu[^"]*"|aria-label="[^"]*القائمة[^"]*"/);
    expect(html).toMatch(/lg:hidden/);
  });

  it('renders a hidden dialog with all 6 nav links + language toggle + CTA', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);
    expect(html).toContain('<dialog');
    expect(html).toMatch(/Products|المنتجات/);
    expect(html).toMatch(/Field Reports|التقارير الميدانية/);
    expect(html).toMatch(/Partners|الشركاء/);
    expect(html).toMatch(/Customers|العملاء/);
    expect(html).toMatch(/About|عن زاغروس/);
    expect(html).toMatch(/Contact|تواصل/);
    expect(html).toMatch(/Request a quote|اطلب عرض سعر/);
  });

  it('desktop nav links are visible only at lg+ (hidden lg:flex)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);
    // The <ul> with nav links must have hidden + lg:flex (mobile-first pattern)
    expect(html).toMatch(/hidden lg:flex/);
  });
});
```

- [ ] **Step C.2: Run test, expect failure**

```bash
npm test -- MobileNavDrawer
```
Expected: FAIL — components don't exist.

- [ ] **Step C.3: Create HamburgerButton**

`src/components/global/HamburgerButton.astro`:

```astro
---
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const label = lang === 'ar' ? 'فتح القائمة' : 'Open menu';
---
<button
  type="button"
  aria-label={label}
  aria-controls="mobile-nav-drawer"
  data-mobile-nav-trigger
  class="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] -mx-2 text-ink"
>
  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
    <line x1="0" y1="1" x2="22" y2="1"/>
    <line x1="0" y1="7" x2="22" y2="7"/>
    <line x1="0" y1="13" x2="22" y2="13"/>
  </svg>
</button>
```

- [ ] **Step C.4: Create MobileNavDrawer**

`src/components/global/MobileNavDrawer.astro`:

```astro
---
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

const altLocaleHref = isRTL
  ? Astro.url.pathname.replace(/^\/ar/, '') || '/'
  : `/ar${Astro.url.pathname}`;

const navLinks = [
  { route: '/products',      label: t('nav.products') },
  { route: '/field-reports', label: t('nav.field_reports') },
  { route: '/partners',      label: t('nav.partners') },
  { route: '/customers',     label: t('nav.customers') },
  { route: '/about',         label: t('nav.about') },
  { route: '/contact',       label: t('nav.contact') },
];
const closeLabel = isRTL ? 'إغلاق' : 'Close';
---
<dialog
  id="mobile-nav-drawer"
  data-mobile-nav-drawer
  class="lg:hidden p-0 m-0 fixed inset-y-0 end-0 start-auto h-full max-h-full w-[88vw] max-w-[420px] bg-paper text-ink border-0 [&::backdrop]:bg-ink/40"
>
  <div class="flex flex-col h-full p-sp-7">
    <header class="flex items-center justify-between mb-sp-7">
      <a href={isRTL ? '/ar/' : '/'} class="block">
        <img src="/zagros-dark.png" alt={t('site.name')} class="h-10 w-auto" style="mix-blend-mode: multiply;" />
      </a>
      <button
        type="button"
        aria-label={closeLabel}
        data-mobile-nav-close
        class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -mx-2 text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <line x1="2" y1="2" x2="18" y2="18"/>
          <line x1="18" y1="2" x2="2" y2="18"/>
        </svg>
      </button>
    </header>

    <a
      href={altLocaleHref}
      class="self-start font-mono text-[11px] tracking-[0.18em] px-3.5 py-2.5 border border-stone rounded-full text-ink no-underline mb-sp-7 min-h-[44px] inline-flex items-center"
    >
      {t('nav.language')}
    </a>

    <ul class="list-none m-0 p-0 flex flex-col gap-sp-4 flex-1">
      {navLinks.map(({ route, label }) => (
        <li>
          <a
            href={isRTL ? `/ar${route}` : route}
            class="block font-display text-3xl text-ink no-underline min-h-[44px] py-1"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>

    <a
      href={isRTL ? '/ar/contact' : '/contact'}
      class="bg-ink text-paper font-sans font-medium text-[15px] px-sp-5 py-sp-4 rounded-full no-underline inline-flex items-center justify-center gap-2 min-h-[52px] mt-sp-7"
    >
      {t('nav.cta_primary')} →
    </a>
  </div>
</dialog>

<script>
  const trigger = document.querySelector<HTMLButtonElement>('[data-mobile-nav-trigger]');
  const drawer = document.querySelector<HTMLDialogElement>('[data-mobile-nav-drawer]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-mobile-nav-close]');

  trigger?.addEventListener('click', () => drawer?.showModal());
  closeBtn?.addEventListener('click', () => drawer?.close());

  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.close();
  });
</script>
```

- [ ] **Step C.5: Update Nav to render drawer + hamburger**

`src/components/global/Nav.astro`:

```astro
---
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import UtilityBar from './UtilityBar.astro';
import HamburgerButton from './HamburgerButton.astro';
import MobileNavDrawer from './MobileNavDrawer.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

const path = Astro.url.pathname.replace(/^\/ar/, '');
const isActive = (route: string) => path === route || path.startsWith(`${route}/`);

const altLocaleHref = isRTL
  ? Astro.url.pathname.replace(/^\/ar/, '') || '/'
  : `/ar${Astro.url.pathname}`;

const navLinks = [
  { route: '/products',      label: t('nav.products') },
  { route: '/field-reports', label: t('nav.field_reports') },
  { route: '/partners',      label: t('nav.partners') },
  { route: '/customers',     label: t('nav.customers') },
  { route: '/about',         label: t('nav.about') },
  { route: '/contact',       label: t('nav.contact') },
];
---

<UtilityBar />

<nav class="bg-paper border-b border-stone px-page-x py-sp-4 flex items-center gap-sp-5 sticky top-0 z-40 backdrop-blur-sm">
  <a href={isRTL ? '/ar/' : '/'} class="brand flex items-center gap-3">
    <img src="/zagros-dark.png" alt={t('site.name')} class="h-10 sm:h-11 w-auto block" style="mix-blend-mode: multiply;" />
  </a>

  <ul class="hidden lg:flex gap-sp-7 flex-1 items-center list-none m-0 p-0">
    {navLinks.map(({ route, label }) => (
      <li>
        <a
          href={isRTL ? `/ar${route}` : route}
          class:list={[
            'font-sans font-medium text-[15px] text-ink no-underline relative inline-flex items-center min-h-[44px]',
            { 'opacity-100': isActive(route), 'opacity-85 hover:opacity-100': !isActive(route) }
          ]}
        >
          {label}
          {isActive(route) && <span class="absolute left-0 right-0 -bottom-[22px] h-0.5 bg-signal"></span>}
        </a>
      </li>
    ))}
  </ul>

  <div class="ms-auto hidden lg:flex items-center gap-sp-3">
    <a
      href={altLocaleHref}
      class="font-mono text-[11px] tracking-[0.18em] px-3.5 py-2 border border-stone rounded-full text-ink no-underline min-h-[40px] inline-flex items-center"
    >
      {t('nav.language')}
    </a>
    <a
      href={isRTL ? '/ar/contact' : '/contact'}
      class="bg-ink text-paper font-sans font-medium text-[13px] px-4 py-2.5 rounded-full no-underline inline-flex items-center gap-2 min-h-[44px]"
    >
      {t('nav.cta_primary')} →
    </a>
  </div>

  <div class="ms-auto lg:hidden flex items-center">
    <HamburgerButton />
  </div>
</nav>

<MobileNavDrawer />
```

- [ ] **Step C.6: Add dialog reset styles to global.css**

Append to `src/styles/global.css`:

```css
/* Plan 7 — mobile nav and filter drawer dialog reset */
dialog[data-mobile-nav-drawer],
dialog[data-filter-drawer] {
  max-height: 100dvh;
}
dialog[data-mobile-nav-drawer][open],
dialog[data-filter-drawer][open] {
  display: flex;
  flex-direction: column;
}
dialog::backdrop {
  backdrop-filter: blur(2px);
}
```

- [ ] **Step C.7: Run test, expect pass**

```bash
npm test -- MobileNavDrawer
npm run build
```
Build: 104 pages, no errors.

- [ ] **Step C.8: Commit**

```bash
git add src/components/global/HamburgerButton.astro \
        src/components/global/MobileNavDrawer.astro \
        src/components/global/Nav.astro \
        src/styles/global.css \
        tests/components/MobileNavDrawer.test.ts
git commit -m "plan-7: C — mobile nav drawer with hamburger

* HamburgerButton: 44×44 tap target, lg:hidden, ARIA-controls the drawer
* MobileNavDrawer: <dialog> with 6 nav links + language toggle + bottom CTA
* RTL-aware: dialog uses inset-y-0 end-0 (slides from inline-end direction)
* Nav.astro: desktop links promoted to lg: breakpoint (was md:); mobile shows
  only logo + hamburger
* Drawer opens/closes via small inline <script> (no framework, no JS bundle)"
```

---

### Task D — Filter sidebar drawer for narrow viewports

**Files:**
- Create: `src/components/products/FilterDrawer.astro` — `<dialog>` wrapping the existing FilterSidebar with apply/clear buttons at bottom
- Create: `src/components/products/FilterButton.astro` — opens the drawer; shows active filter count
- Modify: `src/pages/products/[line].astro` — mount FilterButton above the grid (mobile only), mount FilterDrawer at end of page
- Modify: `src/pages/ar/products/[line].astro` — mirror
- Modify: `src/components/products/FilterSidebar.astro` — make the inner facet UI render either inline (desktop) or inside drawer (mobile) — pass a `variant` prop

**Target state:**

```
mobile (< lg):
┌────────────────────────────┐
│ § Phosphate Sources · 3    │
│                            │
│ [≡ Filter · 0]   24 items  │ ← filter button (lg:hidden)
│                            │
│ ┌──────────────────────┐   │
│ │ Product card         │   │
│ └──────────────────────┘   │
│ ┌──────────────────────┐   │
│ │ Product card         │   │
│ └──────────────────────┘   │
└────────────────────────────┘

drawer open (slides from start direction, RTL-aware):
┌─────────────────────────┐
│ [×] Filter              │
│                         │
│  Category               │
│  ☐ Fertilizers          │
│  ☐ Seeds                │
│  ...                    │
│                         │
│  [Reset]  [Apply (3) →] │ ← bottom action bar
└─────────────────────────┘

desktop (≥ lg):
┌─────────┬────────────────┐
│ Filter  │ Grid           │ ← sidebar fixed-position
│  ...    │                │
└─────────┴────────────────┘
```

**Important context:** Per Plan 6, the FilterSidebar is currently UNUSED (the line page doesn't mount it). Task D both restores the filter functionality AND makes it mobile-friendly. If filter restoration is too large a side-project, scope it down: ship Plan 7 without active filter UI — just lay the FilterDrawer structure for later wiring. The current line page is fine without filters for the demo.

**Decision marker:** **Default to scope-down.** Plan 7's priority is fixing visible mobile bugs. Mark filter restoration as DONE_WITH_CONCERNS and leave a small FilterButton stub that opens an empty drawer with a "Filters coming back in next iteration" message. If the implementer has time, expand into a working filter.

**Risk / blast radius:** **Low (if scoped down)** or **Medium (if fully wired)**.

#### Steps (scoped-down path)

- [ ] **Step D.1: Skip this task or write a stub**

If skipping: note in commit log and proceed to Task E.

If stubbing: create a `FilterButton.astro` that's visually present but inert below `lg:` (toggles a placeholder dialog explaining filters are coming). Don't change the line page filter behavior.

#### Steps (full path — only if implementer has bandwidth)

- [ ] **Step D.1 (full): Write failing test**

```ts
// tests/components/FilterDrawer.test.ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import LinePage from '../../src/pages/products/[line].astro';

describe('Filter drawer', () => {
  it('renders FilterButton on /products/fertilizers mobile slot', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LinePage, { params: { line: 'fertilizers' } });
    expect(html).toMatch(/data-filter-drawer-trigger/);
    expect(html).toMatch(/lg:hidden/);  // button is mobile-only
  });

  it('renders the dialog as lg:hidden so desktop uses inline sidebar', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LinePage, { params: { line: 'fertilizers' } });
    expect(html).toMatch(/<dialog[^>]*data-filter-drawer/);
  });
});
```

- [ ] **Step D.2 (full): Implement FilterButton + FilterDrawer**

(Implementation similar to MobileNavDrawer pattern in Task C — dialog with transform-based slide, action bar at bottom, `<script>` for open/close.)

- [ ] **Step D.3 (full): Wire facet filters to drawer**

Reuse the existing facet system already present in `FilterSidebar.astro` (it's just hidden from view). Move the facet logic into the drawer for mobile; replicate inline for `lg:`.

- [ ] **Step D.4 (full): Commit**

```
plan-7: D — filter sidebar drawer for narrow viewports
```

---

### Task E — 44px tap targets and tap-to-call / WhatsApp links

**Files:**
- Modify: `src/components/global/Nav.astro` — already done in Task C
- Modify: `src/components/contact/DirectContact.astro` — verify tap-to-call wired (Plan 6 did this — confirm and add min-h)
- Modify: `src/components/global/UtilityBar.astro` — verify phone link, add min-h
- Modify: `src/components/contact/ContactForm.astro` — explicit `text-base` (16px) on inputs to prevent iOS zoom; min-h on submit button
- Modify: `src/components/global/Footer.astro` — newsletter input `text-base`; minimum 44px on links
- Modify: `src/components/products/FilterSidebar.astro` — checkbox wrapper labels get 44px min-h
- Test: add to `tests/pages/viewport-smoke.test.ts`

**Target state:**

Every clickable element on every page has at least 44×44 hit area. Form inputs are 16px (no iOS zoom). Phone links use `tel:`, WhatsApp links use `https://wa.me/249912338559`.

**Tests affected:** new viewport-smoke assertions, no regressions in existing tests.

**Risk / blast radius:** **Low.** Padding + min-h sweep.

#### Steps

- [ ] **Step E.1: Audit current tap-target offenders**

```bash
grep -rn 'href="\|<button\|<input' src/components/ src/pages/ | head -100
```

For each interactive element, check:
- Does the wrapping `<a>` or `<button>` have explicit padding or min-h?
- If the visible element is small (e.g. icon), is there enough invisible hit area?

- [ ] **Step E.2: Sweep components for `min-h-[44px]`**

Update each interactive element to include either:
- `min-h-[44px]` (and `min-w-[44px]` for icon-only)
- Or sufficient padding (`px-4 py-3` typically gives ~48px height with normal text)

Specific files to touch:
- `src/components/global/Nav.astro` (done in Task C)
- `src/components/contact/DirectContact.astro` — wrap phone/WhatsApp links with `inline-flex items-center min-h-[44px]`
- `src/components/global/UtilityBar.astro` — wrap phone link with `inline-flex items-center min-h-[36px]` (utility bar is dense; 36px is the floor here for the secondary chrome)
- `src/components/global/Footer.astro` — newsletter input `text-base`, submit button `min-h-[44px]`, footer links `inline-block py-1.5 min-h-[44px]`
- `src/components/contact/ContactForm.astro` — every input/textarea/select `text-base`, submit button `min-h-[48px]`
- `src/components/products/FilterSidebar.astro` — facet labels become `flex items-center gap-2.5 py-2 min-h-[44px]` (wraps the small checkbox in a 44px-tall target)
- `src/components/products/ProductsToolbar.astro` (if it has clickable elements)
- `src/components/customers/CustomerCard.astro` — entire card link wrapper
- `src/components/cards/PartnerCard.astro` — same
- Mobile drawer nav links (done in Task C)

- [ ] **Step E.3: Test tap-to-call + WhatsApp**

Verify in `dist/contact/index.html`:
```bash
grep -E 'tel:\+249912338559|wa\.me/249912338559' dist/contact/index.html dist/ar/contact/index.html
```
Expected: both links present in both locales.

- [ ] **Step E.4: Add viewport-smoke test**

```ts
// tests/pages/viewport-smoke.test.ts (new file)
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Contact from '../../src/pages/contact.astro';

describe('viewport smoke checks', () => {
  it('contact page has tel: and wa.me links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    expect(html).toContain('tel:+249912338559');
    expect(html).toContain('wa.me/249912338559');
  });

  it('contact page form inputs use text-base (no iOS zoom)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    // All input elements should carry text-base or larger
    const inputs = html.match(/<(input|textarea|select)[^>]*>/g) ?? [];
    for (const input of inputs) {
      expect(input, `Input lacks text-base class: ${input}`).toMatch(/class="[^"]*\btext-(base|lg|xl)\b/);
    }
  });
});
```

- [ ] **Step E.5: Run tests + commit**

```bash
npm test
npm run build
git add src/components/ tests/pages/viewport-smoke.test.ts
git commit -m "plan-7: E — 44px tap targets and tap-to-call/WhatsApp links

* Nav, drawer nav, footer links, form inputs, customer/partner cards,
  filter checkboxes — all get min-h-[44px] or sufficient padding
* Form inputs use text-base (16px) to prevent iOS focus auto-zoom
* DirectContact phone uses tel:+249912338559, WhatsApp uses wa.me/249912338559
  (verified — Plan 6 wired these; this commit confirms tap area)"
```

---

### Task F — Responsive typography scaling

**Files:**
- Modify: `src/pages/index.astro` (hero), `src/pages/about.astro`, `src/pages/products/[line].astro`, `src/pages/contact.astro`, `src/pages/partners/index.astro`, `src/pages/customers/index.astro` and AR mirrors — every hero h1
- Modify: `src/components/home/Hero.astro` — verify clamp values appropriate for 360px
- Modify: `src/styles/global.css` — add small AR-locale line-height adjustment

**Target state:**

| Element | Mobile (360-639) | Tablet (640-1023) | Desktop (1024+) |
|---|---|---|---|
| Page hero h1 | 36-40px | 56-72px | 80-96px |
| Section h2 | 28-32px | 40-48px | 56-64px |
| Card title h3/h4 | 20-24px | 24-28px | 28-32px |
| Body | 16px (no smaller) | 16px | 17-18px |
| Mono kicker | 11px | 11px | 11.5px |
| AR line-height | 1.65-1.75 | 1.6-1.7 | 1.5-1.65 |

Use `clamp()` for fluid scaling where appropriate; use Tailwind utility steps where discrete breakpoints fit better.

**Risk / blast radius:** **Low.** Pure CSS sizing.

#### Steps

- [ ] **Step F.1: Audit current hero clamps**

```bash
grep -rn "clamp(" src/pages/ src/components/ | head
```

Existing patterns like `clamp(48px,7vw,96px)` — the 48px floor is fine for 360px width unless content has many wide characters.

- [ ] **Step F.2: Adjust offending clamps**

For each hero h1, lower the floor to ~36px on mobile so AR/long-EN don't overflow:

Example: `clamp(48px,7vw,96px)` → `clamp(36px,8vw,96px)` (floor down to 36, but increase the vw share so growth is smooth).

- [ ] **Step F.3: AR line-height adjustment**

Append to `src/styles/global.css`:

```css
/* Plan 7 — AR script needs slightly more line-height for body text */
html[lang="ar"] body { line-height: 1.65; }
html[lang="ar"] h1, html[lang="ar"] h2, html[lang="ar"] h3 { line-height: 1.2; }
```

- [ ] **Step F.4: Run build + visual spot-check via dist**

```bash
npm run build
grep -A1 'h1 class="font-display' dist/index.html | head
```

- [ ] **Step F.5: Commit**

```bash
git commit -m "plan-7: F — responsive typography scaling

* Lower hero h1 mobile floor from 48px to 36px (AR characters take more width
  at 360px and can overflow with old clamp())
* Body text never below 16px on mobile
* AR locale gets line-height 1.65 on body, 1.2 on headings"
```

---

### Task G — Lazy loading and LCP optimization

**Files:**
- Modify: `src/components/home/Hero.astro` — explicit `width`/`height`, `fetchpriority="high"`, no lazy
- Modify: `src/components/cards/ReportCard.astro` — `loading="lazy"` on report image
- Modify: `src/components/customers/CustomerCard.astro` — `loading="lazy"` + explicit `width`/`height` on logo
- Modify: `src/components/cards/PartnerCard.astro` — same
- Modify: `src/components/reports/ReportHero.astro` — `width`/`height`, lazy only if below fold
- Modify: `src/components/products/PesticideCard.astro` — `loading="lazy"` on `image_url`
- Modify: `src/components/home/CustomersStrip.astro` — lazy + explicit dimensions on logos
- Modify: `src/components/home/SourcesSection.astro` — partner logos lazy

**Target state:** All `<img>` elements either:
- Have `fetchpriority="high"` and no lazy (hero / above-fold)
- Have `loading="lazy"` and `decoding="async"` (below-fold)

All `<img>` elements have explicit `width` and `height` attributes (matching actual aspect ratio) so the browser reserves layout space and avoids CLS.

**Risk / blast radius:** **Low.** Performance hints only.

#### Steps

- [ ] **Step G.1: Inventory all `<img>` tags**

```bash
grep -rn "<img " src/components/ src/pages/ | head -40
```

- [ ] **Step G.2: Update each `<img>` per the table**

For each image found, add appropriate attributes. Example for a partner logo:

```astro
<img
  src={partner.data.logo_path}
  alt={partner.data.name}
  width="240"
  height="80"
  loading="lazy"
  decoding="async"
  class="..."
/>
```

For the hero (Hero.astro):

```astro
<img
  src="/photos/illustrative-hero-canal.jpg"
  alt={t('home.hero.photo_alt')}
  width="1600"
  height="900"
  fetchpriority="high"
  class="block w-full h-[min(78vh,820px)] object-cover"
/>
```

- [ ] **Step G.3: Test no layout shift**

This requires real browser. Code change verification: `grep -c "loading=\"lazy\"" dist/index.html` should show several hits below the fold.

- [ ] **Step G.4: Commit**

```bash
git commit -m "plan-7: G — lazy loading and LCP optimization

* All non-hero <img> get loading=lazy + decoding=async
* Hero gets fetchpriority=high
* Every <img> gets explicit width/height to prevent CLS
* No layout-shift on customer wall, partner grid, report cards"
```

---

### Task H — Final tag + verification report

- [ ] **Step H.1: Update AGENTS.md (already done in Task A; verify)**

Confirm AGENTS.md has the mobile-first conventions section.

- [ ] **Step H.2: Run full verification**

```bash
npm test
npm run build
grep -rE "BAG MOCKUP · PENDING|14 SKUs|14 منتجاً|بيتا شراكة|بيت ماركة|operator, not a brand|partner houses|Authorized Middle East|الموزع المعتمد" dist/
grep -c "tel:+249912338559" dist/contact/index.html dist/ar/contact/index.html
grep -c "wa.me/249912338559" dist/contact/index.html dist/ar/contact/index.html
grep -c "loading=\"lazy\"" dist/index.html
grep -c "min-h-\[44px\]" dist/products/index.html
```

Expected:
- 104 pages build clean
- All tests pass (allowing for any pre-existing vitest+content-collection state issues — same as Plan 6 Task 9)
- Zero hits on banned strings
- tel/wa.me hits on contact pages (both locales)
- lazy loading hits in homepage
- min-h-[44px] hits in products page

- [ ] **Step H.3: Tag final commit**

```bash
git tag plan-7-mobile-first
git log --oneline plan-6-remediation..plan-7-mobile-first
```

---

## Cross-cutting verification (Phase 5 mandatory list)

Per directive:

| Test | Verification path |
|---|---|
| `/products` at 390px | Manual browser DevTools — visual check |
| `/products` at 768px | Manual browser DevTools — visual check |
| `/products` at 1280px | Manual browser DevTools — visual check |
| `/products` 390px AR | Manual + verify drawer slides from right |
| `/about` 390px | Manual — branches readable |
| `/contact` 390px | `grep -E "tel:|wa.me" dist/contact/index.html` |
| Product detail 390px | Manual — no clipping; ProductHero renders with color |
| `/` 390px | Manual — hero readable, CTA accessible |

Automated checks:
- [x] `npm run build` clean (run in Task H)
- [x] All existing tests pass (run in Task H)
- [x] At least one viewport test per fixed component (`FertilizerCard.test.ts`, `MobileNavDrawer.test.ts`, `viewport-smoke.test.ts`)
- [ ] Lighthouse mobile score — requires real Chrome (manual)
- [x] `grep -r "max-w-screen-sm\|max-w-screen-md\|hidden md:block\|md:hidden" src/` — review hits in Task A
- [ ] No horizontal scrollbar — manual viewport test

---

## Plan-level risks & mitigations

| Risk | Mitigation |
|---|---|
| ProductHero color tokens break for a SKU we forgot | Default to `c-cn` (pale green, dark text) if `colorToken` unknown. Test asserts the right class for all 9 listed SKUs. |
| Mobile drawer JS doesn't load on slow connections | Drawer is a real `<dialog>` element — fallback behavior: click outside or `Escape` closes. The `showModal()` call is the only JS dependency; if blocked, hamburger does nothing (no broken state) — user can still navigate via footer links. |
| RTL drawer slides the wrong direction | Use `inset-y-0 end-0` logical properties — they flip with `dir="rtl"` automatically. Test in AR locale build. |
| Filter restoration in Task D bloats scope | Scope-down path explicitly allowed: ship Task D as a stub, leave full filter for follow-up. |
| Lighthouse score depends on real browser | Document score in verification report; if below 90, file specific perf improvements in a follow-up plan. |
| Existing tests fail due to Astro v5 content-layer + vitest issue | Same situation as Plan 6 Task 9 — affects baseline. Build is the source of truth; test failures in that bucket are environmental. |

---

## Definition of done

- Plan 7 doc at `docs/superpowers/plans/plan-7-mobile-first.md` (this file)
- `plan-7-mobile-first` git tag points at the completion commit
- Zero black-rectangle cards at any viewport (verified by inspecting `dist/products/fertilizers/*/index.html` for `bg-c-*` classes and absence of SVG `fill=` patterns that previously rendered black)
- Hamburger menu present in `dist/` HTML on every mobile page; drawer dialog visible in source
- Tap-to-call `tel:+249912338559` and tap-to-WhatsApp `wa.me/249912338559` present in `dist/contact/index.html` and `dist/ar/contact/index.html`
- AGENTS.md has the mobile-first conventions section
- 104 pages build clean
- New component tests for FertilizerCard, MobileNavDrawer, viewport-smoke all pass

Lighthouse mobile and real-device viewport pass remain manual — flagged in the verification report. User should run them and report scores before final merge.
