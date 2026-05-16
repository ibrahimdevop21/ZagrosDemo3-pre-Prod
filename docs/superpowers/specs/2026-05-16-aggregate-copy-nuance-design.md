# Aggregate copy with nuance — sitewide pass

**Date:** 2026-05-16
**Branch:** `feature/plan-7-world-reach`
**Pickup item:** "Out-of-scope copy still carrying the contested aggregates" — captured in the WIP commit `dfa78b7` follow-up checklist. Plan 7 retired the "9 source countries / 12 markets" aggregates from the WorldReach hero strings only; the rest of the site still carries the bragging-aggregate pattern in 9 string keys plus one stale code comment.

## Problem

Two related but distinct numbers appear across the marketing copy:

- **"seven international suppliers"** — counts the 7 named-partner brands in `src/data/company.ts` (East West Seeds, Barenbrug, K+S, Agro Dragon, SAF, KZ, Kafr El Zayat — spanning 7 origin countries: TH, AU, DE, NL, CH, GB, EG).
- **"twelve markets" / "nine source countries"** — counts the broader regional reach (12 MENA markets per `home.v3markets.*`) and broader source-country footprint (9 countries per `world-reach.ts`, adding CN and IN beyond the named-partner set).

Two structural issues with the existing copy:

1. **Bragging-aggregate framing.** Plan 7's WorldReach rewrite shifted to a "name what you can name, mark what's pending, frame coverage rather than presence" pattern — but the rest of the site still asserts the bare counts ("seven international suppliers", "twelve markets") with no acknowledgment that not all 12 markets are equally active or that the 7 named brands and 9 source countries are different things.
2. **Internal contradiction.** Two strings (`home.sources.headline_a` and `partners_page.deck`) say "**six countries**" — but the 7 named partners span 7 countries, and the broader source-country count is 9. The number is wrong wherever it appears.

## Goal

Retire the bragging-aggregate pattern without retiring the numbers. Each contested number gets paired with qualifying language so readers see a complete picture, not a bare count.

## Non-goals

- Removing the giant 12 and 9 numerals from `ByTheNumbersV3.astro`. Per option B, the digit count-ups stay; only their captions are tightened.
- Fixing the data divergence between `company.ts.partners` (7 brands across 7 countries) and `world-reach.ts.countries` (9 source countries including CN/IN beyond the named-partner set). The "seven international supplier houses across nine source countries" framing acknowledges the divergence; whether Mahamaya (India) should be promoted to `/partners` is a separate client decision.
- Touching `home.v3markets.*`, which already does the right thing ("Twelve markets confirmed. Coverage varies by line and supplier agreement…").
- Touching `home.v3partners.headline_accent` ("across nine source countries"), which is already canonical.
- Touching `home.v3branches.*`, already retired by Plan 7.

## Design

### Voice principles

- **Always pair 7 with 9.** "Seven international supplier houses across nine source countries." The brands sit *within* the source-country footprint — the numbers are compatible, not contradictory, when expressed together.
- **Never let 12 stand bare.** Pair with "regional reach across MENA" or "Sudan-anchored distribution" so it doesn't read as 12 equally-active markets (per source-of-truth §6 caveat: "Confirm: is Zagros actively shipping/selling to these markets, or are these aspirational?").
- **AR mirrors EN tone.** Western digits in body copy (per AAAID anchor / AR_VOICE.md §Numerals). MSA, no tashkeel, no terminal periods.

### String rewrites

#### 1. `site.meta_description` (i18n/{en,ar}.json:6)

**EN current:**
> Headquartered in Sudan since 1987, serving twelve MENA markets with seeds, fertilizers, and pesticides from seven international suppliers across Germany, the Netherlands, Switzerland, the UK, Australia, Thailand, and Egypt.

**EN proposed:**
> Headquartered in Sudan since 1987. Sudan-anchored distribution with regional reach across twelve MENA markets. Seeds, fertilizers, and pesticides from seven international supplier houses across nine source countries.

