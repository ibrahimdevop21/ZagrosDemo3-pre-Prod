# Plan 6 — Remediation: Make v2 Client-Shippable

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the `feature/redesign-v2-foundation` branch to a state where it can be merged to `main` and demoed to client without factual errors, invented framing, or leaking placeholder text. Source of authority: `ZAGROS_SOURCE_OF_TRUTH.md` (v2, 2026-05-11).

**Architecture:**
The current branch is structurally sound (layout system, routing shell, i18n, build pipeline, 47 green tests). The wrongness is content + data + brand-frame, not architecture. This plan rebuilds the product taxonomy (3 lines × subcategories, parallel Astro content collections by line), strips invented brand framing, replaces "pending" placeholders with real data where it exists, adds a Customers page + 7-partner Partners rebuild, and corrects geographic positioning from "Middle East distributor" to "Sudan-based agricultural-inputs partner since 2010." Work order is dictated by dependencies: data → schema → routes → copy → meta → verification.

**Tech Stack:** Astro v5 (`type: 'content'` collections, MDX, getStaticPaths), Tailwind, vitest, TypeScript, bilingual AR/EN i18n via `src/i18n/{ar,en}.json`.

---

## Pre-flight: Audit Inventory (what's wrong, where, why)

**Inventory of error sites in current branch (read-only context — do not edit during audit):**

### Wrong-data / wrong-framing file map
| File | What's wrong |
|---|---|
| `src/data/company.ts` | `established_year: 1987` (should be 2010); 2 partners (should be 7+); `Authorized Middle East distributor of K+S + Barenbrug` (wrong scope); empty `branches`, empty `contact`, empty `certifications` |
| `src/data/home-stats.json` | Stats hard-coded to `1987`, `2 partners`, `14 SKUs`, `11 K+S · 3 Barenbrug`; all four stats wrong |
| `src/data/regions.json` | 14 placeholder MENA regions (`R01`–`R14`, `Region 01`...). Aspirational, not factual. Should be replaced by Sudan-branch network |
| `src/data/ops-ticker.json` | Mentions specific products (`soluCN trial · greenhouse tomato`) and Port Sudan-adjacent operations but with `_illustrative: true` flag. Acceptable as-is, but verify nothing claims Middle East scope |
| `src/data/compatibility.json` | Tank-mix compatibility — accurate; reuse as-is |
| `src/data/use-cases.json` | Not yet audited; review for catalog references |
| `src/i18n/en.json:5` | `tagline: "Agricultural Trade · Est. 1987"` — wrong year |
| `src/i18n/en.json:6` | `meta_description: "Authorized Middle East distributor of K+S fertilizers and Barenbrug forage seeds..."` — wrong scope, missing seeds line splits |
| `src/i18n/en.json:20` | `utility.service_area: "Middle East"` — wrong scope |
| `src/i18n/en.json:22` | `utility.partners_label: "K+S · Barenbrug"` — wrong (2 of 7) |
| `src/i18n/en.json:39` | `about.headline: "An operator, not a brand house."` — invented framing |
| `src/i18n/en.json:40` | `about.deck: "Zagros is an authorized Middle East distributor... We do not manufacture — we operate..."` — wrong scope + invented framing |
| `src/i18n/en.json:49,51,53` | Hard-coded `branches_pending`, `team_pending`, `affiliations_pending` strings; branches data exists in source of truth |
| `src/i18n/en.json:109` | `partners_page.kicker: "Sources · two houses"` — wrong (7+ houses) |
| `src/i18n/en.json:111` | `partners_page.deck: "...two partner houses chosen for international credentials..."` — wrong |
| `src/i18n/en.json:141` | `products.page.headline: "Fourteen SKUs, two partner houses, one operator."` — wrong on all three counts |
| `src/i18n/en.json:252` | `home.hero.deck: "Authorized Middle East distributor..."` — wrong scope |
| `src/i18n/en.json:267-269` | `home.sources.{kicker, headline_a/b}` — invented "two houses" framing |
| `src/i18n/en.json:279` | `home.catalog.headline: "Four shelves, fourteen SKUs, one operator"` — wrong |
| `src/i18n/ar.json` | All Arabic parities of the above — `أربعة عشر منتجاً، بيتا شراكة، مُشغّلٌ واحد`, `مُشغّل، لا بيت ماركة`, `الشرق الأوسط` everywhere, `بيت/بيتي شراكة`, etc. |
| `src/pages/index.astro:17,29` | Hard-coded `01 / 09`...`08 / 09` section numbers and `Four shelves · 14 SKUs` subLabel; wrong SKU count, wrong section count if we add Customers section |
| `src/pages/products.astro:34-37` | Renders `{all.length} SKUs`, `2 partner_houses`, `subcatsKs.length + subcatsBb.length` — all wrong outputs from wrong data |
| `src/pages/products.astro:51-71` | Renders `§ K+S · {ks.length} SKUs` and `§ Barenbrug · {bb.length} SKUs` headers — only 2 brands shown, no Seeds/Fertilizers/Pesticides split |
| `src/pages/products/[slug].astro:20` | `const lang: 'en' | 'ar' = 'en';` — hardcoded EN, no AR product detail at all |
| `src/pages/about.astro:37-58` | Branches/team/affiliations all `<DisclaimerChip text={t(...pending)}/>` — branches data exists, do not show pending |
| `src/components/home/Hero.astro:13-17` | `datalineItems` hardcoded to `partners=2`, `skus=14`, `years=companyData.established_year`, `categories=5` |
| `src/components/home/Hero.astro:23` | `src="/photos/illustrative-hero-canal.jpg"` — actual image exists; not a leak, but alt text says `"illustrative photography pending client assets"` which IS leaking placeholder text into rendered alt |
| `src/components/home/SourcesSection.astro` | Renders only the 2 partners from current `partners` collection; needs all 7 |
| `src/components/home/CatalogTable.astro:11-32` | Hard-coded 4 subcategory cards (`water-soluble-npk`, `phosphate-sources`, `nitrogen-mg-k`, `barenbrug-forage`); no Pesticides, no Seeds split |
| `src/components/home/ByTheNumbers.astro:25-49` | Renders `home-stats.json` (wrong) + `regions.json` (14 fake MENA regions) |
| `src/components/global/UtilityBar.astro:13-19` | Uses `companyData.contact.phone ?? '+XXX XXX XXX'` placeholder — needs real Sudan phone |
| `src/components/global/Footer.astro:26,72` | Uses `t('site.meta_description')` (wrong scope) and renders `— pending —` for branches |
| `src/components/contact/DirectContact.astro:19,22,25` | Falls back to `pending` for phone/email/whatsapp — phone data now exists |
| `src/content/products/*.mdx` | 14 MDX files, all fertilizers + forage seeds; pesticides line totally absent; one stale duplicate (per source-of-truth: f1 was generic placeholder, f3/f8 duplicated — current MDX set does not have f1/f8 by name but has 11 K+S + 3 Barenbrug, so already deduped at MDX level — verify no duplicates) |
| `src/content/partners/*.mdx` | Only `barenbrug.mdx` + `k-plus-s.mdx`; barenbrug listed as `country: Netherlands` (wrong — should be Australia per source of truth §4) |
| `src/content/config.ts:26-29` | `brand: z.enum(['K+S', 'Barenbrug'])`, `category: z.enum(['fertilizer', 'forage_seed'])` — pesticides incompatible with this schema |

### Asset inventory (what's present, what's missing)
- **Customer logos: all 6 present** at `public/trusted-customer-logos/` (`ministry-of-agriculture.svg`, `alrajihi.svg`, `amtaar.svg`, `dal.svg`, `Paramount.svg`, `premier-farm.webp`)
- **Partner logos:** 6 of 7 present at `public/partners/` (`agro-dragon.webp`, `barenbrug.png`, `east-west-seeds.webp`, `k&s.webp`, `kz.webp`, `saf.webp`). **Missing:** Kafr El Zayat (Egypt)
- **Pesticide product images:** 13 of 16 present at `public/products/`. **Missing:** Orafen, Mancoxyl, Orastrobin
- **Fertilizer product images:** 0 present (intentional — site uses `<BagMockup>` SVG component instead of photos). Keep as-is
- **Forage seed images:** 0 present; current site uses none on those cards either. Keep as-is

### Tests inventory
- `tests/data/compatibility.test.ts` — pure data, unaffected
- `tests/content/products.test.ts` — asserts shape of `products` collection; will need update for new collections
- `tests/content/partners.test.ts` — asserts shape of `partners` collection; will need update for 7-partner roster
- `tests/content/field-reports.test.ts` — independent, unaffected (field-reports MDX content still references current products by slug; check after taxonomy migration)
- `tests/pages/home.test.ts` — likely asserts hero copy, stats; will fail on new copy
- `tests/pages/products-index.test.ts` — asserts SKU counts, brand groupings; will fail on new taxonomy
- `tests/pages/product-detail.test.ts` — asserts per-product rendering; will mostly pass after migration but needs additions for pesticides + AR locale
- `tests/pages/partners.test.ts` — asserts current 2-partner render; will fail on 7-partner roster
- `tests/pages/field-reports.test.ts` — independent, unaffected
- `tests/pages/static-pages.test.ts` — checks about/contact/privacy/terms; will fail on new about copy

---

## Architectural decisions baked into this plan

**Three parallel Astro content collections, one per product line.** Pesticides have fundamentally different fields (active ingredient, target pests/crops, EC/SC/WP form codes) from fertilizers (NPK composition, K-Mg balance, application stages) and seeds (forage agronomy, sowing rates, PBR/coating). One collection with a discriminated-union schema would balloon optional fields and weaken type safety. Three collections — `fertilizers`, `seeds`, `pesticides` — each with their own tight schema, unified at the `/products` index page level. The existing `products` collection becomes `fertilizers`.

**Three-tier route hierarchy under `/products`:**
- `/products` (and `/ar/products`) — line picker showing 3 cards: Seeds / Fertilizers / Pesticides with SKU counts
- `/products/[line]` (and `/ar/products/[line]`) — line page with subcategory grouping (e.g. K+S + Agro Dragon under Fertilizers)
- `/products/[line]/[slug]` (and `/ar/products/[line]/[slug]`) — detail page

The current `/products/[slug].astro` route gets removed in favor of `/products/[line]/[slug].astro` to disambiguate. Sitemap, breadcrumbs, RelatedProducts links, FieldReport `related_products` references all migrate to new slugs.

**Bilingual product detail required.** Current detail page is EN-only. Plan adds Arabic mirror at `src/pages/ar/products/[line]/[slug].astro`. Both detail pages share a `<ProductDetail lang={...} />` component to keep DRY.

**"Pending client confirmation" markers remain ONLY for items in Source-of-Truth §11.** Specifically: leadership names + photos, certifications beyond International Agricultural Trade Association, branch full street addresses, founding-story narrative, social handles, email, Agro Dragon products, East West Seeds varieties, full Barenbrug variety list, K+S extended catalog confirmation (soluUP/MAP/MKP/AMS/CN).

**Numbers stop being pseudo-precise.** Stats like "39 years" or "12 years in partnership" derived from wrong founding dates get replaced with real numbers (16 years since 2010), or removed if the data is unknown (e.g. partnership years for SAF/KZ/Agro Dragon).

---

## Tasks

Work order: **Error 1 (taxonomy) first — everything downstream depends on the content collections existing.** Then 2 (frame), 3 (about), 4 (customers), 5 (partners), 6 (placeholder leaks), 7 (contact/geography). Verification + AGENTS.md last.

---

### Task 1 — Error 1: Rebuild product taxonomy (3 lines, parallel collections, route migration)

