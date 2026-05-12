# Zagros v3 — Editorial Homepage Redesign + Site Polish Pass

**Status:** Draft, awaiting user review.
**Author:** Working session, 2026-05-12.
**Replaces:** Plan 7 closeout was the last stable state. This spec supersedes any further iterative work on Plan 7 — Plan 7 commits (4fdd06e…5da94d5) stay in place as the foundation; v3 builds on top.
**Source-of-truth:** `ZAGROS_SOURCE_OF_TRUTH.md` at project root is canonical for all product, brand, and company data. No fact in this spec contradicts it.

---

## 1 · Goal

Replace the homepage with a 9-section editorial publication. Fold `Partners` and `Customers` (currently their own pages) into homepage sections. Add `Home` to the primary nav. Apply a coordinated polish pass to the inner pages so the whole site reads as one publication, not "a homepage plus some inner pages." Keep the 7-token palette and the product-card placeholder hero zones (the only parts the user explicitly likes). Eliminate every "AI-slop" generic SaaS pattern. Restrained editorial motion throughout — animation as acknowledgment, not spectacle.

This is a redesign, not a rebuild. Existing data files, content collections, i18n structure, Astro routing, and the design system stay. The visual layer changes.

## 2 · Information architecture (after redesign)

```
Home (Hero → Ticker → Numbers → Catalog → Partners → Field Reports →
      Customers → Branches → Quote CTA)
├── Products (line picker — 3 cards)
│   └── /products/[line] (Seeds | Fertilizers | Pesticides)
│       └── /products/[line]/[slug] (detail page)
├── About
├── Field Reports
│   └── /field-reports/[slug]
├── Contact
├── /partners/[slug] (deep-link only — no /partners index)
├── /privacy, /terms (legal, untouched)
└── /ar/ mirror of every route
```

**Deleted routes:**
- `/partners` and `/ar/partners` (index pages)
- `/customers` and `/ar/customers` (index pages and any detail variant)

**Nav primary links (post-redesign), in order:**
Home · Products · Field Reports · About · Contact · [language toggle] · [Request a quote]

`Home` is the new addition. `Partners` and `Customers` are removed from nav.

## 3 · Homepage section design

### Section 01 — Hero · "Photo-led atmospheric"

Full-bleed hero, locked direction B from the brainstorming session.

- **Background:** real photo when client provides (`/photos/hero-sudan-farmland.jpg`, ~16:9, landscape). Until then, the gradient placeholder ships as the fallback (`linear-gradient(135deg, #6B5E3E 0%, #2B5E3E 50%, #1B1A17 100%)` + dark vignette).
- **Top row:** mono kicker on the left (`● ZAGROS TRADING · KHARTOUM`), `EST · 2010` on the right.
- **Headline:** Fraunces italic display, 3-line phrasing pulled from i18n. EN: *"Seeds, fertilizers, pesticides — sourced for Sudanese soil."* AR equivalent in `ar.json`. The accent word (`Sudanese soil` / `للأرض السودانية`) is rendered in `--signal` yellow.
- **Meta row:** three mono pills along the bottom — suppliers/countries, hours, phone. Border-top separator.
- **Scroll cue:** bottom-right mono `SCROLL · 01 / 09 ↓`.
- **Motion:**
  - Image (when present) parallax-translates 12% on scroll via throttled `transform: translate3d(0, scrollY * 0.12, 0)`.
  - Headline characters stagger-fade-in at 60ms each on first paint (1 char ≈ 0 → 1 opacity, 12px translate-y).
  - Meta row slides up after headline finishes.
  - Scroll cue pulses (opacity 0.55 ↔ 0.95, 2.4s, infinite, paused for reduced motion).

### Section 02 — Ops ticker · "Live operational marquee"

Slim ink band, full bleed, hugged against the bottom of the hero.

- **Items:** Khartoum HQ status · Featured stock SKU · Latest field report headline · Branch rotation · SKU counts. Sourced from `src/data/ops-ticker.json` (existing file, refresh content to remove anything that reads as filler).
- **Signal dot** on the left, marquee scrolls right→left LTR / left→right RTL (CSS animation only, no JS).
- **Motion:** marquee loops at ~40s on desktop / 30s on mobile. Pauses on hover. Live dot blinks at 2s cadence. Both pause for `prefers-reduced-motion`.

