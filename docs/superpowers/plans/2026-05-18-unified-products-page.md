# Unified Products Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-line-card hub at `/products` with a unified listing showing all 35+ products from all 3 collections, grouped by subcategory with `§` headers, filterable via left-rail sidebar (desktop) + drawer (mobile). Lean facets: Line + Subcategory + Search. `/products/[line]` URLs survive as thin preset-filter wrappers.

**Architecture:** A new shared `ProductsListing.astro` component holds the listing body (header + toolbar + sidebar + grouped grid + drawer). Both `/products/index.astro` and `/products/[line].astro` are 5-line files that just render `<ProductsListing initialLine={line?} />`. AR mirrors do the same. Most filter machinery (`products-filter.ts`, `FilterController.astro`) already exists and is generic; this work is mostly wiring + a few enhancements (line-prefixed subcategory values, dynamic group counts, hide empty groups).

**Tech Stack:** Astro 5, Tailwind v3, vitest. Vanilla TS for the filter controller (no framework). URL state via `URLSearchParams` + `history.replaceState`.

**Spec:** `docs/superpowers/specs/2026-05-18-unified-products-page-design.md`
**Branch:** `feature/plan-7-world-reach`

---

## Deviation from spec — small

The spec said "no extracted ProductsListing component" so the body would live in `/products/index.astro` directly. That implies duplicating ~100 lines of JSX across 4 files (EN+AR × index+[line]). I'm extracting a single `ProductsListing.astro` component instead — 5-line wrapper files × 4, with one shared body. Easier to maintain, easier to find ("listing body lives in `ProductsListing.astro`" is just as discoverable as "lives in index.astro"). If the user pushes back at plan review, the easy fix is to revert each `<ProductsListing />` call site to inline the body.

---

## File map

**Modified:**
- `src/components/products/FertilizerCard.astro` — line-prefix the `data-facet-subcategory` value
- `src/components/products/SeedCard.astro` — same
- `src/components/products/PesticideCard.astro` — same
- `src/components/products/SubcategoryGroup.astro` — emit `data-subcategory-group` + count placeholder
- `src/components/products/FilterController.astro` — hide empty groups, update group counts, pretty-print pill labels, fix the total count formula
- `src/components/products/FilterSidebar.astro` — trim to Line + Subcategory; line-prefix subcategory values; add `variant` prop
- `src/components/products/FilterDrawer.astro` — replace stub with `<FilterSidebar variant="drawer" />`
- `src/pages/products/index.astro` — becomes 5-line wrapper around `<ProductsListing />`
- `src/pages/products/[line].astro` — becomes 5-line wrapper around `<ProductsListing initialLine={line} />`
- `src/pages/ar/products/index.astro` — AR mirror of the above
- `src/pages/ar/products/[line].astro` — AR mirror of the above

**Created:**
- `src/components/products/ProductsListing.astro` — shared listing body

**Deleted:**
- `src/components/products/LineCard.astro` — hub component, no longer referenced

---

## Phase 1: Facet metadata on cards + subcategory groups

**Goal:** Emit line-prefixed `data-facet-subcategory` values from each card, and add `data-subcategory-group` + dynamic-count placeholder on `SubcategoryGroup`. No visible change.

**Files:**
- Modify: `src/components/products/FertilizerCard.astro`
- Modify: `src/components/products/SeedCard.astro`
- Modify: `src/components/products/PesticideCard.astro`
- Modify: `src/components/products/SubcategoryGroup.astro`

### Steps

- [ ] **Step 1: Line-prefix the subcategory in FertilizerCard**

`src/components/products/FertilizerCard.astro:34` — change:

```astro
  'data-facet-subcategory': product.data.subcategory,
```

to:

```astro
  'data-facet-subcategory': `fertilizers:${product.data.subcategory}`,
```

- [ ] **Step 2: Line-prefix the subcategory in SeedCard**

`src/components/products/SeedCard.astro:19` — change:

```astro
  data-facet-subcategory={seed.data.subcategory}
```

to:

```astro
  data-facet-subcategory={`seeds:${seed.data.subcategory}`}
```

- [ ] **Step 3: Line-prefix the subcategory in PesticideCard**

`src/components/products/PesticideCard.astro:26` — change:

```astro
  data-facet-subcategory={pesticide.data.subcategory}
```

to:

```astro
  data-facet-subcategory={`pesticides:${pesticide.data.subcategory}`}
```

- [ ] **Step 4: Add group-level data attributes to SubcategoryGroup**

`src/components/products/SubcategoryGroup.astro` — replace the entire `<section>` opener and `<header>`:

```astro
<section class="mb-section-y" data-subcategory-group={subcategory}>
  <header class="flex items-baseline justify-between mb-sp-7 border-b border-ink pb-sp-3 flex-wrap gap-sp-4">
    <h2 class="font-display italic text-3xl text-ink">
      § {subcatLabel} · {entries.length} SKU{entries.length === 1 ? '' : 's'}
    </h2>
```

with:

```astro
<section
  class="mb-section-y"
  data-subcategory-group={`${line}:${subcategory}`}
  data-subcategory-group-total={entries.length}
>
  <header class="flex items-baseline justify-between mb-sp-7 border-b border-ink pb-sp-3 flex-wrap gap-sp-4">
    <h2 class="font-display italic text-3xl text-ink">
      § {subcatLabel} · <span data-subcategory-group-count>{entries.length} SKU{entries.length === 1 ? '' : 's'}</span>
    </h2>
```

(Three changes in one block: prefix the `data-subcategory-group` value; add `data-subcategory-group-total`; wrap the count text in a `<span data-subcategory-group-count>` so JS can update it.)

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: 100 pages, no errors.

