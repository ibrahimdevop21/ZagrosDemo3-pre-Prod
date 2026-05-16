# Aggregate Slot — Visual Differentiation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make WorldReach (home §08) `aggregate` confidence slot read at a glance as a category descriptor — not a brand name — by replacing italic-display body type with sans non-italic + a mono "NETWORK" chip beside the SUPPLIER label.

**Architecture:** Three files touched. (1) One new i18n key per locale (`slot_chip_aggregate`) plus its type. (2) `WorldReach.astro` slot block gains a third typography branch and a chip on the label row. (3) No data-layer changes — `world-reach.ts` stays. Verification is `npm run build` + `npm test` + a manual viewport check (no new vitest; this is pure typography branching on an existing union value).

**Tech Stack:** Astro 5, Tailwind, native CSS variables (`--color-sienna`, `--color-ink`, etc.), vitest + experimental_AstroContainer.

**Spec:** `docs/superpowers/specs/2026-05-16-aggregate-slot-differentiation-design.md`

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/i18n/types.ts` | Locale union — adds `slot_chip_aggregate` to v3branches | Modify (1 line added) |
| `src/i18n/en.json` | EN locale strings | Modify (1 line added) |
| `src/i18n/ar.json` | AR locale strings | Modify (1 line added) |
| `src/components/home/WorldReach.astro` | Home §08 component | Modify slot block, lines ~320–351 |

No new files. No data-layer changes.

---

## Task 1: Add `slot_chip_aggregate` i18n key (EN + AR + types)

**Files:**
- Modify: `src/i18n/types.ts:395-416` (the `v3branches` type block)
- Modify: `src/i18n/en.json:425-436` (the `v3branches` object)
- Modify: `src/i18n/ar.json:425-436` (the `v3branches` object)

The new key sits alphabetically near `slot_aggregate`. Both `en.json` and `ar.json` get the same key. `types.ts` is the locale union — TS will refuse the build if a locale is missing the key.

- [ ] **Step 1.1: Add type entry to `src/i18n/types.ts`**

  Edit line 413 to add `slot_chip_aggregate` immediately after `slot_aggregate`:

  ```ts
        slot_label: string;
        slot_tbc: string;
        slot_partial: string;
        slot_aggregate: string;
        slot_chip_aggregate: string;
        scope_note_label: string;
  ```

- [ ] **Step 1.2: Add EN string to `src/i18n/en.json`**

  Edit line 433 — add the new line after `slot_aggregate`:

  ```json
        "slot_aggregate": "Listed per product on pesticide detail pages",
        "slot_chip_aggregate": "Network",
        "scope_note_label": "Demo only",
  ```

- [ ] **Step 1.3: Add AR string to `src/i18n/ar.json`**

  Edit line 433 — add the new line after `slot_aggregate`. Per AR_VOICE.md anchor: MSA, no tashkeel, no terminal period.

  ```json
        "slot_aggregate": "تظهر الأسماء على صفحة كل منتج",
        "slot_chip_aggregate": "شبكة",
        "scope_note_label": "للعرض التجريبي",
  ```

- [ ] **Step 1.4: Verify TypeScript accepts the new key**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings (the new key is wired through types + both locales, so the locale-union check passes).

  If it fails: re-check the diff for typos in the key name (`slot_chip_aggregate`) across all three files — they must match exactly.

- [ ] **Step 1.5: Commit**

  ```bash
  git add src/i18n/types.ts src/i18n/en.json src/i18n/ar.json
  git commit -m "$(cat <<'EOF'
i18n: add slot_chip_aggregate key for WorldReach aggregate-slot chip

