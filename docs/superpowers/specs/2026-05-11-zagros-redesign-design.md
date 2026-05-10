# Zagros Trading — Website Redesign Design Spec

**Date:** 2026-05-11
**Status:** Pending user approval before implementation planning
**Source of truth:** [`ZAGROS_SOURCE_OF_TRUTH.md`](../../../ZAGROS_SOURCE_OF_TRUTH.md) at the project root — authoritative for all product, partner, and company facts. The current codebase's data files (`src/data/fertilizers.json`, `src/data/pesticides.json`, `src/data/company.ts`) contain stale placeholder content from the original site and are NOT canonical.

---

## 0. Brief

### Problem
The current Zagros website (built 2024) was generated from incorrect placeholder data — Sudan geography, fictional pesticide products, fabricated partner companies. The site's bones are functional but the visual treatment, content, and information architecture all read as a generic agricultural template. The user is repositioning their relationship with Zagros from "site builder" to "marketing agency" and the redesigned site is the centerpiece of that pitch.

### Win condition
Agency-grade portfolio piece that *also* serves real Zagros buyers. Both bars matter — visible craft + defensible business decisions.

### Audience
Primary: agronomists, extension officers, and large-farm managers in the Middle East (Iraq / Kurdistan / Levant — exact service area pending client confirmation per source-of-truth gap list). Secondary: smaller distributors, ministry buyers, and prospective B2B partners.

### Pinned design references
Each page in the build must reference at least one of these by name; abstract direction is not enough.

- **MOLD Magazine** (mold.is) — agricultural editorial; the reference for content-led pages.
- **Cereal Magazine** (readcereal.com) — refined paper-tone editorial layout, controlled type system.
- **Field Magazine** (fieldmagazine.com) — name-aligned, agricultural editorial sensibility.
- **Eames Institute** (eamesinstitute.org) — institutional editorial done right; reference for the long-form Field Report template.
- **Patagonia Provisions** (patagoniaprovisions.com) — magazine-meets-products commercial layer; reference for the Products index/detail.

Explicitly **not** referencing Linear / Vercel / Stripe — different category, different audience.

### Concept
**"The operator — yield is the only metric"**, executed as **industrial editorial** ("Bloomberg meets Field & Stream"), structured as **"The Field Report"** — the whole site treated as a recurring quarterly journal of an agricultural operation.

---

## 1. Positioning & voice

### 1.1 Editorial concept
The site presents Zagros as a working agricultural distributor whose operations *can be examined* — partner provenance, product specs, application protocols, region coverage. Each home visit is "this issue"; each major content surface is a "section" with a section number; each long-form proof point is a "Field Report".

### 1.2 Voice (English)
- Avoid corporate cliché: no "leading", "trusted partner", "innovative solutions", "world-class", "premium", "comprehensive", "proven solutions provider".
- Use specific verbs: *moves, carries, holds back, signs off on, monitors, ships, delivers from port to plot.*
- Use precise agri vocabulary: *hectare* (not "area"), *agronomist* (not "specialist"), *plot* (not generic "field"), *input* / *crop-protection* (not generic "products"), *trial* (not "test"), *control* (not "comparison group"), *variety* (not "type"), *ration* (animal feed), *forage*.
- Editorial constructions: bylines, datelines, pull-quotes, "field memo" framings, section numbers, named contributors.
- Plain-English aphorisms over corporate hedge.

### 1.3 Voice (Arabic)
- Modern Standard Arabic with operational specificity. Read as if written by a Middle East agronomist, not translated from a US deck.
- No literal calques from English. Find the Arabic construction the editorial writer would actually use.
- Operational vocabulary: مُدخلات (inputs), موسم, مشروع, ولاية, قطعة (plot), هكتار, حصاد, ري, شاهد (control), تجربة, إنتاجية (yield), مهندس زراعي (agronomist), إرشاد زراعي (extension).
- **Numerals split by role**: Latin (Western) digits in tables, stats, percentages, grades (15.5%, 48.2k, +18%); Arabic-Indic digits (٠–٩) in prose (٢٠٢٤–٢٥, اثني عشر عاماً).
- **Punctuation**: Arabic comma ، Arabic question ؟ guillemets «» — never English equivalents in Arabic body.
- **No italic** — emphasis via weight (700) and color (sienna or signal yellow) only.
- **Bidi**: Latin partner names (K+S, Barenbrug) and Latin numerals stay LTR within RTL sentences via `<bdi>` or directional marks.
- **No drop-caps** — letters connect; substitute a sienna ◆ ornament + bolder opening phrase.
- Avoid the over-formal خطابي register that translators default to.

