# ZAGROS TRADING — Website Source of Truth (v2)

> **Purpose:** Single canonical reference for rebuilding the Zagros Trading
> website. Claude Code should read this on every session before generating
> product pages, components, copy, or data files.
>
> **Compiled:** 2026-05-11
> **Source materials:**
> - v1 production data files (`src/data/company.ts`, `pesticides.json`, `fertilizers.json`, `countries.ts`)
> - 11 K+S product brochures (PDF, Arabic) + 3 Barenbrug forage seed datasheets
> - Logo tagline ("Zagros Trading — Leaders in Agric Services")
>
> **Status:** Replaces v1 of this doc, which incorrectly treated 11 K+S
> brochures + 3 Barenbrug seeds as the full Zagros catalog. Reality is
> larger and structured differently.

---

## 🚨 CRITICAL — what the v2 website build got wrong, must fix

The redesign branch (`feature/redesign-v2-foundation`) currently has these
fundamental data and positioning errors that came from working off the v1
source-of-truth doc instead of v1's actual data files:

1. **Wrong product count** — page says "14 منتجاً" / "K+S · 11 SKUs". Real
   catalog has **3 product lines** with ~30+ SKUs total (16 pesticides, ~7-12
   fertilizers, multiple seed varieties from 2 suppliers).
2. **Pesticides line missing entirely** — this is 16 SKUs across insecticides,
   herbicides, and fungicides. Completely absent from current build.
3. **Vegetable seeds line missing entirely** — East West Seeds International
   (Thailand) supplies vegetable seeds. Currently conflated with forage seeds.
4. **Invented positioning** — "مُشغّل، لا بيت ماركة" (operator, not a brand
   house) and "بيتا شراكة" (2 partner houses) frames are not from any source.
   Zagros has 7+ international supplier partnerships, not 2.
5. **About page placeholders** — branches, team, certifications, customers
   showing "بانتظار تأكيد العميل" when **all of this data exists in v1**.
6. **Customer list ignored** — 6 real customer references (Ministry of
   Agriculture Sudan, Alrajihi, Amtar, Dal, Paramount, Premier Farm) sitting
   in `customers` array of v1, not surfaced.
7. **Placeholder text leaking into UI** — `illustrative-hero-canal.jpg`
   rendering as visible text on a page.
8. **Geographic positioning wrong** — current copy hints at MENA-regional
   distributor. Reality: Sudan-based with 6 branches in Sudan, sourcing from
   global suppliers.

The Claude Code remediation prompt at the end of this doc fixes all of the
above.

---

## ✅ SECTION 1 — Verified company facts (from v1 data)

```yaml
legal_name:     Zagros Trading
legal_name_ar:  تجارة زاغروس
tagline_en:     Leaders in Agric Services
tagline_ar:     [TO CONFIRM — propose: "روّاد الخدمات الزراعية"]
specialization: Your trusted partner in agricultural solutions
specialization_ar: شريكك الموثوق في الحلول الزراعية
established:    2010
country_hq:     Sudan
city_hq:        Khartoum (Khartoum Bahry)
subsidiary_of:  Zagros Group
membership:     International Agricultural Trade Association
staff_count:    ~50
working_hours:  Sunday–Thursday, 8:00 AM – 5:00 PM
```

### Brand description (from v1, ready to reuse)

**EN:**
> Zagros Trading is a leading agricultural solutions provider, offering
> high-quality fertilizers and pesticides to enhance crop productivity and
> sustainable farming practices.

**AR:**
> زاغروس للتجارة هي شركة رائدة في مجال الحلول الزراعية، تقدم أسمدة ومبيدات
> عالية الجودة لتحسين إنتاجية المحاصيل وممارسات الزراعة المستدامة.

> ⚠️ This description omits the **seeds** product line. Should be updated to:
> "...offering high-quality **seeds, fertilizers, and pesticides**..."
> AR: "...تقدم **بذور وأسمدة ومبيدات** عالية الجودة..."

### Services (from v1)

- Agricultural Consultancy — استشارات زراعية
- Premium Fertilizers — أسمدة متميزة
- Pest Control Solutions — حلول مكافحة الآفات
- (suggested addition) Quality Seeds — بذور عالية الجودة

### Distribution network (from v1)

> Extensive distribution network covering major agricultural regions across
> Sudan, with strategic partnerships enabling efficient delivery of products
> to farmers nationwide.

---

## ⚠️ SECTION 2 — Likely placeholders to verify before launch

These values from v1 look like placeholders. Confirm with client before
publishing:

| Field | v1 Value | Status |
|---|---|---|
| Phone 1 | +249 183 123456 | ❌ Sequential digits — placeholder |
| Phone 2 | +249 183 789012 | ❌ Sequential digits — placeholder |
| Email | info@zagros-agriculture.com | ⚠️ Verify domain ownership |
| Facebook | facebook.com/zagrosagri | ⚠️ Verify account exists |
| Instagram | instagram.com/zagrosagri | ⚠️ Verify account exists |
| YouTube | youtube.com/@zagrosagri | ⚠️ Verify account exists |
| Branch addresses | Only city names listed | ⚠️ Need full street addresses |
| Tagline AR | not in v1 | ❌ Need from client |

### Open data questions

- Real WhatsApp business number? (Sudan ag sector relies heavily on WhatsApp)
- Logo files: SVG + dark/light variants?
- Brand color palette beyond the gold/cream/dark scheme visible in current build?
- Founding story for "About" page?
- Leadership names + photos (current build has empty team section)?
- Any local certifications/registrations to display?

---

## SECTION 3 — Brand identity

**Positioning (recommended):**
> Zagros Trading is Sudan's trusted partner for agricultural inputs,
> connecting Sudanese farmers to premium seeds, fertilizers, and pesticides
> from world-leading manufacturers across Europe, Asia, and the Middle East.
> Since 2010, six branches across Sudan have served farms ranging from
> ministry-scale projects to family operations with consultancy, distribution,
> and after-sales support.

**Differentiators:**
1. **15-year track record** since 2010
2. **Six-branch national network** — Khartoum HQ + Port Sudan, Al Qadarif, Al Managil, Ad-Damar, Ad-Daba
3. **Diverse supplier portfolio** — 7+ international partnerships across 6
   countries (Germany, Netherlands, Switzerland, UK, Australia, Thailand,
   Egypt) plus private-label manufacturing partnerships in China and India
4. **Full input portfolio** — only Sudanese distributor providing all three
   input categories (seeds, fertilizers, pesticides) under one roof
5. **Ministry-grade trust** — sole/primary supplier engagements with the
   Sudanese Ministry of Agriculture and major commercial farms (Alrajihi,
   Dal, Paramount, Premier)

