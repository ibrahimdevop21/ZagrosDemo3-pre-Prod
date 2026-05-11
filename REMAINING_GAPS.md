# Zagros v2 — Remaining Gaps (client follow-up punch list)

> Mirror of Section 11 of `ZAGROS_SOURCE_OF_TRUTH.md`, scoped to what the client needs to provide before public launch. Items the site currently flags as "pending client confirmation" all trace back to one of these.

## Blocking (must resolve before launch)

### 1. Contact channels
- [ ] Real **email** address. Current state: `null` in `src/data/company.ts:contact.email`. Visibly italicized as "pending" in `/contact` direct-contact panel.
- [ ] Confirm **social media handles**: Facebook, Instagram, YouTube (v1 had `zagrosagri` × 3 but these are unverified). All currently null; not rendered.
- [ ] **WhatsApp confirmation** — currently set to the same number as phone (`+249912338559`). Confirm this is a WhatsApp Business line, not just the office phone. If different, update `src/data/company.ts:contact.whatsapp`.

### 2. Branch detail
- [ ] **Full street addresses** for all 6 branches. Currently only city names known. `src/data/company.ts:branches[].address` is null for every entry. The branches grid on `/about` and the sidebar on `/contact` only show city + map link.

### 3. Supplier confirmations
- [ ] **K+S extended catalog** — confirm Zagros stocks soluUP, soluMAP, soluMKP, soluAMS, soluCN. Currently flagged `stock_confirmation: pending_client` in their MDX files. If not stocked, delete those 5 MDX files from `src/content/fertilizers/`.
- [ ] **Agro Dragon product catalog** — currently completely unknown. `/products/fertilizers` shows an "Agro Dragon · Netherlands · catalog pending" empty state. Add MDX files at `src/content/fertilizers/agro-dragon-*.mdx` when received.
- [ ] **East West Seeds variety list** — vegetable hybrid SKUs. `/products/seeds` shows a "Vegetable · East West Seeds · pending" empty state. Add MDX files at `src/content/seeds/vegetable-*.mdx` when received. Schema is ready (`subcategory: vegetable`).
- [ ] **Full Barenbrug variety list** beyond the 3 forage cultivars in source-of-truth §3.2 (Superfine Rhodes, SARDI 10 Series 2, Alfamaster Ten). Likely more lucernes, ryegrass, clover, tropical grasses available from the Australian catalog.
- [ ] **SAF full company name** — currently rendered as "SAF" with country (Switzerland) and "catalog forthcoming" tagline. Update `src/content/partners/saf.mdx:name`.
- [ ] **KZ full company name** — same situation. Update `src/content/partners/kz.mdx:name`.
- [ ] **Kafr El Zayat logo file** — `logo_path: null` in `src/content/partners/kafr-el-zayat.mdx`. Card and detail page render with country flag emoji (🇪🇬) as fallback. Add the SVG/WebP to `public/partners/` and set `logo_path: /partners/kafr-el-zayat.{svg,webp}`.

### 4. Tagline AR confirmation
- [ ] Confirm preferred Arabic translation for **"Leaders in Agric Services"**. Site currently uses `روّاد الخدمات الزراعية`. Source-of-truth §1 flagged this as TO CONFIRM.

## Important but not blocking

### 5. About page completion
- [ ] **Founding story** narrative for `/about` (Section 06 / 06). Currently shows `DisclaimerChip` reading "Founding-story narrative pending client interview" / equivalent AR.
- [ ] **Leadership names + headshots** for `/about` (Section 04 / 06). Currently shows team-pending chip.
- [ ] **Additional certifications and local memberships** beyond IATA (Section 05 / 06). The site shows IATA membership in display type and a pending chip for the rest.

### 6. Photography
- [ ] **Field / farm / team photography** — currently using illustrative stock photos at `public/photos/illustrative-*.jpg`. Replace at the same paths to swap content site-wide.
- [ ] **Product bag / bottle photography** for fertilizers and pesticides. Current state: fertilizer detail pages render an SVG `<BagMockup>` placeholder (clean, on-brand, but a mockup). Pesticide cards/detail use photos at `public/products/*.webp` — Orafen, Mancoxyl, and Orastrobin are missing.
- [ ] **Logo SVGs** for Zagros — confirm dark + light variants render correctly across the site.
- [ ] **Brand color palette spec** — beyond the gold/cream/dark scheme. Currently using `--color-sienna`, `--color-signal`, `--color-ink`, `--color-paper` tokens.

### 7. Country presence
- [ ] **Confirm markets served.** v1 `countries.ts` listed 11 MENA countries (Egypt, Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain, Jordan, Lebanon, Iraq, Yemen). The remediation set `markets_served: ['sd']` only in `src/data/company.ts` because none of these are confirmed. If Zagros actively ships to any, add ISO codes to that array and update the homepage / `/about` map.

## Nice-to-have

### 8. Case studies
- [ ] Pick **2–3 customers** from the 6 (Ministry, Alrajihi, Amtar, Dal, Paramount, Premier Farm) for full case-study pages with measurable outcomes. Would live at `/customers/[slug]` (route not yet built — schema extension straightforward).

### 9. Quote workflow
- [ ] Define what happens after the **"Request a quote"** CTA. The site has the form but the backend isn't wired. Currently routes to email per the form disclaimer.

### 10. Per-SKU use cases
- [ ] Bespoke crop-specific use-case copy beyond the `recommendation` field. The schema supports `crops[]` with category/examples/rates/stages — currently populated for fertilizers but thin for pesticides.

### 11. Partner detail enrichment
- [ ] Confirm `since_year` for each supplier (only K+S has 2014 verified). Barenbrug, East West, Agro Dragon, SAF, KZ, Kafr El Zayat all have `since_year: null`.

### 12. Legal copy
- [ ] **Privacy and Terms pages** currently render placeholder boilerplate with a `pending_review` chip. Need legal-counsel review and adaptation to Sudan jurisdiction before launch.

---

**Generated:** 2026-05-11
**Source:** `ZAGROS_SOURCE_OF_TRUTH.md` §11
**Status:** v1 of this list — update as items are resolved.
