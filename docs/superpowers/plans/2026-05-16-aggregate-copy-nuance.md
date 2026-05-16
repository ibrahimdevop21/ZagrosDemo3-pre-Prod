# Aggregate Copy Nuance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the bragging-aggregate copy pattern sitewide by adding qualifying nuance to every standalone "7 / 12 / 9" reference in `en.json`, `ar.json`, `company.ts`, and one Astro doc comment — without removing the numbers themselves.

**Architecture:** Pure copy edits. Three groups of files: (1) two i18n locale JSON files, (2) one TS data module (`company.ts`), (3) one Astro component doc comment. Each group changes together, commits together. No logic, no markup, no test changes. Verification = build clean + `astro check` + grep `dist/` for retired phrases (expect 0) and new pairings (expect ≥6 EN+AR hits).

**Tech Stack:** Astro 5 i18n (string lookup via `useTranslations`), TypeScript const data exports. No new deps.

**Spec:** `docs/superpowers/specs/2026-05-16-aggregate-copy-nuance-design.md`

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/i18n/en.json` | EN locale strings | 9 string edits across 6 sections |
| `src/i18n/ar.json` | AR locale strings | 9 string edits across 6 sections (mirrors EN) |
| `src/data/company.ts` | Company brand data exported to multiple pages | 2 string edits (en + ar) on `companyData.business` |
| `src/components/home/ByTheNumbersV3.astro` | Home §03 component | 1 doc-comment edit (cosmetic) |

No new files. No removed files. No types or interfaces affected — `i18n/types.ts` already contains every key we touch.

---

## Task 1: Sitewide brand strings (meta_description + companyData)

**Files:**
- Modify: `src/i18n/en.json:6` (the single `site.meta_description` line)
- Modify: `src/i18n/ar.json:6` (the AR mirror)
- Modify: `src/data/company.ts:74-75` (the `companyData.business.en/ar` pair)

These four strings carry the highest leverage — meta_description ships in every page's `<head>` and `companyData.business` is consumed by Footer + About hero. Doing them first prevents the rest of the pass from inheriting old phrasing through component reuse.

- [ ] **Step 1.1: Edit `src/i18n/en.json:6` (`site.meta_description`)**

  Replace the entire string value with:

  ```json
  "meta_description": "Headquartered in Sudan since 1987. Sudan-anchored distribution with regional reach across twelve MENA markets. Seeds, fertilizers, and pesticides from seven international supplier houses across nine source countries."
  ```

- [ ] **Step 1.2: Edit `src/i18n/ar.json:6` (`site.meta_description` AR)**

  Replace the entire string value with:

  ```json
  "meta_description": "تأسست زاغروس في السودان عام 1987. توزيع من السودان وتغطية إقليمية في 12 سوق بالشرق الأوسط. بذور وأسمدة ومبيدات من 7 شراكات دولية في 9 دول مصدرة"
  ```

- [ ] **Step 1.3: Edit `src/data/company.ts:74` (`companyData.business.en`)**

  Replace the existing EN string value with:

  ```ts
  en: 'Headquartered in Sudan since 1987 with regional reach across twelve MENA markets. Seeds, fertilizers, and pesticides from seven international supplier houses across nine source countries.',
  ```

- [ ] **Step 1.4: Edit `src/data/company.ts:75` (`companyData.business.ar`)**

  Replace the existing AR string value with:

  ```ts
  ar: 'تأسست في السودان عام 1987 بتغطية إقليمية في 12 سوق بالشرق الأوسط. بذور وأسمدة ومبيدات من 7 شراكات دولية في 9 دول مصدرة',
  ```

- [ ] **Step 1.5: Verify typecheck**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings (pre-existing 8 ts(6133) hints on other files are unrelated).

- [ ] **Step 1.6: Commit**

  ```bash
  git add src/i18n/en.json src/i18n/ar.json src/data/company.ts
  git commit -m "$(cat <<'EOF'
copy: nuance meta_description + companyData.business (7×9 / 12 with regional reach)