**Voice:**
- Technical, agronomically credible — this is B2B, not consumer
- Bilingual Arabic-first, English secondary (Sudan market is Arabic-dominant)
- Specs-forward — N-P-K numbers, active ingredient %, application rates
- Trust signals heavy — supplier logos, customer references, branch network

**What the brand is NOT:**
- ❌ Not a manufacturer (do not imply Zagros makes anything)
- ❌ Not "an operator, not a brand house" — Zagros IS the brand the customer
  buys; suppliers are upstream credentials
- ❌ Not a regional MENA distributor — Sudan-focused with imports from abroad

---

## SECTION 4 — Supplier partnerships (international linkages)

Zagros sources from these international partners. Each supplier should
appear in "Partners" section with their logo + country flag + the line(s)
they supply.

| # | Supplier | Country | Logo file (v1) | Supplies | Status |
|---|---|---|---|---|---|
| 1 | **East West Seeds International** | Thailand 🇹🇭 | `east-west-seeds.webp` | Vegetable seeds | Active |
| 2 | **Barenbrug Australia (Heritage Seeds)** | Australia 🇦🇺 | `barenbrug.png` | Forage crop seeds | Active |
| 3 | **K+S (K Plus S Middle East FZE)** | Germany 🇩🇪 (Dubai office) | `k&s.webp` | Fertilizers (premium water-soluble) | Active |
| 4 | **Agro Dragon** | Netherlands 🇳🇱 | `agro-dragon.webp` | Fertilizers (organic / specialty?) | ⚠️ confirm |
| 5 | **SAF** | Switzerland 🇨🇭 | `saf.webp` | Pesticides | ⚠️ confirm full name |
| 6 | **KZ** | United Kingdom 🇬🇧 | `kz.webp` | Pesticides | ⚠️ confirm full name |
| 7 | **Kafr El Zayat Pesticides & Chemical Co.** | Egypt 🇪🇬 | (needs logo) | Pesticides (Malathion / "Malason") | Active per product data |
| 8 | **Chinese private-label manufacturers** | China 🇨🇳 | (multiple) | Pesticides (private-label under Agro/Agri/Or prefixes) | Active per product data |
| 9 | **Mahamaya Lifesciences** | India 🇮🇳 | (needs logo) | Pesticides (Pendimethalin) | Active per product data |

### Chinese private-label manufacturer list (from pesticide product data)

Zagros imports active ingredients/formulations from these Chinese partners
and rebrands under its own labels (Agromectin, Oraselect, etc.):

1. Zhejiang Oianjiang Biochemical Co. Ltd
2. Shandong Cynda Chemical Co. Ltd
3. Anhui Fengle Agrochemical Co. Ltd
4. Jiangsu CF Agrochemical Co. Ltd
5. Jiangsu Fengshan Group Co. Ltd
6. Shandong Vicome Greenland Chemical Co. Ltd
7. Anhui Sida Pesticides Chemicals Co. Ltd
8. Jiangsu Yongan Chemical Co. Ltd
9. Changzhou Wujin Henglong Pesticide Co. Ltd
10. Shanghai Hujiang Biochemical Co. Ltd
11. Limin Chemical Co. Ltd
12. Jiangsu Greenscie Chemical Co. Ltd

> **IA recommendation:** Show top-tier branded suppliers (East West, Barenbrug,
> K+S, Agro Dragon, SAF, KZ, Kafr El Zayat) prominently on Partners page with
> logos. The Chinese manufacturers are upstream sources for private-label
> products — surface them per-product as "Manufacturer" / "Country of Origin"
> on product detail pages, not on Partners page.

---

## SECTION 5 — Branches & contact

### Headquarters

```
Zagros Trading Enterprises
Khartoum Bahry Industrial Zone
Block No. 8, Plot 1/3
Khartoum, Sudan
```

### Full branch network (6 locations, all in Sudan)

| # | City (EN) | City (AR) | Type | Map query |
|---|---|---|---|---|
| 1 | Khartoum | الخرطوم | Headquarters / المقر الرئيسي | `Khartoum,Sudan` |
| 2 | Port Sudan | بورتسودان | Branch / فرع | `Port+Sudan,Sudan` |
| 3 | Al Qadarif | القضارف | Branch / فرع | `Al+Qadarif,Sudan` |
| 4 | Al Managil | المناقل | Branch / فرع | `Al+Managil,Sudan` |
| 5 | Ad-Damar | الدامر | Branch / فرع | `Ad-Damar,Sudan` |
| 6 | Ad-Daba | الدبة | Branch / فرع | `Ad-Daba,Sudan` |

### Contact (verify all before publish)

```
Phone:     +249 183 123456     # ❌ placeholder
Phone:     +249 183 789012     # ❌ placeholder
Email:     info@zagros-agriculture.com   # ⚠️ verify
Hours:     Sunday – Thursday, 8:00 AM – 5:00 PM

Facebook:  facebook.com/zagrosagri        # ⚠️ verify
Instagram: instagram.com/zagrosagri       # ⚠️ verify
YouTube:   youtube.com/@zagrosagri        # ⚠️ verify
```

---

## SECTION 6 — Country presence (from v1 countries.ts)

Markets the site signals presence in (Sudan-focused with regional reach):

**Primary market:** Sudan 🇸🇩

**Regional MENA listed in v1:** Egypt, Saudi Arabia, UAE, Qatar, Kuwait, Oman, Bahrain,
Jordan, Lebanon, Iraq, Yemen
> ⚠️ Confirm: is Zagros actively shipping/selling to these markets, or are
> these aspirational? If aspirational, separate "Markets served" from
> "Future expansion."

**Supplier countries (signal credibility, not sales):** Germany, Netherlands,
Switzerland, UK, Australia, Thailand, China, India, Egypt

---

# PRODUCT CATALOG (3 LINES)

## LINE 1 — Pesticides (المبيدات)

**Category description (v1):**
- EN: Products used to control pests, weeds, and diseases.
- AR: منتجات تستخدم للسيطرة على الآفات، الأعشاب الضارة، والأمراض.

**Brand naming convention (Zagros private labels):**
- `Agro-` / `Agri-` prefix: Agro-named line (Agromectin, Agroharvest, Agronos, Agrimethalin, Agrisuit, AgriTop, Agreflan)
- `Or-` prefix: Or-named line (Oraselect, Orazine, Oruzin, Oranoset, Orafen, Orastrobin)
- Standalone brands: Malason (Egyptian source), Mancoxyl, Pendinos

**Total: 16 SKUs across 3 subcategories.**

### 1.1 Insecticides (مبيدات حشرية) — 2 SKUs