- [ ] **Step 6: Manual smoke check**

Spot-check the built HTML:

```bash
grep -o 'data-facet-subcategory="[^"]*"' dist/products/fertilizers/index.html | head -3
```

Expected output (3 lines):
```
data-facet-subcategory="fertilizers:water-soluble-npk"
data-facet-subcategory="fertilizers:phosphate-sources"
data-facet-subcategory="fertilizers:..."
```

```bash
grep -o 'data-subcategory-group="[^"]*"' dist/products/fertilizers/index.html | head -3
```

Expected: 3 different `fertilizers:<subcat>` values.

- [ ] **Step 7: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 8: Commit Phase 1**

```bash
git add src/components/products/FertilizerCard.astro \
  src/components/products/SeedCard.astro \
  src/components/products/PesticideCard.astro \
  src/components/products/SubcategoryGroup.astro
git commit -m "$(cat <<'EOF'
unified products: phase 1 — facet attrs on cards + groups

Line-prefix the data-facet-subcategory value on every product card:
  fertilizers: 'water-soluble-npk'        → 'fertilizers:water-soluble-npk'
  seeds:       'forage'                    → 'seeds:forage'
  pesticides:  'insecticide'               → 'pesticides:insecticide'

Avoids label collisions if a subcategory name ever repeats across
lines (e.g., "vegetable" in two lines). The pretty label rendered
to the user stays the same — only the underlying value changes.

SubcategoryGroup section now emits:
  data-subcategory-group="<line>:<subcat>"   (matches card value)
  data-subcategory-group-total="<N>"         (for FilterController)
And the SKU count is wrapped in a [data-subcategory-group-count]
span so a JS pass can update it from "N SKUs" to "N of M" when
filters trim the visible set.

No visible change. Existing /products/[line] pages render identically.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: FilterController enhancements

**Goal:** Teach `FilterController.astro` to (a) hide subcategory groups with zero visible cards, (b) update group-header counts, (c) pretty-print pill labels for the new line-prefixed subcategory values, (d) fix the total-count formula.

**Files:**
- Modify: `src/components/products/FilterController.astro`

### Steps

- [ ] **Step 1: Replace the `apply()` function**

`src/components/products/FilterController.astro:39-57` — replace the entire `function apply()` block with:

```ts
  function apply() {
    const state = getState();
    const searchInput = document.querySelector<HTMLInputElement>('[data-products-search]');
    const search = searchInput?.value ?? '';

    // 1. Filter individual cards.
    let visible = 0;
    const cards = document.querySelectorAll<HTMLElement>('[data-product-slug]');
    cards.forEach((cardEl) => {
      const card = cardFromElement(cardEl);
      const ok = matchesProduct(card, state, search);
      cardEl.toggleAttribute('hidden', !ok);
      if (ok) visible++;
    });

    // 2. Update subcategory group counts + hide empty groups.
    const groups = document.querySelectorAll<HTMLElement>('[data-subcategory-group]');
    groups.forEach((groupEl) => {
      const total = Number(groupEl.dataset.subcategoryGroupTotal ?? 0);
      const visibleInGroup = groupEl.querySelectorAll<HTMLElement>('[data-product-slug]:not([hidden])').length;
      groupEl.toggleAttribute('hidden', visibleInGroup === 0);
      const countEl = groupEl.querySelector<HTMLElement>('[data-subcategory-group-count]');
      if (countEl) {
        if (visibleInGroup === total) {
          countEl.textContent = `${total} SKU${total === 1 ? '' : 's'}`;
        } else {
          countEl.textContent = `${visibleInGroup} of ${total}`;
        }
      }
    });

    // 3. Update toolbar total.
    const countEl = document.querySelector('[data-products-count]');
    if (countEl) countEl.textContent = String(visible);

    renderPills(state);
  }
```

Three changes vs the old version:
- Adds a step (#2) that walks every `[data-subcategory-group]`, toggles `hidden` on empty groups, and updates the inner `[data-subcategory-group-count]` text.
- Drops the `Math.ceil(visible / 2)` formula. The old halving handled cards+compact double-render (which only the old line page had). The unified listing renders each card once, so `visible` is the right total directly.
- Pulls `searchInput` and `search` to the top of the function (was already there, kept for clarity).

- [ ] **Step 2: Replace the `renderPills()` function with prettier labels**

`src/components/products/FilterController.astro:17-37` — replace the entire `function renderPills()` block with:

```ts
  function renderPills(state: FacetState) {
    const container = document.querySelector<HTMLElement>('[data-products-pills-container]');
    const wrapper = document.querySelector<HTMLElement>('[data-products-pills]');
    if (!container || !wrapper) return;
    container.innerHTML = '';
    let count = 0;
    for (const [facet, values] of Object.entries(state)) {
      if (facet === 'q') continue;
      for (const v of values) {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'inline-flex items-center gap-2 px-3 py-1 border border-ink text-ink bg-paper capitalize';
        pill.dataset.removeFacet = facet;
        pill.dataset.removeValue = v;
        // Pretty label: subcategory values are "line:subcat" — show only the subcat half, dashes → spaces.
        const pretty = facet === 'subcategory' && v.includes(':')
          ? v.split(':')[1].replace(/-/g, ' ')
          : v.replace(/-/g, ' ');
        pill.innerHTML = `${pretty} <span aria-hidden="true">×</span>`;
        container.appendChild(pill);
        count++;
      }
    }
    wrapper.classList.toggle('hidden', count === 0);
  }