### 1.4 Process discipline
- All copy gets a human editor pass before launch — Arabic editor for AR side, agri-savvy English editor for EN. AI drafts are starting points, never final.
- No machine-translation pass-through: each `i18n/ar.json` string is hand-curated.
- Mocks may use illustrative copy as a quality benchmark; production copy comes from the source of truth (and the gaps the source of truth flags in section 14 must be filled before launch).
- Bilingual agri-glossary lives at `docs/glossary.md` (to be created during implementation) and is referenced by every translation.

### 1.5 Arabic copy reuse — direct from brochures
Per source-of-truth section 8: **all Arabic copy in the source-of-truth document was extracted directly from the K+S product brochures and is suitable for direct reuse on the site**, subject to a final native-speaker pass. This means:
- We do **not** translate the product Arabic from English. We reuse the brochure Arabic verbatim where the source-of-truth carries it (positioning, benefits, application rates per crop, compatibility cautions, storage notes).
- We extend only where the brochure didn't cover a thing (e.g., site UI labels, nav, CTAs, breadcrumbs) — those get hand-curated Arabic via the editor pass.
- Same logic for English forage seed copy: it was extracted from Barenbrug datasheets and is reused directly for the 3 forage SKUs.

This is a huge win for tone authenticity — the Arabic on the product pages will be the same Arabic farmers and agronomists already see on the bag, not a re-translation.

---

## 2. Brand language

### 2.1 Wordmark

**v1 default — use the existing Zagros logo.** The real logo file (`/public/zagros-dark.png` and `/public/zagros-white.png`) ships with the v1 site. Mockups in the brainstorming companion now reflect this. Pros: zero brand-identity risk, immediate continuity for existing customers, faster path to ship.

**Optional v2 workstream — wordmark refresh.** During brainstorming, the user picked direction **B** (redrawn geometric Z monogram + IBM Plex Serif wordmark + mono tagline + single yellow horizontal rule cutting through the Z). This refresh is parked as an *optional separate workstream*, not a v1 dependency. If the client commits to it, three deliverables:
- **Primary lockup** — masthead, footer, business card.
- **Compact** — sticky nav at smaller sizes.
- **Monogram only** — favicon, social avatars, app icon.

The current "Leadersin Agric Services" tagline (also a typo — "Leaders in") is dropped in any direction.

In Arabic locales, the existing logo's "Zagros Trading" wordmark either swaps to a Latin-only variant beside an Arabic wordmark "زاغروس" (set in IBM Plex Sans Arabic 700), OR the existing logo file is used as-is in both locales (v1 simplest path; refine later).

### 2.2 Color palette — 7 tokens

```
--paper        #F2EFE6   /* base background — warm ivory */
--stone        #D4D0C5   /* dividers, rule lines, chalk */
--mute         #8A8678   /* captions, tertiary text */
--ink          #1B1A17   /* primary text, inverted bands */
--sienna       #5A3A1E   /* editorial accent — kickers, drop-caps, italics */
--field        #2B5E3E   /* tags, positive deltas, organic certification */
--signal       #F2C233   /* the only bright — CTAs, K+S anchor, single yellow rule */
```

Plus support tokens for product brand-coding (used in bag mockups and product detail headers — see source-of-truth section 1):
```
--c-npk #1F2A4A · --c-mkp #1F6470 · --c-map #2D6F5C · --c-ams #6E1F22
--c-nop #76C68A · --c-cn #DDE8DA · --c-epso #2E7035 · --c-ksop #1E3A8A
--c-rhodes #4A8C3A · --c-sardi #6B4FBB
```

Plus a single warning token for compatibility-matrix copy:
```
--warn   #C8443C   /* "do not mix" red — used sparingly */
```

**Dark mode is dropped.** Single editorial palette, more confident art direction, less code to maintain.

### 2.3 Type stack

| Role | Family | Usage |
|---|---|---|
| Wordmark | IBM Plex Serif (Bold) | Logo lockup only |
| Display headlines | Fraunces (variable, opsz 144) | Hero, page titles, big editorial headlines |
| Body | IBM Plex Sans | Reading text, paragraphs, UI labels |
| Captions / kickers / data | IBM Plex Mono | Section numbers, datelines, table headers, mono numerals |
| Arabic display + body | IBM Plex Sans Arabic | All Arabic text — weight differentiates display (700) from body (400) |