#### p1 · Malason (ملاسون)
| Field | Value |
|---|---|
| Code | Malason 57% EC (Malathion) |
| Type | Insecticide / مبيد حشري |
| Form | Emulsifiable Concentrate / سائل مركز قابل للاستحلاب |
| AI | 570 g/L Malathion |
| Manufacturer | Kafr El Zayat Pesticides & Chemical Co. Ltd |
| Origin | Egypt 🇪🇬 |
| Image | `/products/malason.webp` |

- **Description (EN):** Non-systemic insecticide that works by contact and stomach poison with respiratory action. Controls insect pests in field/horticultural crops and stored products.
- **Description (AR):** مبيد حشرى غير جهازى يعمل بالملامسة و كسم معدي و له تأثير تنفسي. يكافح الآفات في المحاصيل الحقلية والبستانية ومخازن المنتجات.
- **Recommendation:** For onion rabbit pests: 2 liters per acre. / لمكافحة حشرة الأرنب في البصل: 2 لتر للفدان.
- **Efficacy:** High efficacy in controlling onion pests, increasing productivity.

#### p2 · Agromectin (أقرومكتين)
| Field | Value |
|---|---|
| Code | Agromectin 1.8% EC (Abamectin) |
| Type | Insecticide / Acaricide |
| Form | Emulsifiable Concentrate |
| AI | 18 g/L Abamectin |
| Manufacturer | Zhejiang Oianjiang Biochemical Co. Ltd |
| Origin | China 🇨🇳 |
| Image | `/products/Agromectin.webp` |

- **Description (EN):** Contact insecticide and acaricide with stomach poison effect. Controls African bollworms and spider mites.
- **Description (AR):** مبيد حشرات/عناكب يعمل بالملامسة مع تأثير معدى. يكافح دودة اللوز الأفريقية والعناكب.
- **Recommendation:** For African bollworms in tomatoes: 113 ml per acre.
- **Efficacy:** Reduces infected fruits and boosts marketable yield.

### 1.2 Herbicides (مبيدات أعشاب) — 12 SKUs

#### p3 · Oraselect (أوراسلكت)
- **Code:** Oraselect 24% EC (Clethodim) · 240 g/L Clethodim
- **Manufacturer:** Shandong Cynda Chemical Co. Ltd · China 🇨🇳
- **Description:** Selective post-emergence herbicide for annual/perennial grassy weeds.
- **AR:** مبيد أعشاب انتقائي بعد الإنبات للأعشاب النجيلية.
- **Use:** Alfalfa — post-emergence control of grassy weeds.
- **Image:** `/products/Oraselect.webp`

#### p4 · Agroharvest (أقروهارفست)
- **Code:** Agroharvest 10.8% EC (Haloxyfop-P-methyl) · 108 g/L
- **Manufacturer:** Anhui Fengle Agrochemical Co. Ltd · China 🇨🇳
- **Description:** Selective post-emergence herbicide for narrow-leaf weeds in perennial crops.
- **AR:** مبيد أعشاب انتقائي بعد الإنبات للأعشاب رفيعة الأوراق.
- **Use:** Sesame — 0.3 L/acre, applied 3 weeks pre-planting.
- **Image:** `/products/Agroharvest.webp`

#### p5 · Agronos (أقرونوس)
- **Code:** Agronos 600 SL (2,4-D) · 600 g/L
- **Manufacturer:** Jiangsu CF Agrochemical Co. Ltd · China 🇨🇳
- **Form:** Soluble Liquid
- **Description:** Systemic herbicide for post-emergence control of broadleaf weeds in corn/wheat.
- **AR:** مبيد أعشاب جهازي بعد الإنبات للأعشاب عريضة الأوراق.
- **Use:** Corn 0.533 L/acre (3-4 weeks post-planting); Wheat 1 L/acre (3 weeks post-planting).
- **Image:** `/products/Agronos.webp`

#### p6 · Agreflan (أقرفلان)
- **Code:** Agreflan 48% EC (Trifluralin) · 480 g/L
- **Manufacturer:** Jiangsu Fengshan Group Co. Ltd · China 🇨🇳
- **Description:** Pre-emergence herbicide for annual narrow/broadleaf weeds.
- **AR:** مبيد أعشاب قبل الإنبات للأعشاب الحولية.
- **Use:** Clover — 0.84 L/acre with soil plowing.
- **Image:** `/products/Agreflan.webp`

#### p7 · Orazine (أورازين)
- **Code:** Orazine 50% SC (Atrazine) · 500 g/L
- **Manufacturer:** Shandong Vicome Greenland Chemical Co. Ltd · China 🇨🇳
- **Form:** Suspension Concentrate
- **Description:** Systemic herbicide for pre/post-emergence control of annual weeds in corn.
- **AR:** مبيد أعشاب جهازي قبل وبعد الإنبات للمحاصيل مثل الذرة.
- **Use:** Corn — 0.5 L/acre.
- **Image:** `/products/Orazine.webp`

#### p8 · Agrimethalin (أقريمثالين)
- **Code:** Agrimethalin 50% EC (Pendimethalin) · 500 g/L
- **Manufacturer:** Mahamaya Lifesciences PVT Ltd · India 🇮🇳
- **Description:** Pre-emergence herbicide for cotton, peanuts, sunflower, sesame, sugarcane, onions.
- **AR:** مبيد أعشاب قبل الإنبات لمكافحة الحشائش في محاصيل مثل القطن.
- **Use:** Peanuts 1.5 L/acre; Cotton 1.2 L/acre mixed with Dirone.
- **Image:** `/products/Agrimethalin.webp`

#### p9 · Agrisuit (أقريسوت)
- **Code:** Agrisuit 10% SL (Imazethapyr) · 100 g/kg
- **Manufacturer:** Shandong Cynda Chemical Co. Ltd · China 🇨🇳
- **Form:** Soluble Liquid
- **Description:** Systemic herbicide for pre/post-emergence control of broadleaf weeds like clover.
- **AR:** مبيد أعشاب جهازي قبل وبعد الإنبات لمكافحة البرسيم.
- **Use:** Clover — 320 ml/acre.
- **Image:** `/products/Agrisuit.webp`

#### p10 · AgriTop (أقريتوب)
- **Code:** AgriTop 8% EC (Clodinafop-propargyl) · 80 g/kg
- **Manufacturer:** Anhui Sida Pesticides Chemicals Co. Ltd · China 🇨🇳
- **Description:** Systemic post-emergence herbicide for annual grassy weeds like nutgrass.
- **AR:** مبيد أعشاب جهازي بعد الإنبات للأعشاب النجيلية الحولية.
- **Use:** Wheat — 420 ml/acre (3-4 weeks post-planting).
- **Image:** `/products/AgriTop.webp`