**AR current:**
> تأسست زاغروس للتجارة في السودان عام 1987 وتعمل في 12 سوق عبر المنطقة بتوفير البذور والأسمدة والمبيدات من شبكة موردين دولية في 9 دول

**AR proposed:**
> تأسست زاغروس في السودان عام 1987. توزيع من السودان وتغطية إقليمية في 12 سوق بالشرق الأوسط. بذور وأسمدة ومبيدات من 7 شراكات دولية في 9 دول مصدرة

#### 2. `companyData.business` (data/company.ts:74-75)

**EN proposed:**
> Headquartered in Sudan since 1987 with regional reach across twelve MENA markets. Seeds, fertilizers, and pesticides from seven international supplier houses across nine source countries.

**AR proposed:**
> تأسست في السودان عام 1987 بتغطية إقليمية في 12 سوق بالشرق الأوسط. بذور وأسمدة ومبيدات من 7 شراكات دولية في 9 دول مصدرة

#### 3. `home.hero.deck` (i18n/{en,ar}.json:351)

**EN proposed:**
> Six branches across Sudan, seven international supplier houses across nine source countries, full input portfolio. Seeds, fertilizers, pesticides — specs forward, agronomically backed.

**AR proposed:**
> ستة فروع في السودان، و 7 شراكات دولية في 9 دول مصدرة، باقة مدخلات كاملة. بذور وأسمدة ومبيدات — مواصفات أولاً، دعم زراعي خلف كلّ كيس

#### 4. `home.v3numbers.branches` + `.suppliers` captions (i18n/{en,ar}.json:363-364)

These are the captions sitting under the giant "12" and "9" numerals in `ByTheNumbersV3.astro`.

Note: the i18n key names (`branches` / `suppliers`) are misleading vs. their actual content (the "12" caption is for markets, the "9" caption is for source countries). Not renaming the keys in this pass — risk of touching unrelated code. The captions themselves are rewritten.

**EN proposed:**
- `branches` (the "12" caption): `"MENA markets — Sudan active, regional reach across the GCC and Levant"`
- `suppliers` (the "9" caption): `"Source countries supplying seeds, fertilizers, and pesticides into the catalog"`

**AR proposed:**
- `branches`: `"أسواق الشرق الأوسط — السودان نشط، وتغطية إقليمية في الخليج والشام"`
- `suppliers`: `"دول مصدرة للبذور والأسمدة والمبيدات في الكتالوج"`

#### 5. `home.sources.kicker` + `headline_a` (i18n/{en,ar}.json:464-466)

`kicker` is unchanged ("Sources · seven international houses" reads cleanly as a label).

**EN headline_a current:** "Seven international suppliers across **six countries** —" *(wrong: 7 brands span 7 countries)*

**EN headline_a proposed:** "Seven international supplier houses across nine source countries —"

**AR headline_a current:** "سبع شراكات دولية في ست دول —"

**AR headline_a proposed:** "7 شراكات دولية في 9 دول مصدرة —"

#### 6. `about.headline` + `about.deck` (i18n/{en,ar}.json:40-41)

**EN headline proposed:**
> Headquartered in Sudan since 1987 — Sudan-anchored, with regional reach across twelve MENA markets.

**AR headline proposed:**
> تأسست في الخرطوم عام 1987 — توزيع من السودان وتغطية إقليمية في 12 سوق بالشرق الأوسط

**EN deck proposed:**
> Zagros Trading has served farms across the region — from ministry-scale projects to family operations — for thirty-nine years. Six branches anchor distribution in Sudan; regional reach extends across twelve MENA markets. Seven international supplier houses across nine source countries, three product lines, all under one roof — with consultancy, distribution, and after-sales support.

**AR deck proposed:**
> تعمل زاغروس للتجارة في خدمة المزارع منذ تسع وثلاثين سنة — من المشاريع الوزارية إلى المزارع العائلية. ستة فروع تشكّل قاعدة التوزيع في السودان، وتغطية إقليمية تمتد إلى 12 سوق بالشرق الأوسط. 7 شراكات دولية في 9 دول مصدرة، و 3 خطوط منتجات تحت سقف واحد — مع استشارات زراعية، وتوزيع، ودعم ما بعد البيع

