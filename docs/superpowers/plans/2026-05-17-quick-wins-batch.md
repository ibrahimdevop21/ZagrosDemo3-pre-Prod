# Quick-Wins Batch (A3 + A1 + C4 + D2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply four surgical polish edits from the 2026-05-17 spacing audit — A3 (Tailwind page-x → CSS var), A1 (uniform 96px head-to-content across 6 section h2s), C4 (UtilityBar 44px WCAG touch target), D2 (footer 44px rhythm unification). One commit at the end.

**Architecture:** No architecture change. Pure token + utility class edits across ~13 files. All four items are declarative changes — no logic, no shared state, no new abstractions.

**Tech Stack:** Astro 5, Tailwind v3, vitest, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-05-17-quick-wins-batch-design.md`
**Source audit:** `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md`
**Branch:** `feature/plan-7-world-reach`
**Commit style:** Single commit at end (per spec §"Definition of done").

---

## Task 1: Preflight — establish green baseline

**Files:** none modified (verification only)

- [ ] **Step 1: Confirm working tree clean and on the right branch**

Run:
```bash
git status
git branch --show-current
```
Expected: working tree clean, branch `feature/plan-7-world-reach`.

If working tree is dirty, STOP and resolve before proceeding. If branch is different, switch with `git checkout feature/plan-7-world-reach`.

- [ ] **Step 2: Baseline test run**

Run:
```bash
npm test
```
Expected: `94 passed, 0 failed`. If this isn't green, stop and investigate — the baseline must be clean before we add changes.

- [ ] **Step 3: Baseline build**

Run:
```bash
npm run build
```
Expected: build completes, "100 page(s) built", no errors.

If build fails on baseline, stop and investigate before changing anything.

- [ ] **Step 4: Record baseline file mtimes (optional sanity)**

Run:
```bash
ls -la tailwind.config.mjs src/components/global/UtilityBar.astro src/components/global/Footer.astro src/components/home/{CatalogStrips,PartnersSection,FieldReportsTeaser,WorldReach,CustomersWall,QuoteCTA}.astro
```
Expected: all 9 files listed. Confirms we have the right files to touch.

---

## Task 2: A3 — Tailwind `page-x` → CSS-var reference

**Files:**
- Modify: `tailwind.config.mjs:57`

- [ ] **Step 1: Apply the edit**

Replace line 57 of `tailwind.config.mjs`:

```diff
-        'page-x':          '56px',
+        'page-x':          'var(--page-margin-x)',
```

Full context (surrounding lines for orientation):
```js
      spacing: {
        // Raw scale — spec §3.1
        'sp-1': '4px',   'sp-2': '8px',   'sp-3': '12px',  'sp-4': '16px',
        'sp-5': '24px',  'sp-6': '32px',  'sp-7': '48px',  'sp-8': '64px',
        'sp-9': '96px',  'sp-10': '144px','sp-11': '200px',
        // Semantic role tokens — spec §3.2
        'section-y':       '144px',
        'section-y-major': '200px',
        'head-to-content': '96px',
        'card-photo-gap':  '32px',
        'card-kicker-gap': '16px',
        'card-head-gap':   '24px',
        'card-summary-gap':'32px',
        'page-x':          'var(--page-margin-x)',  // ← edited
      },
```

- [ ] **Step 2: Build to verify Tailwind accepts the CSS-var reference**

Run:
```bash
npm run build
```
Expected: build succeeds with no Tailwind warnings about invalid spacing values. 100 pages built.

If build warns about the value: STOP. Tailwind v3 supports CSS vars in spacing values, but if a warning surfaces, downgrade to `'calc(var(--page-margin-x) * 1)'` (works around any string-parsing strictness).

- [ ] **Step 3: Verify at the CSS layer**

Run:
```bash
grep -r "padding-left:var(--page-margin-x)\|padding-right:var(--page-margin-x)" dist/ | head -5
```
Expected: at least one match — the built CSS contains `padding-left:var(--page-margin-x)` somewhere (from any element using `px-page-x`).

If no match, the var rewrite didn't propagate. Recheck the edit.

---

## Task 3: A1 — Apply `head-to-content` token to 6 section h2s

**Files:**
- Modify: `src/components/home/CatalogStrips.astro:38`
- Modify: `src/components/home/PartnersSection.astro:34`
- Modify: `src/components/home/FieldReportsTeaser.astro:46`
- Modify: `src/components/home/WorldReach.astro:91`
- Modify: `src/components/home/CustomersWall.astro:29`
- Modify: `src/components/home/QuoteCTA.astro:27`

- [ ] **Step 1: Edit CatalogStrips.astro:38**

Find:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
```
Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-head-to-content" data-reveal style="--reveal-delay: 100ms;">
```

(Just `mb-sp-9` → `mb-head-to-content` — both resolve to 96px, no visual change here.)

- [ ] **Step 2: Edit PartnersSection.astro:34**

Find:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[24ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
```
Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[24ch] mb-head-to-content" data-reveal style="--reveal-delay: 100ms;">
```

(`mb-sp-9` → `mb-head-to-content`, no visual change.)

- [ ] **Step 3: Edit FieldReportsTeaser.astro:46**

Find:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
```
Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-head-to-content" data-reveal style="--reveal-delay: 100ms;">
```

(`mb-sp-9` → `mb-head-to-content`, no visual change.)

- [ ] **Step 4: Edit WorldReach.astro:91**

Find (the class line of the `<h2>` block at lines 90-97):
```astro
    class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[28ch] mb-sp-8"