#### p11 · Pendinos (بندينوس)
- **Code:** Pendinos 50% EC (Pendimethalin) · 500 g/L
- **Manufacturer:** Jiangsu Yongan Chemical Co. Ltd · China 🇨🇳
- **Description:** Pre-emergence herbicide for onions, cotton, and other crops.
- **AR:** مبيد أعشاب قبل الإنبات للبصل والقطن وغيرها.
- **Use:** Onions — 1.5 L/acre.
- **Image:** `/products/Pendinos.webp`

#### p12 · Oruzin (أوروزين)
- **Code:** Oruzin 70% WP (Metribuzin) · 700 g/kg
- **Manufacturer:** Changzhou Wujin Henglong Pesticide Co. Ltd · China 🇨🇳
- **Form:** Wettable Powder
- **Description:** Systemic herbicide absorbed by roots/leaves. Controls annual weeds in potatoes, tomatoes, and clover.
- **AR:** مبيد أعشاب جهازي يُمتص بالجذور/الأوراق. يكافح الأعشاب الحولية.
- **Use:** Potatoes — 700 g/acre pre-emergence.
- **Image:** `/products/Oruzin.webp`

#### p13 · Oranoset (أورانوسيت)
- **Code:** Oranoset 36% SL (Glyphosate) · 360 g/L
- **Manufacturer:** Shanghai Hujiang Biochemical Co. Ltd · China 🇨🇳
- **Form:** Soluble Liquid
- **Description:** Non-selective systemic herbicide for broadleaf/grassy weeds.
- **AR:** مبيد أعشاب غير انتقائي يدمر الأعشاب عريضة/رفيعة الأوراق.
- **Use:** Zero-tillage farming — 1.5–2.0 L/acre.
- **Image:** `/products/Oranoset.webp`

#### p14 · Orafen (أورافن)
- **Code:** Orafen 24% EC (Oxyfluorfen) · 240 g/L
- **Manufacturer:** Shandong Vicome Greenland Chemical Co. Ltd · China 🇨🇳
- **Description:** Pre-emergence herbicide for onions, cotton, and potatoes.
- **AR:** مبيد أعشاب قبل الإنبات للبصل والقطن والبطاطس.
- **Use:** Onions — 0.5 L/acre.
- **Image:** (missing — needs asset)

### 1.3 Fungicides (مبيدات فطرية) — 2 SKUs

#### p15 · Mancoxyl (مانوكسيل)
- **Code:** Mancoxyl 72% WP (Mancozeb + Metalaxyl) · 640 g/kg Mancozeb + 80 g/kg Metalaxyl
- **Manufacturer:** Limin Chemical Co. Ltd · China 🇨🇳
- **Form:** Wettable Powder
- **Description:** Systemic fungicide with protective/curative properties. Controls powdery mildew, downy mildew, and blight.
- **AR:** مبيد فطريات جهازي وقائي/علاجي. يكافح البياض الدقيقي والزغبي والندوة.
- **Use:** Tomatoes — 850 g/100 L water for powdery mildew.
- **Image:** (missing — needs asset)

#### p16 · Orastrobin (أوراستروبين)
- **Code:** Orastrobin 25% SC (Azoxystrobin) · 250 g/L
- **Manufacturer:** Jiangsu Greenscie Chemical Co. Ltd · China 🇨🇳
- **Form:** Suspension Concentrate
- **Description:** Systemic fungicide with protective, curative, and eradicative action. Controls powdery mildew, blight, and downy mildew.
- **AR:** مبيد فطريات جهازي وقائي/علاجي/استئصالي. يكافح البياض الدقيق والندوة.
- **Use:** Tomatoes — 200 ml/100 L water.
- **Image:** (missing — needs asset)

---

## LINE 2 — Fertilizers (الأسمدة)

**Category description (v1):**
- EN: Products providing essential nutrients for optimal plant growth.
- AR: منتجات توفر العناصر الغذائية الأساسية للنباتات.

**Status of catalog:** v1 listed 9 fertilizer entries but had **f1 as a
generic placeholder** and **f3/f8 as duplicates**. After dedup, 7 unique K+S
SKUs from v1. I also have brochures for **5 additional K+S SKUs** not in v1
(soluUP, soluMAP, soluMKP, soluAMS Premium, soluCN) — confirm with client
whether Zagros stocks these.

> ⚠️ **Decision needed:** Are the 5 K+S SKUs from brochures (soluUP, soluMAP,
> soluMKP, soluAMS, soluCN) part of the Zagros catalog, or were brochures
> shared for context only? If carried — total K+S fertilizers = 12. If not
> carried — total K+S fertilizers = 7. Add Agro Dragon SKUs on top.

### 2.1 K+S fertilizers — confirmed in v1 catalog (7 SKUs)

All K+S products are **25 kg bags**, water-soluble, from **K Plus S Middle
East FZE DMCC, Dubai**.

#### f3 · soluNPK 20-20-20+TE
- **Composition:** 20% N · 20% P₂O₅ · 20% K₂O + chelated trace elements
- **Type:** 100% water-soluble compound fertilizer
- **AR composition:** 20% نيتروجين، 20% فوسفور، 20% بوتاسيوم + عناصر صغرى
- **Description (EN):** High-quality water-soluble fertilizer for balanced crop nutrition. Use for foliar, fertigation, and soil application.
- **Description (AR):** سماد ذائب في الماء ذو جودة عالية لتغذية متوازنة.
- **Application:**
  - Vegetables (tomato, cucumber, pepper, eggplant, watermelon): foliar 10-20 g/L · fertigation 5-6 kg/day/ha
  - Fruit trees (citrus, mango, banana, date palm): foliar 20-30 g/L · fertigation 8-10 kg/day/ha
- **Positioning:** Balanced general-purpose, from seedling through flowering.

#### f4 · soluNOP (Potassium Nitrate, 13-0-46)
- **Composition:** 13% N (nitrate form) · 46% K₂O · chloride-free · sodium-free · near-neutral pH
- **AR composition:** 100% نترات البوتاسيوم
- **Description (EN):** Premium chloride-free potassium nitrate. Ideal for salinity-sensitive crops and saline soil/water. Suitable for greenhouse, open field, and hydroponics.
- **Description (AR):** نترات بوتاسيوم نقية للرش الورقي والتسميد بالري.
- **Hazard:** UN 1486 / Class 5.1 oxidizer
- **Application:**
  - Vegetables (tomato, potato, onion, cucurbits): 3-5 × 1-1.5 kg/donum during flowering & early fruit
  - Fruit (mango, citrus, banana, palm): 1-1.5 kg/donum each cycle post-flowering
  - Cereals — foliar: 3-5 g/L at heading stage
