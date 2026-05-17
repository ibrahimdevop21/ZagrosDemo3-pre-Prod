# Audit close-out batch — implementation plan

> **For agentic workers:** Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every remaining audit polish item in one batched pass — Nav, Footer, Hero rhythm, orphan tokens, and DESIGN.md close-out notes. Five phases, one commit per phase, build + tests green between.

**Scope items (from `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md`):**

| ID | Item | Decision |
|----|------|----------|
| **A2** | `card-*-gap` orphan tokens (4 defined, 0 used) | **Delete.** YAGNI — never wired, no consistent card structure that uses all four roles. |
| **C1** | Nav `py-sp-4` → `py-sp-5` (16 → 24px) | Apply. |
| **C2** | Lang toggle `min-h-[40px]` → `min-h-[44px]` | Apply. |
| **C3** | Nav pill paddings standardize to `px-sp-4 py-sp-3` | Apply across Nav lang-toggle, Nav CTA, MobileNavDrawer lang-toggle. |
| **D1** | Footer `pt-section-y pb-sp-7` (144/48) → `pt-sp-9 pb-sp-8` (96/64) | Apply. Pulls footer up, restores 144/96/64/40 scale rhythm. |
| **D3** | Newsletter raw literals → tokens | Apply: `mb-3` → `mb-sp-3`, `px-3.5 py-3` → `px-sp-4 py-sp-3`, `px-5 py-3` → `px-sp-5 py-sp-3`. |
| **D4** | Colophon `mt-sp-9 pt-sp-5` (120px gap) → `mt-sp-7 pt-sp-5` (72px gap) | Apply. |
| **D6** | Footer branch names differentiate from links | Apply via size + opacity: branches `text-[14px] text-paper/65` vs links `text-[15px] text-paper/85`. Conservative (works in EN + AR; avoids font-mono which breaks Arabic). |
| **E6** | Hero `pt-sp-7 pb-sp-6` (48/32) → `pt-sp-8 pb-sp-7` (64/48) | Apply. Weighted-top, editorial open. |
| **E3** | Hero → marquee glue | **Close by docs.** Marquee is chrome (slim band at `py-sp-3`), Hero ends at `pb-sp-7` after E6. The join is intentional. |
| **E8** | Card padding inconsistent across home sections | **Close by docs.** Variation is role-based (logo tiles need tight padding, hero cards need editorial padding, info cards in between). Not drift. |
| **E9** | Card-internal rhythm drift | **Close by docs.** Same reasoning as E8 — varies by card role, not random. |
| **C5, D5, E4, E5, E7** | Already closed by earlier commits | Note in DESIGN.md close-out section. |

**Spec basis:** `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md` + spine spec `f61b88d` for tokenization discipline.
**Branch:** `feature/plan-7-world-reach`
**Commit style:** One commit per phase, 5 phases.

---

## Phase 1 — A2: Delete orphan card-*-gap tokens

**Files:**
- Modify: `tailwind.config.mjs`

- [ ] **Step 1: Remove the four orphan tokens**

Find lines 53-56 of `tailwind.config.mjs`:
```js
        'card-photo-gap':  '32px',
        'card-kicker-gap': '16px',
        'card-head-gap':   '24px',
        'card-summary-gap':'32px',
```
Delete all four lines.

- [ ] **Step 2: Verify nothing in src references these tokens**

Run:
```bash
grep -rln "card-photo-gap\|card-kicker-gap\|card-head-gap\|card-summary-gap" src/
```
Expected: **no matches**.

- [ ] **Step 3: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94 tests.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.mjs
git commit -m "$(cat <<'EOF'
audit close-out: A2 — delete orphan card-*-gap tokens

card-photo-gap, card-kicker-gap, card-head-gap, card-summary-gap
were defined in tailwind.config.mjs but never used. Per the audit's
A2 finding and a YAGNI judgement: cards in this codebase don't
share a four-role structure (photo / kicker / head / summary), so
the tokens were aspirational. Deleting them is cleaner than wiring
a Card primitive nobody asked for.

If future cards adopt a common structure, the tokens come back
together with the primitive that uses them.

