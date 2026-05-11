# Zagros v2 — Agent Working Notes

> **Source of truth for all Zagros product, brand, company, and supplier data:** `ZAGROS_SOURCE_OF_TRUTH.md` at project root. Read it before any content, copy, or data work. Do not invent facts not in this doc.

## Project at a glance

- **Zagros Trading** is a Sudan-based agricultural-inputs partner. Established 2010. Subsidiary of Zagros Group. ~50 staff. Member of the International Agricultural Trade Association.
- **Six branches across Sudan:** Khartoum HQ (Khartoum Bahry Industrial Zone), Port Sudan, Al Qadarif, Al Managil, Ad-Damar, Ad-Daba.
- **Seven international suppliers across six countries:**
  - 🇹🇭 East West Seeds International — vegetable seeds (Thailand)
  - 🇦🇺 Barenbrug Australia / Heritage Seeds — forage seeds (Australia)
  - 🇩🇪 K+S Middle East — fertilizers (Germany)
  - 🇳🇱 Agro Dragon — fertilizers (Netherlands)
  - 🇨🇭 SAF — pesticides (Switzerland)
  - 🇬🇧 KZ — pesticides (United Kingdom)
  - 🇪🇬 Kafr El Zayat Pesticides & Chemical Co. — pesticides (Egypt)
- **Upstream pesticide manufacturers** (per-product, not on Partners page): ~12 Chinese chemistry partners + Mahamaya Lifesciences (India).
- **Three product lines:**
  - Seeds (vegetable + forage) — 3 confirmed forage SKUs from Barenbrug; vegetable SKU list pending East West
  - Fertilizers — 11 K+S SKUs; Agro Dragon catalog pending
  - Pesticides — 16 SKUs across 3 subcategories (2 insecticides / 12 herbicides / 2 fungicides)
- **Tagline:** *Leaders in Agric Services* / *روّاد الخدمات الزراعية*
- **Contact:** +249 91 233 8559 (phone + WhatsApp). Sun–Thu 8 AM – 5 PM.

## Where data lives

| Concept | File |
|---|---|
| Company facts (name, founded, branches, contact, partners list, certifications) | `src/data/company.ts` |
| Homepage stats (derived from company.ts) | `src/data/home-stats.json` |
| Customers (6 logo-wall entries) | `src/data/customers.ts` |
| Tank-mix compatibility matrix | `src/data/compatibility.json` |
| Ops ticker (live updates) | `src/data/ops-ticker.json` |
| Use cases | `src/data/use-cases.json` |
| Fertilizers (11 SKUs) | `src/content/fertilizers/*.mdx` |
| Seeds (3 forage SKUs; vegetable pending) | `src/content/seeds/*.mdx` |
| Pesticides (16 SKUs) | `src/content/pesticides/p01-malason.mdx` … `p16-orastrobin.mdx` |
| Partners (7) | `src/content/partners/*.mdx` |
| Field reports | `src/content/field-reports/*.mdx` |
| Locale copy | `src/i18n/{ar,en}.json` + `types.ts` |
| Content schemas | `src/content/config.ts` |

## Route map

```
/                          ← homepage (also /ar/)
/products                  ← line picker (Seeds / Fertilizers / Pesticides)
/products/[line]           ← line page with subcategory grouping
/products/[line]/[slug]    ← detail page
/partners                  ← 7-supplier grid
/partners/[slug]           ← partner detail
/customers                 ← 6-customer wall
/about                     ← 6-section about page
/contact                   ← contact form + DirectContact panel
/field-reports             ← reports index
/field-reports/[slug]      ← report detail
/privacy /terms            ← legal (pending counsel review)

All routes mirrored under /ar/
```

## Hard rules