Always pair 7 with 9 ("seven international supplier houses across
nine source countries") so the named-partner count and source-country
footprint read as compatible, not contradictory. Pair 12 with "regional
reach across MENA" per source-of-truth §6 caveat — don't assert 12
equally-active markets.

Spec: docs/superpowers/specs/2026-05-16-aggregate-copy-nuance-design.md
EOF
)"
  ```

---

## Task 2: Home page strings (hero.deck + v3numbers captions + sources)

**Files:**
- Modify: `src/i18n/en.json:351` (`home.hero.deck`)
- Modify: `src/i18n/ar.json:351` (AR mirror)
- Modify: `src/i18n/en.json:363-364` (`home.v3numbers.suppliers` + `.branches` captions)
- Modify: `src/i18n/ar.json:363-364` (AR mirrors)
- Modify: `src/i18n/en.json:464-466` (`home.sources.kicker` + `headline_a` + `headline_b` — only `headline_a` changes; `kicker` and `headline_b` stay as-is)
- Modify: `src/i18n/ar.json:464-466` (AR mirrors)

Six string edits across three home sections.

- [ ] **Step 2.1: Edit `home.hero.deck` (EN)**

  In `src/i18n/en.json:351`, replace the `"deck"` value with:

  ```json
  "deck": "Six branches across Sudan, seven international supplier houses across nine source countries, full input portfolio. Seeds, fertilizers, pesticides — specs forward, agronomically backed.",
  ```

- [ ] **Step 2.2: Edit `home.hero.deck` (AR)**

  In `src/i18n/ar.json:351`, replace the `"deck"` value with:

  ```json
  "deck": "ستة فروع في السودان، و 7 شراكات دولية في 9 دول مصدرة، باقة مدخلات كاملة. بذور وأسمدة ومبيدات — مواصفات أولاً، دعم زراعي خلف كلّ كيس",
  ```

- [ ] **Step 2.3: Edit `home.v3numbers.suppliers` + `.branches` (EN)**

  In `src/i18n/en.json:363-364`, replace these two lines:

  ```json
        "suppliers": "Source countries supplying seeds, fertilizers, and pesticides into the catalog",
        "branches": "MENA markets — Sudan active, regional reach across the GCC and Levant",
  ```

  *(The key names `suppliers` / `branches` are misleading vs. their captioned numbers — they caption the "9" and "12" respectively. Not renaming the keys in this pass — risk of touching the component code without need. Captions tightened in place.)*

- [ ] **Step 2.4: Edit `home.v3numbers.suppliers` + `.branches` (AR)**

  In `src/i18n/ar.json:363-364`, replace these two lines:

  ```json
        "suppliers": "دول مصدرة للبذور والأسمدة والمبيدات في الكتالوج",
        "branches": "أسواق الشرق الأوسط — السودان نشط، وتغطية إقليمية في الخليج والشام",
  ```

- [ ] **Step 2.5: Edit `home.sources.headline_a` (EN)**

  In `src/i18n/en.json:465`, replace the `"headline_a"` value with:

  ```json
        "headline_a": "Seven international supplier houses across nine source countries —",
  ```

  *(Fixes the `"six countries"` factual error — 7 named brands span 7 origin countries; the broader source-country count is 9.)*

- [ ] **Step 2.6: Edit `home.sources.headline_a` (AR)**

  In `src/i18n/ar.json:465`, replace the `"headline_a"` value with:

  ```json
        "headline_a": "7 شراكات دولية في 9 دول مصدرة —",
  ```

- [ ] **Step 2.7: Verify typecheck**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings.

- [ ] **Step 2.8: Commit**

  ```bash
  git add src/i18n/en.json src/i18n/ar.json
  git commit -m "$(cat <<'EOF'
copy: nuance home — hero.deck, v3numbers captions, sources headline

home.hero.deck pairs 7×9 explicitly. v3numbers captions tighten — the
12 caption acknowledges "Sudan active, regional reach"; the 9 caption
drops the country-name dump in favor of a tighter descriptor.
home.sources.headline_a fixes the "six countries" factual error
(7 brands span 7 countries; full source spread is 9).