- **Key benefit:** Increases fruit size, reduces cracking, improves quality. Reduces chloride uptake in saline conditions.

#### f5 · KaliSOP gran (Potassium Sulphate, granular)
- **Composition:** 50% K₂O (= 41.5% K) water-soluble · 45% SO₃ (= 18% S) water-soluble · Cl max 1.0%
- **AR composition:** 50% كبريتات البوتاسيوم، 45% أكسيد البوتاسيوم، كلوريد ≤1.0%
- **Certification:** EU Organic (EU 2018/848 + EC 889/2008)
- **Description (EN):** Granular potassium fertilizer for cereals, vegetables, and fruits. Chloride-free SOP, ideal for high-pH soils and salt-sensitive crops.
- **Description (AR):** سماد بوتاسيوم حبيبي للمحاصيل الحقلية والخضروات والفواكه.
- **Application (per v1):** Cereals 250-300 kg/ha · Vegetables 200-250 kg/ha · Fruits 100-150 kg/ha
- **Application (per brochure, feddan-based):** Fruit trees 125-250 kg/feddan · Vegetables 75-250 kg/feddan · Cereals 100-150 kg/feddan
> ⚠️ Unit reconciliation needed — v1 uses ha, brochure uses feddan. Pick one and apply consistently.

#### f6 · KaliSOP fine (Potassium Sulphate, fine powder)
- **Composition:** 50% K₂O · 45% SO₃ · Cl max 1.0% (brochure label) — note v1 says 0.1%
- **AR composition:** 50% كبريتات البوتاسيوم، 45% أكسيد البوتاسيوم، كلوريد ≤0.1%
- **Certification:** EU Organic
- **Description (EN):** Fine-grade potassium fertilizer for precision application. Premium K+S source for high-value cash crops.
- **Description (AR):** سماد بوتاسيوم ناعم للتطبيق الدقيق.
- **Application (per v1):** Cereals 600-800 kg/ha · Vegetables 400-600 kg/ha · Fruits 250-500 kg/ha
> ⚠️ Chloride spec conflict: brochure body 0.1%, brochure label 1.0%, v1 says 0.1%. Confirm with K+S.

#### f7 · EPSOTop (Magnesium Sulphate)
- **Composition (v1):** 16% MgO · 16% SO₃
- **Composition (brochure):** 16% MgO · **32.5% SO₃** (verify which is correct — brochure spec is from the actual product label)
- **AR composition:** 16% أكسيد المغنيسيوم، 16% ثلاثي أكسيد الكبريت
- **Certification:** EU Organic (EU 2018/848 + EC 889/2008)
- **Description (EN):** Magnesium and sulfur fertilizer to close nutrient gaps. Drives chlorophyll production, supports protein synthesis, improves N-use efficiency.
- **Description (AR):** سماد مغنيسيوم وكبريت لمعالجة نقص العناصر.
- **Application:** 5-10 kg/ha per application · 1-2 kg/ha foliar
- **K-Mg balance:** Maintain K:Mg ratio of 1-2:1

#### f9 · soluNPK 12-12-36+TE
- **Composition:** 12% N · 12% P₂O₅ · 36% K₂O + trace elements (N:P:K ratio 1:1:3)
- **AR composition:** 12% نيتروجين، 12% فوسفور، 36% بوتاسيوم + عناصر صغرى
- **Description (EN):** High-potassium NPK fertilizer for fruiting and flowering crops. Drives yield, fruit quality, size, and color.
- **Description (AR):** سماد NPK عالي البوتاسيوم لمحاصيل الثمار والأزهار.
- **Application:** Fruits 8-10 kg/ha · Vegetables 12-15 kg/ha per application
- **Stage:** Flowering through fruit ripening

> ⚠️ **v1 cleanup:** `f1` (Generic NPK placeholder) should be DELETED.
> `f8` is a duplicate of `f3` — delete one. Renumber if needed.

### 2.2 K+S fertilizers — from brochures, not yet in v1 catalog (5 SKUs)

These I have full brochures for. **Confirm with client whether Zagros stocks
them** — if yes, add to catalog using specs below.

#### soluUP (NP 17-44-00) — Acidic phosphate source
- **Composition:** 17% N (amide) · 44% P₂O₅ water-soluble · pH 1.6-2.0
- **Origin:** China (Beluckey & Wengfu Technology Co., Chengdu) — distributed by K+S
- **Description:** Acidic NP source for pivot irrigation, fertigation, foliar. Ideal from planting through flowering. Safe for high-pH soils and irrigation water (>6.5). Prevents pipe/dripper clogging.
- **AR:** سماد NP حمضي للري المحوري والتسميد بالري والرش الورقي. يحسن امتصاص الفوسفور والعناصر الصغرى.
- **Application:** Foliar 0.5-1.0% early veg, 1.0-2.0% flowering-fruiting · Fertigation 1.5-2.5 kg/feddan early, up to 5 kg/feddan flowering-fruiting
- **⚠️ Do not mix with:** soluCN, EPSO Top
- **Bag:** 25 kg

#### soluMAP (NP 12-61-0)
- **Composition:** 12% N · 61% P₂O₅
- **Description:** High-phosphorus starter fertilizer for early-stage root development. Ideal at planting through flowering.
- **AR:** سماد فوسفور عالي بداية الموسم لتطوير الجذور.
- **Bag:** 25 kg
> ⚠️ Brochure extraction was degraded — verify exact application rates with K+S supplier sheet.

#### soluMKP (Mono Potassium Phosphate, 0-52-34)
- **Composition:** 52% P₂O₅ · 34% K₂O · low EC · low pH (acidic buffer)
- **Formula:** KH₂PO₄
- **Description:** Highest possible P and K concentrations in one soluble product. For fertigation and foliar. Low EC = safe for salt-sensitive crops.
- **AR:** أعلى تركيزات فوسفور وبوتاسيوم في منتج ذائب واحد. آمن للمحاصيل الحساسة للملوحة.
- **Application:** Vegetables 2-3 × 10-15 kg/ha fruiting · Fruits 5-6 × 15-20 kg/ha post-flowering · Foliar 1-3%
- **⚠️ Caution mixing with:** Ca²⁺, Mg²⁺ — tank-mix test first
- **Bag:** 25 kg