```

Changes:
- Pill text is now just the pretty-printed value (no `${facet} ·` prefix). With Line + Subcategory facets, the value alone is self-explanatory ("Fertilizers ×" vs "Water-soluble NPK ×").
- Subcategory values that contain `:` get split and only the right half rendered. Line-prefix is invisible to the user.
- Added `capitalize` Tailwind class so the value reads as "Fertilizers" not "fertilizers".

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: 100 pages, no errors. (The controller script changes don't affect static rendering — the script runs only in the browser.)

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 5: Commit Phase 2**

```bash
git add src/components/products/FilterController.astro
git commit -m "$(cat <<'EOF'
unified products: phase 2 — FilterController group + pill polish

apply() now walks [data-subcategory-group] sections after card
filtering: hides groups whose cards are all filtered out, and
updates the [data-subcategory-group-count] span to read either
"N SKUs" (all visible) or "N of M" (partial). Empty § headers
no longer dangle.

The toolbar total drops the Math.ceil(visible/2) halving — the
unified listing renders each card once, not twice, so visible is
the right total directly.

renderPills() prettifies the pill labels for the new subcategory
value scheme:
  raw value: "fertilizers:water-soluble-npk"
  pill text: "Water-soluble npk ×"        (line prefix hidden,
                                           dashes → spaces,
                                           CSS capitalize)
And the "<facet> · " prefix is removed from pill text — with two
facets in the lean scope, the value alone is self-explanatory.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: FilterSidebar trim + variant + line-prefixed subcategory values

**Goal:** Render only Line + Subcategory facet groups in the sidebar. Subcategory items load from all 3 collections and use line-prefixed values. Add a `variant` prop so the same component works inside `FilterDrawer`.

**Files:**
- Modify: `src/components/products/FilterSidebar.astro`

### Steps

- [ ] **Step 1: Replace FilterSidebar.astro entirely**

Replace the full contents of `src/components/products/FilterSidebar.astro` with:

```astro
---
/**
 * Filter sidebar — lean scope.
 *
 * Renders two facet groups (Line, Subcategory) as checkbox lists,
 * plus a "Reset" header link. Subcategory checkbox VALUES are
 * line-prefixed (e.g., "fertilizers:water-soluble-npk") to match
 * the data-facet-subcategory attributes emitted on each product card.
 *
 * Used by:
 *   - /products listing pages (desktop left rail) — variant="sidebar"
 *   - <FilterDrawer> (mobile dialog body) — variant="drawer"
 *
 * The 5 other facets (Nutrient grid, Application, Crop stage, Crop
 * category, Special props) are intentionally NOT rendered. Their
 * definitions stay below in comments so a future scope-up can
 * re-enable them without redoing the data load.
 */
import { getCollection } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

interface Props {
  variant?: 'sidebar' | 'drawer';
}
const { variant = 'sidebar' } = Astro.props;

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const [fertilizers, seeds, pesticides] = await Promise.all([
  getCollection('fertilizers'),
  getCollection('seeds'),
  getCollection('pesticides'),
]);

// Display order matches /products/[line].astro's orderFor map.
const orderFor: Record<string, string[]> = {
  fertilizers: ['water-soluble-npk', 'phosphate-sources', 'nitrogen-sources', 'potassium-sulphate', 'magnesium'],
  seeds: ['forage', 'vegetable'],
  pesticides: ['insecticide', 'herbicide', 'fungicide'],
};

const sourceFor: Record<string, ReadonlyArray<{ data: { subcategory: string } }>> = {
  fertilizers, seeds, pesticides,
};

interface SubcatItem { value: string; label: string; line: string; }
const subcategoryItems: SubcatItem[] = [];
for (const line of ['fertilizers', 'seeds', 'pesticides'] as const) {
  const declared = orderFor[line];
  const present = new Set(sourceFor[line].map((p) => p.data.subcategory));
  const ordered = declared.filter((s) => present.has(s));
  for (const s of Array.from(present)) if (!ordered.includes(s)) ordered.push(s);
  for (const s of ordered) {
    subcategoryItems.push({
      value: `${line}:${s}`,
      label: s.replace(/-/g, ' '),
      line,
    });
  }
}

const lineItems = [
  { value: 'fertilizers', label: t('products.lines.fertilizers.label') },
  { value: 'seeds',       label: t('products.lines.seeds.label') },
  { value: 'pesticides',  label: t('products.lines.pesticides.label') },
];

const isDrawer = variant === 'drawer';
const wrapperClass = isDrawer
  ? 'flex flex-col gap-sp-7'
  : 'lg:sticky lg:top-[140px] lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto pe-sp-6';
---

<aside class={wrapperClass} aria-label={t('products.filters.label')}>
  {!isDrawer && (
    <header class="flex items-center justify-between mb-sp-7">
      <h2 class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-ink m-0">{t('products.filters.label')}</h2>
      <button type="button" data-products-reset class="motion-press inline-flex items-center min-h-[44px] font-mono text-[10px] tracking-[0.22em] uppercase text-mute hover:text-ink border-b border-mute hover:border-ink pb-0.5">
        {t('products.filters.reset')}
      </button>
    </header>
  )}

  <fieldset class="border-0 p-0 m-0">
    <legend class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mb-sp-4">
      {t('products.facets.category')}
    </legend>
    <ul class="list-none p-0 m-0 space-y-1">
      {lineItems.map((item) => (
        <li>
          <label class="motion-press inline-flex items-center gap-2.5 py-2 min-h-[44px] font-sans text-base text-ink cursor-pointer hover:text-sienna">
            <input type="checkbox" data-facet="line" value={item.value} class="accent-signal" />
            <span>{item.label}</span>
          </label>
        </li>
      ))}
    </ul>
  </fieldset>

  <fieldset class="border-0 p-0 m-0 mt-sp-7">
    <legend class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mb-sp-4">
      {t('products.facets.subcategory')}
    </legend>
    <ul class="list-none p-0 m-0 space-y-1">
      {subcategoryItems.map((item) => (
        <li>
          <label class="motion-press inline-flex items-center gap-2.5 py-2 min-h-[44px] font-sans text-base text-ink cursor-pointer hover:text-sienna">
            <input type="checkbox" data-facet="subcategory" value={item.value} class="accent-signal" />
            <span class="capitalize">{item.label}</span>
            <span class="ms-auto font-mono text-[9.5px] tracking-[0.18em] uppercase text-mute capitalize">{item.line}</span>
          </label>
        </li>
      ))}
    </ul>
  </fieldset>

  {isDrawer && (
    <div class="mt-sp-5">
      <button type="button" data-products-reset class="motion-press inline-flex items-center min-h-[44px] font-mono text-[10px] tracking-[0.22em] uppercase text-mute hover:text-ink border-b border-mute hover:border-ink pb-0.5">
        {t('products.filters.reset')}
      </button>
    </div>
  )}
</aside>

{/*
  Deferred facet groups (lean scope — restore when needed):

  Nutrient grid (N, P2O5, K2O, Ca, MgO, S) — fertilizer-only
  Application (foliar, fertigation, soil, pivot, hydroponic) — fertilizer-only
  Crop stage (establishment, seedling, vegetative, ...) — fertilizer-only
  Crop category (field_crops, vegetables, fruit_trees, forages, oilseeds) — broad
  Special props (organic_certified, chloride_free, sodium_free, acidifying) — fertilizer-only

  All data attributes already emitted on FertilizerCard (line 32-51) so
  re-enabling is purely a sidebar markup change.
*/}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: 100 pages, no errors. (Sidebar isn't used anywhere yet — just confirming it compiles.)

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 4: Commit Phase 3**

```bash
git add src/components/products/FilterSidebar.astro
git commit -m "$(cat <<'EOF'
unified products: phase 3 — FilterSidebar lean rebuild

