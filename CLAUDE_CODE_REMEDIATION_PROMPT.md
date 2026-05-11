# Claude Code Remediation Directive — Zagros v2 Build

**Target branch:** `feature/redesign-v2-foundation`
**Status:** 66 commits, 54 pages, 47 tests green — structurally sound, factually wrong
**Source of authority:** `ZAGROS_SOURCE_OF_TRUTH.md` (project root, updated 2026-05-11)
**Outcome:** Branch ready to merge to main and demo to client without
factual errors, invented framing, or leaking placeholder text.

---

## Context (read this first)

The current branch was built on top of an earlier version of the source-of-truth
doc that incorrectly treated 11 K+S brochures + 3 Barenbrug datasheets as the
full Zagros catalog. The doc has since been replaced (v2). The new doc reflects
v1's actual production data (`src/data/company.ts`, `pesticides.json`,
`fertilizers.json`, `countries.ts`) plus all brochure information.

The current build is impressive on the surface — 54 pages, all tests green —
but contains seven categories of factual error documented in Section 10 of
the source-of-truth doc. Demo-shippable is not client-shippable. Fixing this
is mandatory before merge.

The design system, layout components, build pipeline, i18n setup, and routing
shell from plans 1–5 are sound. The content layer, data layer, and brand frame
are wrong. The remediation is content-focused, not architectural.

---

## Phase 1 — Internalize the spec (read-only, no edits)

1. Read `ZAGROS_SOURCE_OF_TRUTH.md` start to finish.
2. Pay close attention to:
   - The `🚨 CRITICAL` section listing the 7 errors
   - Section 1 (verified company facts)
   - Section 3 (brand identity — what Zagros IS and IS NOT)
   - Section 4 (the 7+ supplier list, not 2)
   - Sections 5–7 (branches, country presence, customers)
   - The PRODUCT CATALOG section (3 lines, ~30 SKUs, not 14)
   - Section 10 (the remediation prompt mirroring this directive)
   - Section 11 (gaps to flag, not fabricate)
3. Open and skim the four v1 data files referenced in the doc:
   - `src/data/company.ts`
   - `src/data/pesticides.json`
   - `src/data/fertilizers.json`
   - `src/data/countries.ts`
4. Audit the current branch and inventory:
   - Every page where "14 products" / "K+S · 11 SKUs" / "بيتا شراكة" appears
   - Every page where "مُشغّل، لا بيت ماركة" or "operator, not a brand house" appears
   - Every page rendering `بانتظار تأكيد العميل` placeholders
   - Every page where literal filenames (e.g. `illustrative-hero-canal.jpg`)
     are leaking into rendered UI
   - Every reference to the wrong taxonomy in components, routes, sidebar
     filters, sitemap, meta tags, and structured data

Do not edit anything yet. Output the inventory as part of your plan.

---

## Phase 2 — Produce Plan 6

Create `docs/superpowers/plans/plan-6-remediation.md` that maps every fix to
specific files. The plan must be detailed enough that the user can review
without you starting work. Structure it as one section per error category
below, with this template per section:

```
### Error N — <title>
**Current state:** <what the build shows now, with file refs>
**Target state:** <what it should show, with source-of-truth refs>
**Files to edit:** <list with paths>
**Files to create:** <list with paths>
**Files to delete:** <list with paths>
**Tests affected:** <list>
**Risk / blast radius:** <low/medium/high + what could break>
```

The seven error categories to plan against:

### Error 1 — Product taxonomy is wrong

- **Current:** 14-product flat catalog with "K+S · 11 SKUs" framing on `/products`
- **Target:** 3 top-level product lines:
  - **Seeds (البذور)** → Vegetable Seeds (East West / Thailand) + Forage Crop Seeds (Barenbrug / Australia)
  - **Fertilizers (الأسمدة)** → K+S (Germany) + Agro Dragon (Netherlands)
  - **Pesticides (المبيدات)** → Insecticides + Herbicides + Fungicides
- Migrate `src/data/pesticides.json` verbatim — keep all 16 SKUs (p1–p16) across 3 subcategories
- Migrate `src/data/fertilizers.json` with cleanup: **DELETE** `f1` (generic placeholder) and **DELETE** one of `f3`/`f8` (duplicates) — keep f3/f4/f5/f6/f7/f9
- Add Vegetable Seeds scaffold (East West Seeds, Thailand) with "varieties pending from client" empty state — do not fabricate cultivars
- Add Agro Dragon fertilizers scaffold with "products pending from client" empty state
- Add the 3 Barenbrug forage varieties from Section 3.2 of the source of truth
- Update: `/products` index, `/products/[line]`, `/products/[line]/[subcategory]`, sidebar filters, breadcrumbs, SKU counters, sitemap, structured data, meta tags

### Error 2 — Invented brand frame must be removed

