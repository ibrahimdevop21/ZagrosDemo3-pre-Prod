# Zagros Design System

Editorial publication aesthetic. Locked in spec `docs/superpowers/specs/2026-05-12-zagros-v3-editorial-design.md`. Defined tokens at `src/styles/tokens.css`. Tailwind utility surface at `tailwind.config.mjs`.

## Color — strategy: Restrained

A single editorial palette. No dark mode. Tints all neutrals toward the brand sienna hue (warm cream / paper ground). Single saturated accent (`signal` yellow) used sparingly, ≤10% of any composition.

Tokens (CSS variables, space-separated RGB triples for use with Tailwind's `rgb(var(--X) / <alpha-value>)`):

| Token | Hex | Role |
|---|---|---|
| `--color-paper` | `#F2EFE6` | Warm ivory base ground |
| `--color-paper-light` | `#FAF8F2` | Slightly brighter alt surface |
| `--color-stone` | `#D4D0C5` | Chalk dividers, borders |
| `--color-mute` | `#8A8678` | Captions, tertiary text |
| `--color-ink` | `#1B1A17` | Primary text, inverted bands |
| `--color-sienna` | `#5A3A1E` | Editorial accent, hover, link underlines |
| `--color-field` | `#2B5E3E` | Tags, positive deltas, organic certifications |
| `--color-signal` | `#F2C233` | The single bright — K+S anchor, CTAs, accent words |
| `--color-warn` | `#C8443C` | Compatibility-matrix warnings only |

**Never use `#000` or `#fff`.** `--color-ink` is the brand's "black"; `--color-paper` is the "white." Both are warm-tinted.

Product brand-coding tokens (used by product card hero zones). Defined as `--c-*` (not `--color-c-*`):

| Token | Hex | Product |
|---|---|---|
| `--c-npk` | `#1F2A4A` | soluNPK / soluUP family |
| `--c-mkp` | `#1F6470` | soluMKP teal |
| `--c-map` | `#2D6F5C` | soluMAP green-teal |
| `--c-ams` | `#6E1F22` | soluAMS Premium burgundy |
| `--c-nop` | `#76C68A` | soluNOP mint |
| `--c-cn` | `#DDE8DA` | soluCN very pale green |
| `--c-epso` | `#2E7035` | EPSO Top organic green |
| `--c-ksop` | `#1E3A8A` | KaliSOP royal blue |
| `--c-rhodes` | `#4A8C3A` | Rhodes tropical green |
| `--c-sardi` | `#6B4FBB` | SARDI / Alfamaster lucerne purple |
| `--c-pesticide` | `#5A3A1E` | Pesticide line (mirrors sienna). New for v3. |

Backgrounds use `bg-c-{token}` Tailwind classes — defined explicitly in `tailwind.config.mjs:33-44`. Never use inline `var(--color-c-*)` — that prefix does not exist, that's the Plan-7-B black-rectangle bug.

## Theme

Light, paper-warm. Single ground per page; bands of `--color-ink` invert local sections for chapter contrast. No dark-mode toggle.

Why light: the audience reads in midday Sudanese sun on phones with hot direct light. Paper-and-ink editorial publication maps to the cultural ag-trade journal reference. Dark mode would be a SaaS reflex without a real reason.

## Typography

Four families. Discriminate role by family + weight, not by extra fonts.

| Family | Use | Weights |
|---|---|---|
| `font-display` → Fraunces | Magazine headlines, hero italics, numerals, wordmark | 300, 400, italics |
| `font-serif` → IBM Plex Serif | Editorial body (pull quotes, long-form) | 400, 500, 600, 700 |
| `font-sans` → IBM Plex Sans Variable | Primary reading sans, UI labels | 400, 500, 600 |
| `font-mono` → IBM Plex Mono | Captions, kickers, data labels, "live · 04:32" | 400, 500 |
| `font-arabic` → IBM Plex Sans Arabic | AR locale default body + display | 400, 500, 600, 700 |

### Type scale

Hierarchy from scale + weight contrast (≥1.25 ratio). Italic for display, mono for kickers.

| Role | Class / value | Notes |
|---|---|---|
| Page hero h1 | `text-[clamp(36px,7vw,96px)]` italic | Floor 36px on 360px mobile, 96px ceiling |
| Section h2 | `text-[clamp(32px,5vw,56px)]` italic | One per section |
| Card h3 / h4 | `text-2xl` to `text-3xl` Fraunces italic | Per card type |
| Body | `text-[15px]` to `text-base` (16px on inputs) | iOS no-zoom on inputs |
| Mono kicker | `text-[10.5px] tracking-[0.22em] uppercase` | All caps, wide tracking |
| Big-number display | `font-display italic font-light text-[clamp(72px,12vw,200px)]` | By-the-numbers, count-up animations |

### Arabic specifics

`html[dir='rtl']` body line-height 1.65, h1-h3 line-height 1.18. Family defaults to `font-arabic`. AR locale uses Arabic-Indic numerals for visible UI numbers but keeps Western digits for phone numbers, ISO codes, technical specifications (N-P-K values, kg/feddan).

### Cap line length

Body 60-75ch. `max-w-prose` is `60ch`. Use it on long-form paragraphs.

## Spacing — editorial generous

Section rhythm uses the `144 / 96 / 64 / 40` scale at hero, `64 / 40` between content blocks. Defined as semantic tokens, not raw pixels:

| Token | Value | Use |
|---|---|---|
| `section-y` | 144px | Vertical padding between major sections |
| `section-y-major` | 200px | Hero / chapter breaks |
| `head-to-content` | 96px | Section h2 to first child |
| `card-photo-gap` | 32px | Photo zone to body zone in cards |
| `card-kicker-gap` | 16px | Kicker to headline |
| `card-head-gap` | 24px | Headline to body |
| `card-summary-gap` | 32px | Body to CTA |
| `page-x` | 56px desktop / 20px mobile | Horizontal page gutter |

Raw scale `sp-1` (4px) → `sp-11` (200px) available for ad-hoc spacing.

Vary spacing for rhythm. Same padding everywhere is monotony. Sections should breathe; sub-sections should compress.

## Layout primitives

- `.container-spine` — **single horizontal-alignment primitive sitewide**. `max-width: var(--stage-max-width)` (1300px), `padding-inline: var(--page-margin-x)` (responsive 56/20px), `margin-inline: auto`. Every content region wraps its inner content in this class. Full-bleed backgrounds sit on the outer element; constrained content sits inside the container. Defined in `src/styles/global.css` `@layer components`. Internal 12-col grids nest inside via `<div class="grid grid-cols-12 gap-6">` (opt-in, never overloaded onto the container itself). Spec: `docs/superpowers/specs/2026-05-17-layout-spine-design.md`.
- `.paper-grain` — SVG-noise paper texture overlay applied as `::after`. Use on hero or full-width sections that want depth.
- `.kicker` — small-caps mono label with a 28px leading bar.

Cards are the lazy answer to most layout problems. Use only when truly the best affordance. Nested cards are always wrong.

## Components conventions

- **Buttons:** signal-yellow primary (`bg-signal text-ink`), paper-on-ink secondary, all 44px min height.
- **Tap-to-call:** `tel:+249912338559` always. WhatsApp: `https://wa.me/249912338559` always.
- **Image placeholders:** `Placeholder.astro` (new in v3) renders a striped diagonal-hatch tile labeled with the kind of photo needed. Honest about gaps.
- **Product card hero zones:** the bg-c-{token} colored zones from Plan 7 B. User-loved. Keep.
- **Drawer:** native HTML `<dialog>` with `transform: translateX` slide. No JS framework. RTL-aware via `dir` attribute.
- **Marquee:** CSS animation only. Paused on hover. Paused for `prefers-reduced-motion`.

## Motion

- Restrained editorial — animation as acknowledgment, not spectacle.
- Hardware-accelerated only: `transform`, `opacity`. Never animate CSS layout properties.
- Ease out with exponential curves (`ease-out-quart`, `cubic-bezier(0.22, 1, 0.36, 1)`). No bounce, no elastic.
- All motion gated by `@media (prefers-reduced-motion: no-preference)`. Global reduced-motion safety net at `src/styles/global.css:63-72`.
- Scroll-reveals: 400ms fade + 12px translate-y, 80ms stagger between siblings. One-shot (don't re-animate on scroll up).
- Hero slideshow: 24s loop, 4 photos, 5s visible + 1s crossfade each. Ken Burns scale 1.00→1.09. CSS-only.
- Count-up numbers: 1.2s ease-out via requestAnimationFrame. Skipped under reduced motion.
- Marquee ticker: 40s loop desktop / 30s mobile. RTL-aware direction.

## Absolute bans (project-specific reinforcement of impeccable shared laws)

- **No side-stripe `border-left` accents on cards.** Use full borders, leading numerals, or nothing.
- **No gradient text.** `background-clip: text` never. Emphasis via color (signal) or weight.
- **No glassmorphism as default.** Backdrop-blur only on dialog backdrops where it serves contrast.
- **No hero-metric template.** Big-number/small-label/supporting-stats SaaS cliché. The By-the-numbers section uses asymmetric scale instead.
- **No identical card grids.** Same-sized icon+heading+text tiles repeated endlessly is the SaaS reflex. Asymmetric grids (1.4fr/1fr/1fr/1fr or spotlight+tiles) preferred.
- **No modal-first.** Inline progressive disclosure. Modals only for truly modal flows (forms, drawers).
- **No em dashes in copy.** Use commas, colons, semicolons, periods, parentheses. Also not `--`. Hyphens are fine for hyphenated compounds.
- **No "AI made that" reflexes.** No icons-in-circles trio. No "build / ship / scale" trichotomies. No purple/blue gradients. No abstract waveform hero illustrations.

## Pending design work

- Real hero photography selection — locked to 4 existing photos in `public/hero/` for v3 launch (irrigation, crop, vegetable, pest). Real client-provided photo set due later.
- Real K+S spotlight photo for home Partners section.
- Real customer pull quote (currently pending fallback).
- Hand-drawn Sudan map SVG for the Branches section.
- Real Kafr El Zayat partner logo (per `REMAINING_GAPS.md` item 8).

## Audit close-out (2026-05-17)

The `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md` punch list is fully reconciled. Items closed by code reference the commit that closed them; items closed by reasoning document the design call so a future audit doesn't re-flag the same thing.

**Closed by code:**
- **A1, A3** — closed in `e13b5ea` (quick-wins batch).
- **A2** — closed in `9c3d39e`: orphan `card-*-gap` tokens deleted (YAGNI — cards don't share a four-role structure).
- **B1, B2, B3, B4, B5, E1, E2** — closed by the layout spine migration (`ce94c16` through `b860f0c`). One `.container-spine` primitive, one `--section-y` token, one type scale per peer role.
- **C1, C2, C3** — closed in `b3a0ae3`: Nav vertical padding bumped to `py-sp-5`, lang toggle to 44px, all three pills standardized on `px-sp-4 py-sp-3`.
- **C4, C5** — closed in `e13b5ea`: UtilityBar phone link to 44px + bar grown to `py-sp-4` token.
- **D1, D3, D4, D6** — closed in `5c3c2e7`: footer pt/pb to 96/64, newsletter literals to tokens, colophon gap tightened, branch names differentiated from links via size + opacity.
- **D2** — closed in `e13b5ea`: `leading-[2.15]` hack removed; footer items now share `min-h-[44px] flex items-center` rhythm.
- **D5** — closed by the spine Phase 2 footer rewrite (`97715dd`): the new `col-span-12 / sm:col-span-3 / lg:col-span-2` responsive scheme replaced the crowded `col-start-{7,9,11,13}` placement.
- **E4** — closed in spine Phase 3 (`fa9e188`): marquee `py-3` literal → `py-sp-3` token.
- **E5** — closed in spine Phase 2 (`97715dd`): CaptionStrip `py-4` literal → `py-sp-4` token.
- **E6** — closed in `4ffef0a`: Hero content wrapper to `pt-sp-8 pb-sp-7`.
- **E7** — closed automatically by D1 (`5c3c2e7`): footer top pulled up to 96px, CTA→footer seam now reasonable.

**Closed by reasoning (no code change needed):**
- **E3** — Hero → OpsTickerMarquee join. Marquee is a chrome band by design (slim ticker at `py-sp-3`); after E6 the hero ends at `pb-sp-7`. The join is intentional. The marquee should feel attached to the hero — it's an ops ticker, not a content section.
- **E8** — Card padding "inconsistent" sitewide. The variation is **role-based, not drift**:
  - Tiny logo tiles (`CustomersWall`): `p-sp-3` — logos need tight padding to read at small sizes.
  - Compact tiles (`PartnersSection`): `p-sp-4` — tile density.
  - Standard editorial cards (`CatalogStrips`, `FieldReportsTeaser`): `p-sp-5 sm:p-sp-6` — full editorial padding.
  - Info blocks (`WorldReach` credentials, scope note): `p-sp-5` — informational density.
  - Utility blocks (`WorldReach` map+aside): `p-sp-4 sm:p-sp-5` — utilitarian.

  Each card-class has one consistent padding for its role. There is no sitewide single `card-padding` token because cards don't share a single role.
- **E9** — Card-internal vertical rhythm. Same reasoning as E8 — `gap-sp-3` (info cards), `gap-sp-4` (editorial cards), `mb-sp-2`/`mb-sp-3` (small cards) all match the role of the card class. Not random drift.