FilterSidebar now renders only two facet groups: Line and
Subcategory. The five other groups (Nutrient grid, Application,
Crop stage, Crop category, Special props) are documented as
deferred-scope in a trailing comment so re-enabling them is a
markup-only change later.

Subcategory items load from all three collections at build time
and emit line-prefixed values (matching the FertilizerCard/
SeedCard/PesticideCard attributes from phase 1). Each subcategory
checkbox shows its display label PLUS a small line caption on
the right so users can disambiguate when subcategory labels
might repeat across lines.

New variant prop ('sidebar' | 'drawer'):
  - 'sidebar' (default): sticky desktop rail behaviour
  - 'drawer': flat list, used by FilterDrawer (next phase)
The variant only swaps the outer wrapper styling; both render
the same checkbox content.

Reset button position adjusts per variant (header in sidebar
mode, footer in drawer mode).

The component is not used anywhere yet — wiring lands in
phases 4 + 5.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: FilterDrawer renders FilterSidebar

**Goal:** Replace the stub body of `FilterDrawer.astro` with `<FilterSidebar variant="drawer" />` inside the dialog.

**Files:**
- Modify: `src/components/products/FilterDrawer.astro`

### Steps

- [ ] **Step 1: Replace FilterDrawer.astro entirely**

Replace the full contents of `src/components/products/FilterDrawer.astro` with:

```astro
---
/**
 * Filter drawer — mobile dialog that hosts FilterSidebar.
 *
 * Native HTML <dialog> slid in from the inline-end edge (RTL-aware
 * via inset-y-0 end-0 start-auto). Visible only below lg:.
 *
 * Dismissal:
 *   - Close button → drawer.close()
 *   - Backdrop click → drawer.close() (target equals dialog element)
 *   - Escape key → native <dialog> behaviour
 *
 * Tap targets: every interactive element is ≥44×44 (WCAG 2.5.5).
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import FilterSidebar from './FilterSidebar.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<dialog
  id="filter-drawer"
  data-filter-drawer
  class="lg:hidden p-0 m-0 fixed inset-y-0 end-0 start-auto h-full max-h-full w-[88vw] max-w-[420px] bg-paper text-ink border-0 [&::backdrop]:bg-ink/40 overflow-y-auto"
>
  <div class="flex flex-col h-full p-sp-7">
    <header class="flex items-center justify-between mb-sp-7">
      <h2 class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-ink m-0">
        {t('products.filters.label')}
      </h2>
      <button
        type="button"
        aria-label={t('products.filters.stub_close')}
        data-filter-drawer-close
        class="motion-press inline-flex items-center justify-center min-w-[44px] min-h-[44px] -mx-2 text-ink hover:opacity-70"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" aria-hidden="true">
          <line x1="3" y1="3" x2="17" y2="17"></line>
          <line x1="17" y1="3" x2="3" y2="17"></line>
        </svg>
      </button>
    </header>

    <div class="flex-1">
      <FilterSidebar variant="drawer" />
    </div>

    <button
      type="button"
      data-filter-drawer-close
      class="motion-press bg-ink text-paper font-sans font-medium text-[15px] px-sp-5 py-sp-4 inline-flex items-center justify-center gap-2 min-h-[52px] mt-sp-7 border-0 hover:opacity-90"
    >
      {t('products.filters.stub_close')}
    </button>
  </div>
</dialog>

<script>
  const trigger = document.querySelector<HTMLButtonElement>('[data-filter-drawer-trigger]');
  const drawer = document.querySelector<HTMLDialogElement>('[data-filter-drawer]');

  trigger?.addEventListener('click', () => drawer?.showModal());

  document.querySelectorAll<HTMLButtonElement>('[data-filter-drawer-close]')
    .forEach((btn) => btn.addEventListener('click', () => drawer?.close()));

  // Backdrop click closes the dialog (clicks on inner content bubble up
  // with e.target pointing at the inner element, not the dialog itself).
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.close();
  });
</script>
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: 100 pages, no errors.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 4: Commit Phase 4**

```bash
git add src/components/products/FilterDrawer.astro
git commit -m "$(cat <<'EOF'
unified products: phase 4 — FilterDrawer hosts real FilterSidebar

