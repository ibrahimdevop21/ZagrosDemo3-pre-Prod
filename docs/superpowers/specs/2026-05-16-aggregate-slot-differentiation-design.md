# Aggregate slot — visual differentiation (WorldReach §08)

**Date:** 2026-05-16
**Branch:** `feature/plan-7-world-reach`
**Pickup item:** "Consider whether China's `aggregate` confidence state deserves a different visual treatment from `confirmed`" — captured in the WIP commit `dfa78b7` follow-up checklist.

## Problem

WorldReach renders 9 source-country cards in a 3×3 grid. Each card has a uniform "supplier slot" (decision G1, locked in the WIP commit). The slot's value renders identically for `confirmed` and `aggregate`:

- **Germany (confirmed):** `K+S Middle East FZE` — italic display font, text-ink, solid stone border.
- **China (aggregate):** `12 OEM manufacturers` — italic display font, text-ink, solid stone border. Mono subtitle "Listed per product on pesticide detail pages" underneath.

At a glance, China reads like a brand name. The subtitle differentiates on second read, but the visual hierarchy says "this is a supplier name" — which it isn't. China is a category descriptor for a network of 12 unnamed OEMs.

## Goal

The reader should be able to tell at a glance — without reading the subtitle — that the China slot is a *category descriptor*, not a *brand name*. `tbc` already has its own visual language (dashed border + mute placeholder); `aggregate` needs the same kind of unmistakable differentiation.

## Non-goals

- Adding a new card-level border tint for aggregate. The chip + body-type switch is enough; a sienna card border would compete with the demo-only scope aside immediately below the grid.
- Surfacing the 12 OEM names. The whole point of `aggregate` is that the names live on pesticide product detail pages (existing IA).
- Sudan inset map, broader "7/12" copy retirement, AR native review, scope-note env-gating. All separately deferred (see WIP commit follow-up list).

## Design

### Visual treatments after this change

| State | Value typography | Slot border | Extra chrome |
|---|---|---|---|
| `confirmed` / `partial` | italic display, text-ink | solid stone | (partial adds subtitle) |
| **`aggregate`** *(new)* | **sans, not-italic, text-ink** | **solid stone** | **mono "NETWORK" chip beside SUPPLIER label + subtitle** |
| `tbc` | italic display, text-mute | dashed mute | mute placeholder text |

The chip + sans body together make aggregate unmistakable. The chip says *"this is a type, not a name"*; the sans body type reinforces that read (italic display is the design system's "this is a proper noun" signal; sans non-italic is the "this is descriptive prose" signal).

### Component changes — `src/components/home/WorldReach.astro`

Slot block currently at lines 320–351. Three changes:

1. **Label row becomes flex with chip slot.** The existing `slot_label` span moves into a `<div class="flex items-baseline justify-between gap-2">` wrapper. When `conf === 'aggregate'`, a sibling `<span>` renders the chip:

   ```astro
   <span class="font-mono text-[9px] tracking-[0.24em] uppercase text-sienna/85">
     {t('home.v3branches.slot_chip_aggregate')}
   </span>
   ```

2. **Value typography gains a third branch.** The existing `class:list` on the value `<span>` already branches on `isTbc`. Add an `aggregate` branch with `font-sans not-italic text-ink text-[clamp(15px,1.5vw,17px)]`.

3. **Subtitle untouched.** Existing `{conf === 'aggregate' && <span>…</span>}` line stays exactly as-is.

### i18n — `src/i18n/{en,ar}.json` + `types.ts`

Add one new key under `home.v3branches`:

- EN: `slot_chip_aggregate: "Network"`
- AR: `slot_chip_aggregate: "شبكة"` (MSA, anchor-compliant per AR_VOICE.md — no tashkeel, no terminal period)
- `i18n/types.ts`: add `slot_chip_aggregate: string` to the v3branches union.

### Data layer — `src/data/world-reach.ts`

**No changes.** `supplier_name: "12 OEM manufacturers"` stays. The count lives in the body text; the chip is the type signal. The uniform-slot decision (G1) is preserved because the slot's shape is identical across all states — only the value's typography and the right-side chip-or-empty differ.

## Tests / verification

No new vitest needed (no logic change, only typography branching on an existing union value).

Verification:
- `npm run build` — clean, 100 pages.
- `npm test` — 94/94 still pass (no test touches the slot styling).
- Visual diff: China card EN + AR. Expected — chip "NETWORK" / "شبكة" appears right of "SUPPLIER" label, body text "12 OEM manufacturers" renders in non-italic sans, subtitle unchanged.
- RTL sanity: chip on opposite side from label in AR (the `justify-between` flex handles this automatically since the parent inherits `dir="rtl"` from `<html>`; no manual flip needed).

## Risks

- **Chip-vs-subtitle redundancy.** The chip says "NETWORK" and the subtitle says "Listed per product on pesticide detail pages." Different jobs — chip is the type, subtitle is the action — so not redundant in practice.
- **Sans body weight contrast.** The sans value at clamp(15-17px) needs to feel intentional next to the italic display values in neighbouring cards. If during build review it reads as broken/weaker rather than deliberately-different, fallback is to keep italic display but switch to a non-italic weight or text-mute color. Decision deferred to visual review.
- **AR chip reading.** "شبكة" is a single MSA word and reads cleanly. No RTL bidi issues expected.

## Out-of-scope follow-ups (carried from WIP commit)

These remain open after this spec lands:

- Env-gate `SHOW_SCOPE_NOTE` in WorldReach.astro:36.
- Retire "7 suppliers / 12 markets" aggregates across company.ts, /about, /partners, /products, home.hero.deck, i18n meta_description.
- Native AR review of slot_partial, scope_note_body, credentials_label.
- Sudan inset map (optional).
- `git tag plan-7-world-reach` after sign-off.