#### soluAMS Premium (Ammonium Sulphate, 21N + 24S)
- **Composition:** 21% N (ammoniacal) · 24% S
- **Form:** White crystals
- **Description:** Dual N + S source. Ideal for S-responsive crops (vegetables, fruits, oilseeds). Acidifies alkaline soils → unlocks P, Fe, Mn, Zn uptake.
- **AR:** مصدر مزدوج للنيتروجين والكبريت. مثالي للمحاصيل المستجيبة للكبريت.
- **Application:** Field crops 3 × 125-150 kg/ha · Vegetables 2-3 × 100-150 kg/ha · Fruit trees 2-3 × 250 kg/ha · Foliar 5-10%
- **⚠️ Do not mix with:** Calcium-containing fertilizers, pesticides
- **Bag:** 25 kg

#### soluCN (Calcium Nitrate)
- **Composition:** 15.5% N min · 19.0% Ca min
- **Description:** The only water-soluble calcium source. Easily absorbed via roots and foliage. Critical for calcium deficiency disorders (blossom-end rot, nail-head spot, fruit cracking).
- **AR:** المصدر الوحيد للكالسيوم القابل للذوبان في الماء. ضروري لمعالجة نقص الكالسيوم.
- **Application:** Vegetables 2-3 × 4-5 kg/donum · Fruits 2-3 × 7.5-10 kg/donum · Forages 7.5-15 kg/donum · Field crops 3 × 5-6 kg/donum
- **⚠️ Do not mix with:** Phosphate sources (soluUP, soluMAP, soluMKP), EPSO Top
- **Bag:** 25 kg

### 2.3 Agro Dragon fertilizers
> ⚠️ **Data missing.** v1 lists Agro Dragon (Netherlands) as a fertilizer
> supplier but no specific products are catalogued. Ask client:
> - Which Agro Dragon products does Zagros stock?
> - Are they organic? Specialty? Bulk?
> - Spec sheets / brochures available?

### Compatibility matrix (critical for tank-mixing copy)

| Product | DO NOT MIX WITH |
|---|---|
| soluUP | soluCN (Calcium Nitrate), EPSO Top (Mg Sulphate) |
| soluCN | Phosphate sources (soluUP, soluMAP, soluMKP), EPSO Top |
| EPSO Top | soluCN, soluUP (any P + Ca + Mg combo) |
| soluAMS Premium | Calcium-containing fertilizers, all pesticides |
| soluMKP | Caution with Ca²⁺ and Mg²⁺ — tank-mix test first |
| soluMAP | Same as MKP/UP — caution with Ca and Mg |

**Universal rule:** Always run a tank-mix compatibility test before any new combination.

---

## LINE 3 — Seeds (البذور)

> ⚠️ **Structural decision:** v1's `international_linkages` separates
> `vegetable_seeds` and `forage_crops_seeds` as two subcategories under one
> "Seeds" line. Recommended IA: Seeds is a top-level product line with two
> subcategories matching the supplier split.

### 3.1 Vegetable Seeds (بذور الخضروات)

**Supplier:** East West Seeds International — Thailand 🇹🇭
- Logo: `east-west-seeds.webp`
- Description (EN): Vegetables seeds from Thailand
- Description (AR): بذور الخضروات من تايلاند

> ⚠️ **Specific cultivars / SKU list needed from client.** East West Seeds is
> a major Asian seed breeder — typically supplies hybrid varieties of tomato,
> cucumber, pepper, eggplant, watermelon, melon, squash, okra, bitter gourd,
> long bean. Get exact catalog from client.

### 3.2 Forage Crop Seeds (بذور محاصيل الأعلاف)

**Supplier:** Barenbrug Australia (trading as Heritage Seeds) — Australia 🇦🇺
- Logo: `barenbrug.png`
- Description (EN): Forage crops seeds from Australia
- Description (AR): بذور محاصيل الأعلاف من أستراليا

**Confirmed varieties (from datasheets):**

#### Superfine Rhodes Grass · *Chloris gayana* (Tropical)
- **Category:** Tropical grass / forage
- **Type:** New Katambora type, bred in Australia from Tolgar Rhodes
- **Coating:** AgriCote · **PBR:** Yes
- **Agronomy:** Rainfall 500 mm+ · pH 5.0-8.0 · Soil light to heavy
- **Sowing:** Marginal dryland 4-6 kg/ha · Ideal dryland 8-12 kg/ha · Irrigated 15-25 kg/ha
- **Key features:** Higher leaf-to-stem ratio than Tolgar Rhodes · finer stem · exceptional hay quality · higher salt tolerance than Katambora · nematode-resistant · moderate drought/frost/cool-season tolerance

#### SARDI 10 Series 2 · Highly Active Winter Lucerne
- **Category:** Lucerne (alfalfa)
- **Type:** Winter activity 10 (highly active)
- **Coating:** AL or AgriCote · **PBR:** Yes
- **Agronomy:** Rainfall 500-700 mm+ · pH 4.5-8.5 (CaCl₂) · Most soil types
- **Key features:** Excellent seedling vigor · improved persistence over SARDI 10 · improved leaf retention · suits Mediterranean winter-dominant rainfall
- **Segments:** Year-round hay production · short-term cropping rotations (3-5 yr) · high-intensity dairy

#### Alfamaster Ten · Highly Winter Active Alfalfa
- **Category:** Alfalfa
- **Type:** Winter activity rating 10
- **Origin:** Elite US and Australian selections
- **Coating:** AgriCote or Group AL · **PBR:** Granted
- **Agronomy:** Rainfall 350 mm+ or irrigation · pH 5.2-8.0 · Deep well-drained soils
- **Trial performance (El Centro):** 78 t DM/ha vs CUF101 76 / Siriver 70 · RFV 181.2 vs 179.3 / 175.5
- **Key features:** Fast establishment · superior yr-1 yield · ideal for arid cut-and-carry systems

> ⚠️ **More forage varieties likely exist** — these 3 are from the datasheets
> I have. Barenbrug/Heritage have a wider catalog. Ask client for the full
> SKU list (other lucernes, ryegrass, clover, tropical grasses).

---

## SECTION 7 — Customer references (from v1)

Display as logo wall + names. All 6 from v1 — these are real, do not invent.

| # | Customer EN | Customer AR | Logo file |
|---|---|---|---|
| 1 | Ministry of Agriculture & Natural Resources Sudan | وزارة الزراعة و الموارد الطبيعية السودان | `ministry-of-agriculture.svg` |
| 2 | Alrajihi Agriculture Project | مشروع الراجحي الزراعي | `alrajihi.svg` |
| 3 | Amtar Agriculture Project | مشروع امطار الزراعي | `amtaar.svg` |
| 4 | Dal Agriculture | دال الزراعية | `dal.svg` |
| 5 | Paramount Agriculture | باراماونت الزراعية | `Paramount.svg` |
| 6 | Premier Farm | بريمير فارم | `premier-farm.webp` |

> ⚠️ Logo files presumably exist from v1 build at `public/customers/` or
> similar. Pull them over to v2 build.

---