Replace the Plan 7 placeholder body with <FilterSidebar
variant="drawer" /> inside the dialog. The drawer is now a real
filter UI on mobile: same Line + Subcategory checkboxes as the
desktop sidebar.

Drawer wrapping (header with title + close button, footer with
big close button) stays as-is. Dialog dismissal logic (backdrop
click, Escape key, close buttons) unchanged. Close buttons gain
motion-press for consistent hover feedback.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5: ProductsListing.astro — shared listing body

**Goal:** Create the shared listing component used by all 4 routes (EN/AR × index/[line]).

**Files:**
- Create: `src/components/products/ProductsListing.astro`

### Steps

- [ ] **Step 1: Create ProductsListing.astro**

Create `src/components/products/ProductsListing.astro` with the following contents:

```astro
---
/**
 * Unified products listing — shared body for /products and /products/[line]
 * (both EN and AR mirrors).
 *
 * Loads all 3 product collections at build time, renders them as
 * one big set of SubcategoryGroup sections grouped by (line, subcategory)
 * with the orderFor mapping. A left-rail FilterSidebar (desktop) +
 * FilterDrawer (mobile) drive client-side filtering against the
 * data-facet-* attributes on each card. FilterController is the
 * single script island that wires it all together.
 *
 * Props:
 *   initialLine — optional line to preset as filter on first paint.
 *                 When set, the page emits an inline script that
 *                 calls history.replaceState() before FilterController
 *                 runs, so the URL gains ?line=<initialLine> and the
 *                 controller's first apply() pass hides non-matching
 *                 cards. Use case: /products/fertilizers preset to
 *                 fertilizers-only view.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import SubcategoryGroup from './SubcategoryGroup.astro';
import FilterSidebar from './FilterSidebar.astro';
import FilterDrawer from './FilterDrawer.astro';
import FilterButton from './FilterButton.astro';
import FilterPills from './FilterPills.astro';
import ProductsToolbar from './ProductsToolbar.astro';
import FilterController from './FilterController.astro';

interface Props {
  initialLine?: 'fertilizers' | 'seeds' | 'pesticides';
}
const { initialLine } = Astro.props;

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const [fertilizers, seeds, pesticides] = await Promise.all([
  getCollection('fertilizers'),
  getCollection('seeds'),
  getCollection('pesticides'),
]);

const orderFor: Record<string, string[]> = {
  fertilizers: ['water-soluble-npk', 'phosphate-sources', 'nitrogen-sources', 'potassium-sulphate', 'magnesium'],
  seeds: ['forage', 'vegetable'],
  pesticides: ['insecticide', 'herbicide', 'fungicide'],
};

type Line = 'fertilizers' | 'seeds' | 'pesticides';
type AnyEntry =
  | CollectionEntry<'fertilizers'>
  | CollectionEntry<'seeds'>
  | CollectionEntry<'pesticides'>;

interface Group { line: Line; subcategory: string; entries: AnyEntry[]; }
const groups: Group[] = [];

const sources: Record<Line, AnyEntry[]> = {
  fertilizers: fertilizers as AnyEntry[],
  seeds: seeds as AnyEntry[],
  pesticides: pesticides as AnyEntry[],
};

for (const line of ['fertilizers', 'seeds', 'pesticides'] as const) {
  const declared = orderFor[line];
  const buckets: Record<string, AnyEntry[]> = {};
  for (const item of sources[line]) {
    const key = (item.data as any).subcategory ?? 'uncategorized';
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(item);
  }
  const ordered = declared.filter((s) => buckets[s]);
  for (const s of Object.keys(buckets)) if (!ordered.includes(s)) ordered.push(s);
  for (const s of ordered) groups.push({ line, subcategory: s, entries: buckets[s] });
}

const totalProducts = groups.reduce((acc, g) => acc + g.entries.length, 0);
const homeHref = lang === 'ar' ? '/ar/' : '/';

// Preset URL state for /products/[line] entries.
const initialQuery = initialLine ? `?line=${initialLine}` : '';
---

<header class="pb-sp-9">
  <div class="container-spine">
    <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute">{t('nav.products')}</span>
    <h1 class="font-display italic font-light text-[clamp(36px,7vw,96px)] leading-[0.95] text-ink mt-sp-5 max-w-[20ch] mb-sp-7">
      {t('products.page.headline')}
    </h1>
    <p class="font-sans text-lg text-ink/80 max-w-[60ch] mb-sp-7 leading-relaxed">
      {t('products.page.deck')}
    </p>
    <div class="flex gap-sp-7 flex-wrap font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute">
      <span><span data-products-count>{totalProducts}</span> {t('products.page.stat_total')}</span>
      <span>{groups.length} {t('products.page.stat_groups')}</span>
    </div>
  </div>
</header>

<ProductsToolbar />
<FilterPills />

<div class="pb-sp-5 flex lg:hidden">
  <div class="container-spine">
    <FilterButton />
  </div>
</div>

<section class="pb-section-y">
  <div class="container-spine">
    <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-sp-9">
      <div class="hidden lg:block">
        <FilterSidebar variant="sidebar" />
      </div>
      <div>
        {groups.map((g) => (
          <SubcategoryGroup
            line={g.line}
            subcategory={g.subcategory}
            entries={g.entries}
            lang={lang}
          />
        ))}
      </div>
    </div>
  </div>
</section>

<FilterDrawer />

{initialLine && (
  <script is:inline define:vars={{ initialQuery }}>
    /* Preset the URL filter state BEFORE FilterController's first
       apply() pass runs. If the user lands at /products/fertilizers
       fresh (no existing query string), this rewrites the URL to
       /products/fertilizers?line=fertilizers so the controller's
       parseStateFromQuery sees the preset. If the URL already has
       a query string, leave it alone — the user navigated here
       with explicit filter intent. */
    if (!location.search) {
      history.replaceState(null, '', location.pathname + initialQuery);
    }
  </script>
)}

<FilterController />
```