**Files:**
- Create: `src/content/pesticides/p01-malason.mdx` through `p16-orastrobin.mdx` (16 files)
- Create: `src/content/seeds/forage-superfine-rhodes.mdx`, `forage-sardi-10.mdx`, `forage-alfamaster-ten.mdx` (3 files, migrated from current `products/`)
- Create: `src/content/seeds/.gitkeep-vegetable-seeds-pending` (empty-state marker; vegetable seeds MDX only added when client provides cultivar list)
- Create: `src/content/fertilizers/` — 11 MDX files migrated verbatim from current `src/content/products/` (rename collection)
- Modify: `src/content/config.ts` — replace `products` collection with three: `fertilizers`, `seeds`, `pesticides`; each with line-appropriate schema
- Delete: `src/content/products/` (all 14 files moved into `fertilizers/` + `seeds/`)
- Create: `src/pages/products/index.astro` (line picker)
- Create: `src/pages/products/[line].astro` (line page, getStaticPaths over `['seeds', 'fertilizers', 'pesticides']`)
- Create: `src/pages/products/[line]/[slug].astro` (unified detail page; queries all three collections)
- Delete: `src/pages/products.astro`, `src/pages/products/[slug].astro`
- Mirror all under `src/pages/ar/products/...` (same structure)
- Create: `src/components/products/LineCard.astro` (used on `/products` index)
- Create: `src/components/products/SubcategoryGroup.astro` (used on `/products/[line]`)
- Create: `src/components/products/PesticideCard.astro` (different layout for pesticide cards — emphasizes AI/form, not NPK)
- Modify: `src/components/products/ProductCard.astro` — generalize for any collection entry, or duplicate per-line
- Modify: `src/components/products/FilterSidebar.astro` — filter by line, subcategory, supplier, crop, application stage / target pest
- Modify: `src/components/products/FilterController.astro` — wire new facets
- Modify: `src/i18n/{ar,en}.json` — new keys for line names, subcategory names, pesticide-specific terminology, empty states for vegetable-seeds and Agro Dragon
- Modify: `src/i18n/types.ts` — new translation key types
- Modify: `tests/content/products.test.ts` — rename to `fertilizers.test.ts`; create `seeds.test.ts`, `pesticides.test.ts`
- Modify: `tests/pages/products-index.test.ts` — new assertions for 3-line page
- Modify: `tests/pages/product-detail.test.ts` — assertions over all three collections, both locales
- Modify: `astro.config.mjs` if needed for content path globs (verify)

**Tests affected:** Heavy — all product-related tests rewritten. Field-reports tests touched because `related_products` MDX frontmatter references current slugs.

**Risk / blast radius:** **HIGH.** This is the foundation of every downstream change. Failure modes: schema validation breaks build; route conflict between `/products.astro` and `/products/[line].astro`; getStaticPaths missing routes; old slug references in field-reports break links. Mitigation: do this whole task on a sub-branch off the remediation branch; verify `npm run build` after each subcollection migration.

#### Subtask 1.1 — Add new content collection schemas

**Files: Modify `src/content/config.ts`**

- [ ] **Step 1: Write failing test for new collection shapes**

```ts
// tests/content/fertilizers.test.ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('fertilizers collection', () => {
  it('has the 7 unique K+S SKUs (post-dedup) plus 4 extended-catalog SKUs flagged for client confirmation', async () => {
    const entries = await getCollection('fertilizers');
    const slugs = entries.map((e) => e.slug).sort();
    // Source-of-truth §2.1: confirmed in v1 = 7 (f3 soluNPK 20-20-20, f4 soluNOP, f5 KaliSOP gran,
    //   f6 KaliSOP fine, f7 EPSOTop, f9 soluNPK 12-12-36, plus original 11 minus f1 dedup minus f3/f8 dedup)
    // Current branch already has 11 K+S MDX files (no f1, no f8). Migrate all 11 verbatim;
    // mark soluUP/MAP/MKP/AMS/CN as `stock_confirmation: 'pending_client'` until verified.
    expect(slugs).toContain('solu-npk-20-20-20');
    expect(slugs).toContain('solu-npk-12-12-36');
    expect(slugs).toContain('solu-nop');
    expect(slugs).toContain('kalisop-gran');
    expect(slugs).toContain('kalisop-fine');
    expect(slugs).toContain('epso-top');
    expect(slugs).toContain('solu-up');
    expect(slugs).toContain('solu-map');
    expect(slugs).toContain('solu-mkp');
    expect(slugs).toContain('solu-ams-premium');
    expect(slugs).toContain('solu-cn');
    expect(entries.length).toBe(11);
  });
});

// tests/content/seeds.test.ts
describe('seeds collection', () => {
  it('has 3 forage SKUs from Barenbrug and zero vegetable SKUs (pending client cultivar list)', async () => {
    const entries = await getCollection('seeds');
    const slugs = entries.map((e) => e.slug).sort();
    expect(slugs).toEqual(['forage-alfamaster-ten', 'forage-sardi-10', 'forage-superfine-rhodes']);
    const subcats = new Set(entries.map((e) => e.data.subcategory));
    expect(subcats).toEqual(new Set(['forage']));
  });
});

// tests/content/pesticides.test.ts
describe('pesticides collection', () => {
  it('has 16 SKUs across 3 subcategories (2 insecticides, 12 herbicides, 2 fungicides)', async () => {
    const entries = await getCollection('pesticides');
    expect(entries.length).toBe(16);
    const bySubcat = entries.reduce((acc, e) => {
      acc[e.data.subcategory] = (acc[e.data.subcategory] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(bySubcat.insecticide).toBe(2);
    expect(bySubcat.herbicide).toBe(12);
    expect(bySubcat.fungicide).toBe(2);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `npm test -- content/`
Expected: FAIL — collections don't exist yet.

- [ ] **Step 3: Define schemas in `src/content/config.ts`**

Replace the file with three collections. The `fertilizers` schema is largely the existing `products` schema minus the `brand` constraint expanded and `category` constraint removed. The `seeds` schema is forage-specific. The `pesticides` schema is new and tracks active ingredient, form code, target pests/crops, manufacturer, origin country.

```ts
import { defineCollection, z } from 'astro:content';

const compositionEntry = z.object({ value: z.number(), unit: z.string() });

const cropApplication = z.object({
  category: z.enum(['field_crops', 'vegetables', 'fruit_trees', 'forages', 'oilseeds']),
  examples: z.array(z.string()),
  foliar_rate: z.string().optional(),
  fertigation_rate: z.string().optional(),
  soil_rate: z.string().optional(),
  stage: z.string(),
});

const fertilizers = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    brand: z.enum(['K+S', 'Agro Dragon']),
    supplier_slug: z.enum(['k-plus-s', 'agro-dragon']),
    subcategory: z.string(),
    grade: z.string(),
    composition: z.object({
      N: compositionEntry.optional(),
      P2O5: compositionEntry.optional(),
      K2O: compositionEntry.optional(),
      Ca: compositionEntry.optional(),
      MgO: compositionEntry.optional(),
      SO3: compositionEntry.optional(),
      S: compositionEntry.optional(),
      Cl: compositionEntry.optional(),
      trace_elements: z.boolean().optional(),
      chelated_micros: z.boolean().optional(),
    }).optional(),
    form: z.string(),
    packaging: z.string(),
    applications: z.array(z.enum(['foliar', 'fertigation', 'soil', 'pivot', 'hydroponic'])),
    ideal_stages: z.array(z.enum([
      'establishment', 'seedling', 'vegetative', 'flowering',
      'heading', 'fruiting', 'post_harvest'
    ])),
    crops: z.array(cropApplication).optional(),
    compatibility: z.object({
      compatible: z.array(z.string()).optional(),
      incompatible: z.array(z.string()).default([]),
      notes: z.string().optional(),
    }),
    certifications: z.array(z.string()).default([]),
    organic_certified: z.boolean().default(false),
    chloride_free: z.boolean().default(false),
    sodium_free: z.boolean().default(false),
    acidifying: z.boolean().default(false),
    hazard_class: z.string().optional(),
    origin_country: z.string().optional(),
    bag_photo_url: z.string().optional(),
    bag_color_token: z.string().optional(),
    brochure_url: z.string().optional(),
    stock_confirmation: z.enum(['confirmed', 'pending_client']).default('confirmed'),
  }),
});

const seeds = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    brand: z.enum(['Barenbrug', 'East West Seeds']),
    supplier_slug: z.enum(['barenbrug', 'east-west-seeds']),
    subcategory: z.enum(['forage', 'vegetable']),
    species: z.string(),
    coating: z.string().optional(),
    pbr: z.boolean().default(false),
    rainfall_mm: z.string().optional(),
    ph_range: z.string().optional(),
    soil_type: z.string().optional(),
    sowing_rates: z.object({
      marginal_dryland: z.string().optional(),
      ideal_dryland: z.string().optional(),
      irrigated: z.string().optional(),
    }).optional(),
    key_features: z.array(z.object({ en: z.string(), ar: z.string() })).default([]),
    origin_country: z.string(),
    image_url: z.string().optional(),
    datasheet_url: z.string().optional(),
  }),
});

const pesticides = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.object({ en: z.string(), ar: z.string() }),
    code: z.object({ en: z.string(), ar: z.string() }),       // e.g. "Malason 57% EC", "ملاسون 57% EC"
    subcategory: z.enum(['insecticide', 'herbicide', 'fungicide']),
    type: z.object({ en: z.string(), ar: z.string() }),       // e.g. "Insecticide / Acaricide"
    form: z.object({ en: z.string(), ar: z.string() }),       // "Emulsifiable Concentrate" / "EC"
    active_ingredient: z.string(),                            // "Malathion"
    active_ingredient_content: z.object({ en: z.string(), ar: z.string() }),  // "570 g/L"
    manufacturer: z.object({ en: z.string(), ar: z.string() }),
    origin_country: z.string(),                               // ISO code
    description: z.object({ en: z.string(), ar: z.string() }),
    recommendation: z.object({ en: z.string(), ar: z.string() }).optional(),
    efficacy: z.object({ en: z.string(), ar: z.string() }).optional(),
    target_pests: z.array(z.string()).default([]),
    target_crops: z.array(z.string()).default([]),
    image_url: z.string().optional(),
  }),
});

export const collections = {
  fertilizers,
  seeds,
  pesticides,
  'field-reports': fieldReports,         // unchanged
  partners,                              // schema updated separately in Task 5
};

// Below: existing fieldReports + partners definitions (keep)
```

- [ ] **Step 4: Migrate 11 K+S MDX files**

Run: `git mv src/content/products/solu-npk-20-20-20.mdx src/content/fertilizers/`, repeat for all 11.
Verify no Barenbrug files moved here. Verify slugs unchanged.

```bash
mkdir -p src/content/fertilizers
git mv src/content/products/solu-npk-20-20-20.mdx src/content/fertilizers/
git mv src/content/products/solu-npk-12-12-36.mdx src/content/fertilizers/
git mv src/content/products/solu-nop.mdx src/content/fertilizers/
git mv src/content/products/kalisop-gran.mdx src/content/fertilizers/
git mv src/content/products/kalisop-fine.mdx src/content/fertilizers/
git mv src/content/products/epso-top.mdx src/content/fertilizers/
git mv src/content/products/solu-up.mdx src/content/fertilizers/
git mv src/content/products/solu-map.mdx src/content/fertilizers/
git mv src/content/products/solu-mkp.mdx src/content/fertilizers/
git mv src/content/products/solu-ams-premium.mdx src/content/fertilizers/
git mv src/content/products/solu-cn.mdx src/content/fertilizers/
```

For each, edit the frontmatter to remove `category: fertilizer` (no longer in schema), add `supplier_slug: k-plus-s`, and for soluUP/MAP/MKP/AMS/CN add `stock_confirmation: pending_client`.

- [ ] **Step 5: Migrate 3 Barenbrug MDX files to seeds collection**

```bash
mkdir -p src/content/seeds
git mv src/content/products/superfine-rhodes.mdx src/content/seeds/forage-superfine-rhodes.mdx
git mv src/content/products/sardi-10-series-2.mdx src/content/seeds/forage-sardi-10.mdx
git mv src/content/products/alfamaster-ten.mdx src/content/seeds/forage-alfamaster-ten.mdx
```

Rewrite each frontmatter to match `seeds` schema:
```yaml
# example for forage-superfine-rhodes.mdx
---
name:
  en: Superfine Rhodes Grass
  ar: عشب رودس سوبرفاين