```
Replace with:
```astro
    class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[28ch] mb-head-to-content"
```

(`mb-sp-8` → `mb-head-to-content`. **Section grows by 32px below h2** — 64 → 96.)

- [ ] **Step 5: Edit CustomersWall.astro:29**

Find:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-paper max-w-[24ch] mb-sp-7" data-reveal style="--reveal-delay: 100ms;">
```
Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-paper max-w-[24ch] mb-head-to-content" data-reveal style="--reveal-delay: 100ms;">
```

(`mb-sp-7` → `mb-head-to-content`. **Section grows by 48px below h2** — 48 → 96.)

- [ ] **Step 6: Edit QuoteCTA.astro:27**

Find:
```astro
<h2 class="font-display italic font-light text-[clamp(40px,7vw,84px)] leading-[1] text-paper max-w-[18ch] mb-sp-7" data-reveal style="--reveal-delay: 100ms;">
```
Replace with:
```astro
<h2 class="font-display italic font-light text-[clamp(40px,7vw,84px)] leading-[1] text-paper max-w-[18ch] mb-head-to-content" data-reveal style="--reveal-delay: 100ms;">
```

(`mb-sp-7` → `mb-head-to-content`. **Section grows by 48px below h2** — 48 → 96. Note the separate `mb-sp-9` on the CTA buttons row at line 31 stays untouched — that's a different gap.)

- [ ] **Step 7: Verify all 6 edits applied**

Run:
```bash
grep -rn "mb-head-to-content" src/components/home/
```
Expected output: **6 matches** — one each in CatalogStrips, PartnersSection, FieldReportsTeaser, WorldReach, CustomersWall, QuoteCTA.

```bash
grep -rn "mb-sp-9\|mb-sp-8\|mb-sp-7" src/components/home/
```
Expected: no matches on the h2 lines we just edited. (Other `mb-sp-*` elsewhere is fine — only the h2-to-content gap was targeted.)

- [ ] **Step 8: Build to verify Tailwind generates the utility**

Run:
```bash
npm run build
```
Expected: build succeeds. Tailwind generates `.mb-head-to-content { margin-bottom: 96px; }` because `head-to-content: 96px` is already in `tailwind.config.mjs`.

Verify in built CSS:
```bash
grep -l "mb-head-to-content\|head-to-content" dist/_astro/*.css | head -3
```
Expected: at least one CSS file matches.

---

## Task 4: C4 — UtilityBar 44px touch target

**Files:**
- Modify: `src/components/global/UtilityBar.astro:12` and `:18`

- [ ] **Step 1: Edit UtilityBar.astro:12 (grow the bar)**

Find:
```astro
<div class="bg-ink text-paper/60 px-page-x py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] flex justify-between items-center">
```
Replace with:
```astro
<div class="bg-ink text-paper/60 px-page-x py-sp-4 font-mono text-[11px] uppercase tracking-[0.22em] flex justify-between items-center">
```

(`py-2.5` → `py-sp-4`. Vertical padding grows from 10px each side to 16px each side. Bar grows from ~34px to ~46px total.)

- [ ] **Step 2: Edit UtilityBar.astro:18 (44px touch target on phone link)**

Find:
```astro
{phone && <a href={`tel:${phoneTel}`} dir="ltr" class="inline-flex items-center min-h-[36px] text-paper/60 no-underline hover:text-paper">{phone}</a>}
```
Replace with:
```astro
{phone && <a href={`tel:${phoneTel}`} dir="ltr" class="inline-flex items-center min-h-[44px] text-paper/60 no-underline hover:text-paper">{phone}</a>}
```

(`min-h-[36px]` → `min-h-[44px]`. WCAG 2.5.5 Target Size compliance.)

- [ ] **Step 3: Verify edits applied**

Run:
```bash
grep -n "py-sp-4\|min-h-\[44px\]" src/components/global/UtilityBar.astro
```
Expected output:
- Line 12: contains `py-sp-4`
- Line 18: contains `min-h-[44px]`

```bash
grep -n "py-2.5\|min-h-\[36px\]" src/components/global/UtilityBar.astro
```
Expected: no matches.

- [ ] **Step 4: Build to verify no regressions**

Run:
```bash
npm run build
```
Expected: build succeeds, 100 pages.

---

## Task 5: D2 — Footer `leading-[2.15]` removal, 44px rhythm unified

**Files:**
- Modify: `src/components/global/Footer.astro:57, 66, 76, 78, 88, 89`

- [ ] **Step 1: Edit Footer.astro:57 (Products link — drop leading)**

Find:
```astro
        <li><a href={isRTL ? '/ar/products' : '/products'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px] leading-[2.15]">{t('nav.products')}</a></li>
```
Replace with:
```astro
        <li><a href={isRTL ? '/ar/products' : '/products'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px]">{t('nav.products')}</a></li>
```

(Drop ` leading-[2.15]`. The `min-h-[44px]` parent height stays; visual rhythm preserved by container, not by line-height.)

- [ ] **Step 2: Edit Footer.astro:66 (Field reports link — drop leading)**

Find:
```astro
        <li><a href={isRTL ? '/ar/field-reports' : '/field-reports'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px] leading-[2.15]">{t('nav.field_reports')}</a></li>
```
Replace with:
```astro
        <li><a href={isRTL ? '/ar/field-reports' : '/field-reports'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px]">{t('nav.field_reports')}</a></li>
```

- [ ] **Step 3: Edit Footer.astro:76 ("— pending —" placeholder — add 44px container)**

Find:
```astro
          <li class="text-paper/55 font-mono text-[12px] leading-[2.15]">— pending —</li>
```
Replace with:
```astro
          <li class="flex items-center min-h-[44px] text-paper/55 font-mono text-[12px]">— pending —</li>
```

(Drop `leading-[2.15]`. Add `flex items-center min-h-[44px]` so the placeholder occupies a 44px row matching the branch list rhythm.)

- [ ] **Step 4: Edit Footer.astro:78 (branch name list item — add 44px container)**

Find:
```astro
          ) : branches.map((b) => (
            <li class="text-paper/85 font-sans text-[15px] leading-[2.15]">{isRTL ? b.name.ar : b.name.en}</li>
          ))}
```
Replace with:
```astro
          ) : branches.map((b) => (
            <li class="flex items-center min-h-[44px] text-paper/85 font-sans text-[15px]">{isRTL ? b.name.ar : b.name.en}</li>
          ))}
```

(Drop `leading-[2.15]`. Add `flex items-center min-h-[44px]` — branch column rhythm now matches link columns. **Visual effect:** branch list grows from ~384px to ~528px tall for 12 cities.)

- [ ] **Step 5: Edit Footer.astro:88 (About link — drop leading)**

Find:
```astro
        <li><a href={isRTL ? '/ar/about' : '/about'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px] leading-[2.15]">{t('nav.about')}</a></li>
```
Replace with:
```astro
        <li><a href={isRTL ? '/ar/about' : '/about'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px]">{t('nav.about')}</a></li>
```

- [ ] **Step 6: Edit Footer.astro:89 (Contact link — drop leading)**

Find:
```astro
        <li><a href={isRTL ? '/ar/contact' : '/contact'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px] leading-[2.15]">{t('nav.contact')}</a></li>
```
Replace with:
```astro
        <li><a href={isRTL ? '/ar/contact' : '/contact'} class="inline-flex items-center min-h-[44px] text-paper/85 no-underline font-sans text-[15px]">{t('nav.contact')}</a></li>
```

- [ ] **Step 7: Verify all 6 edits applied**

Run:
```bash
grep -n "leading-\[2.15\]" src/components/global/Footer.astro
```
Expected: **no matches**. All 6 occurrences removed.

```bash
grep -c "min-h-\[44px\]" src/components/global/Footer.astro
```
Expected: **6** (4 link items unchanged, 2 non-link items newly added).

- [ ] **Step 8: Build to verify**

Run:
```bash
npm run build
```
Expected: build succeeds, 100 pages.

---

## Task 6: Final verification — tests + visual + WCAG

**Files:** none modified (verification only)

- [ ] **Step 1: Full test suite**

Run:
```bash
npm test
```
Expected: `94 passed, 0 failed`. Same as baseline.

If any test fails: investigate which test, which file it touches. Most likely candidate: a snapshot test if one exists for these components. If so, regenerate snapshots only after eyeballing the diff:
```bash
npm test -- -u
# then re-run npm test to confirm green
```

- [ ] **Step 2: Build still green**

Run:
```bash
npm run build
```
Expected: build succeeds, "100 page(s) built", no warnings.

- [ ] **Step 3: Start dev server for visual check**

Run:
```bash
npm run dev
```
Note the URL printed (typically `http://localhost:4321/`). Server runs in background — leave it on.

- [ ] **Step 4: Visual check at 1440px viewport**

Open `http://localhost:4321/` in a browser sized to 1440×900. Check sequentially:

1. **UtilityBar (top of page):** taller than before (~46px instead of ~34px). Service-area pill on left, phone link + partners label on right.
2. **Phone link tap target:** hover the phone number — devtools shows bounding box ≥44px tall.
3. **Scroll to CatalogStrips:** h2 → cards gap = 96px (no visible change from baseline).
4. **Scroll to PartnersSection:** h2 → grid gap = 96px (no visible change).
5. **Scroll to FieldReportsTeaser:** h2 → grid gap = 96px (no visible change).
6. **Scroll to CustomersWall:** h2 → pull-quote gap = 96px (was 48px — **looser than before**).
7. **Scroll to WorldReach:** h2 → map+aside grid gap = 96px (was 64px — **slightly looser**).
8. **Scroll to QuoteCTA:** h2 → CTA buttons row = 96px (was 48px — **looser**).
9. **Footer:** all four columns (Catalog/Reports/Branches/Company) have uniform 44px-per-item vertical rhythm. Branch column visibly taller than before.

- [ ] **Step 5: Visual check at 1024px viewport**

Resize browser to 1024×768. Re-check the same items. Particular attention:

- Footer four-column layout at the `lg:` breakpoint — note any crowding (this is audit finding D5, out of scope for this batch but useful to confirm we haven't made it worse).
- A1 changes still render correctly at this width.

- [ ] **Step 6: Visual check at 375px viewport**

Resize to 375×667 (iPhone SE). Check:

1. UtilityBar visible, status pill left-aligned, taller (~46px). Phone link/partners hidden (per `hidden md:flex`).
2. Mobile nav drawer trigger (hamburger) on the right.
3. Page gutter is **20px** (A3 effect — `--page-margin-x` resolves to 20px below 640px, now propagates through `px-page-x`).
4. All h2 → content gaps at 96px (responsive but the `head-to-content` token is viewport-independent).

- [ ] **Step 7: WCAG 2.5.5 verification**

In devtools, open the inspector and hover the UtilityBar phone link. Verify in the layout overlay:
- Bounding box height ≥ 44px ✓
- Bounding box width ≥ 44px (depends on phone number length — typical `+249 912 338 559` rendered in mono at 11px tracking should be ~150px wide, well over 44px) ✓

If the link's bounding box is <44px tall, the `min-h-[44px]` didn't propagate. Re-check the Task 4 Step 2 edit.

- [ ] **Step 8: AR locale spot-check**

Navigate to `http://localhost:4321/ar/`. Verify:
- h2 → content gaps look uniform across sections (head-to-content is direction-agnostic).
- UtilityBar renders correctly in RTL.
- Footer columns at 44px rhythm in AR.

- [ ] **Step 9: Stop dev server**

Send `Ctrl+C` to the dev-server process or kill the background bash. Server stops; verification phase complete.

---

## Task 7: Single commit

**Files:** all four touched files (none new).

- [ ] **Step 1: Review the diff**

Run:
```bash
git diff --stat
git diff
```
Expected:
- `tailwind.config.mjs` — 1 line changed (A3)
- `src/components/global/UtilityBar.astro` — 2 lines changed (C4)
- `src/components/global/Footer.astro` — 6 lines changed (D2)
- `src/components/home/CatalogStrips.astro` — 1 line changed (A1)
- `src/components/home/PartnersSection.astro` — 1 line changed (A1)
- `src/components/home/FieldReportsTeaser.astro` — 1 line changed (A1)
- `src/components/home/WorldReach.astro` — 1 line changed (A1)
- `src/components/home/CustomersWall.astro` — 1 line changed (A1)
- `src/components/home/QuoteCTA.astro` — 1 line changed (A1)

**9 files changed, ~15 lines edited total.**

If the diff includes any file not in this list: STOP and investigate. Something was edited unintentionally.

- [ ] **Step 2: Stage the changes**

Run:
```bash
git add tailwind.config.mjs \
  src/components/global/UtilityBar.astro \
  src/components/global/Footer.astro \
  src/components/home/CatalogStrips.astro \
  src/components/home/PartnersSection.astro \
  src/components/home/FieldReportsTeaser.astro \
  src/components/home/WorldReach.astro \
  src/components/home/CustomersWall.astro \
  src/components/home/QuoteCTA.astro
git status
```
Expected: 9 files staged, 0 unstaged changes.

- [ ] **Step 3: Commit**

Run:
```bash
git commit -m "$(cat <<'EOF'
polish: quick-wins batch (A3 + A1 + C4 + D2) — audit pickup round 1

Closes the first four items from the 2026-05-17 spacing audit:

A3 — Tailwind 'page-x' now points at var(--page-margin-x), restoring
     the responsive 56/20px gutter on every px-page-x utility (was
     frozen at 56px static, breaking mobile alignment with stage-grid).

A1 — head-to-content token (96px, already in config) applied
     uniformly across all 6 section h2s. WorldReach +32px,
     CustomersWall +48px, QuoteCTA +48px below h2. Three other
     sections were already at 96px.

C4 — UtilityBar grown from py-2.5 to py-sp-4 (10→16px each side);
     phone link min-h bumped from 36px to 44px (WCAG 2.5.5).

D2 — leading-[2.15] hack removed from 6 Footer items. Link columns
     unchanged (already had min-h-[44px] container). Branch list
     and pending placeholder gain flex items-center min-h-[44px] so
     all four footer columns share one 44px rhythm.

Spec:  docs/superpowers/specs/2026-05-17-quick-wins-batch-design.md
Plan:  docs/superpowers/plans/2026-05-17-quick-wins-batch.md
Audit: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md

Next pick from the audit: B1 (horizontal-primitive unification) —
own brainstorm cycle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```
Expected: commit succeeds. Pre-commit hooks (if any) pass.

- [ ] **Step 4: Verify commit landed**

Run:
```bash
git log --oneline -3
git status
```
Expected:
- New commit shows `polish: quick-wins batch (A3 + A1 + C4 + D2) — audit pickup round 1` at HEAD
- Working tree clean
- Branch still `feature/plan-7-world-reach`

- [ ] **Step 5: Done**

Report to user: 4 audit items closed in 1 commit on `feature/plan-7-world-reach`. Tests 94/94. Build 100 pages. WCAG 2.5.5 verified on UtilityBar phone link.

Next pick from the audit (per spec §"Next step after this batch"): **B1** — horizontal-primitive unification. That needs its own brainstorm cycle.

---

## Self-review

**1. Spec coverage:**

| Spec section | Plan task |
|--------------|-----------|
| A3 (tailwind.config.mjs:57) | Task 2 |
| A1 — 6 component h2 edits | Task 3 (steps 1-6) |
| C4 — UtilityBar lines 12 & 18 | Task 4 (steps 1-2) |
| D2 — Footer 6 line edits (4 links + 2 non-links) | Task 5 (steps 1-6) |
| Testing strategy: build green | Tasks 1, 2, 3 (step 8), 4 (step 4), 5 (step 8), 6 (step 2) |
| Testing strategy: tests stay green | Tasks 1 (step 2), 6 (step 1) |
| Testing strategy: visual at 3 viewports | Task 6 (steps 4, 5, 6) |
| Testing strategy: WCAG verification | Task 6 (step 7) |
| Testing strategy: AR locale spot-check | Task 6 (step 8) |
| Definition of done: single commit | Task 7 |

All spec items covered. ✓

**2. Placeholder scan:** none. Every step contains the exact diff or the exact command. ✓

**3. Type consistency:** N/A — no new types or interfaces. Tailwind class names verified against tailwind.config.mjs spacing keys (`head-to-content`, `sp-4`, `page-x`). ✓