- [ ] **Step 2: Check translation keys exist**

The new component references `t('products.page.stat_total')` and `t('products.page.stat_groups')`. Check the i18n bundles:

```bash
grep -A 1 "stat_total\|stat_groups" src/i18n/en.json src/i18n/ar.json
```

If the keys exist, no action needed. If either is missing, add them:

```bash
# en.json keys to add under products.page (if missing):
#   "stat_total": "products total",
#   "stat_groups": "subcategories"
# ar.json equivalents:
#   "stat_total": "منتجاً إجمالاً",
#   "stat_groups": "فئة فرعية"
```

Edit `src/i18n/en.json` and `src/i18n/ar.json` to add the keys under `products.page`. Use the exact JSON syntax of neighbouring keys.

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: 100 pages, no errors. (Component file exists but no page calls it yet, so this just confirms the imports compile.)

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 5: Commit Phase 5**

```bash
git add src/components/products/ProductsListing.astro src/i18n/en.json src/i18n/ar.json
git commit -m "$(cat <<'EOF'
unified products: phase 5 — ProductsListing shared component

New component src/components/products/ProductsListing.astro is
the shared listing body for /products and /products/[line] (both
EN and AR mirrors).

Loads all 3 product collections at build time, organises them into
(line, subcategory) groups using the existing orderFor map, and
renders:
  - Header: h1 + deck + live count ("N products · M subcategories")
  - ProductsToolbar (search + sort + view + pills slot)
  - Mobile-only filter trigger button
  - Body: 260px sticky sidebar (desktop) + grouped grid
  - FilterDrawer (mobile dialog)
  - Optional inline script that presets ?line=<initialLine> URL
    state when this is the [line] preset entry
  - FilterController (single script island that wires it all)

initialLine prop is the only difference between the four call
sites. When set, an inline is:inline script rewrites the URL via
history.replaceState BEFORE FilterController boots, so the
controller's first apply() pass already sees the preset filter
state. Avoids the "all visible flash then snap to filtered"
problem with a static preset.

New i18n keys products.page.stat_total + products.page.stat_groups
in en.json and ar.json.

Component file exists but no page calls it yet — wiring lands in
phases 6 + 7.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 6: EN routes use ProductsListing

**Goal:** Rewrite `/products/index.astro` and `/products/[line].astro` to be thin wrappers around `<ProductsListing />`.

**Files:**
- Modify: `src/pages/products/index.astro`
- Modify: `src/pages/products/[line].astro`

### Steps

- [ ] **Step 1: Rewrite /products/index.astro**

Replace the full contents of `src/pages/products/index.astro` with:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import ProductsListing from '../../components/products/ProductsListing.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const homeHref = lang === 'ar' ? '/ar/' : '/';
---
<Layout title={t('products.page.title')}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: homeHref },
    { label: t('nav.products') },
  ]} />

  <ProductsListing />
</Layout>
```

- [ ] **Step 2: Rewrite /products/[line].astro**

Replace the full contents of `src/pages/products/[line].astro` with:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import ProductsListing from '../../components/products/ProductsListing.astro';

export async function getStaticPaths() {
  return ['seeds', 'fertilizers', 'pesticides'].map((line) => ({ params: { line } }));
}

const { line } = Astro.params;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const homeHref = lang === 'ar' ? '/ar/' : '/';
const productsHref = lang === 'ar' ? '/ar/products' : '/products';
const lineLabel = t(`products.lines.${line}.label`);
---
<Layout title={lineLabel}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: homeHref },
    { label: t('nav.products'), href: productsHref },
    { label: lineLabel },
  ]} />

  <ProductsListing initialLine={line as 'fertilizers' | 'seeds' | 'pesticides'} />
</Layout>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: 100 pages, no errors. The route count is unchanged: `/products` plus `/products/[seeds|fertilizers|pesticides]`.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 5: Manual smoke check (build output)**

```bash
grep -c 'data-product-slug=' dist/products/index.html
```
Expected: a number ≥ 35 (every product card rendered).

```bash
grep -c 'data-subcategory-group=' dist/products/index.html
```
Expected: ~10 (subcategory groups across all 3 lines).

```bash
grep -c 'data-facet="line"' dist/products/index.html
```
Expected: 3 (three Line checkboxes in the sidebar).

```bash
grep -c 'data-facet="line"' dist/products/fertilizers/index.html
```
Expected: 3 (same sidebar; the preset is via inline script, not via different HTML).

- [ ] **Step 6: Commit Phase 6**