Spec: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md §A2

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Nav polish (C1 + C2 + C3)

**Files:**
- Modify: `src/components/global/Nav.astro`
- Modify: `src/components/global/MobileNavDrawer.astro`

- [ ] **Step 1: Nav padding bump (C1)**

In `Nav.astro`, find:
```astro
<nav class="bg-paper border-b border-stone py-sp-4 sticky top-0 z-40 backdrop-blur-sm">
```
Replace `py-sp-4` with `py-sp-5` (16px → 24px vertical, editorial masthead norm).

- [ ] **Step 2: Lang toggle 44px touch + token padding (C2 + C3)**

In `Nav.astro`, find:
```astro
      <a
        href={altLocaleHref}
        class="font-mono text-[11px] tracking-[0.18em] px-3.5 py-2 border border-stone rounded-full text-ink no-underline inline-flex items-center min-h-[40px]"
      >
```
Replace classes with:
```
font-mono text-[11px] tracking-[0.18em] px-sp-4 py-sp-3 border border-stone rounded-full text-ink no-underline inline-flex items-center min-h-[44px]
```

(Three changes in one: `px-3.5 py-2` → `px-sp-4 py-sp-3`; `min-h-[40px]` → `min-h-[44px]`.)

- [ ] **Step 3: Nav CTA token padding (C3)**

In `Nav.astro`, find:
```astro
      <a
        href={isRTL ? '/ar/contact' : '/contact'}
        class="bg-ink text-paper font-sans font-medium text-[13px] px-4 py-2.5 rounded-full no-underline inline-flex items-center gap-2 min-h-[44px]"
      >
```
Replace `px-4 py-2.5` with `px-sp-4 py-sp-3`. (Standardizes with the lang toggle. Min-h already 44.)

- [ ] **Step 4: MobileNavDrawer lang toggle (C3)**

In `MobileNavDrawer.astro`, find:
```astro
    <a
      href={altLocaleHref}
      class="self-start font-mono text-[11px] tracking-[0.18em] px-3.5 py-2.5 border border-stone rounded-full text-ink no-underline mb-sp-7 min-h-[44px] inline-flex items-center"
    >
```
Replace `px-3.5 py-2.5` with `px-sp-4 py-sp-3`.

- [ ] **Step 5: Verify**

```bash
grep -n "px-3.5\|py-2\b\|py-2.5\|py-sp-4 sticky\|min-h-\[40px\]" src/components/global/Nav.astro src/components/global/MobileNavDrawer.astro
```
Expected: no matches on those old patterns. `py-sp-5` should appear once on the nav element; `px-sp-4 py-sp-3` should appear three times (Nav lang, Nav CTA, drawer lang).

```bash
grep -c "px-sp-4 py-sp-3" src/components/global/Nav.astro src/components/global/MobileNavDrawer.astro
```
Expected: 2 in Nav.astro, 1 in MobileNavDrawer.astro.

- [ ] **Step 6: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94.

- [ ] **Step 7: Commit**

```bash
git add src/components/global/Nav.astro src/components/global/MobileNavDrawer.astro
git commit -m "$(cat <<'EOF'
audit close-out: Nav polish (C1 + C2 + C3)

C1 — Nav vertical padding py-sp-4 → py-sp-5 (16 → 24px).
     Editorial-masthead vertical rhythm.

C2 — Desktop nav language toggle min-h-[40px] → min-h-[44px].
     Matches the adjacent CTA height; eliminates touch-target
     asymmetry across the right-cluster pills.

C3 — All three nav pills now use px-sp-4 py-sp-3 (16/12px).
     Replaces three different ad-hoc paddings:
       Nav lang:        px-3.5 py-2
       Nav CTA:         px-4 py-2.5
       MobileNav lang:  px-3.5 py-2.5
     Token discipline + visual consistency.

Spec: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md §C1-C3

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Footer rhythm + typography (D1 + D3 + D4 + D6)

**Files:**
- Modify: `src/components/global/Footer.astro`

- [ ] **Step 1: Footer top/bottom rhythm (D1)**

Find:
```astro
<footer class="bg-ink text-paper border-t border-paper/10 pt-section-y pb-sp-7">
```
Replace `pt-section-y pb-sp-7` (144/48) with `pt-sp-9 pb-sp-8` (96/64). Pulls the footer up and lands on the editorial 144/96/64/40 scale.

- [ ] **Step 2: Newsletter form literals → tokens (D3)**

Find:
```astro
        <label class="block font-mono text-[10.5px] tracking-[0.22em] uppercase text-signal mb-3">
