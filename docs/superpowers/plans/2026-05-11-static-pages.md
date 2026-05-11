# About + Contact + Privacy + Terms (Plan 5 of 5)

**Spec reference:** §6.8 About, §6.9 Contact, §6.10 Privacy & Terms.

**Goal:** Close the v1 site map. About + Contact are intentionally light on copy (pending client PDF + contact details per source-of-truth gaps); they ship with structural placeholders + clearly-marked pending chips. Privacy + Terms ship templated.

**Dependencies on Plans 1–4:** Layout, Nav, Footer, Breadcrumb, Kicker, CaptionStrip, DisclaimerChip.

**Out of scope:** Real form-submission backend (form is presentation-only with a "Quotes route via WhatsApp/email" fallback note). Map embed (placeholder until address known). Team headshots (pending client).

---

## File Structure

**Create (components):**
```
src/components/contact/
  ContactForm.astro        ← form with route selector + textarea + submit
  DirectContact.astro      ← right-column phone/email/WhatsApp panel
```

**Modify (pages — 8 files):**
```
src/pages/about.astro
src/pages/contact.astro
src/pages/privacy.astro
src/pages/terms.astro
src/pages/ar/about.astro
src/pages/ar/contact.astro
src/pages/ar/privacy.astro
src/pages/ar/terms.astro
```

**Modify:** `src/i18n/{en,ar}.json` + types — add `about.*`, `contact.*`, `legal.*` subtrees

**Tests:**
```
tests/pages/static-pages.test.ts  ← smoke for all 4 pages
```

---

## Task 1: ContactForm + DirectContact components

- [ ] **ContactForm.astro** — presentation-only; the submit button is wired to mailto: as a graceful fallback. Real backend deferred.
- [ ] **DirectContact.astro** — phone/email/WhatsApp/hours panel pulling from companyData. Shows "pending" labels where companyData has null.

## Task 2: About page (EN + AR)

5-section vertical: Hero · 3 pillars · Branches placeholder · Team placeholder · Affiliations placeholder. Each section uses CaptionStrip dividers.

## Task 3: Contact page (EN + AR)

Header + 2-col body (ContactForm left, DirectContact right). DisclaimerChip near contact details flagging "pending client confirmation".

## Task 4: Privacy + Terms pages (EN + AR)

Single-column 60ch body. Templated boilerplate (clearly marked placeholder, "consult legal before launch"). Fraunces h2 + Mono § 01 section markers + CaptionStrips between sections.

## Task 5: i18n + tests + milestone

Add all subtrees in one pass. Smoke-test all 4 routes × 2 locales = 8 page renders.

Target build: 54 + 0 new pages (4 routes already in the build as Plan 1 placeholders — these tasks *modify* them, not add). Net 54 pages remain.

```bash
git tag plan-5-static-pages
```

Final tag list: plan-1-foundation, plan-2-homepage, plan-3-products, plan-4-reports-partners, plan-5-static-pages.