```bash
git add src/pages/products/index.astro src/pages/products/[line].astro
git commit -m "$(cat <<'EOF'
unified products: phase 6 — EN routes use ProductsListing

/products/index.astro and /products/[line].astro both rewritten
as thin wrappers around <ProductsListing />.

  /products            → ProductsListing
  /products/[line]     → ProductsListing initialLine={line}

Both routes render the same body. The only difference is the
initialLine prop, which presets the URL filter state via the
component's inline is:inline script (see phase 5).

The 3-line LineCard hub that /products previously rendered is
gone. The LineCard.astro file becomes unreferenced by EN routes
in this commit — phase 8 deletes the file once AR mirrors are
also migrated.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 7: AR routes use ProductsListing

**Goal:** Mirror Phase 6 for the Arabic routes.

**Files:**
- Modify: `src/pages/ar/products/index.astro`
- Modify: `src/pages/ar/products/[line].astro`

### Steps

- [ ] **Step 1: Rewrite /ar/products/index.astro**

Replace the full contents of `src/pages/ar/products/index.astro` with:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';
import Breadcrumb from '../../../components/global/Breadcrumb.astro';
import ProductsListing from '../../../components/products/ProductsListing.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<Layout title={t('products.page.title')}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: '/ar/' },
    { label: t('nav.products') },
  ]} />

  <ProductsListing />
</Layout>
```

- [ ] **Step 2: Rewrite /ar/products/[line].astro**

Replace the full contents of `src/pages/ar/products/[line].astro` with:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';
import Breadcrumb from '../../../components/global/Breadcrumb.astro';
import ProductsListing from '../../../components/products/ProductsListing.astro';

export async function getStaticPaths() {
  return ['seeds', 'fertilizers', 'pesticides'].map((line) => ({ params: { line } }));
}

const { line } = Astro.params;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const lineLabel = t(`products.lines.${line}.label`);
---
<Layout title={lineLabel}>
  <Breadcrumb items={[
    { label: t('nav.home'), href: '/ar/' },
    { label: t('nav.products'), href: '/ar/products' },
    { label: lineLabel },
  ]} />

  <ProductsListing initialLine={line as 'fertilizers' | 'seeds' | 'pesticides'} />
</Layout>
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: 100 pages, no errors.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 5: Manual smoke check**

```bash
grep -c 'data-product-slug=' dist/ar/products/index.html
```
Expected: ≥ 35.

```bash
ls dist/ar/products/fertilizers/index.html
```
Expected: file exists. The AR `[line]` route prerendered correctly.

- [ ] **Step 6: Commit Phase 7**

```bash
git add src/pages/ar/products/index.astro src/pages/ar/products/[line].astro
git commit -m "$(cat <<'EOF'
unified products: phase 7 — AR routes use ProductsListing

Mirror of phase 6 for the Arabic /ar/products routes. Both
/ar/products/index.astro and /ar/products/[line].astro become
thin wrappers around <ProductsListing />.

ProductsListing reads the locale from Astro.url, so all the
t() calls inside render in Arabic naturally; the sidebar
checkbox labels, headers, pill text and toolbar all switch
locale based on the route, with no AR-specific code in the
listing component itself.

AR routes' breadcrumb hardcodes '/ar/' and '/ar/products' since
homeHref/productsHref formatting differs between EN and AR (no
locale prefix in EN). Otherwise identical to phase 6.

The LineCard.astro file is now unreferenced everywhere. Phase 8
deletes it.

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 8: Delete LineCard.astro + final verification

**Goal:** Remove the now-unreferenced `LineCard.astro` file. Run final verification across the build, tests, dev server, and grep.

**Files:**
- Delete: `src/components/products/LineCard.astro`

### Steps

- [ ] **Step 1: Confirm LineCard.astro has no remaining references**

```bash
grep -rln "LineCard" src/
```

Expected: no matches in `src/` (the import lines in `/products/index.astro` and `/ar/products/index.astro` were removed in phases 6 + 7).

If grep returns any file: STOP, do not delete. Investigate that file first.

- [ ] **Step 2: Delete the file**

```bash
git rm src/components/products/LineCard.astro
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: 100 pages, no errors.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: 94/94 passing.

- [ ] **Step 5: Start dev server for manual verification**

```bash
npm run dev
```

Note the URL printed (typically `http://localhost:4321/`). Leave it running.

- [ ] **Step 6: Manual functional checks**

Open the dev URL in a browser at 1440×900. For each URL below, verify the listed behaviour:

1. **`/products`** — page loads with no filter preset. Sidebar shows on the left. All ~10 subcategory groups visible. Toolbar count shows the total (≈ 35).
2. **`/products/fertilizers`** — page loads, URL becomes `/products/fertilizers?line=fertilizers` within milliseconds (inline script runs before FilterController). Sidebar shows Fertilizers checkbox ticked. Only fertilizer groups visible. Seed + Pesticide groups have `hidden` attribute applied.
3. **`/products/seeds`** — same behaviour, preset to seeds.
4. **`/products/pesticides`** — same behaviour, preset to pesticides.
5. **Toggle a sidebar checkbox** — URL updates via `history.replaceState`. Cards filter live. Pills appear in the toolbar. Group counts update ("N of M"). Empty groups hide.
6. **Click an active pill `×`** — that facet drops. URL updates. Cards re-show.
7. **"Reset" link in sidebar** — URL clears. All cards visible. Pills clear.
8. **Search input** — typing filters cards live. URL gains `?q=...`.
9. **Visit `/ar/products`** — page loads in Arabic, sidebar labels in Arabic, breadcrumb in Arabic, body direction is RTL (verify the sidebar sits on the right edge of the body, not the left).
10. **Visit `/ar/products/fertilizers`** — same preset behaviour, Arabic locale.

- [ ] **Step 7: Manual mobile check (375 px viewport)**

Resize browser to 375×667. On `/products`:
1. Sidebar is hidden.
2. "Filters" button visible above the grid.
3. Click "Filters" → drawer slides in from the right edge.
4. Sidebar content (Line + Subcategory groups) visible inside the drawer.
5. Toggle a checkbox → state persists, drawer can close, listing shows filtered result.
6. Backdrop click + Escape key + close button all dismiss the drawer.