Locked because the Plex family pairs cleanly across Latin / Arabic / Mono with high screen legibility — chosen over Source Serif/Sans and Fraunces-for-body after the user flagged Fraunces+Cairo as fatigue-prone for body reading. Fraunces is retained for *display only* where its character is desirable.

### 2.4 Motion principles
- **Restrained.** Entrance reveals (8% from y, ~400ms cubic-bezier), 2px hover lifts on cards, smooth scroll.
- **One signature moment per major page**: animated stat counter on home, scroll-driven map fill on coverage section, photograph reveal on field-report detail.
- No parallax theater, no scroll-tied storytelling, no auto-playing video loops competing for attention.
- Implementation: Framer Motion already in stack; CSS transitions for hover/focus.

### 2.5 Imagery treatment
- Real field/farm photography full-color but **tonally graded toward the paper palette** — `filter: saturate(.78) contrast(1.05) brightness(.92) sepia(.15)` — warm shadows, slight desaturation, slight warm cast.
- Treated as "precious" — full-bleed when used, never wallpaper.
- Photo "stamps" (mono caption pills) overlay images with the location, partner, or trial reference.
- Product bag photography (when client provides) replaces the SVG bag mockups in the catalog. Until then, mockups are colored to source-of-truth brand-coding.

### 2.6 Iconography
Minimal. Lucide line icons for utility (search, arrow, chevron, x). Custom 1px line icons only for crop/equipment glyphs that don't exist in Lucide.

---

## 3. Spacing & alignment system

### 3.1 Spacing scale (CSS tokens)

```
--sp-1: 4px     --sp-2: 8px     --sp-3: 12px    --sp-4: 16px
--sp-5: 24px    --sp-6: 32px    --sp-7: 48px    --sp-8: 64px
--sp-9: 96px    --sp-10: 144px  --sp-11: 200px
```

### 3.2 Semantic role tokens

```
--section-y:        var(--sp-10)   /* 144px — top/bottom of every section */
--section-y-major:  var(--sp-11)   /* 200px — for "epic" moments (CTAs, by-the-numbers, hero takeovers) */
--head-to-content:  var(--sp-9)    /* 96px — section title to first content */
--card-photo-gap:   var(--sp-6)    /* 32px — photo bottom in card */
--card-kicker-gap:  var(--sp-4)    /* 16px — kicker bottom */
--card-head-gap:    var(--sp-5)    /* 24px — headline bottom */
--card-summary-gap: var(--sp-6)    /* 32px — summary bottom */
--page-x:           56px           /* outer page margin */
```

This scale ports into Tailwind config (`theme.extend.spacing`) with `section-y`, `head-to-content`, etc. as named keys — extending Tailwind, not littering arbitrary values.

### 3.3 Grid system
**14-column grid**: 1 left frame margin column + 12 content columns + 1 right frame margin column. Outer columns use `minmax(56px, 1fr)`; content columns use `1fr` with `column-gap: 24px`.

```css
.grid {
  display: grid;
  grid-template-columns: minmax(var(--page-x), 1fr) repeat(12, 1fr) minmax(var(--page-x), 1fr);
  column-gap: var(--sp-5);
}
```

Most content uses `grid-column: 2 / 14` (full content width). Asymmetric layouts use `2 / 9`, `9 / 14`, `2 / 6`, `7 / 13`, etc.

### 3.4 Alignment discipline (companion to spacing)
Cards in a row that share recurring elements (separator rules, stat-lines, CTAs, dashed bottoms) must lock those elements to a **shared horizontal baseline**.

**Fix pattern:**
- Card container: `display: flex; flex-direction: column; height: 100%;` + parent `align-items: stretch` (CSS Grid default).
- Variable-length content: `flex: 1 1 auto;` — absorbs slack and pushes pinned elements to the bottom.
- Pinned elements with internally variable content: `min-height` to keep their *outer* height consistent across cards (e.g., `.stat-line { min-height: 96px; }`).
- Inner spans that can wrap: `min-height: 2.6em` (or `2lh`) so cells equalize when one label wraps and another fits on one line.

**Red flags caught in self-review:**
- Three "Read more" links on a card row at slightly different y values → fail.
- Bottom borders on a card row that visibly stair-step → fail.
- "Open category" links across columns at different y → fail.
- A flex-column card without `height: 100%` or grid stretch → fails.

---

## 4. Information architecture

### 4.1 Sitemap