#### 7. `partners_page.kicker` + `deck` (i18n/{en,ar}.json:129-131)

`kicker` is unchanged.

**EN deck proposed:**
> Zagros sources from seven international supplier houses across nine source countries. Each house was chosen for technical credentials, regulatory standing, and agronomic fit with Sudanese farms.

**AR deck proposed:**
> تستورد زاغروس من 7 شراكات دولية في 9 دول مصدرة. اختير كلّ مورّد لاعتماده الفنّي ومكانته التنظيمية وملاءمته الزراعية للحقل السوداني

#### 8. `products.page.deck` (i18n/{en,ar}.json:170)

**EN proposed:**
> Three product lines, seven international supplier houses across nine source countries, full agronomy support across the catalog. Browse by line below.

**AR proposed:**
> ثلاثة خطوط منتجات، و 7 شراكات دولية في 9 دول مصدرة، دعم زراعي كامل للكتالوج. تصفّح حسب الخط أدناه

#### 9. `ByTheNumbersV3.astro:5-6` doc comment (cosmetic)

**Current:** `* One giant number (39 years since 1987) + three smalls (12 markets, 9 source countries, 30+ SKUs). Numbers count up from 0 on entry.`

**Proposed:** `* One giant number (39 years since 1987) + three smalls (12 MENA markets — regional reach, 9 source countries, 30+ SKUs). Numbers count up from 0 on entry.`

## Verification

- `npm run build` — 100 pages, no errors.
- `npm test` — 94/94 still pass (no test asserts on these copy strings).
- `npx astro check` — 0 errors, 0 warnings.
- **Grep `dist/` for retired strings** — expect 0 hits each:
  - `"twelve markets"` *(bare, without "regional reach" or "regional MENA reach" nearby)*
  - `"across six countries"`
  - `"seven international suppliers"` *(bare, without "houses across nine")*
  - AR: `"في ست دول"`, `"7 موردين دوليين"` *(bare)*
- **Grep `dist/` for new pairings** — expect ≥6 hits across EN+AR home/about/partners/products:
  - `"seven international supplier houses across nine source countries"`
  - `"7 شراكات دولية في 9 دول مصدرة"`

Length sanity:
- `about.deck` grows ~12 chars EN, ~18 chars AR — should fit existing layout (the deck is a paragraph, not a fixed-width label).
- `home.hero.deck` grows ~25 chars EN, ~22 chars AR — verify hero typography still wraps cleanly at the standard breakpoint.

## Risks

- **Hero deck overflow.** `home.hero.deck` is the longest growth. If the hero block uses a narrow column at md+, the longer string could push to an extra wrap line. Mitigation: visual check at 1024-1440 viewport during verification.
- **AR copy quality.** New AR strings follow AR_VOICE.md anchor (MSA, no tashkeel, no terminal periods) but are not native-reviewed. Same disposition as the other AR strings under WIP commit follow-up #4 — flagged as "pending native review."
- **Data divergence still present.** The 7-brands/9-countries asymmetry is real and the framing acknowledges it — but a client reviewer might ask "why 7 then?" The answer ("the other two source countries are an OEM aggregate and a confirmed supplier we haven't yet decided to promote to /partners") lives in the WorldReach grid + the source-of-truth doc, not in marketing copy.

## Out-of-scope follow-ups (still open from WIP commit `dfa78b7`)

- Env-gate `SHOW_SCOPE_NOTE` in `WorldReach.astro:36`.
- Native AR review of slot_partial, scope_note_body, credentials_label, and the new strings from this spec.
- Sudan inset map (optional).
- Data divergence between `company.ts.partners` and `world-reach.ts.countries` (decide whether to promote Mahamaya / acknowledge OEM aggregate in /partners).
- `git tag plan-7-world-reach` once all follow-ups are signed off.