Adds 'Network' / 'شبكة' alongside the existing slot_aggregate
subtitle. Used by the WorldReach (home §08) aggregate-state slot to
mark the supplier value as a category descriptor (vs a brand name).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
  ```

---

## Task 2: Update `WorldReach.astro` slot block

**Files:**
- Modify: `src/components/home/WorldReach.astro:320-351` (the supplier-slot block inside the credentials grid)

Three concrete edits inside the existing `<div class="...slot...">`:

1. Wrap the label `<span>` in a `flex items-baseline justify-between` row so it can host a chip on the right.
2. Add the chip itself, rendered only when `conf === 'aggregate'`.
3. Add a third typography branch on the value `<span>` — non-italic sans for `aggregate`, leaving `isTbc` and the confirmed/partial default branches intact.

- [ ] **Step 2.1: Replace the slot block in `src/components/home/WorldReach.astro`**

  Find the existing block at line 320 — the `<!-- Supplier slot -->` comment through the closing `</div>` at line 351. Replace it with:

  ```astro
          <!-- Supplier slot -->
          <div
            class:list={[
              'mt-sp-2 flex flex-col gap-1.5 px-sp-4 py-sp-3 border',
              isTbc
                ? 'border-dashed border-mute/55 bg-paper-light'
                : 'border-stone bg-paper-light',
            ]}
          >
            <div class="flex items-baseline justify-between gap-2">
              <span class="font-mono text-[9px] tracking-[0.24em] uppercase text-mute">
                {t('home.v3branches.slot_label')}
              </span>
              {conf === 'aggregate' && (
                <span class="font-mono text-[9px] tracking-[0.24em] uppercase text-sienna/85">
                  {t('home.v3branches.slot_chip_aggregate')}
                </span>
              )}
            </div>
            <span
              class:list={[
                'leading-tight',
                conf === 'aggregate'
                  ? 'font-sans not-italic text-ink text-[clamp(15px,1.5vw,17px)]'
                  : isTbc
                  ? 'font-display italic text-mute text-[clamp(16px,1.7vw,19px)]'
                  : 'font-display italic text-ink text-[clamp(16px,1.7vw,19px)]',
              ]}
              dir={c.supplier_name ? 'ltr' : undefined}
            >
              {c.supplier_name ?? t('home.v3branches.slot_tbc')}
            </span>
            {conf === 'partial' && (
              <span class="font-mono text-[9.5px] tracking-[0.16em] uppercase text-mute/85">
                {t('home.v3branches.slot_partial')}
              </span>
            )}
            {conf === 'aggregate' && (
              <span class="font-mono text-[9.5px] tracking-[0.16em] uppercase text-mute/85">
                {t('home.v3branches.slot_aggregate')}
              </span>
            )}
          </div>
  ```

  **What changed vs the original:**
  - Label row is now a flex container that hosts an optional chip on the right.
  - Aggregate chip uses `text-sienna/85` to tie back to the demo-only scope aside's sienna without competing.
  - Value `<span>` switched from a 2-branch `class:list` (isTbc / else) to a 3-branch one (aggregate / isTbc / else). Aggregate gets `font-sans not-italic text-ink` and a slightly smaller clamp range to match sans body proportions.
  - In AR, the parent inherits `dir="rtl"`; `justify-between` automatically puts the chip on the opposite side of the label (no manual flip needed). The value `<span>` keeps `dir="ltr"` only when `supplier_name` is set, preserving the existing Latin-name no-reorder behavior — "12 OEM manufacturers" stays LTR in both locales.

- [ ] **Step 2.2: Verify Astro typecheck passes**

  Run: `npx astro check`
  Expected: 0 errors, 0 warnings. The `t('home.v3branches.slot_chip_aggregate')` call resolves because Task 1 added the key to the union.

- [ ] **Step 2.3: Build the site**

  Run: `npm run build`
  Expected: 100 pages built, no errors. Compare against the WIP commit's last clean build count to confirm no regression.

- [ ] **Step 2.4: Run the test suite**

  Run: `npm test`
  Expected: All previously-passing tests still pass. No test currently asserts on the slot's typography, so no test should change behavior. If a content-collection vitest baseline failure recurs (the Plan 7 documented quirk), note it but treat as pre-existing.

- [ ] **Step 2.5: Commit**

  ```bash
  git add src/components/home/WorldReach.astro
  git commit -m "$(cat <<'EOF'
WorldReach: differentiate aggregate slot — sans body + NETWORK chip

China's `aggregate` slot was visually identical to confirmed entries
(italic-display name) — readers could misparse "12 OEM manufacturers"
as a brand name like the neighbouring Mahamaya Lifesciences entry.

Three visually distinct slot treatments now:
  - confirmed / partial : italic display name, solid stone border
  - aggregate           : sans non-italic body + NETWORK chip on label row
  - tbc                 : dashed mute border + italic placeholder

Chip uses sienna/85 to echo the demo-only scope aside without
competing. RTL handled by inherited dir + justify-between; no manual
flip. Card border and existing partial/tbc treatments untouched.