- **Delete every instance of:**
  - `مُشغّل، لا بيت ماركة` (operator, not a brand house)
  - `بيتا شراكة` (2 partner houses)
  - "operator not brand" / similar EN equivalents
  - Any copy implying Zagros is anything other than the brand customers buy
- **Replace with positioning from Section 3 of the source of truth:** Sudan's trusted agricultural-inputs partner since 2010, 6 branches, 7+ international suppliers, full-input portfolio (seeds + fertilizers + pesticides)
- Update: hero copy on `/` and `/about`, meta descriptions for every route, OG tags, AR/EN translation files

### Error 3 — About page placeholders where data exists

- **Replace `بانتظار تأكيد العميل` with real data on these sections:**
  - Branches → use the 6 real branches from Section 5 (Khartoum HQ, Port Sudan, Al Qadarif, Al Managil, Ad-Damar, Ad-Daba) with map URLs
  - Founded date → display "تأسست 2010" / "Established 2010" prominently
  - Staff size → "~50 employees" / "~50 موظف"
  - Working hours → Sunday–Thursday 8:00 AM – 5:00 PM
  - Services → from Section 1 + the suggested seeds addition
  - Subsidiary note → "subsidiary of Zagros Group"
- **Keep "pending" state ONLY for items in Section 11 of the source of truth that are flagged as gaps:**
  - Team photos and leadership names
  - Certifications and memberships beyond "International Agricultural Trade Association"
  - Branch full street addresses
  - Founding-story narrative

### Error 4 — Customer references missing

- Add a Customers section (recommend: dedicated `/customers` route + logo strip on `/`)
- Use all 6 customers from Section 7 of the source of truth, with AR names:
  - Ministry of Agriculture & Natural Resources Sudan / وزارة الزراعة و الموارد الطبيعية السودان → `ministry-of-agriculture.svg`
  - Alrajihi Agriculture Project / مشروع الراجحي الزراعي → `alrajihi.svg`
  - Amtar Agriculture Project / مشروع امطار الزراعي → `amtaar.svg`
  - Dal Agriculture / دال الزراعية → `dal.svg`
  - Paramount Agriculture / باراماونت الزراعية → `Paramount.svg`
  - Premier Farm / بريمير فارم → `premier-farm.webp`
- Logo files presumably exist from v1 — check `public/customers/` and v1 build. If not present, leave proper placeholder slots that preserve the visual rhythm and flag the missing files in the plan.

### Error 5 — Suppliers / Partners page rebuild

- **Delete "2 partner houses" framing.**
- Build Partners page using Section 4 of the source of truth — 7 named suppliers, each with logo filename, country, flag, and the line(s) they supply:
  1. East West Seeds International (Thailand 🇹🇭) → `east-west-seeds.webp` → Vegetable Seeds
  2. Barenbrug Australia / Heritage Seeds (Australia 🇦🇺) → `barenbrug.png` → Forage Seeds
  3. K+S / K Plus S Middle East (Germany 🇩🇪) → `k&s.webp` → Fertilizers
  4. Agro Dragon (Netherlands 🇳🇱) → `agro-dragon.webp` → Fertilizers
  5. SAF (Switzerland 🇨🇭) → `saf.webp` → Pesticides — flag "full company name pending"
  6. KZ (United Kingdom 🇬🇧) → `kz.webp` → Pesticides — flag "full company name pending"
  7. Kafr El Zayat Pesticides & Chemical Co. (Egypt 🇪🇬) → logo missing, flag → Pesticides
- The 12 Chinese private-label manufacturers and Mahamaya Lifesciences (India) belong on per-product pages as `Manufacturer` / `Country of Origin` fields, **not** on the Partners page

### Error 6 — Placeholder text leaking into UI

- Audit every route for literal strings like:
  - `illustrative-hero-canal.jpg`
  - `PENDING REAL PHOTO`
  - Any other plan-doc placeholder text rendering as visible page content
- Replace each with a proper empty state component or image placeholder element — never display the raw asset path
- The products catalog page hero is one known instance; find all others

### Error 7 — Contact, phone, and geography corrections

- **Replace both placeholder phone numbers in `src/data/company.ts` with the single real number:** `+249 91 233 8559`
  - Remove the `+249 183 123456` and `+249 183 789012` entries
  - Update `telephones` array to contain only the real number
  - Update `phone` field to the real number
- Format the number for display per locale: `+249 91 233 8559` (EN), `‏+249 91 233 8559‎` (AR with RTL marks if needed)
- Make the number tap-to-call on mobile (`tel:` link) and tap-to-WhatsApp where appropriate (`https://wa.me/249912338559`)
- Leave `email`, `facebook`, `instagram`, `youtube` flagged as "verify with client" — do not invent
- Hero copy on `/` and meta descriptions must foreground **Sudan** as the primary market. Tagline "Leaders in Agric Services" stays
- `src/data/countries.ts` audit: of the 12 countries with `code` ≠ supplier countries, only Sudan is confirmed served. Restructure the data into two arrays:
  - `markets_served`: `["sd"]` initially — flag for client to confirm which others
  - `supplier_countries`: `["de", "nl", "ch", "gb", "au", "th", "cn", "in", "eg", "ae"]`