## SECTION 8 — Recommended Information Architecture (v2)

```
Home (الرئيسية)
├── About Zagros (عن زاغروس)
│   ├── Story (Sudan, est. 2010, 6 branches)
│   ├── Leadership / Team        [needs photos & names]
│   ├── Distribution network     (Sudan map with 6 branches)
│   └── Certifications & memberships
│
├── Products (المنتجات)
│   ├── Seeds (البذور)
│   │   ├── Vegetable Seeds — East West Seeds (Thailand)
│   │   └── Forage Crop Seeds — Barenbrug (Australia)
│   │       ├── Superfine Rhodes Grass
│   │       ├── SARDI 10 Series 2
│   │       └── Alfamaster Ten
│   ├── Fertilizers (الأسمدة)
│   │   ├── K+S Premium Water-Soluble (Germany)
│   │   │   ├── soluNPK 20-20-20+TE
│   │   │   ├── soluNPK 12-12-36+TE
│   │   │   ├── soluNOP (Potassium Nitrate)
│   │   │   ├── KaliSOP gran
│   │   │   ├── KaliSOP fine
│   │   │   ├── EPSOTop
│   │   │   └── [Pending stock confirmation: soluUP, soluMAP, soluMKP, soluAMS, soluCN]
│   │   └── Agro Dragon (Netherlands)
│   │       └── [Product list pending from client]
│   └── Pesticides (المبيدات)
│       ├── Insecticides (مبيدات حشرية)
│       │   ├── Malason (Kafr El Zayat, Egypt)
│       │   └── Agromectin (China)
│       ├── Herbicides (مبيدات أعشاب) — 12 SKUs
│       │   └── Oraselect, Agroharvest, Agronos, Agreflan, Orazine,
│       │       Agrimethalin, Agrisuit, AgriTop, Pendinos, Oruzin,
│       │       Oranoset, Orafen
│       └── Fungicides (مبيدات فطرية)
│           ├── Mancoxyl
│           └── Orastrobin
│
├── Partners (الشركاء)
│   ├── East West Seeds — Thailand
│   ├── Barenbrug / Heritage Seeds — Australia
│   ├── K+S — Germany
│   ├── Agro Dragon — Netherlands
│   ├── SAF — Switzerland
│   ├── KZ — UK
│   └── Kafr El Zayat — Egypt
│
├── Customers (العملاء)         [logo wall + project highlights]
├── Branches / Locations (الفروع) [6-branch Sudan map]
├── Contact (تواصل)
└── Quote Request (اطلب عرض سعر)  [already in nav]
```

### Recommended page-level filters on /products

- **Product line:** Seeds / Fertilizers / Pesticides
- **Subcategory:** (dynamic per line)
- **Supplier / origin country**
- **Crop:** Tomato, Cucumber, Onion, Potato, Cotton, Wheat, Corn, Sorghum, Sesame, Peanut, Sunflower, Alfalfa/Clover, Fruit trees, etc.
- **Application stage** (fertilizers): Planting, vegetative, flowering, fruiting, post-harvest
- **Crop problem** (pesticides): Insects, weeds, fungal disease, specific named pests

---

## SECTION 9 — Structured data — recommended JSON shape

For per-product MDX or JSON entries in `src/data/products/`:

```json
{
  "id": "f3",
  "slug": "solunpk-20-20-20-te",
  "line": "fertilizers",
  "subcategory": "npk-water-soluble",
  "name": {
    "en": "soluNPK 20-20-20+TE",
    "ar": "سولو ان بي كيه 20-20-20 مع عناصر صغرى"
  },
  "brand": "K+S",
  "supplier_id": "k-plus-s",
  "manufacturer": {
    "en": "K Plus S Middle East FZE DMCC",
    "ar": "شركة كاي بلس أس الشرق الأوسط"
  },
  "country_origin": "ae",
  "composition": {
    "en": "20% N · 20% P₂O₅ · 20% K₂O + chelated trace elements",
    "ar": "20% نيتروجين، 20% فوسفور، 20% بوتاسيوم + عناصر صغرى"
  },
  "form": "water-soluble crystalline",
  "packaging": "25 kg",
  "applications": ["foliar", "fertigation", "soil"],
  "crop_stages": ["seedling", "vegetative", "flowering"],
  "crops": [],
  "compatibility": {
    "compatible": "most water-soluble fertilizers",
    "incompatible": [],
    "notes": "Run tank-mix test before new combinations"
  },
  "certifications": [],
  "image": "/products/solunpk-20-20-20.webp",
  "brochure_url": "/downloads/SoluNPK_20-20-20_TEBrochure-AR.pdf"
}
```

For pesticides, use a parallel shape with these additional fields:

```json
{
  "type": { "en": "Insecticide", "ar": "مبيد حشري" },
  "form": { "en": "Emulsifiable Concentrate", "ar": "سائل مركز قابل للاستحلاب" },
  "active_ingredient": "Malathion",
  "active_ingredient_content": { "en": "570 g/L", "ar": "570 جرام/لتر" },
  "code": { "en": "Malason 57% EC", "ar": "ملاسون 57% EC" },
  "recommendation": {},
  "efficacy": {},
  "target_pests": ["onion rabbit"],
  "target_crops": ["onion"]
}
```

---

## SECTION 10 — Claude Code remediation prompt

> Paste this as the first message in a new Claude Code session at the
> project root after saving this doc as `ZAGROS_SOURCE_OF_TRUTH.md`.