brand: Barenbrug
supplier_slug: barenbrug
subcategory: forage
species: Chloris gayana
coating: AgriCote
pbr: true
rainfall_mm: 500 mm+
ph_range: 5.0 – 8.0
soil_type: Light to heavy
sowing_rates:
  marginal_dryland: 4-6 kg/ha
  ideal_dryland: 8-12 kg/ha
  irrigated: 15-25 kg/ha
key_features:
  - en: Higher leaf-to-stem ratio than Tolgar Rhodes
    ar: نسبة أعلى من الأوراق إلى الساق مقارنة بـ Tolgar Rhodes
  - en: Higher salt tolerance than Katambora
    ar: تحمل أعلى للملوحة من Katambora
  - en: Nematode-resistant; moderate drought/frost/cool-season tolerance
    ar: مقاوم للنيماتودا؛ تحمل معتدل للجفاف والصقيع وفترات البرودة
origin_country: au
---
```

Do not put MDX body text — schemas pull all displayable content from frontmatter.

- [ ] **Step 6: Create 16 pesticide MDX files**

Use Source-of-Truth Line 1 (lines 262-431). One file per pesticide. Filenames follow `p{NN}-{slug}.mdx`. Example:

```yaml
# src/content/pesticides/p01-malason.mdx
---
name:
  en: Malason
  ar: ملاسون
code:
  en: Malason 57% EC
  ar: ملاسون 57% EC
subcategory: insecticide
type:
  en: Insecticide
  ar: مبيد حشري
form:
  en: Emulsifiable Concentrate
  ar: سائل مركز قابل للاستحلاب
active_ingredient: Malathion
active_ingredient_content:
  en: 570 g/L
  ar: 570 جرام/لتر
manufacturer:
  en: Kafr El Zayat Pesticides & Chemical Co. Ltd
  ar: شركة كفر الزيات للمبيدات والكيماويات
origin_country: eg
description:
  en: Non-systemic insecticide that works by contact and stomach poison with respiratory action. Controls insect pests in field/horticultural crops and stored products.
  ar: مبيد حشري غير جهازي يعمل بالملامسة والسم المعدي مع تأثير تنفسي. يكافح الآفات في المحاصيل الحقلية والبستانية ومخازن المنتجات.
recommendation:
  en: "For onion rabbit pests: 2 liters per acre."
  ar: "لمكافحة حشرة الأرنب في البصل: 2 لتر للفدان."
efficacy:
  en: High efficacy in controlling onion pests, increasing productivity.
  ar: فاعلية عالية في مكافحة آفات البصل، تزيد الإنتاجية.
target_pests:
  - onion-rabbit
target_crops:
  - onion
image_url: /products/malason.webp
---
```

Repeat for p02-agromectin through p16-orastrobin, sourcing every field from `ZAGROS_SOURCE_OF_TRUTH.md` lines 277-431. Use these image paths (verify case match against `public/products/`):

- p01 Malason → `/products/malason.webp`
- p02 Agromectin → `/products/Agromectin.webp`
- p03 Oraselect → `/products/Oraselect.webp`
- p04 Agroharvest → `/products/Agroharvest.webp`
- p05 Agronos → `/products/Agronos.webp`
- p06 Agreflan → `/products/Agreflan.webp`
- p07 Orazine → `/products/Orazine.webp`
- p08 Agrimethalin → `/products/Agrimethalin.webp`
- p09 Agrisuit → `/products/Agrisuit.webp`
- p10 AgriTop → `/products/AgriTop.webp`
- p11 Pendinos → `/products/Pendinos.webp`
- p12 Oruzin → `/products/Oruzin.webp`
- p13 Oranoset → `/products/Oranoset.webp`
- p14 Orafen → omit `image_url` (asset missing)
- p15 Mancoxyl → omit `image_url` (asset missing)
- p16 Orastrobin → omit `image_url` (asset missing)

PesticideCard component handles missing image gracefully (renders SKU code + AI as text block).

- [ ] **Step 7: Run schema tests, expect pass**

Run: `npm test -- content/`
Expected: PASS — three collections present with correct counts (11 / 3 / 16).

- [ ] **Step 8: Commit migration before route work**

```bash
git add src/content/{fertilizers,seeds,pesticides}/ src/content/config.ts tests/content/
git rm -r src/content/products/
git commit -m "plan-6: error 1 — migrate product collections to 3 lines (fertilizers/seeds/pesticides)"
```

#### Subtask 1.2 — Rebuild `/products` route hierarchy

- [ ] **Step 9: Write failing test for new line picker**

```ts
// tests/pages/products-index.test.ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ProductsIndex from '../../src/pages/products/index.astro';

describe('/products line picker', () => {
  it('renders 3 line cards with accurate SKU counts and no invented framing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('Seeds');
    expect(html).toContain('Fertilizers');
    expect(html).toContain('Pesticides');
    expect(html).toMatch(/3.*Forage|forage.*3/i);          // 3 forage SKUs
    expect(html).toMatch(/11.*K\+S|K\+S.*11/i);            // 11 fertilizers
    expect(html).toMatch(/16.*Pesticides|16 SKUs/i);       // 16 pesticides
    expect(html).not.toMatch(/14 SKUs|14 منتجاً/);
    expect(html).not.toMatch(/partner houses|بيوت شراكة|بيتا شراكة/);
    expect(html).not.toMatch(/operator, not a brand|مُشغّل، لا بيت ماركة/);
  });
});
```

Run: `npm test -- products-index`
Expected: FAIL — file doesn't exist yet.

- [ ] **Step 10: Create line picker page**

Create `src/pages/products/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import LineCard from '../../components/products/LineCard.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const [seeds, fertilizers, pesticides] = await Promise.all([
  getCollection('seeds'),
  getCollection('fertilizers'),
  getCollection('pesticides'),
]);

const lines = [
  { slug: 'seeds',       count: seeds.length,       supplierCount: 2, subcatCount: 2 },
  { slug: 'fertilizers', count: fertilizers.length, supplierCount: 2, subcatCount: 4 },
  { slug: 'pesticides',  count: pesticides.length,  supplierCount: 7, subcatCount: 3 },
];
---
<Layout title={t('products.page.title')}>
  <Breadcrumb items={[{ label: t('nav.home'), href: lang === 'ar' ? '/ar/' : '/' }, { label: t('nav.products') }]} />
  <header class="px-page-x pb-sp-9">
    <h1 class="font-display text-[clamp(48px,7vw,96px)] leading-[0.95] text-ink max-w-[18ch] mb-sp-7">{t('products.page.headline')}</h1>
    <p class="font-sans text-lg text-ink/80 max-w-[60ch] mb-sp-7">{t('products.page.deck')}</p>
  </header>
  <section class="px-page-x pb-section-y">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-sp-7">
      {lines.map(line => <LineCard line={line.slug} count={line.count} supplierCount={line.supplierCount} subcatCount={line.subcatCount} lang={lang} />)}
    </div>
  </section>
</Layout>
```

Create `LineCard.astro` with line-specific labels pulled from i18n (`products.lines.seeds.headline`, `.deck`, etc.).

- [ ] **Step 11: Update i18n with new keys**

`src/i18n/en.json` — replace `products.page.headline` and `.deck`; add `products.lines.{seeds,fertilizers,pesticides}.{headline,deck,empty_state}`. Headlines must NOT mention "14 SKUs / 2 partner houses / operator." Use copy aligned with Source-of-Truth §3.

Example:
```json
"products": {
  "page": {
    "title": "Products",
    "headline": "Seeds, fertilizers, pesticides — sourced for Sudanese farms.",
    "deck": "Three product lines, seven international suppliers, full agronomy support across the catalog. Browse by line below."
  },
  "lines": {
    "seeds": {
      "label": "Seeds",
      "headline": "Vegetable and forage seed lines",
      "deck": "Vegetable hybrids from East West Seeds (Thailand) and forage cultivars from Barenbrug (Australia).",
      "vegetable_pending": "Vegetable seed catalog pending — variety list expected from East West Seeds before publication."
    },
    "fertilizers": {
      "label": "Fertilizers",
      "headline": "Premium water-soluble + specialty fertilizers",
      "deck": "K+S German chemistry, plus Agro Dragon Netherlands specialty lines. Eleven SKUs across four subcategories.",
      "agro_dragon_pending": "Agro Dragon catalog pending client confirmation."
    },
    "pesticides": {
      "label": "Pesticides",
      "headline": "Insecticides, herbicides, fungicides",
      "deck": "Sixteen SKUs across three subcategories, sourced from Egyptian, Indian, and Chinese manufacturers and rebranded under the Agro- and Or- lines."
    }
  },
  ...
}
```

AR mirror in `ar.json`.

- [ ] **Step 12: Create `/products/[line].astro`**

```astro
---
// src/pages/products/[line].astro
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Breadcrumb from '../../components/global/Breadcrumb.astro';
import SubcategoryGroup from '../../components/products/SubcategoryGroup.astro';
import DisclaimerChip from '../../components/editorial/DisclaimerChip.astro';

export async function getStaticPaths() {
  return ['seeds', 'fertilizers', 'pesticides'].map(line => ({ params: { line } }));
}

const { line } = Astro.params;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

let items: any[] = [];
if (line === 'seeds')       items = await getCollection('seeds');
if (line === 'fertilizers') items = await getCollection('fertilizers');
if (line === 'pesticides')  items = await getCollection('pesticides');

// Group by subcategory + supplier
const grouped: Record<string, any[]> = {};
for (const item of items) {
  const key = item.data.subcategory ?? 'uncategorized';
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(item);
}
---
<Layout title={t(`products.lines.${line}.label`)}>
  <Breadcrumb items={[
    { label: t('nav.home'),     href: lang === 'ar' ? '/ar/' : '/' },
    { label: t('nav.products'), href: lang === 'ar' ? '/ar/products' : '/products' },
    { label: t(`products.lines.${line}.label`) },
  ]} />
  <header class="px-page-x pb-section-y">
    <h1 class="font-display text-[clamp(48px,7vw,96px)] leading-[0.95] text-ink max-w-[20ch] mb-sp-7">{t(`products.lines.${line}.headline`)}</h1>
    <p class="font-sans text-lg text-ink/80 max-w-[60ch] mb-sp-7">{t(`products.lines.${line}.deck`)}</p>
  </header>
  <section class="px-page-x pb-section-y">
    {Object.entries(grouped).map(([subcat, entries]) => (
      <SubcategoryGroup line={line} subcategory={subcat} entries={entries} lang={lang} />
    ))}
    {line === 'seeds' && (
      <div class="mt-section-y border-t border-ink pt-sp-7">
        <h2 class="font-display text-3xl text-ink mb-sp-5">{t('products.lines.seeds.label')} · {/* vegetable subcategory empty state */}</h2>
        <DisclaimerChip text={t('products.lines.seeds.vegetable_pending')} />
      </div>
    )}
    {line === 'fertilizers' && (
      <div class="mt-section-y border-t border-ink pt-sp-7">
        <h2 class="font-display text-3xl text-ink mb-sp-5">Agro Dragon · Netherlands</h2>
        <DisclaimerChip text={t('products.lines.fertilizers.agro_dragon_pending')} />
      </div>
    )}
  </section>