- Do NOT display "we operate in 12 MENA countries" anywhere — that's aspirational, not factual

---

## Phase 3 — Wait for plan approval

Stop after producing `plan-6-remediation.md`. Do not start editing. The user
will review the plan and respond with approval, revisions, or questions.

---

## Phase 4 — Execute the plan

Once approved:

1. Work through the 7 error categories **in order** (taxonomy first because
   everything else depends on it)
2. Commit per error category with messages like:
   `plan-6: error 1 — rebuild product taxonomy (3 lines, migrate v1 data)`
3. Tag the final commit `plan-6-remediation` when all 7 are done
4. Update `AGENTS.md` to point at `ZAGROS_SOURCE_OF_TRUTH.md` as the canonical
   data source for all future product/copy/data work. Add this line near the top:
   > **Source of truth for all Zagros product, brand, company, and supplier
   > data:** `ZAGROS_SOURCE_OF_TRUTH.md` at project root. Read it before any
   > content, copy, or data work. Do not invent facts not in this doc.

---

## Phase 5 — Verification before push

Before any push to remote, all of the following must be true:

- [ ] All 47 existing tests still green; new tests added for the data-shape changes
- [ ] `npm run build` clean, no type errors
- [ ] Visual smoke check on every route (locale-paired):
  - [ ] `/` and `/en/` — hero foregrounds Sudan, no "14 products" / "2 partner houses"
  - [ ] `/about` and `/en/about` — branches populated, founded 2010 shown, no leaking placeholders
  - [ ] `/products` and `/en/products` — 3 lines visible, real SKU counts per line
  - [ ] `/products/pesticides` — 3 subcategories with 16 SKUs total
  - [ ] `/products/fertilizers` — K+S + Agro Dragon split, 6 K+S SKUs after dedup
  - [ ] `/products/seeds` — Vegetable + Forage subs, Barenbrug varieties present
  - [ ] `/partners` and `/en/partners` — 7 suppliers, not 2
  - [ ] `/customers` and `/en/customers` — 6 real customers
  - [ ] `/contact` and `/en/contact` — real phone number, no placeholders for fields you didn't fix
- [ ] No literal filenames (`*.jpg`, `*.png`) rendering as visible text anywhere
- [ ] No `"14 منتجاً"` / `"بيتا شراكة"` / `"مُشغّل، لا بيت ماركة"` strings anywhere in build output
- [ ] grep the build output for `بانتظار تأكيد العميل` — every remaining instance must correspond to a genuine gap from Section 11 of the source of truth, not data that already exists in v1
- [ ] AR and EN locale parity — every fix lands in both translation files
- [ ] AGENTS.md updated to point at source of truth

Report verification status before any push. Do not push until the user reviews.

---

## Hard constraints

1. **Do not invent content.** If a fact isn't in `ZAGROS_SOURCE_OF_TRUTH.md`,
   either flag it as a gap (Section 11 list) or leave a clean empty state.
   Plausible-sounding placeholder copy is worse than visible "pending client"
   markers — placeholders signal the gap; invented copy hides it.
2. **Do not keep any "operator / brand house" or "2 partner houses" framing.**
   Anywhere. Hero, about, partners, meta, OG, footer, anywhere.
3. **Do not discard the working design system, components, build pipeline, or
   i18n setup from plans 1–5.** Only content, data, copy, and brand frame are
   wrong. The shell is fine.
4. **Do not push to remote during this remediation.** User reviews then pushes.
5. **Do not create new `بانتظار تأكيد العميل` content where data already
   exists.** Cross-check every placeholder against the source of truth before
   leaving it in.
6. **Do not display aspirational geographic claims.** Sudan is the confirmed
   market. The other MENA countries in `countries.ts` are pending client
   confirmation — show them only as supplier-country flags on the Partners
   page, not as "markets we serve."
7. **The data files in `src/data/` from v1 are authoritative for products.**
   Do not regenerate them — migrate verbatim with the documented dedup
   (delete `f1`, delete one of `f3`/`f8`).

---

## Definition of done

The branch is ready to merge to main when:

- All 7 error categories in Phase 2 are addressed and verified
- Plan 6 doc exists at `docs/superpowers/plans/plan-6-remediation.md`
- `plan-6-remediation` git tag points at the completion commit
- AGENTS.md updated to enshrine the source-of-truth doc
- Verification checklist in Phase 5 is complete
- Remaining gaps are listed in a short `REMAINING_GAPS.md` at project root,
  mirroring Section 11 of the source-of-truth doc, so the user knows exactly
  what to ask the client for after the demo

---

**Start with Phase 1. Read the source of truth, then produce Plan 6. Stop and
wait for approval before any edits.**
