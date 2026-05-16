# Env-gate SHOW_SCOPE_NOTE — WorldReach demo chrome

**Date:** 2026-05-17
**Branch:** `feature/plan-7-world-reach`
**Pickup item:** "Production cutover: flip SHOW_SCOPE_NOTE in WorldReach.astro:36 to `false` before the launch — or migrate to an env-based check" — captured in the WIP commit `dfa78b7` follow-up checklist.

## Problem

`src/components/home/WorldReach.astro:36` ships with a hard-coded `const SHOW_SCOPE_NOTE = true`. Before a production launch someone has to remember to flip it to `false`. If they forget, the "Demo only — Public listing only — brand and partner name. No pricing, volumes, or terms displayed." sienna aside lands on the live home page next to the supplier credentials grid.

The WIP commit suggested migrating to `!import.meta.env.PROD` so "both demo + prod from one build" works. That suggestion doesn't survive contact with Astro's env semantics: `astro build` always sets `PROD=true`, including for a deployed demo. `!PROD` would only show the scope note in local `npm run dev`, not in the CEO-facing demo deployment.

## Goal

Replace the hard-coded flag with a build-time env var that:
- Defaults to **off** (safe for prod — a forgotten env var ships the production behavior, not the demo).
- Can be flipped on per-deployment via Vercel project env vars without a code change.
- Is **strict opt-in** even during local development (no DEV fallback) — the designer has to set the var in `.env.local` or shell to see the scope note. Reason: matches the deployed flow exactly, so what the designer sees during iteration matches what the CEO sees.
- Uses a generic name (`PUBLIC_DEMO_MODE`) so later demo-only chrome (e.g., BagMockup "PENDING REAL PHOTO" caption) can adopt the same gate.

## Non-goals

- Adopting the gate for other demo-only chrome in this pass. BagMockup, partner-logo placeholders, "pending client" chips all qualify conceptually but are out of scope here; they can fold in later.
- Adding `src/env.d.ts` for an ambient type declaration on `PUBLIC_DEMO_MODE`. Astro's auto-generated `.astro/types.d.ts` types `import.meta.env.*` as `string | undefined`, which is fine for an `=== 'true'` comparison.
- Build-tooling changes (no new npm scripts, no `astro.config.mjs` changes).

## Design

### Component change — `src/components/home/WorldReach.astro`

Replace line 36:
```ts
const SHOW_SCOPE_NOTE = true; // demo build only — flip to false before production
```

with:
```ts
// Demo-only chrome — set PUBLIC_DEMO_MODE=true (locally in .env.local or in
// Vercel project env for the demo deployment) to render the scope note.
// Hidden by default in all other builds and dev runs.
const SHOW_SCOPE_NOTE = import.meta.env.PUBLIC_DEMO_MODE === 'true';
```

Sync lines 26–27 of the doc comment to describe env-gating instead of "flip the flag":

```ts
 * Scope note — gated by PUBLIC_DEMO_MODE env var. Set to "true" in
 * .env.local or in the deployment env to render the demo-only aside.
```

### New file — `.env.example`

Establishes the convention so a fresh `git clone` sees the documented var:

```
# Set to "true" to render demo-only chrome (e.g., the WorldReach scope note).
# Leave unset for production builds.
PUBLIC_DEMO_MODE=true
```

### AGENTS.md addition

Add a brief "Build-time env vars" subhead so future agentic sessions discover the convention:

```markdown
## Build-time env vars

- `PUBLIC_DEMO_MODE=true` — opts into demo-only chrome (currently: WorldReach scope note). Unset in production. See `.env.example`.
```

Placement: at the end of the file, as a new section. No other AGENTS.md content changes.

## Verification

- `npx astro check` — 0 errors, 0 warnings (8 pre-existing hints unrelated).
- **Default build** (no env var): `npm run build` then `grep -rh "Demo only" dist/` → 0 hits. `grep -rh "للعرض التجريبي" dist/` → 0 hits.
- **Demo build** (env set): `PUBLIC_DEMO_MODE=true npm run build` then same greps → ≥2 hits each (EN + AR home pages render the scope note).
- `npm test` — 94/94 unchanged (no test asserts on scope-note presence).

## Risks

- **Designer first-run surprise.** After this lands, `npm run dev` no longer shows the scope note by default. Mitigation: `.env.example` and the AGENTS.md note document the opt-in.
- **Vercel demo deployment must set the var.** A forgotten setting silently hides the scope note in the deployed demo. Mitigation: pre-launch grep on the deployed `/` HTML confirms presence/absence is as expected for that environment.
- **`.env.local` not gitignored explicitly.** Astro's default `.gitignore` ignores `.env*` except `.env.example`. Verify before adding `.env.example` that the project's `.gitignore` matches this convention.

## Out-of-scope follow-ups (still open from WIP commit `dfa78b7`)

- Native AR review of slot_partial, scope_note_body, credentials_label and the strings retired in the 2026-05-16 copy-nuance pass.
- Sudan inset map (optional).
- Data divergence between `company.ts.partners` and `world-reach.ts.countries`.
- `git tag plan-7-world-reach` once all follow-ups are signed off.
- Folding BagMockup placeholder caption (and similar) into the same `PUBLIC_DEMO_MODE` gate.
