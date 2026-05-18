# Unified products page — design

**Date:** 2026-05-18
**Branch:** `feature/plan-7-world-reach`
**Status:** Brainstorm complete. Spec locked. Plan to follow.

## Trigger

User finds the current `/products` 3-line hub architecture awkward. The per-line page (`/products/fertilizers` in particular) is the experience they like — editorial subcategory groups with the per-product cards. They want **all products on one page with a filter to narrow down**, while preserving the existing card design and the subcategory grouping pattern.

## Goal

Replace the 3-line-card hub with a single unified products listing at `/products` that:

1. Renders **all 35+ products** from all three collections (`fertilizers`, `seeds`, `pesticides`) on one page.
2. Groups them by subcategory with `§ Subcategory · N SKUs` headers (the pattern from today's `/products/fertilizers`).
3. Exposes a **left-rail filter sidebar** on desktop (`lg:` and up) and a **filter drawer** on mobile.
4. Reuses the existing per-product card components verbatim (`FertilizerCard`, `SeedCard`, `PesticideCard`).
5. Preserves the existing `/products/fertilizers`, `/products/seeds`, `/products/pesticides` URLs as **preset-filter shortcuts** to the same unified listing.

## Decisions locked during brainstorming

| # | Decision | Locked value |
|---|----------|--------------|
| 1 | Fate of `/products/[line]` URLs | Keep as preset-filter URLs (both `/products` and `/products/[line]` render the same listing component; the latter pre-applies `line=…`) |
| 2 | Grid organization | Group by subcategory with `§` headers; multi-line view shows ~13 groups across all 3 lines |
| 3 | Filter UI shape | Left-rail sidebar on desktop, drawer on mobile |
| 4 | Facet scope | Lean: **Line + Subcategory + Search** only. Other 5 facets (Nutrient grid, Application, Crop stage, Crop category, Special props) stay defined in `FilterSidebar.astro` but not rendered |
| 5 | Hub header replacement | Slim header only: `h1` + deck + live count. No `LineCard` row |

## Architecture

### Routes and rendering

- `src/pages/products/index.astro` — primary unified listing. Loads all three collections at build time, merges into an ordered list, renders sidebar + toolbar + grouped grid.
- `src/pages/products/[line].astro` — thin wrapper. Accepts the slug param, passes `initialLine={line}` to the shared listing fragment. Same DOM is produced; the only difference is which sidebar checkbox is pre-checked and which entries the URL state machine reads on first paint.
- `src/pages/ar/products/index.astro` and `src/pages/ar/products/[line].astro` — AR mirrors of the above.
- `src/pages/products/[line]/[slug].astro` and AR mirror — unchanged (product detail pages).

The shared listing body lives in `src/pages/products/index.astro` directly (no extracted "ProductsListing" component) to keep the page anatomy easy to find. `[line].astro` imports nothing fancy — it just reads the param and embeds the same JSX with `initialLine` set.

### Data flow

1. **Build time:** load all three collections; compute merged subcategory list with line-prefixed values (e.g., `fertilizers:water-soluble-npk`, `seeds:forage`); pre-compute counts.
2. **Render:** emit every product card with `data-facet-line="<line>"` and `data-facet-subcategory="<line>:<subcategory>"` data attributes. Render the sidebar with Line and Subcategory checkbox groups.
3. **Client first-paint (`/products`):** all cards visible, count shows total.
4. **Client first-paint (`/products/fertilizers`):** `[line].astro` wrapper renders the same listing but with `line=fertilizers` baked into the initial URL query (via a `<meta>` or inline script that calls `history.replaceState` once). The `FilterController` reads URL on first run and hides non-matching cards immediately. Visible result: fertilizers-only.
5. **User interaction:** checkbox toggle → `FilterController` updates URL via `history.replaceState` → re-applies filter → updates pills + count → hides empty `§` headers.

### URL state

- `?line=fertilizers,seeds` — multi-select on Line facet.
- `?subcategory=fertilizers:water-soluble-npk,seeds:forage` — multi-select on Subcategory, line-prefixed so labels can repeat across lines without collision.
- `?q=urea` — free-text search.
- Existing `parseStateFromQuery` / `serializeState` from `src/lib/products-filter.ts` handles this format already.

## Page anatomy

```
+- Breadcrumb -----------------------------------------------+
+- Header band ----------------------------------------------+
|   h1 "Products"  deck paragraph                            |
|   "35 products · 3 lines"   <- live count                  |
+- Toolbar -------------------------------------------------+
|   [search input] · [active pills · clear all]              |
|                              [sort dropdown] [cards|cmpct] |
+- Mobile only: [Filters (N)] button opens drawer -----------+
|                                                            |
+- Body: sidebar + grid ------------------------------------+
|  Sidebar (lg:)         Grid                                |
|  -------------         ----                                |
|  FILTERS  Reset        § Water-soluble NPK · 5 SKUs        |
|  [Line group]          [card] [card] [card] ...            |
|  [Subcategory group]   § Phosphate Sources · 3 SKUs        |
|                        [card] [card] ...                   |
|                        § Forage (Seeds) · 4 SKUs           |
|                        [card] [card] ...                   |
|                        ... (one group per subcategory)     |
|                        [empty state if 0 visible]          |
+------------------------------------------------------------+
```

Mobile: sidebar collapses into `FilterDrawer`, opened by the `FilterButton`. Pills row stays in the toolbar.

## Filter behavior

- **Within a facet group:** OR. Checking "Fertilizers" + "Seeds" shows both.
- **Across facet groups:** AND. Line=Fertilizers + Subcategory=Water-soluble NPK shows only that intersection.
- **Subcategory value scheme:** line-prefixed (`fertilizers:water-soluble-npk`). Label displayed to the user is the unprefixed pretty form ("Water-soluble NPK"). The line prefix is invisible chrome that prevents same-name collisions across lines and supports a future where a "Vegetable" subcategory could exist in both Seeds and another line.
- **Subcategory group `§` header:**
  - Hidden when 0 of its cards are visible (no dangling empty groups).
  - Count updates: "§ Water-soluble NPK · 3 of 5" when an across-facet filter trims the visible set. When all cards visible, just "§ Water-soluble NPK · 5 SKUs".
- **Empty state:** when no cards match anywhere, the grid shows a single editorial block — kicker "No matches" + h2 "Try fewer filters" + a Reset button. Direct, no fallback suggestions.
- **Active pills row:** shows each active facet value as a removable chip. "Clear all" link resets to no filters.

## What stays / what changes

**Unchanged:**
- `src/components/products/FertilizerCard.astro` — keep verbatim.
- `src/components/products/SeedCard.astro` — keep verbatim.
- `src/components/products/PesticideCard.astro` — keep verbatim.
- `src/lib/products-filter.ts` — already generic, already URL-driven. No edit needed.
- `src/components/products/FilterController.astro` — already wired to facet attributes, pills, reset, search, view toggle. No edit needed.
- `src/pages/products/[line]/[slug].astro` and AR mirror — detail pages stay.

**Edited:**
- `src/pages/products/index.astro` — rewritten as the unified listing. Loads all 3 collections, computes merged subcategory list with line prefixes, renders header + toolbar + sidebar + grouped grid + filter drawer.
- `src/pages/products/[line].astro` — becomes a thin wrapper. Accepts `params.line`, renders the same body as `/products/index.astro` but with `initialLine={line}` prop applied to the sidebar (pre-checks that line's checkbox) and embeds the initial URL state via an inline `history.replaceState` call (or by emitting the right `?line=` in the rendered HTML's `<meta>` and letting FilterController read it).
- `src/components/products/FilterSidebar.astro` — remove the "currently unused" comment. Trim rendered facet groups to **Line + Subcategory only**. The other 5 facet definitions stay in the source as commented-out blocks, ready to be re-enabled when a real user need surfaces.
- `src/components/products/FilterDrawer.astro` — replace the stub body with `<FilterSidebar variant="drawer" />` (or simply re-render the same sidebar markup inside the dialog).
- `src/components/products/SubcategoryGroup.astro` — emit `data-facet-line` and `data-facet-subcategory` on each card wrapper so FilterController sees them. Add a `data-subcategory-group-count` mechanism so the `§` header count updates: show "N SKUs" when unfiltered, "N of M" when partially filtered, hide the whole `<section>` when 0 visible.
- `src/components/products/ProductsToolbar.astro` — wire the live count to the FilterController; ensure pills container is included; verify count formatting handles cross-line totals.
- `src/components/products/FilterButton.astro` — ensure it triggers the new full drawer (likely already does via `[data-filter-drawer-trigger]`).
- AR mirrors of the page files get identical edits.

**Deleted:**
- `src/components/products/LineCard.astro` — hub no longer renders these. Grep confirms only `/products/index.astro` imports it; once that import is removed, the file becomes dead. Delete the file in the same commit.

## Out of scope (deferred to future cycles)

- The other 5 facet groups (Nutrient grid, Application, Crop stage, Crop category, Special props). Code stays in `FilterSidebar.astro` source but not rendered.
- Sort behavior changes. The existing `catalog | name | brand` options stay. "Catalog" sort across lines = the order `[fertilizers, seeds, pesticides]` from the existing `lines` array in the source, then each line's internal subcategory order.
- The "Compact" view toggle. Stays as-is. Note for implementation: the compact variant only has `ProductCardCompact` for fertilizers in current code (a quick check via `ls src/components/products/`). Either build `SeedCardCompact` + `PesticideCardCompact` to match, or scope the compact view to fertilizers only with the view toggle disabled when non-fertilizer filters are active. Pick during implementation.
- The `LineCard` design itself. If a future cycle wants to bring back a brand-intro "browse by line" hub, `LineCard` can be revived from git history — it's not lost, just no longer wired.
- New facets, multi-language search relevance, sorting by date — none of these.

## Testing strategy

1. **Tests stay green:** `npm test` → 94/94. No test currently targets the products page beyond what compiles, so changes should be no-impact.
2. **Build stays green:** `npm run build` → 100 pages. The route count is unchanged (`/products` + 3× `/products/[line]` + 3× line detail roots + product detail leaves, in both EN and AR).
3. **Manual functional check:**
   - Load `/products` — all cards visible, count shows total, no facet preset.
   - Load `/products/fertilizers` — only fertilizer cards visible, sidebar Line checkbox for Fertilizers is checked, URL becomes `/products/fertilizers?line=fertilizers` after first FilterController pass.
   - Toggle Subcategory checkbox in sidebar → URL updates, cards filter, count updates.
   - Toggle another Line checkbox to broaden → URL updates, new cards become visible.
   - Click an active pill's × → that facet drops from URL + checkbox unchecks + cards update.
   - "Clear all" → URL resets to bare path, all cards visible.
   - Type in search → cards filter live, URL gains `?q=…`.
4. **Mobile (375px):** Filter button visible, opens drawer, drawer renders sidebar content, applying filters and closing returns to the listing with state intact.
5. **AR parity:** all of the above at `/ar/products`, `/ar/products/fertilizers`, etc. Sidebar reads right-to-left; checkbox labels in Arabic.
6. **Empty-state path:** filter to a combination that yields zero cards (e.g., Line=Seeds + Subcategory=fertilizers:water-soluble-npk). Empty state block renders. Reset button works.

## Risk

- **Low** on the unified listing itself. The filter machinery is solid and well-built — most of this work is wiring, not new code.
- **Medium** on the URL preset behavior in `/products/[line].astro`. Need to ensure the static-prerendered HTML's initial filter state and the runtime `FilterController` agree on first paint. If they disagree, the page flashes "all visible" before snapping to "fertilizers only". Mitigation: emit the initial filter state as an inline `<script>` that runs before FilterController and applies `?line=fertilizers` to the URL before the controller's first read. Or hide the grid with CSS until the controller initializes (slightly worse UX). Pick during implementation.
- **Negligible** on visual. Cards stay verbatim. Subcategory group pattern stays verbatim. Header is simpler than today.

## Definition of done

1. `/products` renders all 35+ products grouped by subcategory, all 3 lines visible by default.
2. `/products/fertilizers`, `/products/seeds`, `/products/pesticides` render the same page with that line preset.
3. Sidebar shows Line + Subcategory groups on desktop. Drawer mirrors on mobile.
4. Toolbar shows search + sort + view-toggle + pills + live count.
5. Filtering updates URL, count, pills, and visible cards. Empty `§` headers hide. Empty state renders when needed.
6. Tests + build green. AR parity verified.
7. `LineCard.astro` deleted.
8. Single commit (or one-per-edit-pass) on `feature/plan-7-world-reach`.

## Next step after this spec

Invoke `writing-plans` to produce a phased implementation plan with verification gates between phases.