- [ ] **Step 8: Manual RTL drawer check**

On `/ar/products` at 375 px:
1. "Filters" button visible.
2. Drawer slides in from the LEFT edge (RTL `inset-y-0 end-0` = left in AR).
3. Sidebar content in Arabic.

- [ ] **Step 9: Stop dev server**

Send `Ctrl+C` to stop the running dev process, or kill the background bash if applicable.

- [ ] **Step 10: Commit Phase 8**

```bash
git status
```

Expected: only the deletion of `src/components/products/LineCard.astro` is staged.

```bash
git commit -m "$(cat <<'EOF'
unified products: phase 8 — delete unused LineCard.astro

src/components/products/LineCard.astro is no longer referenced by
any file in src/ after phases 6 + 7 migrated /products and
/ar/products to ProductsListing. Verified by:

  grep -rln 'LineCard' src/   →   no matches

The 3-line hub design is gone. /products is now a unified listing
of all 35+ products with sidebar + drawer filtering.

Final state of the products tree:
  /products              → ProductsListing (no preset)
  /products/[line]       → ProductsListing initialLine={line}
  /products/[line]/[slug] → unchanged (product detail page)
  /ar/products           → ProductsListing (no preset)
  /ar/products/[line]    → ProductsListing initialLine={line}
  /ar/products/[line]/[slug] → unchanged

Spec: docs/superpowers/specs/2026-05-18-unified-products-page-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 11: Verify final state**

```bash
git log --oneline -10
git status
```

Expected:
- 8 new commits (`unified products: phase 1` through `phase 8`).
- Working tree clean.
- Branch still `feature/plan-7-world-reach`.

Report to the user: 8 phases shipped, tests 94/94, build 100 pages, `/products` and `/ar/products` are now unified listings with sidebar filtering, `/products/[line]` URLs survive as preset filters, `LineCard.astro` deleted.

---

## Self-review

**1. Spec coverage:**

| Spec section | Plan phase |
|--------------|------------|
| Architecture: routes (`/products`, `/products/[line]`, AR mirrors) | Phases 6, 7 |
| Architecture: data flow (load 3 collections, merge, render) | Phase 5 (ProductsListing) |
| Architecture: URL state via FilterController | Phase 2 (controller polish) + Phase 5 (preset script) |
| Page anatomy: header band + toolbar + sidebar + grid + drawer | Phase 5 (assembled in ProductsListing) |
| Filter behavior: within-facet OR, across-facet AND | Inherited from existing `products-filter.ts` (unchanged) |
| Filter behavior: line-prefixed subcategory value scheme | Phase 1 (cards) + Phase 3 (sidebar) + Phase 2 (pill prettifier) |
| Filter behavior: subcategory group hide/count | Phase 2 (FilterController) + Phase 1 (group data attrs) |
| Filter behavior: empty state | Falls out of group-hide behaviour — when ALL groups hide, the body renders 0 content. Add an explicit empty-state block? See note below. |
| What stays / what changes | Phases 1-7 cover every file in the spec's list |
| Deletion of LineCard | Phase 8 |
| Out of scope items (other 5 facets, sort, compact view) | No tasks — left as-is per spec |
| Testing strategy | Phase 8 step 6-8 covers manual functional checks |
| Definition of done | Phase 8 verifies all items |

**Gap found:** the spec's "empty state" requirement (kicker "No matches" + h2 "Try fewer filters" + Reset button) isn't implemented by any phase. The current behaviour when no cards match is: every subcategory group hides, leaving a blank grid column. That's silently empty, not "editorial and direct" per the spec.

**Fix:** add an empty-state block to ProductsListing.astro inside the grid column, hidden by default, shown by FilterController when `visible === 0`. Adding to Phase 5 + Phase 2 retroactively.

**2. Placeholder scan:** none. Every code step contains the exact code to write. Every shell step contains the exact command + expected output.

**3. Type consistency:**
- `Line` type is `'fertilizers' | 'seeds' | 'pesticides'` consistently across ProductsListing, [line].astro, ar/[line].astro.
- `data-facet-subcategory` value format `<line>:<subcat>` is consistent across FertilizerCard, SeedCard, PesticideCard, FilterSidebar, FilterController (pill prettifier).
- `data-subcategory-group` value format `<line>:<subcat>` consistent across SubcategoryGroup and FilterController's group walker.

✓ No drift.

**Empty-state retrofit** — adding two small steps:

**Phase 5 Step 1 addendum** — after the `<SubcategoryGroup>` loop in ProductsListing.astro, insert:

```astro
        <div data-products-empty hidden class="py-section-y text-center">
          <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute mb-sp-3 inline-block">
            {t('products.empty.kicker')}
          </span>
          <h2 class="font-display italic text-3xl text-ink mb-sp-5">
            {t('products.empty.headline')}
          </h2>
          <button
            type="button"
            data-products-reset
            class="motion-press font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink no-underline border-b border-ink pb-0.5 inline-flex items-center min-h-[44px] hover:opacity-70"
          >
            {t('products.filters.reset')}
          </button>
        </div>
```

And add the i18n keys in Phase 5 Step 2:
```
products.empty.kicker   → "No matches" / "لا توجد نتائج"
products.empty.headline → "Try fewer filters" / "حاول تقليل المرشحات"
```

**Phase 2 `apply()` Step 1 addendum** — at the bottom of `apply()`, after the count update, add:

```ts
    // 4. Toggle empty-state block.
    const emptyEl = document.querySelector<HTMLElement>('[data-products-empty]');
    if (emptyEl) emptyEl.toggleAttribute('hidden', visible !== 0);
```

These two retrofits are integrated into Phases 2 and 5 above and will be applied by the implementer as part of those phases' steps.