```
Replace `mb-3` with `mb-sp-3`.

Find:
```astro
            <input
              type="email"
              placeholder={t('footer.newsletter_placeholder')}
              class="flex-1 bg-transparent text-paper border border-paper/20 px-3.5 py-3 font-sans text-base min-h-[44px] outline-none focus:border-signal"
            />
```
Replace `px-3.5 py-3` with `px-sp-4 py-sp-3`.

Find:
```astro
            <button
              type="submit"
              class="bg-signal text-ink font-sans font-semibold text-[14px] px-5 py-3 min-h-[44px] border-none cursor-pointer"
            >
```
Replace `px-5 py-3` with `px-sp-5 py-sp-3`.

- [ ] **Step 3: Colophon gap (D4)**

Find:
```astro
      <div class="col-span-12 mt-sp-9 pt-sp-5 border-t border-paper/10 flex justify-between font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/50">
```
Replace `mt-sp-9` with `mt-sp-7` (96px → 48px). Colophon-vs-columns gap drops from 120px combined to 72px.

- [ ] **Step 4: Branch list differentiation (D6)**

Find:
```astro
          ) : branches.map((b) => (
            <li class="flex items-center min-h-[44px] text-paper/85 font-sans text-[15px]">{isRTL ? b.name.ar : b.name.en}</li>
          ))}
```
Replace classes with:
```
flex items-center min-h-[44px] text-paper/65 font-sans text-[14px]
```

(Branch names: 14px @ 65% opacity vs link items 15px @ 85% opacity. Subtle differentiation through size + opacity — works identically in EN and AR. Font family stays sans to avoid Latin-mono fallback issues in Arabic.)

Also update the "— pending —" placeholder at line ~76 for consistency:
```astro
          <li class="flex items-center min-h-[44px] text-paper/55 font-mono text-[12px]">— pending —</li>
```
Leave as-is. (Pending placeholder is a placeholder; the mono treatment marks it as "machine state, not city name". Different role, different treatment.)

- [ ] **Step 5: Verify**

```bash
grep -n "pt-section-y\|pb-sp-7\|mb-3\b\|px-3.5 py-3\|px-5 py-3\|mt-sp-9" src/components/global/Footer.astro
```
Expected: no matches.

```bash
grep -n "pt-sp-9\|pb-sp-8\|mb-sp-3\|mt-sp-7" src/components/global/Footer.astro
```
Expected: each appears at least once.

```bash
grep -n "text-paper/65 font-sans text-\[14px\]" src/components/global/Footer.astro
```
Expected: 1 match (branch name list item).

- [ ] **Step 6: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94.

- [ ] **Step 7: Commit**

```bash
git add src/components/global/Footer.astro
git commit -m "$(cat <<'EOF'
audit close-out: Footer polish (D1 + D3 + D4 + D6)

D1 — pt-section-y pb-sp-7 (144/48) → pt-sp-9 pb-sp-8 (96/64).
     Pulls the footer up; both values now on the documented
     editorial scale (144/96/64/40). Also closes E7 — the CTA →
     footer seam now totals ~96 + 96 = 192px (was ~344px).

D3 — Newsletter form literals → tokens:
       mb-3       → mb-sp-3
       px-3.5 py-3 → px-sp-4 py-sp-3
       px-5 py-3   → px-sp-5 py-sp-3
     Visually identical, token-correct.

D4 — Colophon row gap mt-sp-9 → mt-sp-7 (96 → 48px). The combined
     gap from column-block to colophon drops from 120px to 72px,
     trimming dead air at the footer bottom.