Spec: docs/superpowers/specs/2026-05-16-aggregate-copy-nuance-design.md
EOF
)"
  ```

---

## Task 3: About + Partners + Products page decks

**Files:**
- Modify: `src/i18n/en.json:40-41` (`about.headline` + `about.deck`)
- Modify: `src/i18n/ar.json:40-41` (AR mirrors)
- Modify: `src/i18n/en.json:129-131` (`partners_page.kicker` + `headline` + `deck` — only `deck` changes)
- Modify: `src/i18n/ar.json:129-131` (AR mirrors)
- Modify: `src/i18n/en.json:170` (`products.page.deck`)
- Modify: `src/i18n/ar.json:170` (AR mirror)

Six string edits across three page-level deck sections.

- [ ] **Step 3.1: Edit `about.headline` + `about.deck` (EN)**

  In `src/i18n/en.json:40-41`, replace these two lines:

  ```json
      "headline": "Headquartered in Sudan since 1987 — Sudan-anchored, with regional reach across twelve MENA markets.",
      "deck": "Zagros Trading has served farms across the region — from ministry-scale projects to family operations — for thirty-nine years. Six branches anchor distribution in Sudan; regional reach extends across twelve MENA markets. Seven international supplier houses across nine source countries, three product lines, all under one roof — with consultancy, distribution, and after-sales support.",
  ```

- [ ] **Step 3.2: Edit `about.headline` + `about.deck` (AR)**

  In `src/i18n/ar.json:40-41`, replace these two lines:

  ```json
      "headline": "تأسست في الخرطوم عام 1987 — توزيع من السودان وتغطية إقليمية في 12 سوق بالشرق الأوسط",
      "deck": "تعمل زاغروس للتجارة في خدمة المزارع منذ تسع وثلاثين سنة — من المشاريع الوزارية إلى المزارع العائلية. ستة فروع تشكّل قاعدة التوزيع في السودان، وتغطية إقليمية تمتد إلى 12 سوق بالشرق الأوسط. 7 شراكات دولية في 9 دول مصدرة، و 3 خطوط منتجات تحت سقف واحد — مع استشارات زراعية، وتوزيع، ودعم ما بعد البيع",
  ```

- [ ] **Step 3.3: Edit `partners_page.deck` (EN)**

  In `src/i18n/en.json:131`, replace the `"deck"` value with:

  ```json
      "deck": "Zagros sources from seven international supplier houses across nine source countries. Each house was chosen for technical credentials, regulatory standing, and agronomic fit with Sudanese farms."
  ```

  *(`kicker` "Sources · seven international houses" stays as-is — it reads cleanly as a label.)*

- [ ] **Step 3.4: Edit `partners_page.deck` (AR)**

  In `src/i18n/ar.json:131`, replace the `"deck"` value with:

  ```json
      "deck": "تستورد زاغروس من 7 شراكات دولية في 9 دول مصدرة. اختير كلّ مورّد لاعتماده الفنّي ومكانته التنظيمية وملاءمته الزراعية للحقل السوداني"
  ```

- [ ] **Step 3.5: Edit `products.page.deck` (EN)**

  In `src/i18n/en.json:170`, replace the `"deck"` value with:

  ```json
        "deck": "Three product lines, seven international supplier houses across nine source countries, full agronomy support across the catalog. Browse by line below.",
  ```

- [ ] **Step 3.6: Edit `products.page.deck` (AR)**

  In `src/i18n/ar.json:170`, replace the `"deck"` value with:

  ```json
        "deck": "ثلاثة خطوط منتجات، و 7 شراكات دولية في 9 دول مصدرة، دعم زراعي كامل للكتالوج. تصفّح حسب الخط أدناه",
  ```

- [ ] **Step 3.7: Verify typecheck**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings.

- [ ] **Step 3.8: Commit**

  ```bash
  git add src/i18n/en.json src/i18n/ar.json
  git commit -m "$(cat <<'EOF'
copy: nuance about + partners + products page decks

about.headline pairs 12 with "Sudan-anchored". about.deck pairs 12
with "regional reach extends across", and 7 with 9 source countries.
partners_page.deck and products.page.deck use the same 7×9 pairing.
Closes the bragging-aggregate pattern in page-level decks.

Spec: docs/superpowers/specs/2026-05-16-aggregate-copy-nuance-design.md
EOF
)"
  ```

---

## Task 4: ByTheNumbersV3.astro doc comment (cosmetic)

**Files:**
- Modify: `src/components/home/ByTheNumbersV3.astro:5-6` (the multi-line doc comment header)

Single comment fix — keeps the doc comment in sync with the new caption strings. No logic, no markup.

- [ ] **Step 4.1: Edit the doc comment**

  Replace lines 5–6:

  ```astro
   * One giant number (39 years since 1987) + three smalls (12 MENA markets —
   * regional reach, 9 source countries, 30+ SKUs). Numbers count up from 0 on entry.
  ```

- [ ] **Step 4.2: Verify typecheck**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings.

- [ ] **Step 4.3: Commit**

  ```bash
  git add src/components/home/ByTheNumbersV3.astro
  git commit -m "$(cat <<'EOF'
