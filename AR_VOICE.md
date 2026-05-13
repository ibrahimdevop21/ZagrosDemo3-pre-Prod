# Zagros Arabic Voice Guide

The site's Arabic copy was rejected for reading "AI-generated, like weak Google Translate." This doc is the constraint for every Arabic string going forward: hero, body, microcopy, alt text, errors, the entire `ar.json`. Pre-launch sign-off requires a native reviewer pass — this guide is a hold-the-line until then.

**Anchor:** Arab Authority for Agricultural Investment and Development (AAAID) — `aaaid.org`. The Authority is regional, MSA, B2B, agronomically credible, premium corporate voice. Zagros sits in the same register: a regional ag-inputs distributor publishing for ministry buyers, commercial farms, and ag professionals across MENA.

**Register:** Modern Standard Arabic (MSA), pure. No Sudanese dialect, no Gulf lean, no chatty Egyptian colloquial. Reads correctly across all 12 markets (Sudan + 11 MENA).

**Voice posture:** Confident, technical, restrained. Closer to an annual report than a brochure. Never DTC-friendly, never emoji-loaded, never "your partner in agriculture" sentimentality.

---

## Numerals

**Western digits in body copy.** The anchor uses `1976`, `12 دولة`, `107 ألف`, `21 دولة عربية` — Western throughout. This is the regional B2B convention. It overrides the older `AGENTS.md` line about Arabic-Indic numerals for visible UI copy.

| Use | Numeral |
|---|---|
| Years (1987, 2026) | Western: `1987`, `2026` |
| Counts in body copy (12 markets, 7 suppliers) | Western: `12 سوقاً`, `7 موردين` |
| Phone, ISO codes, technical specs | Western (already the rule) |
| Giant display numerals in the By-the-numbers hero section | **Either works.** Default Western for consistency. Arabic-Indic is acceptable for editorial drama if a section calls for it. |

The previous Zagros memory said to use Arabic-Indic everywhere — that produced the "Google-translated" feel. AAAID's choice to use Western digits is part of why it reads premium. Match the anchor.

---

## Sentence construction

### Anchor patterns

The anchor's sentences are short, verb-forward, factually compact. Mimic these structures.

| Anchor pattern | Use for |
|---|---|
| `تأسست الهيئة في العام 1976` | Founding year. NOT `منذ ١٩٨٧` alone, NOT `تأسست عام ٢٠١٠`. |
| `تتوزع شركاتها جغرافياً في 12 دولة عربية` | Geographic reach. Compact, verb-first. |
| `تركز على إنتاج المحاصيل والمنتجات الزراعية الاستراتيجية الأساسية` | What the company does. List-style with strategic adjectives. |
| `تلتزم الهيئة بتطبيق الافكار المبتكرة لرفع جودة الأداء` | Mission statement. Begins with verb of commitment. |
| `نوفر فرص استثمارية زراعية واعدة` | First-person plural for offerings. `نوفر`, `نعتمد`, `نطبق`. |
| `يُساهم في رأسمالها 21 دولة عربية` | Stats with verb-subject inversion. |

### Verb stock to prefer

- **تأسست** — was established (not just "كانت موجودة منذ")
- **تتوزع جغرافياً** — is geographically distributed
- **تركز على** — focuses on
- **تلتزم بـ** — is committed to
- **تساهم في** — contributes to / participates in
- **توفر** — provides
- **تخدم** — serves
- **تعتمد** — adopts / relies on
- **تطبق** — applies / implements
- **تستورد** — imports
- **تشتمل** — comprises / includes

### Avoid

- `منذ XXXX` as standalone preamble. Use `تأسست في العام XXXX` or `منذ تأسيسها عام XXXX`.
- `هي شركة تعمل في مجال...` — flabby. Lead with the verb: `تعمل زاغروس في...` or `تختص زاغروس بـ...`.
- `نحن نقدم لكم...` — DTC, friendly. Use `توفر زاغروس` or `نوفر`.
- `الشريك الموثوق` as the lead phrase — overused. Use it as supporting language, not the headline.
- `أفضل` / `الأفضل` / `الرائدة` — superlative claims without backing. The anchor never makes unsubstantiated superlative claims.

---

## Anti-patterns (the "Google Translate" tells)

These were in my previous AR pass. Don't repeat them.

1. **Calqued word order from English.** Arabic verbs come first in declarative sentences. `بذور، أسمدة، مبيدات، مصدّرة من أجل تربة السودان` reads as English-shaped — comma-list-then-verb structure that Arabic doesn't naturally produce. Native: `نوفر بذوراً وأسمدة ومبيدات مختارة لتربة السودان وأسواق المنطقة.`

2. **Over-formal classical fillers** that no real corporate Arabic uses. `حدّثنا عن ما يحتاجه حقلك` — "حدّثنا" is heritage-poetic, not corporate. Native: `أخبرنا باحتياجاتك` or `حدّد احتياجاتك ونتواصل معك`.

3. **Literal preposition translation.** English "for" maps to several Arabic prepositions depending on meaning (`لـ`, `من أجل`, `لأجل`, `إلى`). `مصدّرة من أجل تربة السودان` uses `من أجل` literally — should be just `لـ` or restructured: `بذور لأرضك`.

4. **Awkward number constructions.** `اثنتي عشرة سوقاً` is grammatically correct but stiff. The anchor writes `12 سوقاً` or `12 دولة عربية` with Western digits and natural agreement. Use that.

5. **Italic / decorative formatting on Arabic text.** Arabic has no italic. The site CSS now strips italic on RTL pages — copy should not assume an "accent word" style that depends on italic. Use color (`signal` yellow) or position for emphasis.