</Layout>
```

- [ ] **Step 13: Replace `/products/[slug].astro` with `/products/[line]/[slug].astro`**

```bash
rm src/pages/products/[slug].astro
mkdir -p src/pages/products/[line]
```

Create `src/pages/products/[line]/[slug].astro` that branches on `line` and queries the appropriate collection. The detail layout for pesticides differs from fertilizers (no CompositionCard with NPK; instead an `<ActiveIngredientCard>`), so add a `<ProductDetail>` wrapper component that dispatches by line.

- [ ] **Step 14: Mirror routes under `src/pages/ar/products/`**

Mirror the EN structure under `src/pages/ar/`. The current `src/pages/ar/products.astro` and `src/pages/ar/products/[slug].astro` get deleted in favor of `src/pages/ar/products/index.astro`, `src/pages/ar/products/[line].astro`, `src/pages/ar/products/[line]/[slug].astro`.

- [ ] **Step 15: Run full test suite**

Run: `npm test`
Expected: All content + products tests PASS. Other tests may still fail (those are addressed in later tasks).

- [ ] **Step 16: Commit route migration**

```bash
git add src/pages/products/ src/pages/ar/products/ src/components/products/ src/i18n/
git rm src/pages/products.astro src/pages/ar/products.astro
git commit -m "plan-6: error 1 — rebuild /products route hierarchy (3 lines, line+detail pages, AR mirror)"
```

#### Subtask 1.3 — Update FieldReport related-product references

- [ ] **Step 17: Update related_products slugs in field reports**

`src/content/field-reports/*.mdx` has `related_products: [<slug>]` arrays. Since slugs largely stayed the same (fertilizer slugs unchanged, seed slugs got `forage-` prefix), update only the seed refs.

Verify each report's `related_products`:
- `issue-03-lucerne-yield.mdx` likely refs `sardi-10-series-2` and/or `alfamaster-ten` → change to `forage-sardi-10`, `forage-alfamaster-ten`
- `issue-03-magnesium-citrus.mdx` likely refs `epso-top` → unchanged
- `issue-03-salt-stress-tomato.mdx` likely refs `solu-cn`, `solu-nop` → unchanged

Also update `RelatedProducts` component to query across all three collections by slug (since field reports may reference any line).

- [ ] **Step 18: Run field-report tests**

Run: `npm test -- field-reports`
Expected: PASS.

- [ ] **Step 19: Commit cross-reference fixes**

```bash
git add src/content/field-reports/ src/components/products/RelatedProducts.astro
git commit -m "plan-6: error 1 — update field-report cross-references for new seed slugs"
```

---

### Task 2 — Error 2: Strip invented brand framing everywhere

**Files:**
- Modify: `src/i18n/en.json`, `src/i18n/ar.json` — replace all "operator / brand house / partner houses / two houses" copy
- Modify: `src/data/company.ts` — fix established_year, business description, partners array
- Modify: `src/data/home-stats.json` — recompute years (2026 - 2010 = 16), partners (7), SKUs (30), categories (multiple lines)
- Modify: `src/components/home/Hero.astro` — datalineItems rebuilt from real data, not hardcoded
- Modify: `src/components/home/SourcesSection.astro` — section copy + render all 7 partners (depends on Task 5 partner content; cross-link)
- Modify: `src/components/home/CatalogTable.astro` — subcategory cards reflect 3 lines, not 4 hardcoded buckets
- Modify: `src/pages/index.astro` — section labels (the literal `Four shelves · 14 SKUs` subLabel string), section numbering if Customers section added
- Modify: `src/pages/about.astro` — headline, deck (copy in i18n)
- Modify: `tests/pages/home.test.ts` — assertions over new copy
- Modify: `tests/pages/static-pages.test.ts` — about copy

**Target state (per Source-of-Truth §3):**

EN hero headline (proposed): `Sudan's trusted partner for agricultural inputs — since 2010.`
EN hero deck (proposed): `Six branches across Sudan, seven international suppliers, full input portfolio. Seeds from Thailand and Australia, fertilizers from Germany and the Netherlands, pesticides from Egypt, Switzerland, the UK, India, and China.`

AR hero headline (proposed): `شريكك الموثوق في الحلول الزراعية بالسودان — منذ ٢٠١٠.`
AR hero deck (proposed): `ستة فروع في السودان، سبع شراكات دولية، باقة مدخلات زراعية كاملة. بذور من تايلاند وأستراليا، أسمدة من ألمانيا وهولندا، مبيدات من مصر وسويسرا وبريطانيا والهند والصين.`

EN about headline (proposed): `Sudan's full-input agricultural-solutions partner since 2010.`
AR about headline (proposed): `شريكك في الحلول الزراعية الكاملة بالسودان منذ ٢٠١٠.`

Specific deletions:
- `"An operator, not a brand house."` → DELETE; replace with positioning above
- `"مُشغّل، لا بيت ماركة."` → DELETE
- `"Fourteen SKUs, two partner houses, one operator."` → DELETE; replace with line-by-line counts
- `"أربعة عشر منتجاً، بيتا شراكة، مُشغّلٌ واحد."` → DELETE
- `"Two houses do the chemistry — we do the operating."` → DELETE; replace with "Seven international suppliers across six countries — one Sudanese operator."
- `"Sources · two houses"` / `"المصادر · بيتان"` → `"Sources · seven houses"` / `"المصادر · سبع شراكات"`
- `"Authorized Middle East distributor..."` → `"Sudan's agricultural-inputs partner..."`
- `"الموزع المعتمد لأسمدة K+S وبذور الأعلاف Barenbrug في الشرق الأوسط"` → `"شريك السودان للمدخلات الزراعية..."`
- `"K+S · Barenbrug"` in `utility.partners_label` → `"7 suppliers · 6 countries"` / `"٧ شراكات · ٦ دول"`
- `"Middle East"` in `utility.service_area` → `"Sudan"` / `"السودان"`
- `"Agricultural Trade · Est. 1987"` → `"Agricultural inputs · Est. 2010"` / `"المدخلات الزراعية · تأسست ٢٠١٠"`

**Tests affected:** `home.test.ts`, `static-pages.test.ts` — assertions on new copy. New negative assertions added (`.not.toContain('14 SKUs')`, etc).

**Risk / blast radius:** **MEDIUM.** Mostly text changes. Risk is missing a copy site somewhere — `grep` after each edit pass to make sure the strings are eradicated. Be careful to keep i18n key parity AR ↔ EN.

#### Subtask 2.1 — Fix `src/data/company.ts`

- [ ] **Step 1: Write failing test**

```ts
// tests/data/company.test.ts (new file)
import { describe, it, expect } from 'vitest';
import { companyData } from '../../src/data/company';

describe('companyData', () => {
  it('reflects real Zagros facts from source-of-truth', () => {
    expect(companyData.established_year).toBe(2010);
    expect(companyData.partners.length).toBeGreaterThanOrEqual(7);
    expect(companyData.partners.map(p => p.slug)).toEqual(
      expect.arrayContaining(['east-west-seeds', 'barenbrug', 'k-plus-s', 'agro-dragon', 'saf', 'kz', 'kafr-el-zayat']),
    );
    expect(companyData.branches.length).toBe(6);
    expect(companyData.branches[0].name).toMatch(/Khartoum/);
    expect(companyData.contact.phone).toBe('+249 91 233 8559');
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npm test -- data/company`
Expected: FAIL.

- [ ] **Step 3: Edit `src/data/company.ts`**

Replace the file with:

```ts
export interface CompanyData {
  name: { en: string; ar: string };
  business: { en: string; ar: string };
  established_year: number;
  partners: PartnerSummary[];
  branches: Branch[];
  contact: ContactInfo;
  certifications: string[];
  markets_served: string[];         // ISO codes — confirmed sales markets
  supplier_countries: string[];     // ISO codes — countries we source from
  staff_count: number;
  parent_company: string;
}

export interface PartnerSummary {
  slug: string;
  name: string;
  country: string;            // display name
  country_code: string;       // ISO
  category: 'vegetable_seeds' | 'forage_seeds' | 'fertilizers' | 'pesticides';
}

export interface Branch {
  name: { en: string; ar: string };
  type: 'HQ' | 'branch';
  city_en: string;
  city_ar: string;
  map_query: string;          // for Google Maps URL building
  address: string | null;     // null until client provides street addresses
  phone: string | null;
}

export interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  hours_en: string;
  hours_ar: string;
  social: {
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    linkedin: string | null;
  };
}

export const companyData: CompanyData = {
  name: { en: 'Zagros Trading', ar: 'زاغروس للتجارة' },
  business: {
    en: "Sudan's trusted partner for agricultural inputs — seeds, fertilizers, and pesticides from seven international suppliers across six countries.",
    ar: 'شريك السودان الموثوق للمدخلات الزراعية — بذور وأسمدة ومبيدات من سبع شراكات دولية في ست دول.',
  },
  established_year: 2010,
  partners: [
    { slug: 'east-west-seeds', name: 'East West Seeds International', country: 'Thailand',    country_code: 'th', category: 'vegetable_seeds' },
    { slug: 'barenbrug',       name: 'Barenbrug Australia',           country: 'Australia',   country_code: 'au', category: 'forage_seeds' },
    { slug: 'k-plus-s',        name: 'K+S Middle East',               country: 'Germany',     country_code: 'de', category: 'fertilizers' },
    { slug: 'agro-dragon',     name: 'Agro Dragon',                   country: 'Netherlands', country_code: 'nl', category: 'fertilizers' },
    { slug: 'saf',             name: 'SAF',                           country: 'Switzerland', country_code: 'ch', category: 'pesticides' },
    { slug: 'kz',              name: 'KZ',                            country: 'United Kingdom', country_code: 'gb', category: 'pesticides' },
    { slug: 'kafr-el-zayat',   name: 'Kafr El Zayat Pesticides & Chemical Co.', country: 'Egypt', country_code: 'eg', category: 'pesticides' },
  ],
  branches: [
    { name: { en: 'Khartoum HQ',  ar: 'الخرطوم — المقر الرئيسي' }, type: 'HQ',     city_en: 'Khartoum',  city_ar: 'الخرطوم',  map_query: 'Khartoum,Sudan',    address: null, phone: '+249 91 233 8559' },
    { name: { en: 'Port Sudan',   ar: 'بورتسودان' },                 type: 'branch', city_en: 'Port Sudan', city_ar: 'بورتسودان', map_query: 'Port+Sudan,Sudan', address: null, phone: null },
    { name: { en: 'Al Qadarif',   ar: 'القضارف' },                   type: 'branch', city_en: 'Al Qadarif', city_ar: 'القضارف',   map_query: 'Al+Qadarif,Sudan', address: null, phone: null },
    { name: { en: 'Al Managil',   ar: 'المناقل' },                   type: 'branch', city_en: 'Al Managil', city_ar: 'المناقل',   map_query: 'Al+Managil,Sudan', address: null, phone: null },
    { name: { en: 'Ad-Damar',     ar: 'الدامر' },                    type: 'branch', city_en: 'Ad-Damar',   city_ar: 'الدامر',    map_query: 'Ad-Damar,Sudan',   address: null, phone: null },
    { name: { en: 'Ad-Daba',      ar: 'الدبة' },                     type: 'branch', city_en: 'Ad-Daba',    city_ar: 'الدبة',     map_query: 'Ad-Daba,Sudan',    address: null, phone: null },
  ],
  contact: {
    phone: '+249 91 233 8559',
    whatsapp: '+249912338559',   // for wa.me URL
    email: null,                  // pending client verification
    hours_en: 'Sunday – Thursday · 8:00 AM – 5:00 PM',
    hours_ar: 'الأحد – الخميس · ٨:٠٠ صباحاً – ٥:٠٠ مساءً',
    social: { facebook: null, instagram: null, youtube: null, linkedin: null },
  },
  certifications: ['International Agricultural Trade Association'],
  markets_served: ['sd'],
  supplier_countries: ['de', 'nl', 'ch', 'gb', 'au', 'th', 'cn', 'in', 'eg'],
  staff_count: 50,
  parent_company: 'Zagros Group',
};
```

- [ ] **Step 4: Run test, expect pass**

Run: `npm test -- data/company`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/company.ts tests/data/company.test.ts
git commit -m "plan-6: error 2/7 — rewrite company.ts with real founding year, 7 partners, 6 Sudan branches, real phone"
```

#### Subtask 2.2 — Rewrite home-stats.json

- [ ] **Step 6: Edit `src/data/home-stats.json`**

```json
{
  "_source_note": "Stats derived from src/data/company.ts. Years = currentYear - established_year. Partners = company.partners.length. SKUs = sum of three product collections. Branches = company.branches.length.",
  "stats": [
    { "key": "years",       "value": "16", "label_en": "Years operating",     "label_ar": "سنة من النشاط",      "context_en": "since 2010",            "context_ar": "منذ ٢٠١٠" },
    { "key": "branches",    "value": "6",  "label_en": "Branches across Sudan","label_ar": "فروع في السودان",   "context_en": "Khartoum HQ + 5",       "context_ar": "الخرطوم + ٥ فروع" },
    { "key": "suppliers",   "value": "7",  "label_en": "International suppliers","label_ar": "شراكات دولية",    "context_en": "6 countries",            "context_ar": "٦ دول" },
    { "key": "skus",        "value": "30", "label_en": "SKUs in catalog",     "label_ar": "منتج في الكتالوج",   "context_en": "3 product lines",       "context_ar": "٣ خطوط منتجات" }
  ]
}
```

Note: `30` = 11 fertilizers + 3 seeds + 16 pesticides. Recompute if collection counts change.

- [ ] **Step 7: Delete regions.json**

```bash
git rm src/data/regions.json
```

Replaced by Sudan-branch map (Task 7), no fake MENA regions.

#### Subtask 2.3 — Strip invented framing from i18n

- [ ] **Step 8: Edit `src/i18n/en.json` — replace these keys**

Use the replacement copy specified in "Target state" above. Specific keys to overwrite:

| Key | New value |
|---|---|
| `site.tagline` | `Agricultural inputs · Est. 2010` |
| `site.meta_description` | `Sudan's trusted partner for agricultural inputs since 2010. Seeds from Thailand and Australia, fertilizers from Germany and the Netherlands, pesticides from Egypt, Switzerland, the UK, India, and China.` |
| `utility.service_area` | `Sudan` |
| `utility.partners_label` | `7 suppliers · 6 countries` |
| `about.headline` | `Sudan's full-input agricultural-solutions partner since 2010.` |
| `about.deck` | `Zagros Trading has served Sudanese farms — from ministry-scale projects to family operations — for sixteen years. Six branches, seven international suppliers, three product lines under one roof. Consultancy, distribution, and after-sales support.` |
| `partners_page.kicker` | `Sources · seven international houses` |
| `partners_page.headline` | `Where the seed, the chemistry, and the protection come from.` |
| `partners_page.deck` | `Zagros sources from seven international suppliers across six countries. Each house was chosen for technical credentials, regulatory standing, and agronomic fit with Sudanese farms.` |
| `products.page.headline` | `Seeds, fertilizers, pesticides — sourced for Sudanese farms.` |
| `products.page.deck` | `Three product lines, seven international suppliers, full agronomy support across the catalog.` |
| `home.hero.headline_a` | `Sudan's trusted partner —` |
| `home.hero.headline_b` | `for agricultural inputs since 2010.` |
| `home.hero.deck` | `Six branches across Sudan, seven international suppliers, full input portfolio. Seeds, fertilizers, pesticides — specs forward, agronomically backed.` |
| `home.hero.photo_alt` | `Sudanese agricultural landscape — Zagros field operations` |
| `home.hero.kpi_partners` | `International suppliers` |
| `home.hero.kpi_skus` | `SKUs in catalog` |
| `home.hero.kpi_years` | `Years operating` |
| `home.hero.kpi_categories` | `Product lines` |
| `home.sources.runner` | `Sources · Suppliers` |
| `home.sources.kicker` | `Sources · seven international houses` |
| `home.sources.headline_a` | `Seven international suppliers across six countries —` |
| `home.sources.headline_b` | `one Sudanese operator.` |
| `home.catalog.kicker` | `The catalog — three lines` |
| `home.catalog.headline` | `Seeds, fertilizers, pesticides — three lines, 30+ SKUs` |
| `home.numbers.regions_label` | `Branch network — six locations across Sudan` |
| `home.numbers.audit_chip` | `Branch network · Sudan` (or remove the chip if no caveat applies) |

- [ ] **Step 9: Mirror in `src/i18n/ar.json`**

Use the Arabic equivalents (from Target state) and ensure RTL parity. Pay particular attention to AR numeric formatting — use Arabic-Indic numerals (٢٠١٠، ٦، ٧، ١٦) for AR strings, Western numerals for EN.

Specific AR keys:

| Key | New value |
|---|---|
| `site.tagline` | `المدخلات الزراعية · تأسست ٢٠١٠` |
| `site.meta_description` | `شريك السودان الموثوق للمدخلات الزراعية منذ عام ٢٠١٠. بذور من تايلاند وأستراليا، أسمدة من ألمانيا وهولندا، مبيدات من مصر وسويسرا وبريطانيا والهند والصين.` |
| `utility.service_area` | `السودان` |
| `utility.partners_label` | `٧ شراكات · ٦ دول` |
| `about.headline` | `شريكك في الحلول الزراعية الكاملة بالسودان منذ ٢٠١٠.` |
| `about.deck` | `تخدم زاغروس للتجارة المزارع السودانية — من المشاريع الوزارية حتى المزارع العائلية — منذ ستة عشر عاماً. ستة فروع، سبع شراكات دولية، ثلاثة خطوط منتجات تحت سقف واحد. استشارات وتوزيع ودعم ما بعد البيع.` |
| `partners_page.kicker` | `المصادر · سبع شراكات دولية` |
| `partners_page.headline` | `من أين تأتي البذور والكيمياء وحماية النبات.` |
| `partners_page.deck` | `تستورد زاغروس من سبع شراكات دولية موزّعة على ست دول. اختير كل بيت لاعتماده الفنّي ومكانته التنظيمية وملاءمته الزراعية للحقول السودانية.` |
| `products.page.headline` | `بذور وأسمدة ومبيدات — مختارة للحقل السوداني.` |
| `home.hero.headline_a` | `شريكك الموثوق —` |
| `home.hero.headline_b` | `للمدخلات الزراعية منذ ٢٠١٠.` |
| `home.hero.deck` | `ستة فروع في السودان، سبع شراكات دولية، باقة مدخلات كاملة. بذور وأسمدة ومبيدات — مواصفات أولاً، دعم زراعي خلف كلّ كيس.` |
| `home.sources.headline_a` | `سبع شراكات دولية في ست دول —` |
| `home.sources.headline_b` | `مُشغّل سوداني واحد.` |
| `home.catalog.headline` | `بذور، أسمدة، مبيدات — ثلاثة خطوط، ٣٠+ منتج` |

- [ ] **Step 10: Update `src/i18n/types.ts`**

Reflect added/removed keys. Compiler will catch any orphaned references.

- [ ] **Step 11: Grep for surviving wrong-framing strings**

Run:
```bash
grep -rn "1987\|14 SKU\|14 منتجاً\|أربعة عشر منتجاً\|بيتا شراكة\|بيت ماركة\|operator, not a brand\|partner houses\|two houses\|Middle East distributor" src/
```
Expected: zero results. If any exist, fix them in-place.

- [ ] **Step 12: Run home + static-pages tests**

Run: `npm test -- home static-pages`
Expected: FAIL (test assertions still reference old copy). Update test assertions to new copy. Then PASS.

- [ ] **Step 13: Commit**

```bash
git add src/i18n/ src/data/home-stats.json tests/
git rm src/data/regions.json
git commit -m "plan-6: error 2 — strip invented brand framing across i18n, stats, hero, sources, catalog"
```

#### Subtask 2.4 — Rebuild Hero / Sources / Catalog components against real data

- [ ] **Step 14: Update `src/components/home/Hero.astro`**

Replace the hardcoded datalineItems block:

```astro
---
import statsData from '../../data/home-stats.json';
const datalineItems = statsData.stats.map(s => ({
  label: lang === 'ar' ? s.label_ar : s.label_en,
  value: s.value,
}));
---
```

Remove the `<DisclaimerChip />` overlay (no longer relevant — content isn't illustrative anymore).

- [ ] **Step 15: Update `src/components/home/CatalogTable.astro`**

Replace the 4 hardcoded subcategories with the real 3 lines + their counts. Pull from collections:

```astro
---
const [seeds, fertilizers, pesticides] = await Promise.all([
  getCollection('seeds'), getCollection('fertilizers'), getCollection('pesticides'),
]);
const lines = [
  { slug: 'seeds',       count: seeds.length,       label_en: 'Seeds',       label_ar: 'البذور',     ... },
  { slug: 'fertilizers', count: fertilizers.length, label_en: 'Fertilizers', label_ar: 'الأسمدة',     ... },
  { slug: 'pesticides',  count: pesticides.length,  label_en: 'Pesticides',  label_ar: 'المبيدات',     ... },
];
---
```

- [ ] **Step 16: Update `src/components/home/ByTheNumbers.astro`**

Remove the `regionsData` block (file is being deleted). Replace with a branch list pulled from `companyData.branches`. Hub marker reserved for HQ.

- [ ] **Step 17: Run home test**

Run: `npm test -- home`
Expected: PASS.

- [ ] **Step 18: Update `src/pages/index.astro`**

Section numbers go from `01 / 09` to `01 / 10` if we add Customers (Task 4). For now bump to `/ 10` and leave the Customers section as a placeholder slot to be filled in Task 4.

Update line 29: `subLabel="Four shelves · 14 SKUs"` → `subLabel={`${t('home.catalog.headline_short')}`}` or remove the subLabel entirely.

- [ ] **Step 19: Commit**

```bash
git add src/components/home/ src/pages/index.astro
git commit -m "plan-6: error 2 — rebuild home Hero/Sources/Catalog/ByTheNumbers against real company data"
```

---

### Task 3 — Error 3: Replace About placeholders with real data

**Files:**
- Modify: `src/pages/about.astro` — replace pending DisclaimerChips with real sections for branches (6), staff count, founding year, services, parent company
- Modify: `src/components/about/BranchesGrid.astro` (NEW) — render 6 branches from `companyData.branches` with map links
- Modify: `src/components/about/FoundedTimeline.astro` (NEW) — "Est. 2010", 16-year arc
- Modify: `src/components/about/ServicesList.astro` (NEW) — 4 services from Source-of-Truth §1 (Consultancy, Fertilizers, Pesticides, Seeds)
- Modify: `src/i18n/{ar,en}.json` — new keys for branches list, services list, founded label, parent company line
- Modify: `tests/pages/static-pages.test.ts`

**Target state:**

About page sections (in order):
1. Header (real headline + deck from Task 2)
2. Founded 2010 / 16 years / staff ~50 / parent company (new section)
3. Services — 4 items (Consultancy, Premium Fertilizers, Pest Control Solutions, Quality Seeds)
4. Branches — 6-card grid with map links (no longer pending)
5. Team — KEEP `team_pending` (genuinely missing per §11)
6. Affiliations — replace pending with "International Agricultural Trade Association" + chip for "additional certifications pending client confirmation"
7. (Removed pillars section — replaced by the above, or kept and renumbered)

**Tests affected:** `static-pages.test.ts` — assertions over about copy + branches presence.

**Risk / blast radius:** **LOW.** Pure rendering. No data model changes (data already added in Task 2).

#### Subtask 3.1 — Add About content sections

- [ ] **Step 1: Write failing test**

```ts
// tests/pages/static-pages.test.ts (additions)
import About from '../../src/pages/about.astro';

describe('/about', () => {
  it('shows the 6 real branches, not a pending chip', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('Khartoum');
    expect(html).toContain('Port Sudan');
    expect(html).toContain('Al Qadarif');
    expect(html).toContain('Al Managil');
    expect(html).toContain('Ad-Damar');
    expect(html).toContain('Ad-Daba');
    expect(html).not.toMatch(/Branch list pending|قائمة الفروع بانتظار/);
  });
  it('shows founding year 2010 prominently', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('2010');
  });
  it('keeps team-pending state (genuinely unknown per source-of-truth §11)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toMatch(/Team profiles pending|نبذات الفريق بانتظار/);
  });
});
```

- [ ] **Step 2: Run test, expect failure**

Run: `npm test -- static-pages`
Expected: FAIL.

- [ ] **Step 3: Create branches grid component**

`src/components/about/BranchesGrid.astro`:

```astro
---
import { companyData } from '../../data/company';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isAR = lang === 'ar';
const branches = companyData.branches;
---
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-sp-6">
  {branches.map((b) => (
    <a href={`https://www.google.com/maps/search/?api=1&query=${b.map_query}`} target="_blank" rel="noreferrer"
       class="block border border-stone p-sp-5 hover:border-ink transition-colors no-underline">
      <span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute">
        {b.type === 'HQ' ? t('about.branches.hq_label') : t('about.branches.branch_label')}
      </span>
      <div class="font-display italic text-2xl text-ink mt-sp-3">{isAR ? b.name.ar : b.name.en}</div>
      {b.phone && <div class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-mute mt-sp-3">{b.phone}</div>}
    </a>
  ))}
</div>
```

- [ ] **Step 4: Create founded timeline component**

`src/components/about/FoundedTimeline.astro` (simple — display year, years-active count, staff, parent):

```astro
---
import { companyData } from '../../data/company';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isAR = lang === 'ar';
const yearsActive = new Date().getFullYear() - companyData.established_year;
---
<div class="grid grid-cols-1 md:grid-cols-4 gap-sp-7 border-t border-ink pt-sp-7">
  <div>
    <span class="font-display italic text-sienna text-6xl leading-none">{isAR ? '٢٠١٠' : '2010'}</span>
    <div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mt-sp-3">{t('about.timeline.founded_label')}</div>
  </div>
  <div>
    <span class="font-display italic text-sienna text-6xl leading-none">{isAR ? '١٦' : yearsActive}</span>
    <div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mt-sp-3">{t('about.timeline.years_label')}</div>
  </div>
  <div>
    <span class="font-display italic text-sienna text-6xl leading-none">{isAR ? '~٥٠' : '~50'}</span>
    <div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mt-sp-3">{t('about.timeline.staff_label')}</div>
  </div>
  <div>
    <div class="font-display text-2xl text-ink leading-tight">{isAR ? 'مجموعة زاغروس' : 'Zagros Group'}</div>
    <div class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute mt-sp-3">{t('about.timeline.parent_label')}</div>
  </div>
</div>
```

- [ ] **Step 5: Create services list component**

`src/components/about/ServicesList.astro`:

```astro
---
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const services = [
  { key: 'consultancy', icon: '01' },
  { key: 'fertilizers', icon: '02' },
  { key: 'pesticides',  icon: '03' },
  { key: 'seeds',       icon: '04' },
];
---
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sp-7">
  {services.map(s => (
    <article class="border-t border-ink pt-sp-5">
      <span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-mute">{s.icon}</span>
      <h3 class="font-display text-2xl text-ink mt-sp-3 mb-sp-3">{t(`about.services.${s.key}_title`)}</h3>
      <p class="font-sans text-sm text-ink/80 leading-relaxed">{t(`about.services.${s.key}_body`)}</p>
    </article>
  ))}
</div>
```

- [ ] **Step 6: Rewrite `src/pages/about.astro`**

Replace section bodies. Keep section number scheme `01 / 06` (founded, services, branches, team, affiliations, certifications). Pillars section can be removed or kept — recommend removing (was tied to invented "operator" framing). Sections:

```astro
<CaptionStrip sectionNumber="01 / 06" label={t('about.timeline_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-12 col-start-2">
      <FoundedTimeline />
    </div>
  </div>
</section>

<CaptionStrip sectionNumber="02 / 06" label={t('about.services_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-12 col-start-2"><ServicesList /></div>
  </div>
</section>

<CaptionStrip sectionNumber="03 / 06" label={t('about.branches_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-12 col-start-2"><BranchesGrid /></div>
  </div>
</section>

<CaptionStrip sectionNumber="04 / 06" label={t('about.team_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-9 col-start-2"><DisclaimerChip text={t('about.team_pending')} /></div>
  </div>
</section>

<CaptionStrip sectionNumber="05 / 06" label={t('about.affiliations_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-9 col-start-2">
      <div class="font-display text-2xl text-ink mb-sp-5">{t('about.affiliations.iata')}</div>
      <DisclaimerChip text={t('about.affiliations.additional_pending')} />
    </div>
  </div>
</section>

<CaptionStrip sectionNumber="06 / 06" label={t('about.story_label')} />
<section class="py-section-y bg-paper">
  <div class="stage-grid">
    <div class="col-span-9 col-start-2"><DisclaimerChip text={t('about.story_pending')} /></div>
  </div>
</section>
```

Mirror to `src/pages/ar/about.astro`.

- [ ] **Step 7: Add i18n keys**

EN:
```json
"about": {
  "timeline_label": "Established",
  "timeline": {
    "founded_label": "Founded",
    "years_label": "Years operating",
    "staff_label": "Team members",
    "parent_label": "Parent company"
  },
  "services_label": "Services",
  "services": {
    "consultancy_title": "Agricultural consultancy",
    "consultancy_body": "Soil reports, application planning, crop diagnostics. Technical desk on every order over a tank-mix in complexity.",
    "fertilizers_title": "Premium fertilizers",
    "fertilizers_body": "Water-soluble K+S German chemistry plus specialty Agro Dragon (Netherlands) lines for foliar, fertigation, and soil application.",
    "pesticides_title": "Pest control solutions",
    "pesticides_body": "Insecticides, herbicides, fungicides — Egyptian, Swiss, British, Indian, and Chinese sources rebranded under the Agro- and Or- lines.",
    "seeds_title": "Quality seeds",
    "seeds_body": "Vegetable hybrids from East West Seeds (Thailand), forage cultivars from Barenbrug (Australia)."
  },
  "branches_label": "Branches across Sudan",
  "branches": {
    "hq_label": "Headquarters",
    "branch_label": "Branch"
  },
  "team_label": "Leadership",
  "team_pending": "Team profiles pending client headshots and bios.",
  "affiliations_label": "Memberships",
  "affiliations": {
    "iata": "International Agricultural Trade Association",
    "additional_pending": "Additional certifications and local memberships pending client confirmation."
  },
  "story_label": "Our story",
  "story_pending": "Founding-story narrative pending client interview."
}
```

AR mirror.

- [ ] **Step 8: Run test, expect pass**

Run: `npm test -- static-pages`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/pages/about.astro src/pages/ar/about.astro src/components/about/ src/i18n/ tests/pages/static-pages.test.ts
git commit -m "plan-6: error 3 — about page replaces placeholders with real 6 branches, 4 services, founded 2010, IATA membership"
```

---

### Task 4 — Error 4: Add Customers section + dedicated page

**Files:**
- Create: `src/data/customers.ts` — 6 customer records with EN/AR names, logo paths
- Create: `src/pages/customers/index.astro` + `src/pages/ar/customers/index.astro`
- Create: `src/components/home/CustomersStrip.astro` — logo strip for homepage
- Modify: `src/pages/index.astro` — add Customers section (new section number)
- Modify: `src/components/global/Nav.astro` — add Customers to nav
- Modify: `src/components/global/Footer.astro` — add Customers link to company column
- Modify: `src/i18n/{ar,en}.json` — `nav.customers`, `customers.page.*`, `home.customers.*`
- Modify: `src/i18n/types.ts`
- Create: `tests/pages/customers.test.ts`

**Target state:**

`/customers` page: 6 customer cards in grid, each with logo + EN/AR name + sector chip. Homepage gets a CustomersStrip — single-row logo wall plus a "View customer wall →" CTA linking to /customers.

Customer data:

```ts
export const customers = [
  { slug: 'ministry-of-agriculture', name: { en: 'Ministry of Agriculture & Natural Resources Sudan', ar: 'وزارة الزراعة والموارد الطبيعية السودان' }, logo: '/trusted-customer-logos/ministry-of-agriculture.svg', sector: 'government' },
  { slug: 'alrajihi',                name: { en: 'Alrajihi Agriculture Project', ar: 'مشروع الراجحي الزراعي' }, logo: '/trusted-customer-logos/alrajihi.svg', sector: 'commercial_farm' },
  { slug: 'amtar',                   name: { en: 'Amtar Agriculture Project',    ar: 'مشروع امطار الزراعي' },  logo: '/trusted-customer-logos/amtaar.svg', sector: 'commercial_farm' },
  { slug: 'dal',                     name: { en: 'Dal Agriculture',              ar: 'دال الزراعية' },           logo: '/trusted-customer-logos/dal.svg', sector: 'commercial_farm' },
  { slug: 'paramount',               name: { en: 'Paramount Agriculture',        ar: 'باراماونت الزراعية' },     logo: '/trusted-customer-logos/Paramount.svg', sector: 'commercial_farm' },
  { slug: 'premier-farm',            name: { en: 'Premier Farm',                 ar: 'بريمير فارم' },            logo: '/trusted-customer-logos/premier-farm.webp', sector: 'commercial_farm' },
];
```

All 6 logo files exist in `public/trusted-customer-logos/` — verified during audit.

**Tests affected:** New `tests/pages/customers.test.ts`. Home test updated for new section.

**Risk / blast radius:** **LOW.** Pure additive — no schema rewrites, all assets present.

#### Subtask 4.1 — Add customer data + components + pages

- [ ] **Step 1: Write failing test**

```ts
// tests/pages/customers.test.ts
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Customers from '../../src/pages/customers/index.astro';

describe('/customers', () => {
  it('renders all 6 real customers with EN names', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Customers);
    expect(html).toContain('Ministry of Agriculture');
    expect(html).toContain('Alrajihi');
    expect(html).toContain('Amtar');
    expect(html).toContain('Dal Agriculture');
    expect(html).toContain('Paramount');
    expect(html).toContain('Premier Farm');
  });
  it('references the 6 logo files', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Customers);
    expect(html).toContain('/trusted-customer-logos/ministry-of-agriculture.svg');
    expect(html).toContain('/trusted-customer-logos/alrajihi.svg');
    expect(html).toContain('/trusted-customer-logos/amtaar.svg');
    expect(html).toContain('/trusted-customer-logos/dal.svg');
    expect(html).toContain('/trusted-customer-logos/Paramount.svg');
    expect(html).toContain('/trusted-customer-logos/premier-farm.webp');
  });
});
```

- [ ] **Step 2: Create customers data file + page + components**

Create `src/data/customers.ts`, `src/pages/customers/index.astro`, `src/pages/ar/customers/index.astro`, `src/components/home/CustomersStrip.astro`, `src/components/customers/CustomerCard.astro`.

- [ ] **Step 3: Add nav + footer + homepage section**

- `Nav.astro`: add Customers link between Partners and About
- `Footer.astro`: add Customers in `col_company` list
- `pages/index.astro`: insert new section after Sources (or before Numbers), renumber 01/10 through 10/10

- [ ] **Step 4: Add i18n keys**

EN:
```json
"nav": { ..., "customers": "Customers" },
"customers": {
  "page": {
    "title": "Customers",
    "kicker": "Customer wall",
    "headline": "Sudan's farms — ministry to family operation.",
    "deck": "Six anchor customers whose orders span national agricultural projects, commercial farms, and the agriculture ministry's procurement."
  }
},
"home": {
  "customers": {
    "kicker": "Customer wall",
    "headline": "Six anchor customers across Sudan",
    "cta": "View customer wall →"
  }
}
```

AR mirror.

- [ ] **Step 5: Run tests, expect pass**

Run: `npm test -- customers home`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/customers.ts src/pages/customers/ src/pages/ar/customers/ src/components/customers/ src/components/home/CustomersStrip.astro src/pages/index.astro src/components/global/Nav.astro src/components/global/Footer.astro src/i18n/ tests/pages/customers.test.ts
git commit -m "plan-6: error 4 — add /customers page and homepage logo strip (6 real customers)"
```

---

### Task 5 — Error 5: Rebuild Partners page (7 suppliers, not 2)

**Files:**
- Create: `src/content/partners/east-west-seeds.mdx`
- Modify: `src/content/partners/barenbrug.mdx` (country: Netherlands → Australia; tagline rewrite)
- Modify: `src/content/partners/k-plus-s.mdx` (keep, refresh stats)
- Create: `src/content/partners/agro-dragon.mdx`
- Create: `src/content/partners/saf.mdx`
- Create: `src/content/partners/kz.mdx`
- Create: `src/content/partners/kafr-el-zayat.mdx`
- Modify: `src/content/config.ts` — `partners` schema: relax `since_year` to optional, add `category`, allow missing `stats`
- Modify: `src/pages/partners/index.astro` — render all 7
- Modify: `src/pages/partners/[slug].astro` — handle partners with empty stats gracefully
- Modify: `src/components/cards/PartnerCard.astro` — handle nullable fields
- Modify: `src/components/home/SourcesSection.astro` — render top 4 or all 7 on homepage
- Create: `tests/content/partners.test.ts` (replacing existing) — assertions over 7 partners
- Modify: `tests/pages/partners.test.ts`

**Target state:**

Each partner MDX (using `kafr-el-zayat.mdx` as example):

```yaml
---
name: Kafr El Zayat Pesticides & Chemical Co.
country: Egypt
country_code: eg
category: pesticides
since_year: null
logo_path: null
tagline:
  en: Egyptian pesticide manufacturer — Malathion-based insecticides for field crops.
  ar: مُصنّع مصري للمبيدات — مبيدات حشرية على أساس الملاثيون للمحاصيل الحقلية.
product_lines:
  - name: Insecticides
    grade: Malason 57% EC (Malathion)
    crops: [onion, field crops, horticultural crops]
stats: null   # full name confirmed, stats not yet available
---
```

For SAF and KZ: tagline + product_lines fields populated, but `name` notes `[full company name pending]` in copy, and `stats: null`. Logo paths point at existing assets.

For `kafr-el-zayat.mdx`: `logo_path: null` — surface as missing-logo placeholder in PartnerCard (text-only card with country flag instead of logo).

**Tests affected:** `partners.test.ts` (content + pages). `home.test.ts` (Sources section).

**Risk / blast radius:** **MEDIUM.** Partner schema change has Astro typecheck implications. New cards must handle nullable fields without breaking.

#### Subtask 5.1 — Update partner schema and MDX

- [ ] **Step 1: Write failing test**

```ts
// tests/content/partners.test.ts (rewrite)
describe('partners collection', () => {
  it('contains all 7 suppliers per source-of-truth §4', async () => {
    const partners = await getCollection('partners');
    const slugs = partners.map(p => p.slug).sort();
    expect(slugs).toEqual([
      'agro-dragon', 'barenbrug', 'east-west-seeds', 'k-plus-s',
      'kafr-el-zayat', 'kz', 'saf',
    ]);
  });
  it('attributes Barenbrug to Australia (not Netherlands)', async () => {
    const partners = await getCollection('partners');
    const barenbrug = partners.find(p => p.slug === 'barenbrug');
    expect(barenbrug!.data.country).toBe('Australia');
  });
});
```

- [ ] **Step 2: Update `src/content/config.ts` — partners schema**

```ts
const partners = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    country_code: z.string(),
    category: z.enum(['vegetable_seeds', 'forage_seeds', 'fertilizers', 'pesticides']),
    since_year: z.number().nullable(),
    logo_path: z.string().nullable(),
    tagline: z.object({ en: z.string(), ar: z.string() }),
    product_lines: z.array(z.object({
      name: z.string(),
      grade: z.string(),
      crops: z.array(z.string()),
    })),
    stats: z.object({
      years_in_partnership: z.number().optional(),
      products_carried: z.number(),
      tons_2024: z.number().optional(),
      states_served: z.number().optional(),
    }).nullable(),
  }),
});
```

- [ ] **Step 3: Add 5 new partner MDX files + update 2 existing**

Use Source-of-Truth §4 for content. For each:

- `east-west-seeds.mdx`: country Thailand, country_code `th`, category `vegetable_seeds`, logo `/partners/east-west-seeds.webp`, product_lines includes vegetable seed varieties (mark "pending client SKU list" as a single line item), `stats: null`
- `barenbrug.mdx`: update country `Netherlands` → `Australia`, country_code `nl` → `au`, logo unchanged (`/partners/barenbrug.png` or `.svg`), refresh `tagline.en` + `.ar` to mention Heritage Seeds Australia, product_lines: 3 forage cultivars
- `k-plus-s.mdx`: refresh `stats.years_in_partnership` from `12` (computed from `since_year: 2014`) to current value (12 still — 2026-2014). Keep `products_carried: 11`. Update `country_code: de`. Add `category: fertilizers`.
- `agro-dragon.mdx`: country Netherlands, country_code `nl`, category `fertilizers`, logo `/partners/agro-dragon.webp`, tagline mentions specialty/organic fertilizers, `product_lines` empty array with note "catalog pending client confirmation"
- `saf.mdx`: country Switzerland, country_code `ch`, category `pesticides`, logo `/partners/saf.webp`, tagline notes Swiss origin, `product_lines` empty array, `stats: null`. Name displayed as `SAF [full company name pending]`
- `kz.mdx`: country United Kingdom, country_code `gb`, category `pesticides`, logo `/partners/kz.webp`, similar treatment to SAF
- `kafr-el-zayat.mdx`: country Egypt, country_code `eg`, category `pesticides`, `logo_path: null`, product_lines: 1 (Malason)

- [ ] **Step 4: Update PartnerCard to handle null logo + null stats**

`src/components/cards/PartnerCard.astro`: branch on `partner.data.logo_path`. If null, render a text-only card with country flag in upper-left.

- [ ] **Step 5: Update `src/pages/partners/index.astro`**

Already iterates `partners.map(p => <PartnerCard partner={p} />)`. Reorder render by `category` priority: seeds → fertilizers → pesticides. Maybe group with subheadings.

- [ ] **Step 6: Update `src/pages/partners/[slug].astro`**

Render gracefully when `stats: null` (hide stats block). Render `product_lines` empty state when array is empty.

- [ ] **Step 7: Update `src/components/home/SourcesSection.astro`**

Show all 7 partners, or top 4 with a "View all 7 →" CTA. Recommendation: 4 + CTA, keeps the homepage from getting crowded.

- [ ] **Step 8: Run partners + home tests**

Run: `npm test -- partners home`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/content/partners/ src/content/config.ts src/pages/partners/ src/components/cards/PartnerCard.astro src/components/home/SourcesSection.astro tests/content/partners.test.ts tests/pages/partners.test.ts
git commit -m "plan-6: error 5 — rebuild partners (7 suppliers, Barenbrug→Australia, Kafr El Zayat added)"
```

---

### Task 6 — Error 6: Strip placeholder text leaking into UI

**Files:**
- Modify: `src/components/home/Hero.astro` — alt text rewrite
- Modify: `src/i18n/{ar,en}.json` — alt text + any photo-placeholder strings
- Modify: `src/components/home/ByTheNumbers.astro` — remove "Illustrative figures · pending audit" chip
- Modify: `src/components/home/Hero.astro` — remove the `<DisclaimerChip />` overlay
- Audit: every component for literal `*.jpg|*.png|*.webp` strings appearing as text content (not as `src=` attributes)
- Audit: every component for "Illustrative", "pending audit", "PENDING REAL PHOTO" string literals

**Target state:**

Search the entire codebase for these patterns and replace each appropriately:
- `illustrative-` rendered as visible text → either render the image normally (it exists) or use a proper image-placeholder component
- `pending audit` / `قيد التدقيق` text rendered next to real data → remove
- `Illustrative figures` → remove (numbers are now real)

The hero image (`/photos/illustrative-hero-canal.jpg`) is a real image that exists on disk. The leakage is the alt text and the surrounding DisclaimerChip overlay claiming the photo is illustrative — both fixed in Task 2.

The Numbers section's `audit_chip` ("Region map · pending client audit" / "أرقام توضيحية · قيد التدقيق") gets removed because the numbers are real now (6 branches, not 14 fake regions).

**Tests affected:** `home.test.ts` — negative assertions that "Illustrative", "pending audit", "*.jpg" do not appear in rendered HTML.

**Risk / blast radius:** **LOW.** Pure text edits.

- [ ] **Step 1: Write failing test**

```ts
// tests/pages/home.test.ts (additions)
it('shows no placeholder leakage in rendered output', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Index);
  // No literal filenames as visible text (only as src/href attribute values is fine)
  // Strip out attribute-context filenames and check what's left
  const text = html.replace(/(src|href|content)=["'][^"']+["']/g, '');
  expect(text).not.toMatch(/illustrative-[\w-]+\.(jpg|png|webp)/);
  expect(text).not.toMatch(/Illustrative figures|أرقام توضيحية/);
  expect(text).not.toMatch(/pending audit|قيد التدقيق/);
  expect(text).not.toMatch(/PENDING REAL PHOTO/i);
});
```

- [ ] **Step 2: Run test, see what fails**

Run: `npm test -- home`

- [ ] **Step 3: Strip remaining leaks**

For each fail:
- Update i18n keys
- Remove component blocks that render the offending text

Specifically:
- `src/components/home/ByTheNumbers.astro`: delete the `<DisclaimerChip text={t('home.numbers.audit_chip')} />` line and `audit_chip` i18n key
- `src/components/home/Hero.astro`: already cleaned in Task 2 (DisclaimerChip overlay removed, alt text rewritten)
- `src/i18n/en.json:244` `"pending_audit"`: delete unless referenced elsewhere
- `src/i18n/en.json:249` `"photo_alt"`: replace `"...illustrative photography pending client assets."` with neutral copy from Task 2

- [ ] **Step 4: Run test, expect pass**

Run: `npm test -- home`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ src/i18n/ tests/pages/home.test.ts
git commit -m "plan-6: error 6 — strip placeholder/illustrative text leakage from home UI"
```

---

### Task 7 — Error 7: Phone, geography, market positioning

**Files:**
- Already done in Task 2 — `companyData.contact.phone` set to `+249 91 233 8559`, `whatsapp` set
- Already done in Task 2 — `markets_served` / `supplier_countries` split in companyData
- Modify: `src/components/contact/DirectContact.astro` — render real phone, WhatsApp link, format properly; keep email/social as pending
- Modify: `src/components/global/UtilityBar.astro` — phone gets `tel:` link; remove the placeholder fallback
- Modify: any meta/OG tags referencing service area
- Verify: no surviving "Middle East" references except in supplier-country context (e.g. K+S Middle East FZE is the partner's company name — legitimate)
- Modify: `tests/pages/static-pages.test.ts` — contact assertions

**Target state:**

DirectContact panel:
```
PHONE       +249 91 233 8559          ← tap-to-call (tel:+249912338559)
WHATSAPP    +249 91 233 8559          ← link to https://wa.me/249912338559
EMAIL       [pending client]          ← italicized, sienna disclaimer chip
HOURS       Sunday-Thursday · 8AM-5PM
```

UtilityBar:
```
Sudan · Sun-Thu 8-5             +249 91 233 8559 · [email pending]
```

Phone in AR locale: same digits, RTL-safe (use Unicode RTL marks if needed).

**Tests affected:** static-pages, home.

**Risk / blast radius:** **LOW.** Mostly already covered in Task 2.

- [ ] **Step 1: Write failing test**

```ts
// tests/pages/static-pages.test.ts (additions)
it('contact page shows real phone with tel: link', async () => {
  const html = await container.renderToString(Contact);
  expect(html).toContain('+249 91 233 8559');
  expect(html).toMatch(/tel:\+249912338559/);
  expect(html).toMatch(/wa\.me\/249912338559/);
  expect(html).not.toMatch(/\+249 183 123456|\+249 183 789012/);  // old placeholders
});
it('Middle East references only persist as supplier-company names', async () => {
  // Whitelist: "K+S Middle East" is the partner's legal name; allowed.
  const html = await container.renderToString(About);
  const middleEastMatches = (html.match(/Middle East/g) ?? []).filter(
    () => true,
  );
  // Either zero, or only inside "K+S Middle East" context. Check by stripping that string and re-matching.
  const cleaned = html.replace(/K\+S Middle East/g, '');
  expect(cleaned).not.toMatch(/Middle East/);
});
```

- [ ] **Step 2: Update `DirectContact.astro`**

Replace lines 19, 22, 25 with proper rendering — `<a href={`tel:${contact.phone}`}>` for phone, `<a href={`https://wa.me/${contact.whatsapp}`}>` for WhatsApp. Email stays as pending. Email and social social pending markers remain (genuine §11 gap).

- [ ] **Step 3: Update `UtilityBar.astro`**

Remove the `'+XXX XXX XXX'` placeholder fallback. Render `<a href="tel:...">` for phone. `service_area` already updated to "Sudan" in Task 2.

- [ ] **Step 4: Grep for remaining wrong-scope copy**

Run:
```bash
grep -rn "Middle East\|الشرق الأوسط" src/i18n/ src/components/ src/pages/
```
Expected: zero results outside `K+S Middle East FZE` supplier-name context.

- [ ] **Step 5: Update meta/OG tags**

In `src/layouts/Layout.astro` or wherever `<meta name="description">` / `<meta property="og:description">` come from — should now pull from updated `site.meta_description` i18n. Verify the OG tags say Sudan, not Middle East.

- [ ] **Step 6: Run static-pages + home tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/contact/DirectContact.astro src/components/global/UtilityBar.astro src/layouts/Layout.astro tests/pages/static-pages.test.ts
git commit -m "plan-6: error 7 — real phone tap-to-call, Sudan-foreground geography, strip Middle East scope claims"
```

---

### Task 8 — Create AGENTS.md and REMAINING_GAPS.md

**Files:**
- Create: `AGENTS.md`
- Create: `REMAINING_GAPS.md`
- Tag: `plan-6-remediation` git tag at final commit

#### Subtask 8.1 — AGENTS.md

- [ ] **Step 1: Create `AGENTS.md`**

```markdown
# Zagros v2 — Agent Working Notes

> **Source of truth for all Zagros product, brand, company, and supplier data:** `ZAGROS_SOURCE_OF_TRUTH.md` at project root. Read it before any content, copy, or data work. Do not invent facts not in this doc.

## Project at a glance

- Zagros Trading is a Sudan-based agricultural-inputs partner since 2010.
- Six branches across Sudan: Khartoum HQ, Port Sudan, Al Qadarif, Al Managil, Ad-Damar, Ad-Daba.
- Seven international suppliers across six countries — Thailand (East West Seeds), Australia (Barenbrug), Germany (K+S), Netherlands (Agro Dragon), Switzerland (SAF), United Kingdom (KZ), Egypt (Kafr El Zayat). Plus ~12 Chinese private-label manufacturers and 1 Indian partner (Mahamaya Lifesciences) surfaced per-product, not on Partners page.
- Three product lines: Seeds (vegetable + forage), Fertilizers (K+S + Agro Dragon), Pesticides (insecticides + herbicides + fungicides). ~30 SKUs total.

## Where data lives

| Concept | File |
|---|---|
| Company facts (name, founded, branches, contact, partners, certifications) | `src/data/company.ts` |
| Homepage stats | `src/data/home-stats.json` (derived from company.ts) |
| Customers | `src/data/customers.ts` |
| Tank-mix compatibility | `src/data/compatibility.json` |
| Ops ticker (live updates) | `src/data/ops-ticker.json` |
| Use cases | `src/data/use-cases.json` |
| Fertilizers (11 SKUs) | `src/content/fertilizers/*.mdx` |
| Seeds (3 forage SKUs; vegetable pending) | `src/content/seeds/*.mdx` |
| Pesticides (16 SKUs) | `src/content/pesticides/*.mdx` |
| Partners (7) | `src/content/partners/*.mdx` |
| Field reports | `src/content/field-reports/*.mdx` |
| Locale copy | `src/i18n/{ar,en}.json` + `types.ts` |

## Hard rules

- Do not invent content. If a fact isn't in the source-of-truth doc, either flag it as a gap (see `REMAINING_GAPS.md`) or render an empty state.
- Plausible placeholder copy hides gaps. Visible "pending" markers signal them. Prefer markers.
- Do not use "operator, not a brand house" or "two partner houses" framing anywhere.
- Sudan is the confirmed market. Do not display aspirational MENA-regional claims.
- Bilingual copy parity: every visible string lives in both `en.json` and `ar.json`.
- Do not modify the locked design system (typography scale, spacing tokens, color tokens) without the user's go-ahead.

## Conventions

- File naming: kebab-case slugs everywhere. `solu-npk-20-20-20`, not `SoluNPK_20_20_20`.
- Product image paths in `public/products/`. PesticideCard handles missing images gracefully (text-only render).
- Phone format: display `+249 91 233 8559`. Use `tel:+249912338559` for tap-to-call, `https://wa.me/249912338559` for WhatsApp.
- AR numerals: prefer Arabic-Indic (٢٠١٠) for visible AR copy; keep ISO codes / phone digits in Western.
```

- [ ] **Step 2: Commit AGENTS.md**

```bash
git add AGENTS.md
git commit -m "plan-6: enshrine ZAGROS_SOURCE_OF_TRUTH.md as canonical reference in AGENTS.md"
```

#### Subtask 8.2 — REMAINING_GAPS.md (mirrors Source-of-Truth §11)

- [ ] **Step 3: Create `REMAINING_GAPS.md`**

Distill Source-of-Truth §11 into an actionable client-followup checklist organized by impact. Include each gap with: (a) what's needed, (b) where it lands in the site once provided, (c) priority. This file is for the user to take into the demo and walk away with a punch list for the client.

- [ ] **Step 4: Tag completion**

```bash
git tag plan-6-remediation
git log --oneline plan-5-static-pages..plan-6-remediation
```

---

## Task 9 — Verification before push

Each item must be confirmed before reporting completion.

- [ ] **Build clean:** `npm run build` exits 0, no type errors, no unresolved imports.
- [ ] **All tests green:** `npm test` shows full pass — originals + new tests for plan-6.
- [ ] **Visual smoke check** — start `npm run dev`, browse each route in both locales:
  - [ ] `/` — Sudan-foreground hero, real stats (16 yrs / 6 branches / 7 suppliers / 30 SKUs), no "14 SKUs / 2 partner houses / operator"
  - [ ] `/ar/` — Arabic mirror, same rule
  - [ ] `/products` — 3 line cards (Seeds / Fertilizers / Pesticides), real SKU counts
  - [ ] `/products/pesticides` — 3 subcategories with 16 SKUs total
  - [ ] `/products/fertilizers` — K+S group (11 SKUs) + Agro Dragon empty state
  - [ ] `/products/seeds` — Forage group (3 SKUs) + Vegetable empty state
  - [ ] Each detail route works: `/products/pesticides/p01-malason`, etc.; both `/products/...` and `/ar/products/...` render
  - [ ] `/about` — founded 2010, 6 branches grid, 4 services, IATA membership; team/story/cert-extras still pending
  - [ ] `/partners` — 7 supplier cards, Barenbrug attributed to Australia
  - [ ] `/customers` — 6 customer cards with logos
  - [ ] `/contact` — real phone with tel: and wa.me links; email + social still pending; 6 branches in sidebar
  - [ ] `/field-reports` and detail pages — still functional, related_products link to new slugs
  - [ ] `/privacy`, `/terms` — unchanged (still pending legal review marker)
- [ ] **No literal filenames** appearing as visible text anywhere in build output:
  - `grep -rE '(\.jpg|\.png|\.webp)' dist/` — only inside `src=` / `srcset=` / `href=` / inline CSS / JSON-LD, never as visible text. Manual eyeball check on a few sample pages.
- [ ] **No banned strings in build output:**
  - `grep -r "14 منتجاً\|14 SKUs\|بيتا شراكة\|بيت ماركة\|operator, not a brand\|partner houses\|أربعة عشر منتجاً\|Authorized Middle East" dist/`
  - Expected: zero results.
- [ ] **AR / EN parity:** every locale string visible on the site has a counterpart. `npm test -- i18n` if a parity test exists; otherwise spot-check 5 representative pages.
- [ ] **AGENTS.md present, REMAINING_GAPS.md present, `plan-6-remediation` tag present.**
- [ ] **No push to remote** — user reviews locally first.

Report verification status with each checkbox marked and any caveats listed.

---

## Plan-level risks & mitigations

| Risk | Mitigation |
|---|---|
| Task 1 schema rewrite breaks all downstream pages mid-flight | Subtask 1.1 (collections) and 1.2 (routes) commit independently. Build must pass after each. |
| Pesticide MDX hand-translation introduces typos in Arabic field labels | Single editor sweep at the end of Task 1 — diff against Source-of-Truth §1.1-1.3 line-by-line. |
| Slug changes break field-report cross-references | Subtask 1.3 catches this. Tests would also fail. |
| `getStaticPaths` collisions between `/products/[slug]` (old) and `/products/[line]/[slug]` (new) | Delete the old route file before creating the new tree. Verified in Step 14 commit. |
| Customer logos exist with mixed casing/extensions (Paramount.svg, premier-farm.webp) | Filenames hard-coded in `src/data/customers.ts` exactly as they appear on disk. Verified during audit. |
| Pesticide images missing for Orafen/Mancoxyl/Orastrobin | PesticideCard handles missing `image_url` field — renders text-block card. No build error. |
| Removing `regions.json` breaks ByTheNumbers if Task 2 step ordering reversed | Step 16 of Task 2 (rewrite ByTheNumbers) commits BEFORE Step 7 of Task 2 (delete regions.json). |
| AR copy quality regression — user has strict "no Google-Translate Arabic" memory | Use Source-of-Truth's AR copy verbatim where it exists; for new AR strings, mirror the doc's voice (technical, agronomic, terse). Flag for review if any new AR copy is invented. |

---

## Definition of done

- All 7 error categories addressed and verified per Task 9 checklist
- Plan 6 doc exists at `docs/superpowers/plans/plan-6-remediation.md` (this file)
- `plan-6-remediation` git tag points at the completion commit
- `AGENTS.md` created at project root, pointing at the source-of-truth doc
- `REMAINING_GAPS.md` at project root mirrors §11 of the source-of-truth doc
- 47 original tests still pass; new tests added for new collections, customers, partner expansion, placeholder leak detection
- No push to remote until user reviews