docs: ByTheNumbersV3 — sync doc comment with new captions

Cosmetic. The "12 markets" / "9 source countries" caption descriptors
in the doc header now match the tightened i18n captions
(MENA markets — regional reach + Sudan active).

Spec: docs/superpowers/specs/2026-05-16-aggregate-copy-nuance-design.md
EOF
)"
  ```

---

## Task 5: Verification + grep sweep

**Files:** (none — verification only)

Confirm the production build is clean and the retired strings are gone from the rendered output. Confirm the new pairings are present.

- [ ] **Step 5.1: Run the test suite**

  Run: `npm test`
  Expected: `22 passed (22) · 94 passed (94)` or similar — no regressions. Tests don't assert on these copy strings, so the count should match the pre-change baseline exactly.

- [ ] **Step 5.2: Build for production**

  Run: `npm run build`
  Expected: `[build] 100 page(s) built` with no errors.

- [ ] **Step 5.3: Grep `dist/` for retired bare phrases (expect 0 each)**

  Run each separately and verify 0 hits per command. Each retired phrase has a clean replacement in the same string, so a non-zero hit means an edit was missed.

  ```bash
  # EN retired bare aggregates
  grep -r "twelve markets" dist/ | grep -v "twelve MENA markets" | grep -v "regional reach across twelve MENA markets" | wc -l
  grep -rc "across six countries" dist/ | grep -v ":0$" | wc -l
  grep -rc "seven international suppliers\b" dist/ | grep -v "supplier houses" | wc -l

  # AR retired bare aggregates
  grep -rc "في ست دول" dist/ | grep -v ":0$" | wc -l
  grep -rc "7 موردين دوليين" dist/ | grep -v ":0$" | wc -l
  ```

  Expected: every command's final number is `0`.

- [ ] **Step 5.4: Grep `dist/` for new pairings (expect ≥6 hits each)**

  ```bash
  grep -rc "seven international supplier houses across nine source countries" dist/ | grep -v ":0$" | wc -l
  grep -rc "7 شراكات دولية في 9 دول مصدرة" dist/ | grep -v ":0$" | wc -l
  ```

  Expected: each command's final number is `≥6` (meta_description appears in every page; about/partners/products/home decks appear in their respective pages × 2 locales).

- [ ] **Step 5.5: Decide on outcome**

  **If all greps clean:** proceed to Step 5.6.

  **If a retired phrase still appears:** identify the string key by grepping the source: `grep -rn "<retired phrase>" src/i18n/ src/data/`. Apply the missing edit per the spec. Rebuild. Re-run Step 5.3.

- [ ] **Step 5.6: Final status check + summary**

  Run: `git log --oneline main..HEAD | head -10`
  Expected: the four task commits sit at the top of the branch (Task 4 → Task 3 → Task 2 → Task 1).

  No final commit. Tasks 1-4 each committed their own changes; verification produces no diffs.

---

## Self-Review

**Spec coverage:** Every section of the spec maps to a task.
- Voice principles (always pair 7 with 9, never let 12 stand bare) → embedded in every Task 1–3 string.
- String rewrites §1-2 (`meta_description` + `companyData.business`) → Task 1.
- String rewrites §3-5 (home: hero.deck + v3numbers + sources) → Task 2.
- String rewrites §6-8 (about + partners + products) → Task 3.
- String rewrite §9 (ByTheNumbersV3 doc comment) → Task 4.
- Verification section → Task 5.

**Placeholder scan:** No TBDs. Every string is fully written out in both locales. No "similar to" or "etc." Every step has either exact code/JSON or exact bash command.

**Type consistency:** No types touched. The i18n keys (`site.meta_description`, `companyData.business.{en,ar}`, `home.hero.deck`, `home.v3numbers.{suppliers,branches}`, `home.sources.{kicker,headline_a,headline_b}`, `about.{headline,deck}`, `partners_page.{kicker,deck}`, `products.page.deck`) are all pre-existing in `i18n/types.ts` — no new keys to add. The `companyData.business.en/ar` interface in `data/company.ts` is unchanged (same shape, new values).

Plan complete.