Spec: docs/superpowers/specs/2026-05-16-aggregate-slot-differentiation-design.md

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
  ```

---

## Task 3: Visual review + final verification

**Files:** (none — verification only)

The change is typography-only, so the proof is the rendered output. Open the dev server, inspect the China card EN + AR at desktop (`lg:` 3×3 grid) and mobile (`<sm` stacked) to confirm:

1. The "NETWORK" chip appears to the right of "SUPPLIER" on the China slot only.
2. "12 OEM manufacturers" renders in **non-italic sans-serif** (compare with the italic-display "K+S Middle East FZE" in the Germany slot directly next to it).
3. In AR, the chip "شبكة" appears on the left side of the slot's label row (opposite the "المورد" label, since `justify-between` + `dir="rtl"`).
4. The Switzerland / UK (`tbc`) slots are unchanged — dashed border, mute italic "To be confirmed" placeholder.
5. The Netherlands (`partial`) slot is unchanged — italic display "Agro Dragon" + mute subtitle.

- [ ] **Step 3.1: Start the dev server**

  Run: `npm run dev`
  Wait for: `Local   http://localhost:4321/`

- [ ] **Step 3.2: Inspect EN at desktop**

  Open `http://localhost:4321/#world-reach` (or scroll to §08 from the home page).

  Check:
  - China card: chip "NETWORK" right of "SUPPLIER" label, sienna tint. Value "12 OEM manufacturers" in sans non-italic, text-ink.
  - Germany card (adjacent): chip absent. Value "K+S Middle East FZE" in italic display.
  - Visual distinctiveness obvious at a glance (1–2 seconds).

- [ ] **Step 3.3: Inspect AR at desktop**

  Open `http://localhost:4321/ar/#world-reach`.

  Check:
  - China card: chip "شبكة" on the visual *left* of the label row (label "المورد" is on the right per RTL). Value "12 OEM manufacturers" with `dir="ltr"` so the Latin string doesn't reorder.
  - Subtitle "تظهر الأسماء على صفحة كل منتج" renders below as before.

- [ ] **Step 3.4: Inspect at narrow viewport (≤640px)**

  DevTools mobile width 390px both locales.

  Check:
  - Slot still legible — chip + label fit on one line. If they wrap, the design still works (chip drops below label, justify-between collapses gracefully).
  - Value text doesn't overflow the slot's `px-sp-4` padding.

- [ ] **Step 3.5: Decide on outcome**

  **If visuals match the spec:** proceed to Step 3.6.

  **If the sans body reads as "broken/weaker" rather than deliberately different** (the risk called out in the spec): roll back the value-typography change to keep italic display, but keep the chip. Update the spec's risk-fallback line to record the choice, commit a one-line fix, and skip to Step 3.6.

- [ ] **Step 3.6: Stop the dev server and run the production build once more**

  Stop the dev server (Ctrl+C). Then:

  Run: `npm run build`
  Expected: 100 pages, no errors.

- [ ] **Step 3.7: Confirm the resume checklist updated**

  No commit needed — this is a notes step. The WIP commit's "To pick up from here" list still contains:

  > Consider whether China's `aggregate` confidence state deserves a different visual treatment from `confirmed`

  After this plan lands, that item is **closed.** The remaining items (SHOW_SCOPE_NOTE env-gating, broader "7/12" copy retirement, native AR review, Sudan inset, tag) stay open. No code action; just note the closure when summarising the session to the user.

---

## Self-Review

**Spec coverage:** Every section of the spec maps to a task.
- Problem / Goal → Task 2 (the actual visual change).
- Visual-treatments table → Task 2 step 2.1 (the class:list branches).
- Component changes → Task 2.
- i18n → Task 1.
- Data-layer "no changes" → Task 2 leaves `world-reach.ts` alone.
- Tests / verification → Task 2 steps 2.2–2.4 + Task 3.
- Risks → Task 3 step 3.5 (visual-review fallback).
- Out-of-scope follow-ups → unchanged, explicitly noted in the plan header and Task 3.7.

**Placeholder scan:** No TBDs, no "add validation", no "similar to". Every code step has the full diff/replacement. Verification steps name exact commands and expected output.

**Type consistency:** `slot_chip_aggregate` used identically across types.ts (Task 1.1), en.json (1.2), ar.json (1.3), and the `t('home.v3branches.slot_chip_aggregate')` call in WorldReach.astro (2.1). The existing `c.supplier_name`, `c.confidence`, `conf`, `isTbc` references all match the current world-reach.ts contract — no new symbols introduced beyond the one i18n key.

Plan complete.