D6 — Branch list city names differentiate from link items:
       Links:    font-sans text-[15px] text-paper/85
       Branches: font-sans text-[14px] text-paper/65
     Size + opacity differentiation works identically in EN and AR
     (font-mono was rejected because Plex Mono doesn't carry Arabic
     glyphs and would force a system-font fallback for AR city
     names). Pending placeholder stays in mono — that's a machine
     state, not a city name.

Spec: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md §D1, D3, D4, D6

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Hero rhythm (E6)

**Files:**
- Modify: `src/components/home/HeroV3.astro`

- [ ] **Step 1: Weighted-top hero rhythm**

Find:
```astro
  <div class="relative z-20 flex flex-col min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] pt-sp-7 pb-sp-6">
```
Replace `pt-sp-7 pb-sp-6` (48/32) with `pt-sp-8 pb-sp-7` (64/48).

- [ ] **Step 2: Build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HeroV3.astro
git commit -m "$(cat <<'EOF'
audit close-out: Hero rhythm (E6)

HeroV3 content wrapper pt-sp-7 pb-sp-6 → pt-sp-8 pb-sp-7
(48/32 → 64/48). Weighted-top, on the editorial scale. The hero's
top row (kicker + est pill) now sits with the breathing room
appropriate for a chapter open, and the meta row at the bottom
keeps a deliberate 48px from the section bottom.

Spec: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md §E6

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Phase 5 — DESIGN.md audit close-out + reasoning for deferred items

**Files:**
- Modify: `DESIGN.md`

- [ ] **Step 1: Add an "Audit close-out" section to DESIGN.md**

Append the following block to the end of `DESIGN.md`:

```markdown
## Audit close-out (2026-05-17)

The `docs/superpowers/audits/2026-05-17-spacing-polish-audit.md` punch list is fully reconciled. Closed items below; items closed by reasoning (rather than code change) document the design call so future audits don't re-flag them.

**Closed by code:**
- **A1, A3** — closed in `e13b5ea` (quick-wins batch).
- **A2** — closed in `[phase 1 commit]`: orphan card-*-gap tokens deleted (YAGNI).
- **B1, B2, B3, B4, B5, E1, E2** — closed by the layout spine migration (`ce94c16` through `b860f0c`). One `.container-spine` primitive, one `--section-y` token, one type scale per peer role.
- **C1, C2, C3** — closed in `[phase 2 commit]`: Nav vertical padding bumped, lang toggle to 44px, all three pills standardized on `px-sp-4 py-sp-3`.
- **C4, C5** — closed in `e13b5ea`: UtilityBar phone link to 44px + bar grown to `py-sp-4` token.
- **D1, D3, D4, D6** — closed in `[phase 3 commit]`: footer pt/pb to 96/64, newsletter literals to tokens, colophon gap tightened, branch names differentiated from links via size + opacity.
- **D2** — closed in `e13b5ea`: `leading-[2.15]` hack removed; footer items now share `min-h-[44px] flex items-center` rhythm.
- **D5** — closed by the spine Phase 2 footer rewrite (`97715dd`): the new `col-span-12 / sm:col-span-3 / lg:col-span-2` responsive scheme replaced the crowded `col-start-{7,9,11,13}` placement.
- **E4** — closed in spine Phase 3 (`fa9e188`): marquee `py-3` literal → `py-sp-3` token.
- **E5** — closed in spine Phase 2 (`97715dd`): CaptionStrip `py-4` literal → `py-sp-4` token.
- **E6** — closed in `[phase 4 commit]`: Hero content wrapper to `pt-sp-8 pb-sp-7`.
- **E7** — closed automatically by D1: footer top pulled up to 96px, CTA→footer seam now reasonable.

**Closed by reasoning (no code change needed):**
- **E3** — Hero → OpsTickerMarquee join. Marquee is a chrome band by design (slim ticker at `py-sp-3`); after E6 the hero ends at `pb-sp-7`. The join is intentional. The marquee should feel attached to the hero — it's an ops ticker, not a content section.
- **E8** — Card padding "inconsistent" sitewide. The variation is **role-based, not drift**:
  - Tiny logo tiles (`CustomersWall`): `p-sp-3` — logos need tight padding to read at small sizes.
  - Compact tiles (`PartnersSection`): `p-sp-4` — tile density.
  - Standard editorial cards (`CatalogStrips`, `FieldReportsTeaser`): `p-sp-5 sm:p-sp-6` — full editorial padding.
  - Info blocks (`WorldReach` credentials, scope note): `p-sp-5` — informational density.
  - Utility blocks (`WorldReach` map+aside): `p-sp-4 sm:p-sp-5` — utilitarian.
  Each card-class has one consistent padding for its role. There is no sitewide single `card-padding` token because cards don't share a single role.
- **E9** — Card-internal vertical rhythm. Same reasoning as E8 — `gap-sp-3` (info cards), `gap-sp-4` (editorial cards), `mb-sp-2`/`mb-sp-3` (small cards) all match the role of the card class. Not random drift.
```