6. **Possessive over-use.** `شريك السودان الموثوق` is fine occasionally but reads tonally heavy if repeated. Vary with `الشريك الموثوق في السودان` or just restructure.

7. **Long noun chains without verbs.** Strong Arabic prose uses verbs. `زاغروس للتجارة للمدخلات الزراعية المتميزة منذ تأسيسها في عام ١٩٨٧` is a noun pileup. Native: `تأسست زاغروس للتجارة عام 1987 وتعمل في توفير المدخلات الزراعية المتميزة عبر المنطقة.`

---

## Domain glossary

Locked translations for repeat terms. Don't deviate.

### Agriculture-general

| EN | AR | Notes |
|---|---|---|
| agricultural inputs | المدخلات الزراعية | not مستلزمات (too generic) |
| seeds | بذور | always plural unless specifying one variety |
| fertilizers | أسمدة | plural |
| pesticides | مبيدات | plural; `مبيدات حشرية / أعشاب / فطرية` for sub-types |
| forage | أعلاف | plural; singular `علف` |
| field crops | محاصيل حقلية | |
| fruit trees | أشجار الفاكهة | |
| vegetables | خضراوات / خضار | both work; prefer `خضراوات` in formal |
| catalog | كتالوج / قائمة منتجات | use كتالوج for short reference, قائمة منتجات in long form |
| stock | متوفر / مخزون | متوفر = in stock; مخزون = inventory |
| application rate | معدل الاستخدام | not جرعة (medical) |
| tank-mix | المزج في خزان الرش | full phrase; no Arabic single word |
| crop stage | مرحلة المحصول | |

### Agronomy-specific

| EN | AR | Notes |
|---|---|---|
| lucerne / alfalfa | البرسيم الحجازي | NOT جرجير (that's rocket/arugula — different plant) |
| Rhodes grass | عشب الرودس | |
| clover | البرسيم | bare `البرسيم` is clover; alfalfa is `البرسيم الحجازي` |
| fertigation | التسميد بالري | |
| foliar application | الرش الورقي | |
| soil application | التطبيق الأرضي | |
| pre-emergence (herbicide) | قبل الإنبات | |
| post-emergence | بعد الإنبات | |
| systemic | جهازي | for systemic herbicides/insecticides |
| contact (mode of action) | بالملامسة | |
| residual | متبقّ | |
| selective herbicide | مبيد أعشاب انتقائي | |

### Corporate / brand

| EN | AR | Notes |
|---|---|---|
| Zagros Trading | زاغروس للتجارة | always |
| headquartered in Sudan | مقرها في السودان | not "متمركزة" |
| since 1987 / established 1987 | تأسست في العام 1987 | full phrase preferred; `منذ 1987` only as a tail |
| international supplier | مورّد دولي | not شريك (too vague) |
| partnership | شراكة | |
| catalog (publication) | كتالوج | |
| publication / issue | إصدار | |
| field report | تقرير ميداني | not تقرير من الحقل |
| branch | فرع | plural فروع |
| headquarters | المقر الرئيسي | not المركز الرئيسي |
| service | خدمة | plural خدمات |
| trust / trusted | الموثوق به | as adjective `موثوق` |
| quote (price quote) | عرض سعر | always عرض سعر, never تسعيرة (colloquial) |
| consultancy | استشارات زراعية | when ag-specific |
| operation / operations | عمليات | plural |

### Geography (matches `markets_served`)

| EN | AR |
|---|---|
| Sudan | السودان |
| Egypt | مصر |
| Saudi Arabia | المملكة العربية السعودية (formal) / السعودية (short) |
| UAE | الإمارات العربية المتحدة (formal) / الإمارات (short) |
| Qatar | قطر |
| Kuwait | الكويت |
| Oman | سلطنة عُمان (formal) / عُمان (short) |
| Bahrain | البحرين |
| Jordan | الأردن |
| Lebanon | لبنان |
| Iraq | العراق |
| Yemen | اليمن |
| Germany | ألمانيا |
| Netherlands | هولندا |
| Switzerland | سويسرا |
| United Kingdom | المملكة المتحدة (formal) / بريطانيا (short) |
| Australia | أستراليا |
| Thailand | تايلاند |
| China | الصين |
| India | الهند |

---

## Typographic constraints

- **No italic on Arabic.** The CSS now strips italic in RTL (`src/styles/global.css`). Copy shouldn't assume italic emphasis.
- **No mixing Latin script in the middle of an Arabic sentence** unless it's a proper noun (K+S, soluNPK, Barenbrug, SAF, KZ). When inline, leave them in their original Latin form — don't transliterate to Arabic letters.
- **Quotes:** use Arabic guillemets `«` and `»` for pull quotes, not English `"`. Body text inline quotes can use either.
- **Punctuation:** use Arabic comma `،` not Latin `,`. Arabic question mark `؟`. Semi-colon `؛`. Latin period `.` is fine (Arabic full stop and Latin look identical in most fonts).

---

## Pre-launch sign-off

This guide gets us to "publishable now" — not native-perfect. Pre-launch checklist:

1. Native Arabic copywriter (regional MENA, ag-domain familiar) reviews `ar.json` end-to-end. 2–4 hours of work, $100–300.
2. Reviewer marks any sentence that still reads translated. They rewrite, not me.
3. Update this doc with any patterns they catch that aren't already here.
4. Sign-off note added to `docs/superpowers/plans/2026-05-13-zagros-v3-status.md`.

Until step 4, every AR commit message ends with `(MSA, pending native review)`.

---

*End of voice guide. Anchor: aaaid.org. Authority: pure MSA. Updated by native reviewer at launch.*
