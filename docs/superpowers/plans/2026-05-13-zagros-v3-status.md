# Zagros v3 — Status

**Status:** code complete, tests green, build clean. Awaiting visual review on the live dev server before tagging `v3-editorial`.

## What shipped

| Task | Subject | Commit |
|---|---|---|
| A | motion foundation + Placeholder | `be80ff7` |
| B | `--c-pesticide` token + bg class | `991956b` |
| C | nav: add Home, drop Partners + Customers | `6ce5a8a` |
| D | drop /partners + /customers indexes, 301 redirects | `fa9b806` |
| E | Section 01 HeroV3 (rotating slideshow) | `2d8390a` |
| F | Section 02 OpsTickerMarquee (CSS-only) | `d9a6be5` |
| G | Section 03 ByTheNumbersV3 (count-up) | `69f6e91` |
| H | Section 04 CatalogStrips | `ff93481` |
| I | Section 05 PartnersSection + shared spotlight | `fe7a09c` |
| J | Section 06 FieldReportsTeaser | `f397fda` |
| K | Section 07 CustomersWall (ink ground) | `df9a694` |
| L | Section 08 BranchesMap (drops leaflet) | `2fc55e2` |
| M | Section 09 QuoteCTA + home page rewrite | `ac803f2` |
| N | /partners/[slug] hero uses PartnerSpotlight | `c9d3c0e` |
| O | products tree typography sweep | `c7fc6c2` |
| P+Q | about, contact, field-reports typography polish | `d1770ed` |
| R | verification + this status doc | (next commit) |

## Verification

```
npm test         97 passed (97)
npm run build    100 page(s) built in ~4s
```

Plan H.2-style grep sweep on `dist/`:
- Banned strings (`BAG MOCKUP · PENDING`, `14 SKUs`, `بيتا شراكة`, `بيت ماركة`, "operator, not a brand", "partner houses") → **0 hits each**
- `tel:+249912338559` → 2 hits each on EN + AR home + EN + AR contact
- `wa.me/249912338559` → 1 hit each on EN + AR home + EN + AR contact
- `data-reveal` → live in dist (motion system wired)
- `hero-slideshow` → live in dist (Section 01 slideshow)
- `Home` nav link present (3 instances: brand wordmark + primary nav link + mobile drawer link)
- No bare `/partners` or `/customers` href in nav (only `/partners/[slug]` deep-links remain)

## What changed (high-level)

- **Homepage:** rebuilt from scratch as 9-section editorial publication. Section order locked in brainstorming: Hero → Ops ticker → By the numbers → Catalog → Partners → Field reports → Customers → Branches → Quote CTA.
- **Nav:** `Home` added as the first primary link. `Partners` and `Customers` removed (they live on the homepage now).
- **IA:** `/partners` and `/customers` index pages deleted. 301 redirects from both (and AR mirrors) point to home. Deep-link `/partners/[slug]` pages survive.
- **Motion:** new `src/lib/motion.ts` + `src/styles/motion.css`. IntersectionObserver-driven scroll reveals + count-up. CSS-only marquee + hero slideshow. All gated by `prefers-reduced-motion`.
- **Image placeholders:** new `Placeholder.astro` component used wherever real photography is pending. Striped diagonal-hatch tile labeled with the kind of photo needed. Honest about gaps per anti-AI-slop discipline.
- **Hero photo:** 4-photo CSS Ken Burns slideshow using existing `public/hero/{irrigation,crop,vegetable,pest}.webp`. Reduced-motion freezes on first slide.
- **Sudan map:** hand-drawn editorial inline SVG (drops `leaflet` dependency).
- **Pesticide brand token:** new `--c-pesticide` mirrors sienna numerals.
- **Inner pages:** all hero h1s now use `font-display italic font-light` per DESIGN.md big-display convention.
- **Partner detail:** uses shared PartnerSpotlight (variant=detail) instead of the old PartnerHero (deleted).

## Files changed

- **New (16):** motion.ts, motion.css, Placeholder.astro, HeroV3, OpsTickerMarquee, ByTheNumbersV3, CatalogStrips, PartnersSection, PartnerSpotlight, FieldReportsTeaser, CustomersWall, BranchesMap, QuoteCTA, plus 4 test files (Placeholder, HeroV3, PartnersSection, CustomersWall, BranchesMap, home-redesign).
- **Modified (~14):** Nav, MobileNavDrawer, Footer, both index.astro, both [line].astro, both products/index.astro, both [line]/[slug].astro, both partners/[slug].astro, both about.astro, both contact.astro, both field-reports/index.astro, tokens.css, tailwind.config.mjs, ProductHero.astro, content/config.ts, k-plus-s.mdx, customers.ts, ops-ticker.json, en.json, ar.json, types.ts, astro.config.mjs, package.json + lock.
- **Deleted (15):** 4 index pages, 10 obsolete home components (Hero, OpsTicker, EditorsNote, FeaturedReport, ThreeReportsGrid, SourcesSection, CustomersStrip, ByTheNumbers, CatalogTable, HomeCTA), PartnerHero, customers.test.ts.

## Pending real assets (per anti-AI-slop discipline)

These render as honest `Placeholder` tiles or fallback copy until the client provides the real thing:

1. **K+S spotlight photo** (home Section 05 + /partners/k-plus-s) — Placeholder, label says "facility, product range, or team photo pending"
2. **Customer pull quote** (home Section 07) — fallback to italic `[pull quote pending client confirmation]` marker
3. **Kafr El Zayat partner logo** (home Section 05 tile) — Placeholder logo tile
4. **Real Sudanese hero photography** — current 4 photos in rotation are placeholders from `public/hero/`; client may provide custom set later
5. **Sudan map outline accuracy** — current SVG is editorial hand-drawn approximation, not GIS-grade. Easy swap if client wants tighter outline.

## What's NOT done (out of scope per spec §13)

- Real photography
- New field reports beyond the 3 existing
- Backend / form submission
- Filter UI restoration (Plan 7 Task D full path)
- New supplier additions

## Browser pass still required

Code-level checks all pass. Visual confirmation needed on the live dev server:

- Hero slideshow rotation feel (24s cadence, Ken Burns scale)
- Marquee speed comfortable on desktop + mobile
- Pull quote pending fallback reads well in both locales
- Partner spotlight stickiness on lg+ viewports
- Reduced-motion preview (system setting on)
- 360 / 414 / 768 / 1024 viewport sweep in LTR + RTL
- Lighthouse mobile score (target 90+)

## Next step

User reviews on dev server. If sign-off, tag `v3-editorial`:

```
git tag v3-editorial
git log --oneline plan-7-mobile-first..v3-editorial
```

Do not push or tag without that sign-off.