```
/
├── /products                          [refreshed; full overhaul]
│   ├── /products/[slug]               [refreshed; per-SKU detail]
│   └── (filterable index — 14 SKUs across 2 partners)
├── /field-reports                     [NEW · index]
│   └── /field-reports/[slug]          [NEW · long-form detail]
├── /partners                          [NEW · index]
│   └── /partners/[slug]               [NEW · per-partner deep-dive]
├── /about                             [refreshed]
├── /contact                           [refreshed]
├── /privacy                           [templated]
├── /terms                             [templated]
└── /ar/*                              [Arabic mirror of every page]
```

**Deferred** (mentioned in source-of-truth section 5 but not in v1):
- `/solutions` (cross-cut by crop: vegetables, fruit, field crops, forages)
- `/resources` (compatibility matrix as standalone, application guides, deficiency guide)
- `/news` or `/insights`

These get their own design treatment in v2 once the v1 IA validates with real users.

### 4.2 Global navigation — two-tier sticky

**Utility bar** (top, dark, mono):
- Operational signals: HQ name + branch count + business hours.
- Direct contact: phone + email.
- Collapses on scroll.

**Main nav** (paper, serif wordmark):
- Brand lockup (Z monogram + Zagros wordmark + tagline).
- Links: Products · Field Reports · Partners · About · Contact.
- Active section underlined in `--signal` (K+S yellow).
- Language toggle (EN ⇄ العربية) as a mono pill.
- Single primary CTA: "Request a quote →" in `--ink` (or `--signal` over photo backgrounds).
- Stays sticky on scroll.

### 4.3 Footer — colophon
- Full Z lockup + tagline.
- Newsletter capture: "Field Updates · monthly".
- Four columns: Catalog · Reports · Branches · Company.
- Floor row: copyright + "Section · 09 / 09 · Colophon" stamp (mono, muted).

### 4.4 Caption strips (section dividers)
Between every major section (or page header transition), a thin `--ink` strip with mono uppercase text:
- Left: "Section · NN / 09 · **Section name**"
- Right: contextual sub-label (e.g., "Three reports · this issue", "2024 operating year")

These act as the journal's section-header furniture and create page rhythm without competing with content.

---

## 5. Component inventory

### 5.1 Primitives
- **Caption strip** (dark, mono, between-section divider).
- **Kicker** (mono uppercase + signal/sienna bar prefix).
- **Section number** marginalia (Fraunces italic outline numerals).
- **Pull quote** (Fraunces italic, sienna or signal accent rule).
- **Drop-cap** (English only, Fraunces opsz 144, sienna).
- **Ornament glyph** (◆ in sienna, used in Arabic in place of drop-cap).
- **Photo stamp** (overlay on image — paper bg + mono uppercase).
- **Disclaimer chip** (floating top-right when illustrative data is shown — `Illustrative figures · pending audit`).
- **Mono dataline** (e.g., "Section · 04 / 09 · Editor's note" footer of dark bands).

### 5.2 Editorial blocks
- **Hero** (full-bleed photo or paper-toned with massive Fraunces italic numerals + asymmetric layout).
- **Editor's note** (asymmetric two-col with marginalia + drop-cap + pull quote).
- **Featured Field Report** (half-bleed photo + side info panel with stat-row).
- **Yellow takeover band** (operations ticker — mono mini-headlines on signal background).
- **Dark "By the numbers" takeover** (4-cell stat grid + micro-bar charts + 14-state region map).
- **CTA section** (signal background, ink heading, ink + ghost buttons, mono meta panel).
- **Caption strip** (already noted in primitives).

### 5.3 Card patterns
- **Report card** (photo + stamp + kicker + Fraunces headline + summary + stat-line + Read link). Locked stat-line baseline via `min-height: 96px`.
- **Partner card** (logo tile in K+S yellow / ink / field green + label + Fraunces name + summary + meta dashed-rule). Locked meta baseline via flex-column body.
- **Product card** (bag mockup or real photo + SKU + Fraunces name + grade in mono + composition + use tags + badges + View link). Locked footer baseline via flex-column body.
- **Use-case card** (numbered Fraunces italic + Fraunces head + body — used in product detail, dark variant).
- **Related-content card** (smaller report-card variant — appears at the bottom of detail pages).

### 5.4 Data display
- **Inline data callout** (table with mono headers + Fraunces serif numerals, dashed inter-row rules).
- **Application rates table** (per-crop rows with stage badge + units + notes).
- **Stat grid** (4-cell with Fraunces 4.4rem numerals + mono labels + micro-bar charts).
- **Region table** (14-state grid with `--signal` "hub" tiles).
- **Composition card** (dark spec-sheet panel — see Product detail).
- **Compatibility matrix** (two-col ✕/✓ with chemistry "why" notes + universal-rule callout in `--warn` border).