(Substitute the actual commit hashes for `[phase N commit]` after committing each phase. Or leave them as TODOs to fix in the final docs commit.)

- [ ] **Step 2: Verify DESIGN.md still parses**

Run:
```bash
wc -l DESIGN.md
```
Expected: roughly +50 lines vs baseline.

- [ ] **Step 3: Build + tests (no impact expected since docs)**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94.

- [ ] **Step 4: Commit (with commit hashes filled in)**

After committing Phases 1-4, retrieve their hashes via `git log --oneline -5` and substitute them into the DESIGN.md text before committing this phase.

```bash
git add DESIGN.md
git commit -m "$(cat <<'EOF'
docs: DESIGN.md — audit close-out (2026-05-17 audit fully reconciled)

Add an "Audit close-out" section to DESIGN.md that reconciles every
finding in docs/superpowers/audits/2026-05-17-spacing-polish-audit.md
against the commits that closed it. For items closed by reasoning
(E3, E8, E9), document the design call so a future audit doesn't
re-flag the same thing — the card-padding variation is role-based,
not drift; the hero→ticker join is intentional, not a missing gap.

Closed by code: A1, A2, A3, B1-B5, C1-C5, D1-D6, E1, E2, E4-E7
Closed by reasoning: E3, E8, E9

The audit's punch list is now empty.

Spec: docs/superpowers/audits/2026-05-17-spacing-polish-audit.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Final verification (before stop)

- [ ] **Step 1: No old patterns remain**

```bash
grep -rln "px-page-x\|stage-grid\|section-y-major\|leading-\[2.15\]\|min-h-\[40px\]\|min-h-\[36px\]\|py-2.5\|px-3.5\|card-photo-gap\|card-kicker-gap\|card-head-gap\|card-summary-gap" src/
```
Expected: no matches in any source file.

- [ ] **Step 2: Final build + tests**

```bash
npm run build && npm test
```
Expected: 100 pages, 94/94.

- [ ] **Step 3: Restart dev for verification**

```bash
npm run dev
```
Hand over URL.

- [ ] **Step 4: Report to user with the verification checklist**

Tell user to verify `/` and `/ar/` at desktop + 375px. Confirm tests + build green. Stop. Do not start motion / animation work — that's their explicit gate.

---

## Self-review

**Spec coverage:**

| Audit item | Plan phase |
|------------|------------|
| A2 | Phase 1 |
| C1, C2, C3 | Phase 2 |
| D1, D3, D4, D6 | Phase 3 |
| D5 | Closed by spine Phase 2 (`97715dd`) — documented in Phase 5 |
| C5 | Closed by `e13b5ea` — documented in Phase 5 |
| E4, E5 | Closed by spine Phases 2-3 — documented in Phase 5 |
| E6 | Phase 4 |
| E7 | Falls out of D1 (Phase 3) — documented in Phase 5 |
| E3, E8, E9 | Closed by reasoning in Phase 5 |

Every open audit item is either closed by an edit or formally closed by documented reasoning. ✓

**Placeholder scan:** Phase 5 Step 1 references `[phase N commit]` placeholders to be filled in at commit time — that's intentional, not a plan defect; the hashes don't exist until the commits are made.

**Type consistency:** All token names verified against `tailwind.config.mjs` (`sp-3`, `sp-4`, `sp-5`, `sp-7`, `sp-8`, `sp-9`) and existing tokens (`section-y`, `head-to-content`). No new token introduced.