```
Read ZAGROS_SOURCE_OF_TRUTH.md at the project root in full before doing
anything else. It supersedes any prior plan doc and corrects fundamental
errors in the current branch.

Current branch (feature/redesign-v2-foundation) has these errors that
must be fixed before merging to main:

1. Product taxonomy is wrong.
   - Current: "14 products / 11 K+S SKUs / 2 partner houses".
   - Correct: 3 product lines (Seeds, Fertilizers, Pesticides), 7+
     supplier partnerships, ~30+ SKUs total.
   - Pesticides line (16 SKUs) is missing entirely — add it.
   - Vegetable Seeds line (East West Seeds, Thailand) is missing — add it.
   - Forage Seeds correctly attributed to Barenbrug — keep.

2. Brand positioning is invented.
   - Remove "مُشغّل، لا بيت ماركة" (operator, not a brand house) framing
     from all pages. Zagros IS the brand; suppliers are upstream
     credentials.
   - Remove "بيتا شراكة" (2 partner houses) framing. Use the real
     supplier list from Section 4 of the source-of-truth doc.

3. About page placeholders.
   - Branches section: replace placeholder with the 6 real branches from
     Section 5 of the doc (Khartoum HQ, Port Sudan, Al Qadarif, Al
     Managil, Ad-Damar, Ad-Daba).
   - Team section: leave with a clear "pending client photos" state
     instead of generic placeholder copy.
   - Certifications: leave with "pending client confirmation".
   - Add a "Founded 2010" timestamp prominently.

4. Customer references missing.
   - Add a Customers section with the 6 real customers from Section 7
     of the doc. Logo files: ministry-of-agriculture.svg, alrajihi.svg,
     amtaar.svg, dal.svg, Paramount.svg, premier-farm.webp.
   - If logos aren't yet in public/, surface that as a known gap and
     leave placeholder spots in the layout so the visual rhythm is
     correct.

5. Placeholder text leaking into rendered UI.
   - Anywhere a string like "illustrative-hero-canal.jpg" or
     "PENDING REAL PHOTO" is appearing visually on the rendered page,
     replace with empty state or proper image placeholder element. The
     hero of the products catalog page is one example.

6. Migrate v1 data files.
   - src/data/company.ts, src/data/countries.ts, src/data/pesticides.json,
     and src/data/fertilizers.json from the v1 site contain ground-truth
     data. Reuse this data verbatim in v2 instead of regenerating. The
     source-of-truth doc has all v1 data structured for easy reference.
   - When migrating pesticides.json: keep the 3 subcategories
     (Insecticides, Herbicides, Fungicides) and all 16 products as-is.
   - When migrating fertilizers.json: DELETE f1 (generic placeholder),
     DELETE either f3 or f8 (they are duplicates), keep f4 f5 f6 f7 f9
     as-is.

7. Geographic positioning correction.
   - Site is for a Sudan-based company with 6 Sudan branches. Hero copy
     and meta tags should foreground Sudan. Other MENA markets in
     countries.ts are aspirational and should be a separate "Markets
     we serve" vs "Future expansion" presentation — confirm with the
     user before deciding scope.

After reading the doc, propose a remediation plan covering the above
points in order. Do not start editing until I approve the plan.
```

---

## SECTION 11 — Remaining gaps (for client follow-up)

Open items, ordered by impact on the launch:

### Blocking
1. **Real phone numbers** (+249...) — both numbers in v1 are placeholders
2. **Verify domain & email** (`info@zagros-agriculture.com`)
3. **Verify social media handles** (zagrosagri × 3 platforms)
4. **Confirm K+S extended catalog** — are soluUP, soluMAP, soluMKP, soluAMS, soluCN actually stocked? (Affects 5 product pages)
5. **Agro Dragon product list** — currently completely unknown
6. **Branch full street addresses** (not just city names)
7. **SAF & KZ full company names** for partner pages
8. **East West Seeds variety list** (vegetable seed SKUs)
9. **Full Barenbrug variety list** beyond the 3 datasheets I have

### Important but not blocking
10. **Tagline AR translation** — confirm preferred Arabic for "Leaders in Agric Services"
11. **About page founding story / leadership info**
12. **Real WhatsApp business number** (Sudan ag standard)
13. **Brand logo files** in SVG + dark/light variants
14. **Brand color palette** spec
15. **Field/farm/team photography**
16. **Product bag/bottle photography** for fertilizers and pesticides
17. **Partner logo files** for Kafr El Zayat + Mahamaya + Chinese manufacturers (per-product)
18. **Country presence confirmation** — is Zagros actually shipping to all 11 MENA markets in countries.ts, or just Sudan?

### Nice-to-have
19. **Founding story narrative** for About page hero
20. **Project case studies** — pick 2-3 from the 6 customers for full case study pages
21. **Pricing / quote workflow design** — current site has "اطلب عرض سعر" CTA, define what happens after click
22. **Per-SKU bespoke use cases** beyond the recommendation field

---

## SECTION 12 — Source file index

| # | File | Status | Section |
|---|---|---|---|
| 1 | `src/data/company.ts` (v1) | ✅ merged | 1, 2, 4, 5, 6, 7 |
| 2 | `src/data/pesticides.json` (v1) | ✅ merged | Line 1 (all 16 SKUs) |
| 3 | `src/data/fertilizers.json` (v1) | ✅ merged | Line 2 (7 unique SKUs after dedup) |
| 4 | `src/data/countries.ts` (v1) | ✅ merged | Section 6 |
| 5 | Brochure: `soluUP_25kg_Bag_Design.pdf` | ✅ extracted | Line 2.2 |
| 6 | Brochure: `SoluNPK_20-20-20_TEBrochure-AR_.pdf` | ✅ extracted + merged | Line 2.1 |
| 7 | Brochure: `SoluNPK_12-12-36_TEBrochure-AR_.pdf` | ✅ extracted + merged | Line 2.1 |
| 8 | Brochure: `SoluMKP_Brochure-AR.pdf` | ✅ extracted | Line 2.2 |
| 9 | Brochure: `SoluMAP_Brochure-AR.pdf` | ⚠️ partial extraction | Line 2.2 |
| 10 | Brochure: `SoluAMS_Premium_Brochure-AR.pdf` | ✅ extracted | Line 2.2 |
| 11 | Brochure: `Solu_NOP_Brochure-AR.pdf` | ✅ extracted + merged | Line 2.1 |
| 12 | Brochure: `Solu_CN_Brochure-AR.pdf` | ✅ extracted | Line 2.2 |
| 13 | Brochure: `EPSOTop_Middle_East_AR.pdf` | ✅ extracted + merged | Line 2.1 |
| 14 | Brochure: `KaliSOP_fine_Brochure-AR.pdf` | ✅ extracted + merged | Line 2.1 |
| 15 | Brochure: `KALISOP_gran-AR.pdf` | ✅ extracted + merged | Line 2.1 |
| 16 | Datasheet: Superfine Rhodes Grass | ✅ extracted | Line 3.2 |
| 17 | Datasheet: SARDI 10 Series 2 | ✅ extracted | Line 3.2 |
| 18 | Datasheet: Alfamaster Ten | ✅ extracted | Line 3.2 |
| ❌ | `شركة_زاغروس_البذور.pdf` (company profile) | NOT EXTRACTED — file did not reach workspace | — |

---

## Changelog

**v2 (2026-05-11):** Rebuilt from v1 actual data files + brochures. Corrected
fundamental errors in v1 of this doc: product taxonomy (3 lines not 14
SKUs), company location (Sudan not regional MENA), supplier count (7+ not
2), missing pesticides line, missing vegetable seeds line, missing customer
list. Added Claude Code remediation prompt for the broken v2 build.

**v1 (2026-05-10):** Initial extraction from 11 K+S brochures + 3
Barenbrug datasheets. Incorrectly assumed brochures = full catalog.

---

*End of source-of-truth document.*