- **Do not invent content.** If a fact isn't in `ZAGROS_SOURCE_OF_TRUTH.md`, either flag it in `REMAINING_GAPS.md` or render an empty state.
- **Plausible placeholder copy hides gaps; visible "pending" markers signal them.** Prefer markers.
- **No invented brand framing.** Do not use "operator, not a brand house" or "two partner houses" anywhere. Zagros IS the brand customers buy.
- **Sudan-foreground.** Do not display aspirational MENA-regional claims. K+S Middle East FZE is a legitimate supplier company name — but that's the only context where "Middle East" should appear.
- **Bilingual parity.** Every visible string lives in both `en.json` and `ar.json`. Hand-write Arabic — do not Google-translate.
- **Design system is locked.** Use existing tokens (`font-display`, `font-mono`, `font-sans`, `text-ink`, `text-mute`, `text-sienna`, `text-signal`, `sp-*`, `page-x`, `section-y`). Don't introduce new visual primitives without user sign-off.
- **Generous editorial spacing.** Match the existing rhythm (144/96/64/40 scale at hero, 64/40 between content blocks).

## Conventions

- **Slugs** are kebab-case: `solu-npk-20-20-20`, `forage-superfine-rhodes`, `p01-malason`.
- **Product images** live at `public/products/`. Pesticide cards handle missing `image_url` gracefully (text-only render). Fertilizer detail uses `<BagMockup>` SVG (no photos yet).
- **Phone format:** display `+249 91 233 8559`. Use `tel:+249912338559` for tap-to-call, `https://wa.me/249912338559` for WhatsApp.
- **AR numerals:** Arabic-Indic (٢٠١٠, ٦, ٧, ١٦) for visible AR copy; keep ISO codes / phone digits in Western numerals everywhere.
- **AR agricultural terminology:** lucerne = البرسيم الحجازي (NOT جرجير), fertigation = تسميد بالري, pest control = حلول مكافحة الآفات, pesticide = مبيد, fertilizer = سماد, forage = أعلاف.
- **Commit messages:** `plan-N: error N — <change>` for plan-driven work. Co-author tag on Claude commits.

## Mobile-first conventions (Plan 7)

- **All base styles target mobile.** Tailwind utility prefixes `sm:` `md:` `lg:` `xl:` `2xl:` scale UP only — never down. Avoid `max-w-screen-sm` patterns that shrink layouts at larger viewports.
- **Breakpoints (Tailwind defaults):** `sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`. No custom `xs` breakpoint needed.
- **Element swaps** (mobile drawer vs desktop nav) use paired classes: one element is `hidden lg:flex`, its mobile counterpart is `flex lg:hidden`. The `lg:` breakpoint is the nav fold point.
- **Grids:** start 1-column on mobile, grow via `sm:grid-cols-2 lg:grid-cols-3`. Never start at 3 columns and shrink.
- **Touch targets:** every interactive element gets minimum 44×44px hit area. Use `min-h-[44px]` + `min-w-[44px]` for icon-only buttons, or padding to expand smaller visible elements.
- **Form inputs:** explicit `text-base` (16px) to prevent iOS Safari auto-zoom on focus.
- **Drawers:** HTML `<dialog>` with `transform: translateX(...)` slide animations (RTL-aware via `dir` attribute on `<html>`). No JS framework required — small inline `<script>` opens/closes via `showModal()` / `close()`.
- **Color tokens for product cards:** use Tailwind `bg-c-{token}` classes (defined in `tailwind.config.mjs:33-44` against `--c-*` CSS variables in `src/styles/tokens.css:23-32`). Do NOT use inline `var(--color-c-*)` — those variables do not exist; the prefix is `--c-` not `--color-c-`.
- **Viewport meta:** `<meta name="viewport" content="width=device-width, initial-scale=1">` is in `src/layouts/Layout.astro:35`. Do not change.

## What's still pending (see `REMAINING_GAPS.md`)

Items the client must provide before launch:
1. Real email and social handles (current data has placeholders we removed)
2. Branch street addresses (only city names known)
3. Leadership names + headshots
4. SAF and KZ full company names + product lists
5. East West Seeds variety list
6. Agro Dragon product catalog
7. K+S extended catalog confirmation (soluUP, soluMAP, soluMKP, soluAMS, soluCN currently flagged `stock_confirmation: pending_client`)
8. Kafr El Zayat logo file
9. Founding-story narrative
10. Additional certifications and memberships beyond IATA
11. Field photography (current photos are illustrative)
12. Bag and bottle product photography

See `REMAINING_GAPS.md` for the full punch list.