### 5.5 Filter system (Products index)
- **Sticky left sidebar** with eight facet groups: Category · Subcategory · Nutrient (6-tile periodic-table grid) · Application method · Crop stage · Crop category · Special properties · pH suitability.
- **Top toolbar** with search (⌘K hotkey) · live result count · sort dropdown · view toggle (Cards / Compact).
- **Active filter pills row** with one-click × removal + Clear all.
- **Reset filters** button at sidebar bottom.

### 5.6 Navigation furniture
- **Breadcrumb** (mono uppercase with `/` separator, ink links).
- **Issue tag** (massive Fraunces italic numeral with `--signal` color highlight).
- **Section runner** (vertical-rl mono "SOURCES" or similar, used in margin space).
- **Scroll hint** (mono "scroll · 01 / 09" + thin vertical line + chevron).

---

## 6. Per-page specs

### 6.1 Home — "The Field Report cover"
**Goal:** Establish the editorial concept on first scroll while keeping Products one click away.

**Section stack** (referenced as 01 / 09 through 09 / 09 in caption strips):
1. Utility bar + main nav.
2. **Hero** — full-bleed real field photo (irrigation canal default) + `Issue 03 · 2025 · Yield` stamp top-right + asymmetric Fraunces headline overflowing the photo bottom + dataline (4 KPIs in mono+Fraunces) at the bottom.
3. **Yellow operations ticker** — live shipments and trial windows (e.g., "K+S potash arriving · Port [city] · 14 May").
4. **Editor's note** — asymmetric 2-col, marginalia outlined "02", drop-cap, pull-quote with `--signal` rule.
5. **Featured Field Report** — half-bleed photo + side info panel with sienna `§ 03` floating label.
6. **Three reports grid** — staggered 3-col with photos, stamps, stat-lines locked to shared baseline.
7. **Sources (Partners)** — vertical-rl "SOURCES" runner + asymmetric head + 3 partner profiles with real K+S / Barenbrug logos. Note: only 2 partner houses, but home displays them as 3 if a sub-line of Barenbrug is treated separately, OR shows just 2 with extended profile text. **Default: 2 partner cards in a wider 2-col layout for v1.**
8. **By the numbers** — `--ink` takeover with 4-stat grid, micro-bar charts, methodology marginalia, and the 14-region table.
9. **The catalog** — field-manual table summarizing the catalog *categories* (not individual SKUs). v1 layout: 4-col table at desktop, listing K+S Water-soluble NPK · K+S Phosphate sources · K+S Nitrogen + Magnesium + Potassium (collapsed) · Barenbrug Forage. Each column: category number, name, SKU count, 2–3 representative SKU names with active ingredient/grade, "Open category →" link. Bottoms align via the alignment-discipline pattern (column = flex column; SKU list = flex grow; CTA pinned).
10. **CTA** — `--signal` takeover, "Bring us your soil report. *We'll bring the inputs.*", ink + ghost buttons, mono operational meta.
11. **Footer / Colophon**.

### 6.2 Products index (`/products`)
**Goal:** Help an agronomist filter to the relevant SKUs in under three clicks.

- **Page header** — compact (single Fraunces headline + 1-paragraph desc + 3-stat row).
- **Toolbar** (search · count · sort · view toggle).
- **Active filter pills**.
- **Catalog area** — 280px sticky sidebar + main results.
- **Sidebar** (see component 5.5).
- **Results** — partner-anchored sections (K+S 11 SKUs, Barenbrug 3 SKUs), each with subcategory bands (numbered Fraunces italic § + mono uppercase title), then a 3-col card grid.
- **Card** — bag mockup in product brand color + SKU + Fraunces name + grade + composition mono + use tags + badges + View. "Bag photo · pending" overlay until client provides real photography.
- **Compact view** — 5-col table-style row (mini-bag + name + composition + uses + badges + open) for spec power-users.

### 6.3 Product detail (`/products/[slug]`)
Canonical example: soluCN.

- Page-id strip + utility + main nav.
- Breadcrumb (Products / Fertilizers (K+S) / Nitrogen sources / soluCN).
- **Header** — 2-col:
  - Left: partner attribution line with K+S logo + supplier note ("supplied via K Plus S Middle East FZE, Dubai") + Fraunces italic product name + grade in mono + badges (water-soluble, Cl-free, etc.) + Fraunces lead paragraph.
  - Right: dark spec card with composition (Fraunces numerals + mono labels in 2-col grid) + form/bag/solubility/use/brochure download in mono `<dl>`.