### Section 03 — By the numbers · "Asymmetric data grid"

Four numbers, one giant + three normal.

- **Layout:** 1.4fr / 1fr / 1fr / 1fr grid (collapse to 2-col on tablet, 1-col on mobile). Big number is `15` (years since 2010). Small numbers: `07` suppliers, `06` branches, `30+` SKUs.
- **Type:** Fraunces italic display, 200px on the big number, 88px on the smalls. Big number in ink, smalls in sienna for differentiation.
- **Each number** pairs with a one-line copy block underneath: short serif for big, mono caption for smalls.
- **Motion:** numbers count up from 0 when section enters viewport (1.2s ease-out, JS via `requestAnimationFrame`). Grid fade-staggers in. Reduced-motion skips count-up, shows final value immediately.

### Section 04 — Catalog · "Three-line strip"

Three product-line cards, each with the editorial colored hero zone.

- **Layout:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sp-5`. Reuse the existing `bgClassMap` Tailwind classes for hero zones — `bg-c-rhodes` (seeds, green), `bg-c-npk` (fertilizers, navy), and a pesticide variant. The current token set in `src/styles/tokens.css:23-32` does not include a pesticide-specific brand token, so plan adds `--c-pesticide: 90 58 30;` (matching the existing `--color-sienna` numerals — keeps the palette unchanged in practice) and a `bg-c-pesticide` map entry. Decision flagged in open questions §15.
- **Hero zone content:** supplier name caption, SKU count as a giant italic numeral, classification mono pill.
- **Body:** subhead (Fraunces italic 26px), 2-line body copy, `Open category →` mono link with `min-h-[44px]`.
- **Motion:** stagger-fade-up on entry (80ms steps). Hover lifts card 4px + subtly sharpens border (stone → ink). NO scale transforms.

### Section 05 — Partners · "Spotlight + 6 tiles"

The folded-in Partners section. K+S as the always-on spotlight; the other 6 suppliers as tiles. Each tile links to its `/partners/[slug]` deep-link page.

- **Layout:** 1.4fr / 1fr / 1fr grid. Spotlight card spans 2 rows on the left. Six partner tiles in the 2x3 right grid.
- **Spotlight:**
  - Ink background, paper text, signal `READ PARTNER STORY →` mono link.
  - Top: `SPOTLIGHT · GERMANY 🇩🇪` mono caption.
  - Subhead: `K+S Middle East FZE` (Fraunces italic 32px).
  - Photo placeholder: 4:3 landscape, label `K+S facility / product range / handshake`. Real photo client-pending — render `Placeholder.astro` until provided.
  - 2-line body copy.
- **Partner tiles:** each contains a logo (`Placeholder.astro` when missing logo, real SVG/PNG when present from `/public/partners/`), supplier name, country/category mono pill.
- **Featured selection:** add `featured: true` to `src/content/partners/k-plus-s.mdx`; component picks the first `featured: true` partner. Future rotation possible by toggling flags.
- **Motion:** spotlight card sticky-pinned during scroll while right-column tiles scroll past (mobile: regular stack, no pin). Each tile reveals via 200ms fade-up. Hover darkens tile border ink. Logos lazy-load with explicit width/height to prevent CLS.

### Section 06 — Field reports · "Editorial magazine layout"

Three latest reports — one featured + two normal.

- **Layout:** 1.6fr / 1fr / 1fr grid. Featured report gets 16:10 hero image, others get 4:3.
- **Data source:** `src/content/field-reports/*.mdx` — sorted by date descending, take 3.
- **Card:** placeholder photo on top (when `image_pending`), report-date mono caption, Fraunces italic headline (30px featured, 22px others), 2-line excerpt.
- **Motion:** masonry stagger reveal (top-down, 120ms each). Hover lifts 4px + sharpens border.
- **Link to index:** end-of-section `Read all reports →` link that goes to `/field-reports`.

### Section 07 — Customers · "Ink band + pull quote + logo wall"

The folded-in Customers section. Inverts to ink ground for chapter contrast.

- **Layout:** Ink background, paper foreground. Section label, big italic headline `Working with the people who feed Sudan.` (signal accent word). Then a centered pull quote (IBM Plex Serif italic, 24px, 36ch max-width, signal `"` quotation mark above it). Attribution mono. Logo wall below — 6 tiles in a row (3x2 on tablet, scrolling marquee on mobile).
- **Pull quote source:** add `pull_quote` field (object with `text` and `attribution`) to `src/data/customers.ts`. For v3 launch, render `[pull quote pending client confirmation]` placeholder copy in italics if not provided — never invent a customer quote.
- **Logo wall:** existing logos at `/public/customers/*.svg|webp`. Hover effect: hovered logo stays at 100% opacity, others desaturate to 60%.
- **Motion:** pull quote fade-in when the `"` mark crosses viewport. Logo wall: marquee on mobile, static grid on desktop, hover-desaturate on desktop.

### Section 08 — Branches · "Editorial map + list"

Sudan map on the left, six-branch list on the right.

- **Layout:** 1.4fr / 1fr grid. Mobile: list above, map below.
- **Map:** an SVG hand-drawn editorial Sudan outline (NOT a Leaflet OpenStreetMap render — too generic). Six pins at the six city locations. Render via inline `<svg>` so it inherits text colors and stays small. Existing `leaflet` dep can be removed if no other page uses it.
- **Branch list:** 6 items in a `<dl>`-style list. Each row: serial numeral (Fraunces italic), city name (Fraunces italic), branch-type mono pill (HEADQUARTERS / BRANCH). Border between rows.
- **Data:** from `src/data/company.ts` — already correct (Khartoum HQ + 5 regional).
- **Motion:** pins drop-in sequentially (100ms each) when section enters view. List items reveal in sync with pin animation. Reduced-motion shows everything immediately.

### Section 09 — Quote CTA · "Editorial close"

Signal bar across the top, ink ground, big editorial headline, three actions.

- **Signal bar:** 3px tall, full width, scales from 0 → 100% width over 600ms when section enters viewport.
- **Headline:** `Tell us what your field needs.` (signal accent word). Fraunces italic, 78px desktop / 36px mobile.
- **Three actions:** primary button (signal background, ink text, `Request a quote →`), two secondary chips (phone number, WhatsApp). All ≥44px tap target.
- **Footer line:** address + colophon mono row.
- **Motion:** signal bar scale-in (the only motion). Buttons static.

## 4 · Nav redesign

- **Add:** `Home` link at the start. Active state: `border-bottom: 2px solid var(--signal)` extending below the link.
- **Remove:** `Partners` and `Customers` links.
- **Keep:** `Products`, `Field Reports`, `About`, `Contact`, language toggle, quote CTA. All keep their current 44px tap targets from Plan 7 E.
- **Mobile drawer (`MobileNavDrawer.astro`):** same edits — add Home, remove Partners + Customers.

## 5 · Inner-page polish pass

Scope is **polish, not rebuild**. No structural changes to these pages.

| Page | Polish |
|---|---|
| `/products` (line picker) | Use the same typographic rhythm as the home Catalog section. SKU count display switches to italic-numeral style. |
| `/products/[line]` | Already in good shape from Plan 7 B + D stub. Sweep hero typography to match home Numbers section (italic numerals). |
| `/products/[line]/[slug]` | Detail page already uses ProductHero. Polish body grid: composition card, compatibility matrix, application rates table — tighten type + spacing to match the editorial rhythm. |
| `/partners/[slug]` | Replace generic header with a spotlight-card-style hero (same component used in home Section 05 spotlight). Body keeps current MDX-driven content. |
| `/about` | Polish only — typography rhythm, spacing scale, image placeholders for leadership (currently empty). The 6-section structure stays. |
| `/contact` | Already in good shape. Polish ContactForm — tighten input styling, larger headline, retain `tel:` and `wa.me/` from Plan 7 E. |
| `/field-reports` | Index page gets the same editorial card treatment as the homepage teaser, just expanded to all reports. |
| `/field-reports/[slug]` | Polish body typography. Image-placeholder system applies. |

All polished pages get the same Nav (with Home added) and Footer.

## 6 · Image placeholder system

A new shared component `src/components/editorial/Placeholder.astro` replaces every "image-pending" spot. It renders a striped diagonal-hatch tile labeled with what photo is needed:

```astro
---
interface Props {
  kind: 'hero' | 'partner' | 'field-photo' | 'portrait' | 'map' | 'product' | 'logo';
  label?: string;        // freeform additional description
  aspectRatio?: string;  // default per kind
  dark?: boolean;        // for dark sections (ink ground)
}
---
```

Component renders:
- A diagonal hatched background using existing `--stone` and a derived shade (light variant) OR a paper/8-rgba variant (dark variant).
- A center label: `PLACEHOLDER · <KIND>` in mono, plus the `label` text in smaller mono.
- A dashed border inset 6px to reinforce "this is a placeholder."

When the client provides a photo, the `Placeholder` invocation is swapped for an `<img>` with explicit `width`/`height` (from Plan 7 G).

**Placeholders in v3 launch (won't have real photos yet):**
1. Hero photo (Sudanese farmland)
2. K+S spotlight photo (K+S facility/product/handshake)
3. Three field-report hero images
4. Customer pull-quote photo (optional — may render text-only)
5. Sudan map (we hand-draw the SVG, not strictly a "placeholder" but flagged here)
6. Kafr El Zayat partner logo (per `REMAINING_GAPS.md` item 8)

## 7 · Animation system

- **Stack:** vanilla CSS animations + a tiny IntersectionObserver helper. No framer-motion on the homepage (it's already in deps for product-card tilt but we don't add a new dependency).
- **New helper:** `src/lib/motion.ts` exports `observeReveal()` — wires up `IntersectionObserver` to add a `data-revealed` attribute to elements with `data-reveal` once they cross 15% into the viewport. One-shot (no re-animation on scroll up).
- **CSS:** `src/styles/motion.css` defines:
  - `[data-reveal]` — initial state: `opacity: 0; transform: translateY(12px);`
  - `[data-reveal][data-revealed]` — final state: `opacity: 1; transform: none;`
  - Transition: `opacity 400ms ease-out, transform 400ms ease-out`. Stagger via `transition-delay` set per element via inline CSS variable `--reveal-delay`.
  - Marquee keyframes for ops ticker (LTR + RTL variants via `dir` attribute selector).
  - Count-up assist class for numbers (final value via `data-target`).
- **Reduced motion:** wrap all motion-related selectors in `@media (prefers-reduced-motion: no-preference)`. The Plan 7 F global reduced-motion rule (`global.css:63-72`) stays as the safety net.
- **Hero parallax:** small inline script in `Hero.astro` (~15 LOC) using `requestAnimationFrame` + `passive: true` scroll listener. Throttled. Skipped under reduced motion.
- **Number count-up:** small inline script in `ByTheNumbers.astro` triggered by `IntersectionObserver`. Uses `requestAnimationFrame`. ~25 LOC.

Total new JS budget for motion: ~3 KB compressed. Well under Plan 7 G's `<100KB first-load JS` budget.

## 8 · i18n additions

New keys needed in both `en.json` and `ar.json`, plus matching `types.ts`:

```
home.hero.kicker
home.hero.est_year_pill
home.hero.headline_phrase_1   // "Seeds, fertilizers, pesticides — sourced for"
home.hero.headline_accent     // "Sudanese soil." (signal-yellow word)
home.hero.scroll_cue
home.hero.meta_suppliers
home.hero.meta_hours
home.numbers.label
home.numbers.big_copy
home.numbers.suppliers_caption
home.numbers.branches_caption
home.numbers.skus_caption
home.catalog.label
home.catalog.headline
home.partners.label
home.partners.headline
home.partners.spotlight_label
home.partners.cta_read_story
home.reports.label
home.reports.headline
home.reports.cta_read_all
home.customers.label
home.customers.headline_phrase
home.customers.headline_accent
home.customers.pull_quote_pending  // shown when no real quote yet
home.branches.label
home.branches.headline
home.cta.label
home.cta.headline_phrase
home.cta.headline_accent
home.cta.primary
home.cta.whatsapp
home.cta.phone_caption
nav.home   // "Home" / "الرئيسية"
```

Hand-translated AR — no machine translation, per the project's AR-quality rule.

## 9 · Data additions

| File | Change |
|---|---|
| `src/content/partners/k-plus-s.mdx` | Add `featured: true` frontmatter flag |
| `src/content/config.ts` | Extend partners schema with optional `featured: boolean` |
| `src/data/customers.ts` | Add optional `pull_quote?: { text: { en, ar }, attribution: { en, ar }, customer_slug }` field. Leave null until client confirms. |
| `src/data/ops-ticker.json` | Audit + replace any filler with real data sourced from `ZAGROS_SOURCE_OF_TRUTH.md` |

## 10 · Component changes

### New
- `src/components/editorial/Placeholder.astro`
- `src/components/home/HeroV3.astro`         *(replaces Hero.astro contents)*
- `src/components/home/OpsTickerMarquee.astro`  *(replaces OpsTicker.astro contents)*
- `src/components/home/ByTheNumbersV3.astro` *(replaces ByTheNumbers.astro contents)*
- `src/components/home/CatalogStrips.astro`  *(replaces CatalogTable.astro contents)*
- `src/components/home/PartnersSection.astro`
- `src/components/home/FieldReportsTeaser.astro` *(replaces ThreeReportsGrid.astro contents)*
- `src/components/home/CustomersWall.astro`     *(replaces CustomersStrip.astro contents)*
- `src/components/home/BranchesMap.astro`
- `src/components/home/QuoteCTA.astro`          *(replaces HomeCTA.astro contents)*
- `src/components/partners/PartnerSpotlight.astro` *(shared between home Section 05 and `/partners/[slug]` hero)*
- `src/lib/motion.ts`
- `src/styles/motion.css`

### Modified
- `src/pages/index.astro` and `src/pages/ar/index.astro` (new section order)
- `src/components/global/Nav.astro` (add Home link, remove Partners + Customers)
- `src/components/global/MobileNavDrawer.astro` (mirror Nav changes)
- `src/pages/partners/[slug].astro` + AR mirror (PartnerSpotlight hero)
- `src/pages/about.astro` + AR mirror (polish pass)
- `src/pages/contact.astro` + AR mirror (polish pass)
- `src/pages/field-reports/index.astro` + AR mirror (editorial cards)
- `src/pages/field-reports/[slug].astro` + AR mirror (polish)
- `src/pages/products/index.astro` + AR mirror (polish)
- `src/pages/products/[line]/[slug].astro` + AR mirror (body polish)
- `src/i18n/{en,ar}.json` + `types.ts` (new keys)
- `src/content/config.ts` (partners.featured optional)
- `src/content/partners/k-plus-s.mdx` (featured: true)
- `src/data/customers.ts` (pull_quote field, all null at launch)
- `src/data/ops-ticker.json` (refresh content)

### Deleted
- `src/pages/partners/index.astro` and `src/pages/ar/partners/index.astro`
- `src/pages/customers/index.astro` and `src/pages/ar/customers/index.astro`
- `src/components/home/Hero.astro` (replaced)
- `src/components/home/OpsTicker.astro`
- `src/components/home/ByTheNumbers.astro`
- `src/components/home/CatalogTable.astro`
- `src/components/home/CustomersStrip.astro`
- `src/components/home/ThreeReportsGrid.astro`
- `src/components/home/SourcesSection.astro`
- `src/components/home/EditorsNote.astro`
- `src/components/home/HomeCTA.astro`
- `src/components/home/FeaturedReport.astro`
- `leaflet` dep + `src/components/branches/*Map*.astro` if found unused after BranchesMap.astro ships

### Kept as-is (user-loved)
- `src/components/products/ProductHero.astro` — the bgClassMap fix from Plan 7 B
- `src/components/products/FertilizerCard.astro`, `SeedCard.astro`, `PesticideCard.astro`
- 7-token palette in `src/styles/tokens.css`
- Plan 7 mobile gutter `@media (max-width: 639px)` override

## 11 · Testing

- **Component tests (new):**
  - `tests/components/HeroV3.test.ts` — renders headline, accent word in signal-yellow class, kicker, meta row, scroll cue. Both locales.
  - `tests/components/Placeholder.test.ts` — renders correct kind label and accessibility text.
  - `tests/components/PartnersSection.test.ts` — featured K+S in spotlight, 6 tiles for other suppliers, deep links to `/partners/[slug]`.
  - `tests/components/CustomersWall.test.ts` — renders 6 logos, pending pull quote fallback when `pull_quote` null.
  - `tests/components/BranchesMap.test.ts` — 6 pins, 6 list items, both locales.
- **Page tests:**
  - `tests/pages/home-redesign.test.ts` — asserts the 9 sections render in order, contains `data-reveal` attributes, no `/partners` or `/customers` index links in nav, contains `Home` nav link.
  - Modify `tests/pages/partners.test.ts` — drop index assertions, keep detail assertions, add PartnerSpotlight hero check.
  - Modify `tests/pages/customers.test.ts` — delete entirely or repurpose as `tests/components/CustomersWall.test.ts`.
- **Verification grep on dist (Plan H.2-style):**
  - `Home` link appears in `<nav>` markup of every page.
  - `/partners` and `/customers` URLs do not appear in nav of any page.
  - `data-reveal` attribute present on relevant section roots.
  - `@media (prefers-reduced-motion: reduce)` selectors still present in compiled CSS.
  - Banned strings still 0 hits (`BAG MOCKUP · PENDING`, `14 SKUs`, "operator, not a brand", etc.).

## 12 · Phasing for the implementation plan

The implementation plan (next skill: `superpowers:writing-plans`) will sequence work as:

1. **Foundation:** motion helper + CSS + Placeholder component. Verify reduced-motion path.
2. **Nav redesign:** add Home, remove Partners/Customers (both desktop + mobile drawer). i18n key for `nav.home`.
3. **Page deletions:** drop the 4 index files. Verify build still passes (104 pages → 100).
4. **Homepage build:** Section 01 → 09 each in its own component, mounted to `/` and `/ar/`. One commit per section.
5. **Partner spotlight extract:** Build `PartnerSpotlight.astro`, use it in home Section 05 AND `/partners/[slug]` hero.
6. **Inner-page polish:** sweep `/products` tree, `/about`, `/contact`, `/field-reports`. One commit per page.
7. **Verification + tag:** Plan-7-style grep sweep, type check, vitest, build. Tag `v3-editorial` after user reviews.

## 13 · Out of scope

- Real photography. Spec ships with `Placeholder.astro` everywhere photos are pending. Replace inline once client provides.
- Field reports editorial cadence (new reports beyond the 3 existing MDX files).
- Real customer pull quotes (currently `null`, render pending fallback).
- Filter UI restoration (Plan 7 D full path). Filter stub stays as is.
- Backend/CMS work. Static-site only.
- Animation library beyond the tiny motion.ts helper.
- New supplier additions to the partner network.
- Translation of new English copy by anyone other than a fluent Arabic speaker — auto-translate is banned.

## 14 · Risks

| Risk | Mitigation |
|---|---|
| Visual placeholder overload makes the site look unfinished | Placeholders are intentional design objects — diagonal stripes + clear "PLACEHOLDER · KIND" labels signal "design system in flight" rather than "broken image." Acceptable for client-review staging; not for production launch. Spec is explicit about this. |
| Parallax / count-up break under low-end Sudanese mobile bandwidth | Both are gated by `IntersectionObserver` so they only fire when in view. Reduced-motion fallback skips them entirely. Performance budget from Plan 7 G holds: <100KB first-load JS, LCP <2.5s on 3G. |
| Deleting `/partners` and `/customers` indexes breaks deep links in the wild | No outbound link to those indexes exists in the current codebase (verified via grep before deletion in the plan). External backlinks (if any) will 404 — add 301 redirects via Astro's `astro:redirects` if the user asks. |
| K+S spotlight rotation request later requires manual MDX edit | Featured flag is an MDX boolean — easy to flip. Future enhancement: rotate via a `featured_rotation` array in `src/data/company.ts` if needed. |
| RTL parity at narrow viewports for marquee | Marquee uses `dir`-aware CSS animation. Test in AR locale build at 360px before merge. |
| Pull quote pending-state copy contradicts the anti-AI-slop discipline | Pending fallback uses italics + a `[pending client confirmation]` marker, not a fabricated quote. Per the anti-slop memory: visible pending markers signal gaps, plausible placeholder copy hides them. |

## 15 · Open questions for the user (resolved in review or before implementation)

1. **Pesticide hero zone color** — spec proposes `bg-c-sienna` (or new `--c-pesticide` token at `#5A3A1E`). Confirm or pick another existing token.
2. **Sudan map style** — confirm hand-drawn editorial SVG (recommended) vs continuing with Leaflet/OpenStreetMap (more accurate, less editorial).
3. **301 redirects** from old `/partners` and `/customers` paths — add or accept 404s?
4. **Hero photo timing** — does the client provide one for the v3 launch or do we ship with the gradient placeholder and hot-swap later?

---

*End of design spec.*