- **Compatibility callout** — `--warn` accented label + Fraunces head + 2-col ✕/✓ grid with chemistry "why" notes + universal-rule callout.
- **Application rates table** — per-crop rows with units, stage badges, operational notes.
- **Why this matters** — `--ink` takeover with Fraunces head + 3 use-case cards (e.g., blossom-end rot · fruit cracking · saline correction).
- **Related products** strip.
- **Pre-footer CTA + Footer**.

### 6.4 Field Reports index (`/field-reports`)
- Header with issue archive overview (12+ reports, browseable by issue / crop / region / partner).
- 3-col card grid (same component as home's "More from the field"); pagination or infinite scroll TBD in implementation.

### 6.5 Field Report detail (`/field-reports/[slug]`)
Long-form editorial template — see screen 13 mockup.

- Breadcrumb + issue stamp (massive Fraunces italic) + Fraunces hero headline.
- **Byline row** — author / date / location / read time / "Save report" affordance.
- **Full-bleed hero photo** with caption + credit overlay.
- **Body** — 3-col + 6-col asymmetric layout:
  - Left margin (cols 2–4): info blocks — "Trial in brief" (dark spec card), "Trial site" (paper card with mini-map), "Partner" (paper card with partner logo + name + since-date).
  - Article (cols 6–12): Fraunces lead, body paragraphs with drop-cap on first paragraph, h3 sub-heads, inline data callouts with mono table, pull-quote with signal rule.
- **Mid-article wide photo** (cols 2–14, 420px tall) with mono caption.
- **Related reports strip** (paper-light bg).

### 6.6 Partners index (`/partners`)
- Header: 2 partner houses + 14 SKUs total.
- 2 large partner cards (K+S, Barenbrug) — bigger than the homepage variant; each links to deep-dive.
- Inline meta: country / since-date / SKU count / last-shipment / trial status.

### 6.7 Partner deep-dive (`/partners/[slug]`)
See screen 13 mockup.

- Breadcrumb + dark hero band:
  - 200×200 logo tile (paper bg, mix-blend multiply).
  - Identity panel: kicker "Partner · Germany · since 2014" + Fraunces "K+S Group, of Kassel." + Fraunces lead paragraph.
  - 4-stat row underneath.
- Section-note strip + **About the house** section: 2-col asymmetric. Left = lead with Fraunces head + body. Right = product lines table (real cultivars/SKUs Zagros carries from this partner).
- Section-note strip + **In the field** section: 3-card "reports tagged with this partner" grid (same as home's "More from the field" component).
- Pre-footer CTA + Footer.

### 6.8 About (`/about`) — pending company PDF
**Pending content from client:** legal name, founding year, mission, leadership, locations, branches, contact details, vision/values (per source-of-truth gap list).

**Structural plan** (locked, awaits copy):
- Hero — Fraunces statement + photo of operations.
- "How we operate" — 3 pillars (technical excellence · regional fit · international standards).
- "Where we operate" — branch list with map.
- "The team" — placeholder until client provides headshots/bios.
- Affiliations / certifications.
- Pre-footer CTA + Footer.

### 6.9 Contact (`/contact`) — pending contact details
**Pending:** phone, email, WhatsApp, addresses, branch list (per source-of-truth gap list).

**Structural plan**:
- Header — Fraunces headline + intent-router subhead ("Quotes go out within one business day…").
- 2-col body: Left = form with route selector (Sales / Agronomy / Press / Careers); Right = direct contact panel + WhatsApp callout + branch list + hours + map.
- Pre-footer CTA-as-divider + Footer.

### 6.10 Privacy & Terms (`/privacy`, `/terms`)
Templated. Single-column 60ch body in IBM Plex Sans, Fraunces h2 sub-heads, mono section numbers (§ 01, § 02). Reuses caption strips between sections. Footer-linked only.

### 6.11 Solutions / Resources (deferred to v2)
Not built in v1. Components and IA pattern designed but content/copy waits on real query data after launch.

---

## 7. Implementation notes

### 7.1 Tech stack — what stays
- **Astro 5** (kept) — page routing, MDX support for product detail / field reports, SSG output.
- **React 18** (kept) — interactive components (filter sidebar, toolbar, search).
- **Tailwind 3** (kept) — design tokens extend the theme.
- **Framer Motion** (kept, restrained usage).
- **Swiper** (kept) — used for hero carousels if needed and the operations ticker.
- **Leaflet** (kept) — coverage map on home + per-region drilldown.
- **i18n** (kept) — EN/AR with RTL; Arabic is hand-curated, not auto-translated.

### 7.2 What to replace
- **Fonts**: replace Cairo with IBM Plex Sans Arabic; add Fraunces, IBM Plex Serif/Sans/Mono. Self-host via `@fontsource/...` packages (recommended over Google Fonts CDN for performance + privacy).
- **Logo SVG**: redrawn Z mark + IBM Plex Serif lockup. Existing `/public/logo.svg` is replaced.
- **Color tokens**: rewrite `tailwind.config.mjs` to extend `theme.colors` with the 7-token palette + product brand-coding tokens. Drop dark mode variants entirely.
- **Spacing tokens**: rewrite `theme.extend.spacing` with `--sp-1`…`--sp-11` keys + role tokens (`section-y`, `head-to-content`, etc.).
- **Component layer**: replace all `src/components/home/*` with new section components mirroring the screens 08–15 mockups.
- **Stale data files**: `src/data/fertilizers.json`, `src/data/pesticides.json`, `src/data/company.ts` are scrapped. Replace with a per-product MDX collection or `products.json` driven by the source-of-truth schema (see source-of-truth section 9).

### 7.3 What to add
- **Astro content collections**: `src/content/products/*.mdx`, `src/content/field-reports/*.mdx`, `src/content/partners/*.mdx`. Each MDX has frontmatter matching the JSON schema in source-of-truth section 9, plus a body for narrative copy.
- **Brand assets**: `/public/brand/` — wordmark variants, monogram, favicons.
- **Bag mockup component** (`<ProductBag>`) — renders SVG fallback in product brand color until real bag photography arrives. Same component takes a `bagPhotoUrl` prop and renders the photo when set. Note: when real bag photography arrives from K+S, every fertilizer bag carries the **K+S bull logo** — that's the brand mark on every product, not just a typographic K+S setting.
- **Brochure downloads**: per source-of-truth section 8, the original K+S brochure PDFs (11 fertilizer brochures, Arabic) and Barenbrug datasheets (3 forage, English) should host at `/downloads/specs/` and link from every product detail page's spec card under `brochure_url` in the JSON schema. Treat these as the authoritative spec sheet — never replicate their content beyond the summary visible on the product page.
- **Compatibility matrix** as a reusable component used on every product detail page (data driven from a `compatibility.json` keyed by SKU). The full matrix is in source-of-truth section 6 — copy it verbatim into `src/data/compatibility.json`. The "why" explanations (Ca²⁺ + phosphate → precipitate, etc.) become the body of the universal-rule callout on the product detail page.
- **Scroll-driven micro-interactions**: stat counter on home, map fill on coverage section. Framer Motion's `useInView` + `useMotionValue`.
- **Sticky filter sidebar** — `position: sticky` with a max-height + internal scroll on shorter viewports.

### 7.6 SEO starting points (per source-of-truth section 10)
Source-of-truth section 10 provides starting-point `<title>` (60ch target) and meta descriptions (155ch) for the home and example product pages. Implementation should:
- Adopt those templates for every product detail page using the same shape.
- Generate the title/meta from the product's frontmatter (`name.en`, `name.ar`, `grade`, key positioning line) via an Astro head component.
- Add Open Graph + Twitter card metadata per page (image = bag photo when available, otherwise the bag SVG mockup rasterized).
- Localize: each AR route gets its own title/meta in Arabic.

### 7.4 Product data shape
Adopt source-of-truth section 9's JSON schema verbatim as the per-product MDX frontmatter. Add fields where the source-of-truth flags optional (`hazard_class`, `organic_certified`, `origin_country`, `incompatible_with[]`). Compatibility data is its own structure cross-referenced by SKU.

### 7.5 i18n strategy
- Translation files: `src/i18n/en.json` and `src/i18n/ar.json`, hand-curated, never auto-translated.
- Per-locale MDX bodies: `src/content/products/solu-cn.en.mdx`, `solu-cn.ar.mdx`.
- Routing: `/` (English default) and `/ar/*` (Arabic mirror) — preserves the current pattern.
- RTL handling: `dir="rtl"` on `<html>` for Arabic routes; CSS logical properties (`margin-inline-start`, `padding-inline-end`) instead of physical (`margin-left`, etc.) wherever possible.

---

## 8. Open gaps — client must provide before launch

From source-of-truth section "GAPS — FILL BEFORE LAUNCH":

1. **Company profile content** — re-upload `شركة_زاغروس_البذور.pdf`. Powers About + footer copy.
2. **Contact details** — phone, email, WhatsApp, physical addresses.
3. **Service area** — Iraq? Kurdistan? Other Middle East? Powers nav copy + about + footer.
4. **Languages** — confirm i18n scope (Arabic primary; Kurdish? English?).
5. **Logo files** — SVG preferred, PNG fallback. Required for the new wordmark refresh.
6. **Brand color palette** — confirm or override what we've inferred.
7. **Photography** — product packaging shots (replaces SVG bag mockups), field/farm photos (replaces the placeholder Sudanese photos in the brainstorming mocks), team photos.
8. **Pricing / quote workflow** — does the site quote prices, or only collect inquiries?
9. **Crop-region targeting** — date palms / citrus / vegetables / forage emphasis per the regional buyer.
10. **Existing customers / case studies** — for trust section + Field Reports body.
11. **Local certifications** — separate from manufacturer ones.
12. **soluMAP spec verification** — current numbers approximate per source of truth.
13. **KaliSOP fine chloride spec** — 0.1% body vs 1.0% label — confirm.
14. **High-res bag/photo assets from K+S and Barenbrug** — replaces the brand-coded SVG mockups.

Sections that **cannot ship in v1** without these gaps filled: About, Contact, contextual copy on Home (regional naming).

---

## 9. Phasing

### v1 launch scope
- Home (with placeholder regional copy where needed; Field Reports can ship 2–3 reports written against source of truth).
- Products index + 14 product detail pages (frontmatter-driven from source of truth).
- Field Reports index + 3 reports (canonical examples — soluCN-for-blossom-end-rot, Alfamaster Ten yield trial, Superfine Rhodes salt-tolerance).
- Partners index + 2 deep-dive pages (K+S, Barenbrug).
- About (structural skeleton + placeholder copy until company PDF arrives).
- Contact (structural skeleton + placeholder until details arrive).
- Privacy + Terms (templated).
- EN + AR mirror.

### v2 (post-launch)
- `/solutions` cross-cut by crop.
- `/resources` — compatibility matrix as standalone, application calculators, deficiency identification guide.
- `/news` or `/insights` blog/journal.
- Field Reports archive expansion (reports 4–12).
- Partner expansion if Zagros adds new houses.
- Quote/pricing workflow if client adopts it.

---

## 10. Quality gates

Before declaring any page "done" during implementation, run:

1. **Spacing self-review** — section padding ≥ 96px, head-to-content gap ≥ 64px, card internals match the role tokens.
2. **Alignment self-review** — card-row separators / CTAs / dashed rules sit on shared horizontal baselines (test by overlaying with a horizontal rule in DevTools).
3. **Voice self-review** — no banned cliché list, copy reads as written by a domain editor not generated by an AI.
4. **Arabic typesetting check** — no italic, no English punctuation in AR body, numerals correct per role, drop-cap replaced with ◆ ornament, Latin partner names within RTL stay LTR.
5. **Source-of-truth cross-reference** — every fact (name, grade, application rate, ingredient, partner) is traceable to source of truth.
6. **Performance baseline** — Lighthouse 90+ for performance and accessibility on slow 3G profile (Middle East buyers may be on patchy connections).
7. **Brand-design review** — referenced against the pinned references (MOLD / Cereal / Field / Eames / Patagonia Provisions) to verify editorial conviction; not generic AI aesthetic.

---

## 11. References

- **Source of truth** (canonical content): [`ZAGROS_SOURCE_OF_TRUTH.md`](../../../ZAGROS_SOURCE_OF_TRUTH.md)
- **Brainstorm session mockups**: `.superpowers/brainstorm/31581-1778441403/content/` — screens 00 (context) through 15 (products v2).
- **Pinned design references**: MOLD Magazine · Cereal Magazine · Field Magazine · Eames Institute · Patagonia Provisions.
- **Frontend-design skill** must drive implementation: avoid generic AI aesthetic, commit to the editorial direction, asymmetry/texture/dominant-color over timid grids.
- **Memory**: `~/.claude/projects/-home-ibrahim-Desktop-ZagrosDemo3-pre-Prod/memory/` — anti-slop discipline, copy quality rules, spacing & alignment rules, source-of-truth pointer.

---

## 12. Sign-off

This spec is the contract for implementation. Any deviation must update this document first.

**Approved by:** _pending_
**Implementation plan:** to be created next via the `writing-plans` skill, referencing this spec.
