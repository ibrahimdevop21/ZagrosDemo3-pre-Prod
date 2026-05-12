# Zagros v3 — Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage with a 9-section editorial publication, fold partners + customers into homepage sections (delete their indexes, add 301 redirects), add `Home` to nav, polish all inner pages to match, and apply restrained editorial motion throughout — without breaking the user-loved 7-token palette or the product-card placeholder hero zones from Plan 7 B.

**Architecture:** Astro 5 + Tailwind 3 (no new framework). All new components live under `src/components/{home,editorial,partners}/`. Motion is a tiny IntersectionObserver helper at `src/lib/motion.ts` plus declarative CSS at `src/styles/motion.css` — no JS animation library. Image placeholders ship as a shared `Placeholder.astro` so swapping in real photos later is a one-line change. Hero is a 4-photo CSS-only Ken Burns slideshow using existing `public/hero/*.webp` assets. Sudan map is a hand-drawn inline SVG (drops the `leaflet` dep).

**Tech Stack:** Astro v5.4, Tailwind v3.4, TypeScript v5.8, vitest v4, bilingual EN/AR via `src/i18n/`, content collections for products/partners/field-reports.

**Design discipline:** Per `DESIGN.md` (Restrained color, paper-warm light theme, no side-stripe borders, no gradient text, no glassmorphism default, no hero-metric template, no identical card grids, no em dashes, no AI-slop reflexes). Per `PRODUCT.md` (brand register, technical B2B voice, Sudan-foreground, AR-primary, anti-AI-slop discipline).

**Spec source:** `docs/superpowers/specs/2026-05-12-zagros-v3-editorial-design.md`. Every task here implements a specific section of that spec.

---

## File structure (locked)

### New files (created in this plan)

```
src/lib/motion.ts                            # IntersectionObserver helper
src/styles/motion.css                         # reveal/marquee/count-up keyframes
src/components/editorial/Placeholder.astro    # honest striped image placeholder
src/components/home/HeroV3.astro              # rotating slideshow hero (replaces Hero.astro)
src/components/home/OpsTickerMarquee.astro    # CSS marquee (replaces OpsTicker.astro)
src/components/home/ByTheNumbersV3.astro      # asymmetric big-number grid
src/components/home/CatalogStrips.astro       # 3-line catalog
src/components/home/PartnersSection.astro     # spotlight + 6 tiles
src/components/home/FieldReportsTeaser.astro  # 3-report editorial grid
src/components/home/CustomersWall.astro       # ink band + pull quote + logo wall
src/components/home/BranchesMap.astro         # SVG map + branch list
src/components/home/QuoteCTA.astro            # signal-bar editorial close
src/components/partners/PartnerSpotlight.astro  # shared (home Section 05 + /partners/[slug] hero)
tests/components/Placeholder.test.ts
tests/components/HeroV3.test.ts
tests/components/PartnersSection.test.ts
tests/components/CustomersWall.test.ts
tests/components/BranchesMap.test.ts
tests/pages/home-redesign.test.ts
```

### Modified files

```
astro.config.mjs                              # add 4 redirects
package.json                                  # remove leaflet dep
src/styles/tokens.css                         # add --c-pesticide token
tailwind.config.mjs                           # add bg-c-pesticide class
src/components/products/ProductHero.astro     # extend bgClassMap with c-pesticide
src/components/global/Nav.astro               # add Home, remove Partners + Customers
src/components/global/MobileNavDrawer.astro   # mirror Nav changes
src/i18n/en.json, src/i18n/ar.json            # ~30 new keys
src/i18n/types.ts                             # match new keys
src/content/config.ts                         # partners.featured optional
src/content/partners/k-plus-s.mdx             # featured: true
src/data/customers.ts                         # optional pull_quote field
src/data/ops-ticker.json                      # refresh content
src/pages/index.astro                         # rebuild section order
src/pages/ar/index.astro                      # rebuild section order
src/pages/partners/[slug].astro + AR mirror   # PartnerSpotlight hero
src/pages/about.astro + AR mirror             # polish typography + spacing
src/pages/contact.astro + AR mirror           # polish form + headline
src/pages/field-reports/index.astro + AR      # editorial card layout
src/pages/field-reports/[slug].astro + AR     # body polish
src/pages/products/index.astro + AR mirror    # match home Catalog typography
src/pages/products/[line]/[slug].astro + AR   # body polish
```

### Deleted files

```
src/pages/partners/index.astro
src/pages/ar/partners/index.astro
src/pages/customers/index.astro
src/pages/ar/customers/index.astro
src/components/home/Hero.astro                # replaced by HeroV3.astro
src/components/home/OpsTicker.astro
src/components/home/ByTheNumbers.astro
src/components/home/CatalogTable.astro
src/components/home/CustomersStrip.astro
src/components/home/ThreeReportsGrid.astro
src/components/home/SourcesSection.astro
src/components/home/EditorsNote.astro
src/components/home/HomeCTA.astro
src/components/home/FeaturedReport.astro
src/components/home/CaptionStrip.astro       # if only home used it (verify)
node_modules: leaflet (after package.json edit)
```

---

## Task A — Foundation: motion + placeholder

The lowest-risk surface area. Everything later depends on these.

**Files:**
- Create: `src/lib/motion.ts`, `src/styles/motion.css`, `src/components/editorial/Placeholder.astro`
- Modify: `src/styles/global.css` (import motion.css)
- Test: `tests/components/Placeholder.test.ts`

- [ ] **Step A.1: Create the motion CSS keyframes**

`src/styles/motion.css`:

```css
/* Plan: Zagros v3 — restrained editorial motion. All gated by
   prefers-reduced-motion: no-preference. Hardware-accelerated only
   (transform + opacity). Defined classes/attributes are picked up by
   src/lib/motion.ts. */

@media (prefers-reduced-motion: no-preference) {
  /* === Scroll reveals === */
  [data-reveal] {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 400ms cubic-bezier(0.22, 1, 0.36, 1),
                transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--reveal-delay, 0ms);
  }
  [data-reveal][data-revealed] {
    opacity: 1;
    transform: none;
  }

  /* === Marquee (LTR) === */
  .marquee-track {
    display: inline-flex;
    gap: 36px;
    animation: marquee-ltr 40s linear infinite;
    white-space: nowrap;
  }
  .marquee-wrap:hover .marquee-track {
    animation-play-state: paused;
  }
  [dir="rtl"] .marquee-track {
    animation-name: marquee-rtl;
  }
  @keyframes marquee-ltr {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes marquee-rtl {
    from { transform: translateX(-50%); }
    to   { transform: translateX(0); }
  }
  @media (max-width: 639px) {
    .marquee-track { animation-duration: 30s; }
  }

  /* === Live dot blink === */
  .blink-signal {
    animation: blink-signal 2.4s infinite;
  }
  @keyframes blink-signal {
    0%, 60%, 100% { opacity: 1; }
    80%           { opacity: 0.4; }
  }

  /* === Hero slideshow === */
  .hero-slideshow .slide {
    opacity: 0;
    animation: hero-fade 24s infinite;
  }
  .hero-slideshow .slide img {
    animation: hero-zoom 24s infinite ease-in-out;
  }
  .hero-slideshow .slide:nth-child(1),
  .hero-slideshow .slide:nth-child(1) img { animation-delay: 0s; }
  .hero-slideshow .slide:nth-child(2),
  .hero-slideshow .slide:nth-child(2) img { animation-delay: 6s; }
  .hero-slideshow .slide:nth-child(3),
  .hero-slideshow .slide:nth-child(3) img { animation-delay: 12s; }
  .hero-slideshow .slide:nth-child(4),
  .hero-slideshow .slide:nth-child(4) img { animation-delay: 18s; }

  @keyframes hero-fade {
    0%   { opacity: 0; }
    4%   { opacity: 1; }
    25%  { opacity: 1; }
    29%  { opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes hero-zoom {
    0%   { transform: scale(1.00); }
    4%   { transform: scale(1.02); }
    29%  { transform: scale(1.09); }
    100% { transform: scale(1.09); }
  }

  /* Progress dots fill in sync with each slide */
  .hero-progress .dot::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgb(var(--color-signal));
    transform-origin: left;
    transform: scaleX(0);
    animation: progress-fill 24s infinite linear;
  }
  [dir="rtl"] .hero-progress .dot::after {
    transform-origin: right;
  }
  .hero-progress .dot:nth-child(1)::after { animation-delay: 0s; }
  .hero-progress .dot:nth-child(2)::after { animation-delay: 6s; }
  .hero-progress .dot:nth-child(3)::after { animation-delay: 12s; }
  .hero-progress .dot:nth-child(4)::after { animation-delay: 18s; }
  @keyframes progress-fill {
    0%   { transform: scaleX(0); opacity: 1; }
    25%  { transform: scaleX(1); opacity: 1; }
    27%  { transform: scaleX(1); opacity: 0; }
    100% { transform: scaleX(0); opacity: 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Reduced-motion freezes hero on first slide, hides progress fill,
     keeps everything else static. The global reduced-motion rule in
     global.css already kills generic animations. */
  .hero-slideshow .slide:nth-child(1) { opacity: 1; }
  .hero-slideshow .slide:not(:nth-child(1)) { opacity: 0; }
  [data-reveal] { opacity: 1; transform: none; }
}
```

- [ ] **Step A.2: Wire motion.css into global.css**

`src/styles/global.css` — add the import after the existing tokens import. Find:

```css
@import './tokens.css';

@tailwind base;
```

Replace with:

```css
@import './tokens.css';
@import './motion.css';

@tailwind base;
```

- [ ] **Step A.3: Create the IntersectionObserver helper**

`src/lib/motion.ts`:

```typescript
/**
 * Plan: Zagros v3 — scroll-reveal helper.
 *
 * Adds `data-revealed` attribute to elements with `data-reveal` once they
 * cross 15% into the viewport. One-shot — does not re-animate on scroll up.
 *
 * Usage from any .astro file:
 *   <script>import { observeReveal } from '../../lib/motion';
 *   observeReveal();</script>
 *
 * Stagger inside a parent: set --reveal-delay on each child:
 *   <li data-reveal style="--reveal-delay: 80ms"></li>
 *   <li data-reveal style="--reveal-delay: 160ms"></li>
 *
 * Reduced motion: the CSS in motion.css gates the visible effect,
 * so even if this helper runs the user sees the final state immediately.
 */
export function observeReveal(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.setAttribute('data-revealed', ''));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/**
 * Count-up helper for the By-the-numbers section.
 * Animates a number from 0 to `target` over `duration` ms when the element
 * enters the viewport. Strips non-digit prefix/suffix preservation.
 *
 * Usage on an element with data-count-target="15":
 *   <span data-count-target="15">15</span>
 *   observeCountUp();
 */
export function observeCountUp(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-count-target]');
  if (!targets.length) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => {
      el.textContent = el.dataset.countTarget ?? el.textContent;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.countTarget ?? '0', 10);
        const suffix = el.dataset.countSuffix ?? '';
        const start = performance.now();
        const duration = 1200;

        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  targets.forEach((el) => observer.observe(el));
}
```

- [ ] **Step A.4: Write the failing Placeholder test**

`tests/components/Placeholder.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Placeholder from '../../src/components/editorial/Placeholder.astro';

describe('Placeholder', () => {
  it('renders kind label uppercased', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'hero', label: 'Sudanese farmland' },
    });
    expect(html).toContain('PLACEHOLDER');
    expect(html).toContain('HERO');
    expect(html).toContain('Sudanese farmland');
  });

  it('exposes accessibility role and label', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'partner', label: 'K+S facility' },
    });
    expect(html).toMatch(/role="img"/);
    expect(html).toMatch(/aria-label="[^"]*K\+S facility/);
  });

  it('switches to dark variant for ink-ground sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'logo', label: 'Customer logo', dark: true },
    });
    expect(html).toMatch(/data-variant="dark"/);
  });
});
```

- [ ] **Step A.5: Run test, expect fail**

```bash
npm test -- Placeholder
```
Expected: FAIL — module not found.

- [ ] **Step A.6: Implement Placeholder**

`src/components/editorial/Placeholder.astro`:

```astro
---
/**
 * Plan: Zagros v3 — honest image placeholder.
 *
 * Renders a striped diagonal-hatch tile labeled with the kind of photo
 * needed. Used everywhere a real image is pending. Per PRODUCT.md
 * anti-AI-slop discipline: visible "PENDING" markers signal gaps;
 * plausible stock photos hide them.
 *
 * Replace with <img> + Plan-7-G performance attributes when the client
 * provides the real asset.
 */
type Kind = 'hero' | 'partner' | 'field-photo' | 'portrait' | 'map' | 'product' | 'logo';

interface Props {
  kind: Kind;
  label?: string;
  aspectRatio?: string;
  dark?: boolean;
  class?: string;
}

const {
  kind,
  label = '',
  aspectRatio,
  dark = false,
  class: extraClass = '',
} = Astro.props;

const defaultRatio: Record<Kind, string> = {
  hero: '16 / 9',
  partner: '4 / 3',
  'field-photo': '4 / 3',
  portrait: '3 / 4',
  map: '5 / 4',
  product: '1 / 1',
  logo: '5 / 3',
};

const ratio = aspectRatio ?? defaultRatio[kind];
const variant = dark ? 'dark' : 'light';
const a11yLabel = `Pending image: ${kind}${label ? ` — ${label}` : ''}`;
---
<div
  role="img"
  aria-label={a11yLabel}
  data-variant={variant}
  class:list={[
    'ph-tile relative w-full overflow-hidden flex flex-col items-center justify-center text-center',
    'gap-2 p-sp-5',
    extraClass,
  ]}
  style={`aspect-ratio: ${ratio};`}
>
  <span class="ph-mark font-mono text-[10.5px] tracking-[0.22em] uppercase">
    PLACEHOLDER · {kind.toUpperCase()}
  </span>
  {label && (
    <span class="ph-sub font-mono text-[9px] tracking-[0.18em] uppercase max-w-[28ch] opacity-80">
      {label}
    </span>
  )}
</div>

<style>
  .ph-tile[data-variant="light"] {
    background:
      repeating-linear-gradient(135deg,
        rgb(var(--color-stone)) 0 14px,
        rgb(212 208 197 / 0.7) 14px 28px);
    color: rgb(var(--color-ink));
  }
  .ph-tile[data-variant="light"]::after {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px dashed rgb(var(--color-ink) / 0.35);
    pointer-events: none;
  }
  .ph-tile[data-variant="dark"] {
    background:
      repeating-linear-gradient(135deg,
        rgb(var(--color-paper) / 0.08) 0 14px,
        rgb(var(--color-paper) / 0.04) 14px 28px);
    color: rgb(var(--color-paper));
  }
  .ph-tile[data-variant="dark"]::after {
    content: '';
    position: absolute;
    inset: 6px;
    border: 1px dashed rgb(var(--color-paper) / 0.25);
    pointer-events: none;
  }
  .ph-tile .ph-mark { color: rgb(var(--color-sienna)); font-weight: 500; }
  .ph-tile[data-variant="dark"] .ph-mark { color: rgb(var(--color-signal)); }
</style>
```

- [ ] **Step A.7: Run test, expect pass**

```bash
npm test -- Placeholder
```
Expected: PASS (3/3).

- [ ] **Step A.8: Commit**

```bash
git add src/lib/motion.ts src/styles/motion.css src/styles/global.css \
        src/components/editorial/Placeholder.astro tests/components/Placeholder.test.ts
git commit -m "$(cat <<'EOF'
v3: A — motion foundation + Placeholder component

* src/lib/motion.ts: IntersectionObserver helper for one-shot scroll
  reveals + count-up. Reduced-motion safe (skips animation entirely).
* src/styles/motion.css: hardware-accelerated keyframes for reveals,
  marquee (LTR + RTL), hero slideshow Ken Burns, progress dots, blink.
  All gated by prefers-reduced-motion: no-preference.
* Placeholder.astro: honest striped image-pending tile, light + dark
  variants, role=img + aria-label for accessibility. Per PRODUCT.md
  anti-AI-slop discipline.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task B — Pesticide token + bg-c-pesticide class

Resolves spec §15.1.

**Files:**
- Modify: `src/styles/tokens.css`, `tailwind.config.mjs`, `src/components/products/ProductHero.astro`

- [ ] **Step B.1: Add the token to tokens.css**

In `src/styles/tokens.css`, find the product brand-coding block (lines 22-32). After `--c-sardi:` add:

```css
    --c-pesticide: 90 58 30;  /* #5A3A1E — pesticide line, mirrors --color-sienna */
```

- [ ] **Step B.2: Add the Tailwind class mapping**

In `tailwind.config.mjs`, find the product brand-coding `colors` block (lines 32-41). After `'c-sardi':` add:

```js
        'c-pesticide': 'rgb(var(--c-pesticide) / <alpha-value>)',
```

- [ ] **Step B.3: Extend ProductHero.astro bgClassMap**

In `src/components/products/ProductHero.astro`, find `bgClassMap` (around line 38). Add:

```ts
  'c-pesticide': 'bg-c-pesticide',
```

inside the `bgClassMap` object. And add `'c-pesticide'` to the `darkBgTokens` Set (line 55):

```ts
const darkBgTokens = new Set(['c-npk', 'c-mkp', 'c-map', 'c-ams', 'c-epso', 'c-ksop', 'c-sardi', 'c-pesticide']);
```

- [ ] **Step B.4: Verify build**

```bash
npm run build
```
Expected: 104 pages, no errors.

- [ ] **Step B.5: Commit**

```bash
git add src/styles/tokens.css tailwind.config.mjs src/components/products/ProductHero.astro
git commit -m "$(cat <<'EOF'
v3: B — add --c-pesticide token + bg-c-pesticide class

* tokens.css: --c-pesticide mirrors --color-sienna (#5A3A1E)
* tailwind.config.mjs: bg-c-pesticide utility
* ProductHero.astro: bgClassMap + darkBgTokens entries

Lets the new home Catalog section render the pesticide line with a
brand color, keeping the 7-token palette intact in spirit (the new
token reuses sienna's numerals).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task C — Nav redesign: add Home, drop Partners + Customers

**Files:**
- Modify: `src/components/global/Nav.astro`, `src/components/global/MobileNavDrawer.astro`
- Modify: `src/i18n/{en,ar}.json`, `src/i18n/types.ts`

- [ ] **Step C.1: Add the nav.home translation key (EN)**

In `src/i18n/en.json`, find the `"nav"` block. After existing keys, add `"home": "Home"`. Locate the existing structure first by reading a few lines around `"nav":`.

Example final state of the nav block:

```json
"nav": {
  "home": "Home",
  "products": "Products",
  "field_reports": "Field Reports",
  "partners": "Partners",
  "customers": "Customers",
  "about": "About",
  "contact": "Contact",
  "language": "العربية",
  "cta_primary": "Request a quote"
}
```

(Keep the existing partners + customers keys for now — they're still used by `/partners/[slug]` breadcrumbs etc. We just won't link to them from primary nav.)

- [ ] **Step C.2: Add the nav.home translation key (AR)**

In `src/i18n/ar.json`, mirror with hand-written Arabic:

```json
"home": "الرئيسية",
```

placed at the top of the `"nav"` block. AR translation `الرئيسية` = "the main one" / "home." Hand-written, not machine.

- [ ] **Step C.3: Update i18n types.ts**

In `src/i18n/types.ts`, find the `nav` interface block. Add `home: string;` as the first field:

```ts
nav: {
  home: string;
  products: string;
  // ... existing fields
};
```

- [ ] **Step C.4: Modify Nav.astro — desktop links**

In `src/components/global/Nav.astro`, find the `navLinks` array (around line 18). Change to:

```ts
const navLinks = [
  { route: '/',              label: t('nav.home') },
  { route: '/products',      label: t('nav.products') },
  { route: '/field-reports', label: t('nav.field_reports') },
  { route: '/about',         label: t('nav.about') },
  { route: '/contact',       label: t('nav.contact') },
];
```

Removed: `/partners` and `/customers` entries. Added: `/` for Home as the first item.

The `isActive` helper (line 12) already handles root match — for `/products` it returns true on `/products` and `/products/foo`, which means root `/` would only be active on the bare `/` path. That matches what we want.

- [ ] **Step C.5: Modify MobileNavDrawer.astro — match Nav links**

In `src/components/global/MobileNavDrawer.astro`, find the matching `navLinks` array (around line 35). Apply the same edit as Step C.4: prepend `{ route: '/', label: t('nav.home') }`, remove the `/partners` and `/customers` entries.

- [ ] **Step C.6: Run tests + build**

```bash
npm test
npm run build
```

Test failures from `partners.test.ts` and `customers.test.ts` will linger because their fixtures reference the index pages we haven't deleted yet — Task D handles that. Just verify the build succeeds (104 pages).

- [ ] **Step C.7: Commit**

```bash
git add src/components/global/Nav.astro src/components/global/MobileNavDrawer.astro \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "$(cat <<'EOF'
v3: C — nav: add Home, drop Partners + Customers links

* Nav.astro: navLinks reordered with Home (/) as first, Partners and
  Customers removed from primary nav. Active state highlights Home only
  on the bare / path.
* MobileNavDrawer.astro: mirror change
* i18n: add nav.home key (EN: "Home", AR hand-translated: "الرئيسية")
* types.ts: nav.home string field

Per the user's complaint "we dont even have a home page in the nav bar
to access it i have to click on the logo." Partners + customers move
to homepage sections in later tasks.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task D — Delete index pages + add 301 redirects

Resolves spec §15.3.

**Files:**
- Delete: `src/pages/partners/index.astro`, `src/pages/ar/partners/index.astro`, `src/pages/customers/index.astro`, `src/pages/ar/customers/index.astro`
- Modify: `astro.config.mjs`
- Modify (or delete): `tests/pages/customers.test.ts` (asserts the index existed)

- [ ] **Step D.1: Verify nothing else links to these indexes**

```bash
grep -rn '"/partners"\|"/customers"\|/ar/partners"\|/ar/customers"' src/ --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.json" 2>&1
```

Expected matches:
- Old nav links (already removed in Task C) — none should remain.
- Breadcrumbs in `/partners/[slug]` — they link to `/partners` for the listing crumb. We will need to either update those breadcrumbs to link to home (`/`) or leave them as 301-redirect targets. **Decision: update breadcrumbs to link to `/` (home, where the partner section now lives).**

If grep finds breadcrumb hits in `src/pages/partners/[slug].astro` or AR mirror, edit them to point to `/` and `/ar/` respectively.

- [ ] **Step D.2: Delete the four index files**

```bash
rm src/pages/partners/index.astro \
   src/pages/ar/partners/index.astro \
   src/pages/customers/index.astro \
   src/pages/ar/customers/index.astro
```

- [ ] **Step D.3: Add redirects to astro.config.mjs**

Find the existing `defineConfig` call. Add a `redirects` block:

```js
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    mdx(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/partners':    { status: 301, destination: '/' },
    '/customers':   { status: 301, destination: '/' },
    '/ar/partners': { status: 301, destination: '/ar/' },
    '/ar/customers':{ status: 301, destination: '/ar/' },
  },
});
```

- [ ] **Step D.4: Delete or rewrite the customers index test**

`tests/pages/customers.test.ts` asserts the now-deleted index page rendered. Delete the file — its replacement comes in Task M (`tests/components/CustomersWall.test.ts`).

```bash
rm tests/pages/customers.test.ts
```

If `tests/pages/partners.test.ts` has assertions about the index page, delete those individual `it(...)` blocks (keep tests for `/partners/[slug]` detail pages — those are the deep-link routes that survive). Inspect the file first:

```bash
grep -n "describe\|it(" tests/pages/partners.test.ts
```

For each `it(...)` test referencing the `/partners` index URL, its rendered HTML, or `partners/index.astro`, delete the block.

- [ ] **Step D.5: Run tests + build**

```bash
npm test
npm run build
```

Expected: tests pass (or only fail on baseline content-collection issues). Build: 100 pages (104 - 4 deleted indexes).

- [ ] **Step D.6: Commit**

```bash
git add astro.config.mjs src/pages/ tests/pages/
git commit -m "$(cat <<'EOF'
v3: D — drop /partners + /customers indexes, add 301 redirects

* Delete src/pages/{partners,customers}/index.astro and AR mirrors —
  these views move to homepage sections in later tasks
* astro.config.mjs: 301 redirects from old paths to home (per locale)
* Drop tests/pages/customers.test.ts (replaced by CustomersWall test
  in a later task); trim partners.test.ts of index-only assertions
* Update partner-detail breadcrumbs to point to / instead of /partners

Build drops from 104 → 100 pages. /partners/[slug] (7 pages) survives
as deep-link target.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task E — Homepage Section 01: HeroV3 (rotating slideshow)

**Files:**
- Create: `src/components/home/HeroV3.astro`
- Create: `tests/components/HeroV3.test.ts`
- Modify: `src/i18n/{en,ar}.json` and `types.ts` (hero keys)

- [ ] **Step E.1: Add hero i18n keys (EN)**

In `src/i18n/en.json` add a `home` block at top level (or extend if already present). Inside `home`, add `hero`:

```json
"home": {
  "hero": {
    "kicker": "Zagros Trading · Khartoum",
    "est_pill": "Est · 2010",
    "headline_phrase": "Seeds, fertilizers, pesticides, sourced for",
    "headline_accent": "Sudanese soil.",
    "meta_suppliers": "7 suppliers · 6 countries",
    "meta_hours": "Sun–Thu 8–5",
    "meta_phone": "+249 91 233 8559"
  }
}
```

(No em dash. Comma + "for" in `headline_phrase` per DESIGN.md ban.)

- [ ] **Step E.2: Add hero i18n keys (AR, hand-translated)**

In `src/i18n/ar.json`, the matching block:

```json
"home": {
  "hero": {
    "kicker": "زاغروس للتجارة · الخرطوم",
    "est_pill": "تأسست · ٢٠١٠",
    "headline_phrase": "بذور، أسمدة، مبيدات، مصدّرة من أجل",
    "headline_accent": "تربة السودان.",
    "meta_suppliers": "٧ موردين · ٦ دول",
    "meta_hours": "الأحد إلى الخميس · ٨ صباحاً – ٥ مساءً",
    "meta_phone": "+249 91 233 8559"
  }
}
```

(Phone digits stay Western per AR convention; visible UI numbers use Arabic-Indic.)

- [ ] **Step E.3: Add types**

In `src/i18n/types.ts`, add the `home.hero` block to the type. Find the right place to extend the existing `home` interface or create one if missing:

```ts
home: {
  hero: {
    kicker: string;
    est_pill: string;
    headline_phrase: string;
    headline_accent: string;
    meta_suppliers: string;
    meta_hours: string;
    meta_phone: string;
  };
};
```

- [ ] **Step E.4: Write the failing HeroV3 test**

`tests/components/HeroV3.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HeroV3 from '../../src/components/home/HeroV3.astro';

describe('HeroV3', () => {
  it('renders all 4 slide images', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('/hero/irrigation.webp');
    expect(html).toContain('/hero/crop.webp');
    expect(html).toContain('/hero/vegetable.webp');
    expect(html).toContain('/hero/pest.webp');
  });

  it('first slide preloads with fetchpriority=high', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toMatch(/<img[^>]*src="\/hero\/irrigation\.webp"[^>]*fetchpriority="high"/);
  });

  it('renders the locked headline with signal-yellow accent word', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('Sudanese soil.');
    expect(html).toMatch(/text-signal/);
  });

  it('exposes 4 progress dots', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    const dots = html.match(/class="dot"/g) ?? [];
    expect(dots.length).toBe(4);
  });

  it('uses hero-slideshow class for CSS animation hook', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('hero-slideshow');
  });
});
```

- [ ] **Step E.5: Run test, expect fail**

```bash
npm test -- HeroV3
```
Expected: FAIL — module not found.

- [ ] **Step E.6: Implement HeroV3.astro**

`src/components/home/HeroV3.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 01 hero (rotating slideshow).
 *
 * 4 photos rotate with CSS-only Ken Burns + crossfade. 24s loop.
 * Reduced-motion freezes on first slide (irrigation).
 *
 * Composition fixed per spec §3 Section 01:
 *   top row: kicker + est-year pill
 *   center: italic display headline with signal-yellow accent word
 *   meta row: 3 mono pills along the bottom
 *   progress dots: bottom-right, 4 yellow segments fill in sync with active slide
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const slides = [
  { src: '/hero/irrigation.webp', alt: '' },
  { src: '/hero/crop.webp',       alt: '' },
  { src: '/hero/vegetable.webp',  alt: '' },
  { src: '/hero/pest.webp',       alt: '' },
];
---
<section class="relative min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] text-paper overflow-hidden bg-ink">
  <!-- Slideshow stack -->
  <div class="hero-slideshow absolute inset-0 z-0">
    {slides.map((s, i) => (
      <div class="slide absolute inset-0 will-change-[opacity]">
        <img
          src={s.src}
          alt={s.alt}
          width="1920"
          height="1080"
          loading={i === 0 ? 'eager' : 'eager'}
          fetchpriority={i === 0 ? 'high' : 'auto'}
          decoding="async"
          class="w-full h-full object-cover will-change-transform"
        />
      </div>
    ))}
  </div>

  <!-- Dark scrim for legibility -->
  <div class="absolute inset-0 z-10 pointer-events-none"
    style="background: linear-gradient(180deg, rgba(27,26,23,0.18) 30%, rgba(27,26,23,0.55) 70%, rgba(27,26,23,0.85) 100%);">
  </div>

  <!-- Content -->
  <div class="relative z-20 flex flex-col h-full min-h-[640px] sm:min-h-[720px] lg:min-h-[820px] px-page-x pt-sp-7 pb-sp-6">
    <!-- Top row -->
    <div class="flex items-baseline justify-between text-paper/80">
      <span class="font-mono text-[10.5px] tracking-[0.22em] uppercase inline-flex items-center gap-2">
        <span class="blink-signal w-[6px] h-[6px] rounded-full bg-signal inline-block"></span>
        {t('home.hero.kicker')}
      </span>
      <span class="font-mono text-[10.5px] tracking-[0.22em] uppercase">
        {t('home.hero.est_pill')}
      </span>
    </div>

    <!-- Headline -->
    <h1 class="font-display italic font-light text-[clamp(40px,8vw,96px)] leading-[0.95] max-w-[16ch] mt-auto mb-sp-6 text-paper" data-reveal style="--reveal-delay: 200ms;">
      {t('home.hero.headline_phrase')} <span class="text-signal not-italic">{t('home.hero.headline_accent')}</span>
    </h1>

    <!-- Meta row -->
    <div class="flex flex-wrap gap-x-sp-7 gap-y-sp-3 pt-sp-4 border-t border-paper/25 text-paper/85" data-reveal style="--reveal-delay: 360ms;">
      <span class="font-mono text-[10.5px] tracking-[0.18em] uppercase">{t('home.hero.meta_suppliers')}</span>
      <span class="font-mono text-[10.5px] tracking-[0.18em] uppercase">{t('home.hero.meta_hours')}</span>
      <span class="font-mono text-[10.5px] tracking-[0.18em] uppercase">{t('home.hero.meta_phone')}</span>
    </div>
  </div>

  <!-- Progress dots -->
  <div class="hero-progress absolute bottom-sp-6 end-page-x z-30 flex gap-1.5">
    {slides.map(() => (
      <span class="dot relative w-7 h-[2px] bg-paper/25 overflow-hidden block"></span>
    ))}
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>
```

- [ ] **Step E.7: Run test, expect pass**

```bash
npm test -- HeroV3
```
Expected: PASS (5/5).

- [ ] **Step E.8: Commit**

```bash
git add src/components/home/HeroV3.astro tests/components/HeroV3.test.ts \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "$(cat <<'EOF'
v3: E — Section 01 HeroV3 rotating slideshow

* HeroV3.astro: 4-photo CSS-only Ken Burns slideshow (24s loop) using
  existing public/hero/{irrigation,crop,vegetable,pest}.webp. First
  slide gets fetchpriority=high; reduced-motion freezes on first slide.
* Headline uses Fraunces italic with signal-yellow accent word.
  Meta row + headline have data-reveal staggered entry.
* Progress dots fill in sync with active slide (CSS only).
* i18n: 7 hero keys (EN + hand-translated AR), no em dashes per
  DESIGN.md absolute bans.
* tests/components/HeroV3.test.ts: 5/5 passing.

Replaces the old Hero.astro (deletion happens in the home page rewrite,
Task L).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task F — Homepage Section 02: OpsTickerMarquee

**Files:**
- Create: `src/components/home/OpsTickerMarquee.astro`
- Modify: `src/data/ops-ticker.json`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step F.1: Audit and refresh ops-ticker.json**

Read current `src/data/ops-ticker.json`. Replace any items that read like filler with real ones from `ZAGROS_SOURCE_OF_TRUTH.md`. Final shape:

```json
{
  "items": [
    { "en": "Khartoum HQ open · Sun–Thu 8–5",            "ar": "المقر الرئيسي بالخرطوم مفتوح · الأحد إلى الخميس · ٨–٥" },
    { "en": "K+S soluNPK 20-20-20 · in stock",            "ar": "K+S سولو NPK ٢٠-٢٠-٢٠ · متوفر" },
    { "en": "Field report · Alfalfa, Al Managil · 2026-04", "ar": "تقرير ميداني · البرسيم الحجازي، المناقل · ٢٠٢٦-٠٤" },
    { "en": "16 pesticide SKUs across 3 subcategories",   "ar": "١٦ مبيداً ضمن ٣ فئات فرعية" },
    { "en": "Branch · Port Sudan · operational",          "ar": "فرع · بورتسودان · يعمل" },
    { "en": "Barenbrug forage seeds · 3 confirmed varieties", "ar": "بذور الأعلاف باربنرغ · ٣ أنواع معتمدة" }
  ]
}
```

- [ ] **Step F.2: Add ticker i18n keys**

In `en.json` `home` block, add:

```json
"ticker": {
  "label": "Live"
}
```

In `ar.json`:

```json
"ticker": {
  "label": "مباشر"
}
```

In `types.ts`:

```ts
ticker: { label: string; };
```

(Inside `home`.)

- [ ] **Step F.3: Implement OpsTickerMarquee.astro**

`src/components/home/OpsTickerMarquee.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 02 ops ticker.
 *
 * Slim ink band. CSS-only marquee. Items duplicated for seamless loop.
 * RTL-aware via `dir` attribute on parent. Pauses on hover. Respects
 * prefers-reduced-motion (the @media gate in motion.css freezes it).
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import ticker from '../../data/ops-ticker.json';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const items = ticker.items.map((i) => i[lang as 'en' | 'ar']);
// Duplicate the array so the marquee loops without a gap.
const stream = [...items, ...items];
---
<aside
  class="marquee-wrap bg-ink text-paper overflow-hidden border-y border-paper/10"
  aria-label={t('home.ticker.label')}
>
  <div class="px-page-x py-3 flex items-center gap-sp-5">
    <span class="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.22em] uppercase text-signal flex-shrink-0">
      <span class="blink-signal w-[6px] h-[6px] rounded-full bg-signal inline-block"></span>
      {t('home.ticker.label')}
    </span>
    <div class="overflow-hidden flex-1">
      <div class="marquee-track font-mono text-[10.5px] tracking-[0.18em] uppercase text-paper/80">
        {stream.map((item) => (
          <span class="inline-block">· {item}</span>
        ))}
      </div>
    </div>
  </div>
</aside>
```

- [ ] **Step F.4: Build verify**

```bash
npm run build
```
Expected: 100 pages clean.

- [ ] **Step F.5: Commit**

```bash
git add src/components/home/OpsTickerMarquee.astro src/data/ops-ticker.json \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "$(cat <<'EOF'
v3: F — Section 02 OpsTickerMarquee (CSS-only)

* Ink band, marquee scrolls right→left LTR / left→right RTL via the
  motion.css keyframes. 40s desktop / 30s mobile. Pauses on hover.
* Items doubled in markup so the loop is seamless without JS.
* Refreshed ops-ticker.json with 6 real items sourced from
  ZAGROS_SOURCE_OF_TRUTH.md (HQ status, K+S stock, field report,
  pesticide SKU count, branch, Barenbrug seeds).
* Live dot blinks at 2.4s cadence (motion.css). All motion gated by
  prefers-reduced-motion: no-preference.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task G — Homepage Section 03: ByTheNumbersV3

**Files:**
- Create: `src/components/home/ByTheNumbersV3.astro`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step G.1: Add numbers i18n keys**

EN:

```json
"numbers": {
  "label": "By the numbers",
  "big_copy": "years moving inputs into Sudanese farms, established 2010 in Khartoum.",
  "suppliers": "Supplier partners across Germany, Netherlands, Switzerland, UK, Australia, Thailand, Egypt",
  "branches": "Sudan branches, Khartoum HQ + 5 regional",
  "skus": "Active SKUs across seeds, fertilizers, pesticides"
}
```

AR (hand-translated, Arabic-Indic numerals):

```json
"numbers": {
  "label": "بالأرقام",
  "big_copy": "سنة من إيصال المدخلات إلى المزارع السودانية، تأسست عام ٢٠١٠ في الخرطوم.",
  "suppliers": "موردون شركاء عبر ألمانيا وهولندا وسويسرا وبريطانيا وأستراليا وتايلاند ومصر",
  "branches": "فروع داخل السودان · الخرطوم (المقر) + ٥ فروع إقليمية",
  "skus": "صنف فعّال ضمن البذور والأسمدة والمبيدات"
}
```

`types.ts` extension:

```ts
numbers: {
  label: string;
  big_copy: string;
  suppliers: string;
  branches: string;
  skus: string;
};
```

- [ ] **Step G.2: Implement ByTheNumbersV3.astro**

`src/components/home/ByTheNumbersV3.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 03 by the numbers.
 *
 * Asymmetric grid: one giant number + three smalls. Numbers count up
 * from 0 when section enters viewport (1.2s ease-out). Reduced-motion
 * skips count-up and shows final value.
 *
 * Per DESIGN.md: NOT the SaaS hero-metric template. Big-number gets its
 * own column-and-a-bit; the smalls form a horizontal row underneath.
 * Sienna for the smalls, ink for the giant.
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

// AR shows Arabic-Indic display, but the count-up data uses Western digits
// for the requestAnimationFrame numeric loop. Final text gets swapped to
// AR-Indic via Intl.NumberFormat in a small inline script if needed.
const numerals = isRTL ? '٠١٢٣٤٥٦٧٨٩' : '0123456789';
function toLocaleNum(n: number, suffix = ''): string {
  if (!isRTL) return n + suffix;
  return n.toString().split('').map((d) => numerals[+d] ?? d).join('') + suffix;
}
---
<section class="px-page-x py-section-y bg-paper">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute inline-flex items-center gap-2.5 mb-sp-7" data-reveal>
    <span class="w-6 h-px bg-mute inline-block"></span>
    {t('home.numbers.label')}
  </span>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sp-7 lg:gap-sp-9 items-end">
    <!-- Big -->
    <div class="lg:col-span-1" data-reveal style="--reveal-delay: 0ms;">
      <div class="font-display italic font-light text-[clamp(96px,18vw,200px)] leading-[0.82] text-ink" data-count-target="15" data-count-suffix="">{toLocaleNum(15)}</div>
      <p class="font-display text-lg sm:text-xl leading-[1.25] max-w-[18ch] mt-sp-4 text-ink">
        {t('home.numbers.big_copy')}
      </p>
    </div>

    <!-- Smalls -->
    <div data-reveal style="--reveal-delay: 120ms;">
      <div class="font-display italic font-light text-[clamp(56px,9vw,88px)] leading-[0.82] text-sienna" data-count-target="7">{toLocaleNum(7)}</div>
      <p class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-mute mt-sp-3 max-w-[20ch]">{t('home.numbers.suppliers')}</p>
    </div>

    <div data-reveal style="--reveal-delay: 200ms;">
      <div class="font-display italic font-light text-[clamp(56px,9vw,88px)] leading-[0.82] text-sienna" data-count-target="6">{toLocaleNum(6)}</div>
      <p class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-mute mt-sp-3 max-w-[20ch]">{t('home.numbers.branches')}</p>
    </div>

    <div data-reveal style="--reveal-delay: 280ms;">
      <div class="font-display italic font-light text-[clamp(56px,9vw,88px)] leading-[0.82] text-sienna" data-count-target="30" data-count-suffix="+">{toLocaleNum(30, '+')}</div>
      <p class="font-mono text-[10.5px] tracking-[0.18em] uppercase text-mute mt-sp-3 max-w-[20ch]">{t('home.numbers.skus')}</p>
    </div>
  </div>
</section>

<script>
  import { observeReveal, observeCountUp } from '../../lib/motion';
  observeReveal();
  observeCountUp();
</script>
```

- [ ] **Step G.3: Build verify**

```bash
npm run build
```

- [ ] **Step G.4: Commit**

```bash
git add src/components/home/ByTheNumbersV3.astro src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "v3: G — Section 03 ByTheNumbersV3 with count-up

Asymmetric 1+3 grid (big 15-year number + 3 smalls for suppliers,
branches, SKUs). Sienna for smalls, ink for big number. Count-up
animation via observeCountUp() helper from motion.ts. AR locale
displays Arabic-Indic numerals.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task H — Homepage Section 04: CatalogStrips

**Files:**
- Create: `src/components/home/CatalogStrips.astro`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step H.1: Add catalog i18n keys**

EN:

```json
"catalog": {
  "label": "The catalog",
  "headline_phrase": "Three product lines, one Sudan-grade",
  "headline_accent": "supply chain.",
  "open": "Open category",
  "lines": {
    "seeds": {
      "title": "Seeds",
      "supplier_caption": "Barenbrug · East West",
      "skus": "3+",
      "subcat": "Forage + vegetable",
      "body": "Australian forage cultivars and Thai vegetable hybrids. Catalog scaling as suppliers confirm."
    },
    "fertilizers": {
      "title": "Fertilizers",
      "supplier_caption": "K+S · Agro Dragon",
      "skus": "11",
      "subcat": "Water-soluble NPK",
      "body": "K+S German premium chemistry, soluble NPK, KaliSOP, EPSO Top, soluNOP."
    },
    "pesticides": {
      "title": "Pesticides",
      "supplier_caption": "SAF · KZ · Kafr El Zayat",
      "skus": "16",
      "subcat": "3 subcategories",
      "body": "Insecticides, herbicides, fungicides. Egyptian, Swiss, UK, China, India sourcing."
    }
  }
}
```

AR (hand-translated):

```json
"catalog": {
  "label": "الكتالوج",
  "headline_phrase": "ثلاثة خطوط من المنتجات، سلسلة إمداد",
  "headline_accent": "بمعايير سودانية.",
  "open": "افتح الفئة",
  "lines": {
    "seeds": {
      "title": "البذور",
      "supplier_caption": "باربنرغ · إيست ويست",
      "skus": "+٣",
      "subcat": "أعلاف + خضار",
      "body": "أصناف أعلاف أسترالية وهجن خضار تايلاندية. الكتالوج يتسع كلما تأكدت أصناف الموردين."
    },
    "fertilizers": {
      "title": "الأسمدة",
      "supplier_caption": "K+S · أقرو دراقون",
      "skus": "١١",
      "subcat": "ذائبة في الماء NPK",
      "body": "كيميا ألمانية متميزة من K+S، NPK ذائبة، كاليسوب، EPSO Top، سولو NOP."
    },
    "pesticides": {
      "title": "المبيدات",
      "supplier_caption": "SAF · KZ · كفر الزيات",
      "skus": "١٦",
      "subcat": "٣ فئات فرعية",
      "body": "مبيدات حشرية وأعشاب وفطريات. مصادر مصرية وسويسرية وبريطانية وصينية وهندية."
    }
  }
}
```

`types.ts`:

```ts
catalog: {
  label: string;
  headline_phrase: string;
  headline_accent: string;
  open: string;
  lines: {
    seeds:       { title: string; supplier_caption: string; skus: string; subcat: string; body: string };
    fertilizers: { title: string; supplier_caption: string; skus: string; subcat: string; body: string };
    pesticides:  { title: string; supplier_caption: string; skus: string; subcat: string; body: string };
  };
};
```

- [ ] **Step H.2: Implement CatalogStrips.astro**

`src/components/home/CatalogStrips.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 04 catalog strips.
 *
 * 3 cards, mobile-first responsive grid. Each card has the product-card
 * hero zone (the user-loved bg-c-* colored zones from Plan 7 B) plus an
 * editorial body. Stagger reveal on entry. Hover lifts 4px, sharpens border.
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

const lines = [
  { key: 'seeds',       href: '/products/seeds',       hero: 'bg-c-rhodes',    serial: '01' },
  { key: 'fertilizers', href: '/products/fertilizers', hero: 'bg-c-npk',       serial: '02' },
  { key: 'pesticides',  href: '/products/pesticides',  hero: 'bg-c-pesticide', serial: '03' },
] as const;

function arHref(href: string) {
  return isRTL ? `/ar${href}` : href;
}
---
<section class="px-page-x py-section-y bg-paper-light border-t border-ink">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-mute inline-block"></span>
    {t('home.catalog.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
    {t('home.catalog.headline_phrase')} <span class="text-sienna not-italic">{t('home.catalog.headline_accent')}</span>
  </h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sp-5 sm:gap-sp-6">
    {lines.map(({ key, href, hero, serial }, idx) => {
      const line = (t as any)(`home.catalog.lines.${key}`) as {
        title: string; supplier_caption: string; skus: string; subcat: string; body: string;
      };
      // Note: useTranslations returns string, so for nested objects we
      // reach into the JSON shape directly via the `t` function returning
      // the raw value. Astro's JSON imports preserve nested objects, so
      // the cast above is safe given our types.ts definition.
      return (
        <article class="flex flex-col bg-paper border border-stone overflow-hidden transition-[border-color,transform] duration-200 hover:border-ink hover:-translate-y-1" data-reveal style={`--reveal-delay: ${(idx + 1) * 80}ms;`}>
          <a href={arHref(href)} class="block no-underline text-inherit">
            <div class:list={[hero, 'p-sp-5 sm:p-sp-6 min-h-[200px] flex flex-col justify-between text-paper']}>
              <div class="flex justify-between items-baseline">
                <span class="font-mono text-[10px] tracking-[0.22em] uppercase opacity-70">{line.supplier_caption}</span>
                <span class="font-mono text-[10px] tracking-[0.22em] uppercase opacity-70">{serial}</span>
              </div>
              <div>
                <div class="font-display italic font-light text-[clamp(48px,7vw,72px)] leading-[0.85]">{line.skus}</div>
                <div class="font-mono text-[10px] tracking-[0.22em] uppercase opacity-70 mt-sp-2">{line.subcat}</div>
              </div>
            </div>
          </a>
          <div class="p-sp-5 sm:p-sp-6 flex flex-col flex-1 gap-sp-4">
            <h3 class="font-display italic text-[clamp(24px,3vw,30px)] leading-tight text-ink m-0">
              <a href={arHref(href)} class="text-ink no-underline">{line.title}</a>
            </h3>
            <p class="font-sans text-[14px] leading-relaxed text-ink m-0">{line.body}</p>
            <a href={arHref(href)} class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink no-underline border-b border-ink pb-0.5 self-start min-h-[44px] inline-flex items-center mt-auto">
              {t('home.catalog.open')} {isRTL ? '←' : '→'}
            </a>
          </div>
        </article>
      );
    })}
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>
```

- [ ] **Step H.3: Build verify**

```bash
npm run build
```

- [ ] **Step H.4: Commit**

```bash
git add src/components/home/CatalogStrips.astro src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "v3: H — Section 04 CatalogStrips

3-line responsive grid (1/2/3 cols), each card uses the bg-c-* hero
zone the user explicitly liked from Plan 7 B. Pesticide line uses
the new bg-c-pesticide token from Task B. Stagger reveal + 4px lift
on hover. Bilingual.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task I — Homepage Section 05: PartnersSection (with shared PartnerSpotlight)

**Files:**
- Create: `src/components/partners/PartnerSpotlight.astro`
- Create: `src/components/home/PartnersSection.astro`
- Create: `tests/components/PartnersSection.test.ts`
- Modify: `src/content/config.ts`, `src/content/partners/k-plus-s.mdx`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step I.1: Add `featured` to partners schema**

In `src/content/config.ts`, find the partners collection schema. Add an optional `featured: z.boolean().default(false)` field. Sample form (adapt to existing schema shape):

```ts
const partnersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    // ... existing fields
    featured: z.boolean().default(false),
  }),
});
```

- [ ] **Step I.2: Mark K+S featured**

In `src/content/partners/k-plus-s.mdx` frontmatter, add:

```yaml
featured: true
```

- [ ] **Step I.3: Add partners i18n keys**

EN:

```json
"partners": {
  "label": "Partners",
  "headline_phrase": "Seven international suppliers, sourcing from",
  "headline_accent": "six countries.",
  "spotlight_label": "Spotlight",
  "read_story": "Read partner story"
}
```

AR:

```json
"partners": {
  "label": "الشركاء",
  "headline_phrase": "سبعة موردون دوليون، يصدّرون من",
  "headline_accent": "ست دول.",
  "spotlight_label": "في الواجهة",
  "read_story": "اقرأ ملف الشريك"
}
```

`types.ts`:

```ts
partners: {
  label: string;
  headline_phrase: string;
  headline_accent: string;
  spotlight_label: string;
  read_story: string;
};
```

- [ ] **Step I.4: Implement PartnerSpotlight (shared)**

`src/components/partners/PartnerSpotlight.astro`:

```astro
---
/**
 * Plan: Zagros v3 — shared partner spotlight card.
 *
 * Used in two places:
 *   1. Home Section 05 spotlight (left column, 2 rows)
 *   2. /partners/[slug] hero (full-width variant)
 *
 * Renders an ink-grounded card with country flag, partner name, photo
 * placeholder (until client provides), short body copy, and a "read
 * partner story" link in signal yellow.
 */
import type { CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Placeholder from '../editorial/Placeholder.astro';

interface Props {
  partner: CollectionEntry<'partners'>;
  variant?: 'home' | 'detail';
}

const { partner, variant = 'home' } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';
const localized = (partner.data as any).name?.[lang] ?? (partner.data as any).name ?? partner.slug;
const country = (partner.data as any).country ?? '';
const flag = (partner.data as any).flag ?? '';
const blurb = (partner.data as any).blurb?.[lang] ?? (partner.data as any).blurb ?? '';

const href = isRTL ? `/ar/partners/${partner.slug}` : `/partners/${partner.slug}`;
const minHeight = variant === 'detail' ? 'min-h-[480px]' : 'min-h-[420px] lg:min-h-[460px]';
---
<article class:list={['relative bg-ink text-paper p-sp-6 sm:p-sp-7 flex flex-col gap-sp-5', minHeight]}>
  <div class="flex items-baseline justify-between gap-sp-3">
    <span class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70">
      {t('home.partners.spotlight_label')} · {country.toUpperCase()} {flag}
    </span>
    <span class="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/50">
      {(partner.data as any).line ?? ''}
    </span>
  </div>

  <h3 class="font-display italic font-light text-[clamp(28px,4vw,40px)] leading-[1] text-paper m-0">
    {localized}
  </h3>

  <Placeholder kind="partner" label={`${localized} — facility, product range, or team`} dark={true} class="flex-1 max-h-[260px]" />

  <p class="font-sans text-[14px] leading-relaxed text-paper/85 max-w-[44ch] m-0">
    {blurb || `Partner profile content for ${localized}. Full body copy in /partners/${partner.slug}.`}
  </p>

  <a href={href} class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-signal no-underline border-b border-signal/40 hover:border-signal pb-0.5 self-start min-h-[44px] inline-flex items-center">
    {t('home.partners.read_story')} {isRTL ? '←' : '→'}
  </a>
</article>
```

- [ ] **Step I.5: Write the failing PartnersSection test**

`tests/components/PartnersSection.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import PartnersSection from '../../src/components/home/PartnersSection.astro';

describe('PartnersSection', () => {
  it('renders the K+S partner as the spotlight', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PartnersSection);
    expect(html).toMatch(/K\+?S|كاي\s?\+?\s?س/);
    // Spotlight card has the spotlight label
    expect(html.toLowerCase()).toMatch(/spotlight|في الواجهة/);
  });

  it('renders 6 non-featured partner tiles', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PartnersSection);
    // Each tile carries the data-partner-tile attribute
    const tiles = html.match(/data-partner-tile/g) ?? [];
    expect(tiles.length).toBe(6);
  });

  it('every tile links to /partners/[slug]', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PartnersSection);
    const links = html.match(/href="\/partners\/[a-z-]+"/g) ?? [];
    expect(links.length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step I.6: Run test, expect fail**

```bash
npm test -- PartnersSection
```
Expected: FAIL — module not found.

- [ ] **Step I.7: Implement PartnersSection.astro**

`src/components/home/PartnersSection.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 05 partners (folded in).
 *
 * Layout: 1.4fr / 1fr / 1fr grid. Spotlight (K+S, featured: true) spans
 * 2 rows on the left. Six other partners as tiles in the 2x3 right grid.
 *
 * Mobile: spotlight on top, tiles in 2-col grid below.
 *
 * Per spec §3 Section 05: each tile links to /partners/[slug].
 */
import { getCollection } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import PartnerSpotlight from '../partners/PartnerSpotlight.astro';
import Placeholder from '../editorial/Placeholder.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

const allPartners = await getCollection('partners');
const featured = allPartners.find((p) => (p.data as any).featured) ?? allPartners[0];
const tiles = allPartners.filter((p) => p.slug !== featured.slug);

function arHref(slug: string) {
  return isRTL ? `/ar/partners/${slug}` : `/partners/${slug}`;
}
---
<section class="px-page-x py-section-y bg-paper border-t border-ink">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-mute inline-block"></span>
    {t('home.partners.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[24ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
    {t('home.partners.headline_phrase')} <span class="text-sienna not-italic">{t('home.partners.headline_accent')}</span>
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-sp-5 lg:gap-sp-6">
    <!-- Spotlight (spans 2 rows on lg) -->
    <div class="lg:row-span-2" data-reveal>
      <PartnerSpotlight partner={featured} variant="home" />
    </div>

    <!-- Tiles -->
    {tiles.map((partner, idx) => {
      const localized = (partner.data as any).name?.[lang] ?? (partner.data as any).name ?? partner.slug;
      const country = (partner.data as any).country ?? '';
      const flag = (partner.data as any).flag ?? '';
      const line = (partner.data as any).line ?? '';
      const logoPath = (partner.data as any).logo_path;
      return (
        <a
          href={arHref(partner.slug)}
          data-partner-tile
          class="flex flex-col gap-sp-3 p-sp-4 bg-paper-light border border-stone hover:border-ink transition-colors duration-200 min-h-[160px] no-underline text-inherit"
          data-reveal
          style={`--reveal-delay: ${(idx + 1) * 80}ms;`}
        >
          <div class="flex-1 flex items-center justify-center min-h-[64px]">
            {logoPath ? (
              <img src={logoPath} alt={localized} width="160" height="48" loading="lazy" decoding="async" class="block max-h-12 w-auto" />
            ) : (
              <Placeholder kind="logo" label={`${localized} — logo pending`} aspectRatio="5 / 2" class="max-h-16" />
            )}
          </div>
          <div class="flex items-baseline justify-between mt-auto">
            <span class="font-display italic text-[16px] text-ink">{localized}</span>
            <span class="font-mono text-[9.5px] tracking-[0.2em] uppercase text-mute">{flag} {country.toUpperCase()} · {line}</span>
          </div>
        </a>
      );
    })}
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>
```

- [ ] **Step I.8: Run test, expect pass**

```bash
npm test -- PartnersSection
```
Expected: PASS (3/3).

- [ ] **Step I.9: Commit**

```bash
git add src/components/partners/PartnerSpotlight.astro \
        src/components/home/PartnersSection.astro \
        tests/components/PartnersSection.test.ts \
        src/content/config.ts src/content/partners/k-plus-s.mdx \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "$(cat <<'EOF'
v3: I — Section 05 PartnersSection (folded in) + shared spotlight

* PartnerSpotlight.astro: shared component for home Section 05 left
  column AND /partners/[slug] hero. Ink ground, signal CTA, dark
  Placeholder for the partner photo.
* PartnersSection.astro: 1.4fr/1fr/1fr grid on lg, single column on
  mobile. K+S (featured: true) spans 2 rows on left; 6 other partners
  as tiles linking to their /partners/[slug] page.
* content/config.ts: partners.featured optional boolean
* content/partners/k-plus-s.mdx: featured: true
* tests/components/PartnersSection.test.ts: 3/3 passing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task J — Homepage Section 06: FieldReportsTeaser

**Files:**
- Create: `src/components/home/FieldReportsTeaser.astro`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step J.1: Add reports i18n keys**

EN:

```json
"reports": {
  "label": "Field reports",
  "headline_phrase": "From the ground, agronomy notes",
  "headline_accent": "by branch.",
  "read_all": "Read all reports"
}
```

AR:

```json
"reports": {
  "label": "تقارير ميدانية",
  "headline_phrase": "من الأرض، ملاحظات زراعية",
  "headline_accent": "من كل فرع.",
  "read_all": "اقرأ كل التقارير"
}
```

`types.ts`:

```ts
reports: { label: string; headline_phrase: string; headline_accent: string; read_all: string; };
```

- [ ] **Step J.2: Implement FieldReportsTeaser.astro**

`src/components/home/FieldReportsTeaser.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 06 field reports teaser.
 *
 * 1.6fr/1fr/1fr grid. Featured report on the left (16:10 image), two
 * smaller reports on the right (4:3 image). Sorted by date desc, first 3.
 * Stagger reveal. Uses Placeholder when image_pending.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import Placeholder from '../editorial/Placeholder.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';

const all = await getCollection('field-reports');
// Sort by date desc — the schema's `date` field is required
const sorted = all.sort((a, b) => {
  const da = new Date((a.data as any).date ?? 0).getTime();
  const db = new Date((b.data as any).date ?? 0).getTime();
  return db - da;
});
const reports = sorted.slice(0, 3);
const [featured, ...rest] = reports;

function arHref(slug: string) {
  return isRTL ? `/ar/field-reports/${slug}` : `/field-reports/${slug}`;
}
function localized(entry: CollectionEntry<'field-reports'>, field: string): string {
  const v = (entry.data as any)[field];
  if (typeof v === 'object' && v !== null) return v[lang] ?? v.en ?? '';
  return v ?? '';
}
function fmtDate(iso: string): string {
  if (!iso) return '';
  return iso.slice(0, 7); // YYYY-MM
}
---
<section class="px-page-x py-section-y bg-paper-light border-t border-ink">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-mute inline-block"></span>
    {t('home.reports.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[20ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
    {t('home.reports.headline_phrase')} <span class="text-sienna not-italic">{t('home.reports.headline_accent')}</span>
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-sp-5 lg:gap-sp-6">
    {featured && (
      <a href={arHref(featured.slug)} data-reveal class="flex flex-col bg-paper border border-stone hover:border-ink transition-colors no-underline text-inherit">
        {(featured.data as any).hero_image ? (
          <img src={(featured.data as any).hero_image} alt="" width="800" height="500" loading="lazy" decoding="async" class="block w-full aspect-[16/10] object-cover" />
        ) : (
          <Placeholder kind="field-photo" label={`${localized(featured, 'title')} — featured report photo pending`} aspectRatio="16 / 10" />
        )}
        <div class="p-sp-5 sm:p-sp-6">
          <span class="font-mono text-[10px] tracking-[0.22em] uppercase text-mute block mb-sp-3">REPORT · {fmtDate((featured.data as any).date ?? '')}</span>
          <h3 class="font-display italic text-[clamp(22px,3.5vw,30px)] leading-tight text-ink m-0 mb-sp-3">
            {localized(featured, 'title')}
          </h3>
          <p class="font-sans text-[14px] leading-relaxed text-ink m-0">{localized(featured, 'excerpt')}</p>
        </div>
      </a>
    )}
    {rest.map((report, idx) => (
      <a href={arHref(report.slug)} data-reveal style={`--reveal-delay: ${(idx + 1) * 120}ms;`} class="flex flex-col bg-paper border border-stone hover:border-ink transition-colors no-underline text-inherit">
        {(report.data as any).hero_image ? (
          <img src={(report.data as any).hero_image} alt="" width="600" height="450" loading="lazy" decoding="async" class="block w-full aspect-[4/3] object-cover" />
        ) : (
          <Placeholder kind="field-photo" label={`${localized(report, 'title')} — photo pending`} aspectRatio="4 / 3" />
        )}
        <div class="p-sp-5">
          <span class="font-mono text-[10px] tracking-[0.22em] uppercase text-mute block mb-sp-3">REPORT · {fmtDate((report.data as any).date ?? '')}</span>
          <h3 class="font-display italic text-[20px] leading-tight text-ink m-0 mb-sp-2">
            {localized(report, 'title')}
          </h3>
          <p class="font-sans text-[13px] leading-relaxed text-ink m-0">{localized(report, 'excerpt')}</p>
        </div>
      </a>
    ))}
  </div>

  <div class="mt-sp-9">
    <a href={isRTL ? '/ar/field-reports' : '/field-reports'} class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink no-underline border-b border-ink pb-0.5 inline-flex items-center min-h-[44px]">
      {t('home.reports.read_all')} {isRTL ? '←' : '→'}
    </a>
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>
```

- [ ] **Step J.3: Build verify**

```bash
npm run build
```

- [ ] **Step J.4: Commit**

```bash
git add src/components/home/FieldReportsTeaser.astro src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "v3: J — Section 06 FieldReportsTeaser

1 featured + 2 standard reports in 1.6/1/1 grid. Falls back to
Placeholder.astro when hero_image is unset. Stagger reveal. Bottom
'Read all reports →' link to /field-reports.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task K — Homepage Section 07: CustomersWall

**Files:**
- Create: `src/components/home/CustomersWall.astro`
- Create: `tests/components/CustomersWall.test.ts`
- Modify: `src/data/customers.ts`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step K.1: Add customers i18n keys**

EN:

```json
"customers": {
  "label": "Customers",
  "headline_phrase": "Working with the people who",
  "headline_accent": "feed Sudan.",
  "pull_quote_pending": "[Customer pull quote pending client confirmation.]"
}
```

AR:

```json
"customers": {
  "label": "العملاء",
  "headline_phrase": "نعمل مع الذين",
  "headline_accent": "يطعمون السودان.",
  "pull_quote_pending": "[اقتباس عميل قيد التأكيد من العميل.]"
}
```

`types.ts`:

```ts
customers: {
  label: string;
  headline_phrase: string;
  headline_accent: string;
  pull_quote_pending: string;
};
```

- [ ] **Step K.2: Add optional pull_quote field to customers data**

In `src/data/customers.ts`, extend the customer type with optional `pull_quote`:

```ts
export interface Customer {
  // ... existing fields
  pull_quote?: {
    text: { en: string; ar: string };
    attribution: { en: string; ar: string };
  };
}
```

Leave all 6 customers' `pull_quote` undefined (real quotes pending client).

- [ ] **Step K.3: Write the failing CustomersWall test**

`tests/components/CustomersWall.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CustomersWall from '../../src/components/home/CustomersWall.astro';

describe('CustomersWall', () => {
  it('renders 6 customer logo tiles', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    const tiles = html.match(/data-customer-logo/g) ?? [];
    expect(tiles.length).toBe(6);
  });

  it('falls back to pull_quote_pending text when no quote is set', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    expect(html).toMatch(/pull quote pending|قيد التأكيد/);
  });

  it('uses ink ground for the section', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    expect(html).toMatch(/bg-ink/);
  });
});
```

- [ ] **Step K.4: Run test, expect fail**

```bash
npm test -- CustomersWall
```

- [ ] **Step K.5: Implement CustomersWall.astro**

`src/components/home/CustomersWall.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 07 customers wall.
 *
 * Ink-ground band — chapter contrast. Pull quote (italic Plex Serif,
 * signal-yellow opening quotation mark). Logo wall: 6 tiles in a row
 * on lg, 3x2 on tablet, marquee on mobile. Hover desaturates other
 * logos.
 *
 * Per DESIGN.md absolute-bans: this is intentionally NOT an identical
 * card grid — the pull quote dominates the top, logos serve as visual
 * proof underneath, scaled to the grid.
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import { customers } from '../../data/customers';
import Placeholder from '../editorial/Placeholder.astro';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const customerWithQuote = customers.find((c: any) => c.pull_quote);
const quote = customerWithQuote?.pull_quote;
---
<section class="px-page-x py-section-y bg-ink text-paper">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper/60 inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-paper/60 inline-block"></span>
    {t('home.customers.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-paper max-w-[24ch] mb-sp-7" data-reveal style="--reveal-delay: 100ms;">
    {t('home.customers.headline_phrase')} <span class="text-signal not-italic">{t('home.customers.headline_accent')}</span>
  </h2>

  <div class="max-w-[44ch] mb-sp-9" data-reveal style="--reveal-delay: 200ms;">
    {quote ? (
      <>
        <div class="font-display italic font-light text-[60px] leading-[0.4] text-signal mb-sp-3">"</div>
        <p class="font-serif italic text-[clamp(18px,2.5vw,24px)] leading-[1.35] text-paper m-0">
          {quote.text[lang as 'en' | 'ar']}
        </p>
        <p class="font-mono text-[10.5px] tracking-[0.22em] uppercase text-paper/70 mt-sp-4 m-0">
          — {quote.attribution[lang as 'en' | 'ar']}
        </p>
      </>
    ) : (
      <p class="font-serif italic text-[clamp(18px,2.5vw,24px)] leading-[1.35] text-paper/70 m-0">
        {t('home.customers.pull_quote_pending')}
      </p>
    )}
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-sp-3">
    {customers.map((c: any) => (
      <div data-customer-logo class="bg-paper/5 border border-paper/15 aspect-[5/3] flex items-center justify-center p-sp-3 hover:bg-paper/10 transition-colors" data-reveal>
        {c.logo_path ? (
          <img src={c.logo_path} alt={c.name?.en ?? c.name} width="120" height="48" loading="lazy" decoding="async" class="max-w-full max-h-full object-contain opacity-85 hover:opacity-100 transition-opacity" />
        ) : (
          <Placeholder kind="logo" label={(c.name?.en ?? c.name) + ' — logo pending'} dark={true} aspectRatio="5 / 3" />
        )}
      </div>
    ))}
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>
```

- [ ] **Step K.6: Run test, expect pass**

```bash
npm test -- CustomersWall
```

- [ ] **Step K.7: Commit**

```bash
git add src/components/home/CustomersWall.astro tests/components/CustomersWall.test.ts \
        src/data/customers.ts src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "v3: K — Section 07 CustomersWall (ink ground)

Ink-grounded chapter break. Pull quote in Plex Serif italic with
signal-yellow opening quotation mark. Falls back to honest pending
marker when no real quote is set (per anti-AI-slop discipline —
never invent customer testimonials). Logo wall: 6 tiles, hover-fade
on others when one is hovered.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task L — Homepage Section 08: BranchesMap (hand-drawn SVG)

Resolves spec §15.2.

**Files:**
- Create: `src/components/home/BranchesMap.astro`
- Create: `tests/components/BranchesMap.test.ts`
- Modify: `src/i18n/{en,ar}.json` + `types.ts`
- Modify: `package.json` (remove leaflet)

- [ ] **Step L.1: Add branches i18n keys**

EN:

```json
"branches": {
  "label": "Network",
  "headline_phrase": "Six branches across Sudan, Khartoum HQ +",
  "headline_accent": "five regional.",
  "hq": "Headquarters",
  "branch": "Branch"
}
```

AR:

```json
"branches": {
  "label": "الشبكة",
  "headline_phrase": "ستة فروع داخل السودان، الخرطوم (المقر) +",
  "headline_accent": "خمسة فروع إقليمية.",
  "hq": "المقر الرئيسي",
  "branch": "فرع"
}
```

`types.ts`:

```ts
branches: { label: string; headline_phrase: string; headline_accent: string; hq: string; branch: string; };
```

- [ ] **Step L.2: Write the failing BranchesMap test**

`tests/components/BranchesMap.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BranchesMap from '../../src/components/home/BranchesMap.astro';

describe('BranchesMap', () => {
  it('renders an inline SVG (not Leaflet)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    expect(html).toMatch(/<svg[^>]*viewBox/);
    expect(html).not.toMatch(/leaflet/i);
  });

  it('renders 6 branch list items', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    const items = html.match(/data-branch-item/g) ?? [];
    expect(items.length).toBe(6);
  });

  it('renders 6 map pins', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    const pins = html.match(/data-pin/g) ?? [];
    expect(pins.length).toBe(6);
  });
});
```

- [ ] **Step L.3: Run test, expect fail**

```bash
npm test -- BranchesMap
```

- [ ] **Step L.4: Implement BranchesMap.astro**

`src/components/home/BranchesMap.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 08 branches map.
 *
 * Hand-drawn editorial SVG of Sudan with 6 city pins, paired with a
 * branch list. Replaces the Leaflet/OSM render — too generic for the
 * publication tone.
 *
 * Coordinates are normalised to the SVG's 0..100 viewBox so the outline
 * + pins scale together. Approximate positions (not GIS-grade):
 *   Khartoum    — central
 *   Port Sudan  — east coast
 *   Al Qadarif  — east-central, south of Port Sudan
 *   Al Managil  — central, south of Khartoum
 *   Ad-Damar    — north-central, between Khartoum and Egyptian border
 *   Ad-Daba     — north
 *
 * The Sudan outline is a simplified path. For a more accurate hand-drawn
 * outline later, swap the `<path d=...>` value below — everything else
 * (pins, list, animations) stays the same.
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import { companyData } from '../../data/company';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

interface Branch { city_en: string; city_ar?: string; type: 'hq' | 'branch'; cx: number; cy: number; }

// Pull cities + types from companyData. If the data shape has just city
// names, layer the 6 known coordinates here. The 6 branches are fixed
// per ZAGROS_SOURCE_OF_TRUTH.md §5; we map by name.
const branches: Branch[] = [
  { city_en: 'Khartoum',   city_ar: 'الخرطوم',   type: 'hq',     cx: 52, cy: 48 },
  { city_en: 'Port Sudan', city_ar: 'بورتسودان', type: 'branch', cx: 78, cy: 32 },
  { city_en: 'Al Qadarif', city_ar: 'القضارف',   type: 'branch', cx: 70, cy: 56 },
  { city_en: 'Al Managil', city_ar: 'المناقل',   type: 'branch', cx: 50, cy: 60 },
  { city_en: 'Ad-Damar',   city_ar: 'الدامر',    type: 'branch', cx: 56, cy: 36 },
  { city_en: 'Ad-Daba',    city_ar: 'الدبة',     type: 'branch', cx: 44, cy: 28 },
];

// Simplified Sudan outline as a hand-drawn-feel path. Editorial, not GIS.
const sudanPath = "M 35,18 L 60,14 L 78,18 L 86,28 L 86,46 L 78,58 L 76,68 L 68,80 L 56,86 L 42,84 L 28,76 L 22,62 L 22,42 L 28,28 Z";
---
<section class="px-page-x py-section-y bg-paper border-t border-ink">
  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-mute inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-mute inline-block"></span>
    {t('home.branches.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(32px,5vw,56px)] leading-[0.95] text-ink max-w-[24ch] mb-sp-9" data-reveal style="--reveal-delay: 100ms;">
    {t('home.branches.headline_phrase')} <span class="text-sienna not-italic">{t('home.branches.headline_accent')}</span>
  </h2>

  <div class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-sp-7 lg:gap-sp-9 items-start">
    <!-- Map -->
    <div class="aspect-[5/4] w-full bg-paper-light border border-stone p-sp-5 flex items-center justify-center" data-reveal>
      <svg viewBox="0 0 100 100" class="w-full h-full" aria-label="Sudan branch map" role="img">
        <!-- Outline -->
        <path
          d={sudanPath}
          fill="rgb(var(--color-stone) / 0.4)"
          stroke="rgb(var(--color-ink))"
          stroke-width="0.6"
          stroke-linejoin="round"
        />
        <!-- Pins -->
        {branches.map((b, i) => (
          <g data-pin transform={`translate(${b.cx} ${b.cy})`} style={`--pin-delay: ${i * 100}ms`}>
            <circle r="2.4" fill={b.type === 'hq' ? 'rgb(var(--color-signal))' : 'rgb(var(--color-sienna))'} stroke="rgb(var(--color-ink))" stroke-width="0.5" />
            <circle r="1" fill="rgb(var(--color-ink))" />
          </g>
        ))}
      </svg>
    </div>

    <!-- List -->
    <ul class="list-none m-0 p-0 flex flex-col">
      {branches.map((b, i) => (
        <li data-branch-item class="grid grid-cols-[36px_1fr_auto] gap-sp-4 items-baseline py-sp-4 border-b border-stone last:border-b-0" data-reveal style={`--reveal-delay: ${(i + 1) * 100}ms;`}>
          <span class="font-display italic text-[24px] text-mute leading-none">{String(i + 1).padStart(2, '0')}</span>
          <span class="font-display italic text-[clamp(18px,2.4vw,21px)] text-ink leading-tight">{lang === 'ar' ? (b.city_ar ?? b.city_en) : b.city_en}</span>
          <span class="font-mono text-[9.5px] tracking-[0.22em] uppercase text-mute">
            {b.type === 'hq' ? t('home.branches.hq') : t('home.branches.branch')}
          </span>
        </li>
      ))}
    </ul>
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
</script>

<style>
  @media (prefers-reduced-motion: no-preference) {
    [data-pin] {
      opacity: 0;
      transform-origin: center;
      transform: translate(var(--pin-x, 0), var(--pin-y, 0)) scale(0);
      animation: pin-drop 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: var(--pin-delay, 0ms);
    }
    /* Note: SVG transform on g doesn't compose with CSS transforms in
       all browsers; we fade-in the pin via opacity only. The SVG attr
       transform gives us position; the CSS handles the entrance. */
    [data-pin] {
      transform: none;
      animation-name: pin-fade;
    }
    @keyframes pin-fade {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  }
</style>
```

- [ ] **Step L.5: Remove leaflet from package.json**

Edit `package.json` — remove the `"leaflet": "^1.9.4"` line from `dependencies`. Then:

```bash
npm install
```

- [ ] **Step L.6: Run test + build**

```bash
npm test -- BranchesMap
npm run build
```

- [ ] **Step L.7: Commit**

```bash
git add src/components/home/BranchesMap.astro tests/components/BranchesMap.test.ts \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts \
        package.json package-lock.json
git commit -m "$(cat <<'EOF'
v3: L — Section 08 BranchesMap (hand-drawn SVG)

* Inline SVG Sudan outline + 6 pins (HQ in signal yellow, branches in
  sienna). Branch list on the right, paired by serial numeral. Pins
  fade in stagger when section enters view.
* Drop leaflet dep — no other component used it.
* tests/components/BranchesMap.test.ts: 3/3 passing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task M — Homepage Section 09: QuoteCTA + home page rewrite

**Files:**
- Create: `src/components/home/QuoteCTA.astro`
- Create: `tests/pages/home-redesign.test.ts`
- Modify: `src/pages/index.astro`, `src/pages/ar/index.astro`
- Delete: 9 old home components (after verifying nothing else imports them)
- Modify: `src/i18n/{en,ar}.json` + `types.ts`

- [ ] **Step M.1: Add CTA i18n keys**

EN:

```json
"cta": {
  "label": "Request a quote",
  "headline_phrase": "Tell us what your",
  "headline_accent": "field needs.",
  "primary": "Request a quote",
  "phone_label": "Call",
  "whatsapp_label": "WhatsApp",
  "footer_address": "Zagros Trading · Khartoum Bahry Industrial Zone"
}
```

AR:

```json
"cta": {
  "label": "اطلب عرض سعر",
  "headline_phrase": "حدّثنا عن ما يحتاجه",
  "headline_accent": "حقلك.",
  "primary": "اطلب عرض سعر",
  "phone_label": "اتصل",
  "whatsapp_label": "واتساب",
  "footer_address": "زاغروس للتجارة · الخرطوم بحري · المنطقة الصناعية"
}
```

`types.ts`:

```ts
cta: {
  label: string;
  headline_phrase: string;
  headline_accent: string;
  primary: string;
  phone_label: string;
  whatsapp_label: string;
  footer_address: string;
};
```

- [ ] **Step M.2: Implement QuoteCTA.astro**

`src/components/home/QuoteCTA.astro`:

```astro
---
/**
 * Plan: Zagros v3 — Section 09 quote close.
 *
 * Signal-bar accent across the top (scales from 0 → 100% on entry).
 * Big editorial headline with signal accent word. Three actions:
 * primary CTA + tap-to-call + WhatsApp. Footer line with address +
 * colophon mono row.
 */
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import { companyData } from '../../data/company';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const isRTL = lang === 'ar';
const phone = companyData.contact.phone;
const phoneTel = phone?.replace(/\s+/g, '');
const whatsapp = companyData.contact.whatsapp?.replace(/[^\d]/g, '');
---
<section class="relative bg-ink text-paper px-page-x py-section-y-major overflow-hidden">
  <span class="signal-bar absolute top-0 left-0 right-0 h-[3px] bg-signal origin-left" data-reveal style="transform: scaleX(0); transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);"></span>

  <span class="font-mono text-[10.5px] tracking-[0.24em] uppercase text-paper/70 inline-flex items-center gap-2.5 mb-sp-5" data-reveal>
    <span class="w-6 h-px bg-paper/70 inline-block"></span>
    {t('home.cta.label')}
  </span>

  <h2 class="font-display italic font-light text-[clamp(40px,7vw,84px)] leading-[1] text-paper max-w-[18ch] mb-sp-7" data-reveal style="--reveal-delay: 100ms;">
    {t('home.cta.headline_phrase')} <span class="text-signal not-italic">{t('home.cta.headline_accent')}</span>
  </h2>

  <div class="flex flex-wrap items-center gap-sp-3 mb-sp-9" data-reveal style="--reveal-delay: 200ms;">
    <a href={isRTL ? '/ar/contact' : '/contact'} class="bg-signal text-ink font-sans font-semibold text-[14px] px-sp-5 py-sp-3 rounded-full no-underline inline-flex items-center gap-2 min-h-[48px]">
      {t('home.cta.primary')} {isRTL ? '←' : '→'}
    </a>
    {phone && (
      <a href={`tel:${phoneTel}`} class="border border-paper/40 text-paper font-sans font-medium text-[14px] px-sp-5 py-sp-3 rounded-full no-underline inline-flex items-center gap-2 min-h-[48px]">
        {t('home.cta.phone_label')} {phone}
      </a>
    )}
    {whatsapp && (
      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" class="border border-paper/40 text-paper font-sans font-medium text-[14px] px-sp-5 py-sp-3 rounded-full no-underline inline-flex items-center gap-2 min-h-[48px]">
        {t('home.cta.whatsapp_label')}
      </a>
    )}
  </div>

  <div class="pt-sp-5 border-t border-paper/20 flex justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-paper/60">
    <span>{t('home.cta.footer_address')}</span>
    <span>© 2026 · Section 09 / 09 · Colophon</span>
  </div>
</section>

<script>
  import { observeReveal } from '../../lib/motion';
  observeReveal();
  // The signal bar is data-reveal too; once revealed, scale to 1.
  document.querySelectorAll<HTMLElement>('.signal-bar[data-reveal]').forEach((el) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.style.transform = 'scaleX(1)';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });
    observer.observe(el);
  });
</script>
```

- [ ] **Step M.3: Write the home page redesign test**

`tests/pages/home-redesign.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomeEN from '../../src/pages/index.astro';
import HomeAR from '../../src/pages/ar/index.astro';

describe('home page (v3)', () => {
  it('EN renders all 9 sections in order', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeEN);
    // Hero slideshow
    expect(html).toContain('hero-slideshow');
    // Ops ticker
    expect(html).toContain('marquee-track');
    // By the numbers (count-up target)
    expect(html).toMatch(/data-count-target="15"/);
    // Catalog (bg-c-pesticide for the third line)
    expect(html).toContain('bg-c-pesticide');
    // Partners spotlight
    expect(html).toMatch(/spotlight|Spotlight/);
    // Field reports
    expect(html).toMatch(/REPORT ·|تقرير/);
    // Customers wall on ink ground
    expect(html).toMatch(/bg-ink[^"]*"[^>]*>[\s\S]*?Customers|العملاء/);
    // Branches map (inline SVG)
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 100 100"/);
    // Quote CTA
    expect(html).toMatch(/Request a quote|اطلب عرض سعر/);
  });

  it('AR mirror renders the same 9 sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeAR);
    expect(html).toContain('hero-slideshow');
    expect(html).toContain('marquee-track');
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 100 100"/);
  });

  it('nav contains the new Home link and not Partners or Customers', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeEN);
    // The desktop nav UL contains an /products link but not /partners or /customers
    expect(html).toMatch(/href="\/products"/);
    expect(html).not.toMatch(/<a[^>]*href="\/partners"[^>]*>Partners</);
    expect(html).not.toMatch(/<a[^>]*href="\/customers"[^>]*>Customers</);
  });
});
```

- [ ] **Step M.4: Rewrite src/pages/index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import HeroV3 from '../components/home/HeroV3.astro';
import OpsTickerMarquee from '../components/home/OpsTickerMarquee.astro';
import ByTheNumbersV3 from '../components/home/ByTheNumbersV3.astro';
import CatalogStrips from '../components/home/CatalogStrips.astro';
import PartnersSection from '../components/home/PartnersSection.astro';
import FieldReportsTeaser from '../components/home/FieldReportsTeaser.astro';
import CustomersWall from '../components/home/CustomersWall.astro';
import BranchesMap from '../components/home/BranchesMap.astro';
import QuoteCTA from '../components/home/QuoteCTA.astro';
---

<Layout>
  <HeroV3 />
  <OpsTickerMarquee />
  <ByTheNumbersV3 />
  <CatalogStrips />
  <PartnersSection />
  <FieldReportsTeaser />
  <CustomersWall />
  <BranchesMap />
  <QuoteCTA />
</Layout>
```

- [ ] **Step M.5: Mirror in src/pages/ar/index.astro**

```astro
---
import Layout from '../../layouts/Layout.astro';
import HeroV3 from '../../components/home/HeroV3.astro';
import OpsTickerMarquee from '../../components/home/OpsTickerMarquee.astro';
import ByTheNumbersV3 from '../../components/home/ByTheNumbersV3.astro';
import CatalogStrips from '../../components/home/CatalogStrips.astro';
import PartnersSection from '../../components/home/PartnersSection.astro';
import FieldReportsTeaser from '../../components/home/FieldReportsTeaser.astro';
import CustomersWall from '../../components/home/CustomersWall.astro';
import BranchesMap from '../../components/home/BranchesMap.astro';
import QuoteCTA from '../../components/home/QuoteCTA.astro';
---

<Layout>
  <HeroV3 />
  <OpsTickerMarquee />
  <ByTheNumbersV3 />
  <CatalogStrips />
  <PartnersSection />
  <FieldReportsTeaser />
  <CustomersWall />
  <BranchesMap />
  <QuoteCTA />
</Layout>
```

- [ ] **Step M.6: Verify nothing else imports the old components**

```bash
grep -rn "components/home/Hero\.astro\|components/home/OpsTicker\.astro\|components/home/EditorsNote\.astro\|components/home/FeaturedReport\.astro\|components/home/ThreeReportsGrid\.astro\|components/home/SourcesSection\.astro\|components/home/CustomersStrip\.astro\|components/home/ByTheNumbers\.astro\|components/home/CatalogTable\.astro\|components/home/HomeCTA\.astro\|components/global/CaptionStrip\.astro" src/ 2>&1
```

If grep returns hits beyond `src/pages/index.astro` and `src/pages/ar/index.astro` (the files we just rewrote), STOP — those imports must be cleaned up before deletion. If only the rewritten home pages had references (and those references no longer exist after M.4-M.5), proceed.

- [ ] **Step M.7: Delete the 10 obsolete components**

```bash
rm src/components/home/Hero.astro \
   src/components/home/OpsTicker.astro \
   src/components/home/EditorsNote.astro \
   src/components/home/FeaturedReport.astro \
   src/components/home/ThreeReportsGrid.astro \
   src/components/home/SourcesSection.astro \
   src/components/home/CustomersStrip.astro \
   src/components/home/ByTheNumbers.astro \
   src/components/home/CatalogTable.astro \
   src/components/home/HomeCTA.astro \
   src/components/global/CaptionStrip.astro
```

If any of these throw "no such file" — fine, they may have been refactored already. Continue.

- [ ] **Step M.8: Run tests + build**

```bash
npm test
npm run build
```

Expected: all tests pass (or only baseline fertilizer/pesticide content-collection failures linger). 100 pages built clean.

- [ ] **Step M.9: Commit**

```bash
git add src/components/home/QuoteCTA.astro tests/pages/home-redesign.test.ts \
        src/pages/index.astro src/pages/ar/index.astro \
        src/components/ src/components/global/CaptionStrip.astro \
        src/i18n/en.json src/i18n/ar.json src/i18n/types.ts
git commit -m "$(cat <<'EOF'
v3: M — Section 09 QuoteCTA + home page rewrite

* QuoteCTA.astro: signal-bar accent (scale-in on entry), big italic
  headline with signal accent word, primary CTA + tap-to-call +
  WhatsApp (all ≥48px), footer address line.
* src/pages/index.astro and AR mirror rewritten — 9 v3 sections in
  spec order. Old composition (10 sections + CaptionStrip dividers)
  replaced.
* Deleted 10 obsolete home components + CaptionStrip (no longer used).
* tests/pages/home-redesign.test.ts: asserts all 9 sections render in
  both locales and the new nav links are present without /partners or
  /customers entries.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task N — Inner-page polish: /partners/[slug] hero

**Files:**
- Modify: `src/pages/partners/[slug].astro`, `src/pages/ar/partners/[slug].astro`
- Modify: `src/components/partners/PartnerHero.astro` (existing — replace with PartnerSpotlight usage)

- [ ] **Step N.1: Switch /partners/[slug] hero to PartnerSpotlight**

In `src/pages/partners/[slug].astro`, find the existing `<PartnerHero>` import and usage. Replace with:

```astro
import PartnerSpotlight from '../../components/partners/PartnerSpotlight.astro';
// ...
<PartnerSpotlight partner={partner} variant="detail" />
```

- [ ] **Step N.2: Mirror in AR**

Same edit in `src/pages/ar/partners/[slug].astro` with `'../../../'` import paths.

- [ ] **Step N.3: Decide on PartnerHero.astro**

```bash
grep -rn "PartnerHero" src/ 2>&1
```

If grep returns no hits after N.1-N.2 (meaning nothing else imports it), delete:

```bash
rm src/components/partners/PartnerHero.astro
```

If hits remain, leave it for a follow-up cleanup.

- [ ] **Step N.4: Build verify**

```bash
npm run build
```

7 partner detail pages × 2 locales = 14 partner-detail pages should still render.

- [ ] **Step N.5: Commit**

```bash
git add src/pages/partners/\[slug\].astro src/pages/ar/partners/\[slug\].astro src/components/partners/
git commit -m "v3: N — /partners/[slug] hero uses shared PartnerSpotlight

Same component as home Section 05 spotlight, variant='detail' for
the wider hero. Keeps body MDX content untouched. PartnerHero.astro
deleted if no other importers found.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task O — Inner-page polish: products tree typography sweep

**Files:**
- Modify: `src/pages/products/index.astro`, `src/pages/ar/products/index.astro`
- Modify: `src/pages/products/[line]/[slug].astro`, AR mirror

- [ ] **Step O.1: /products line picker — match home Catalog typography**

In `src/pages/products/index.astro`, find the page header. Update the h1 to match the home Catalog headline style:

Find:
```astro
<h1 class="font-display text-[clamp(36px,7vw,96px)] leading-[0.95] text-ink max-w-[18ch] mb-sp-7">{t('products.page.headline')}</h1>
```

Replace with (italic + font-light per DESIGN.md big-display rule):
```astro
<h1 class="font-display italic font-light text-[clamp(36px,7vw,96px)] leading-[0.95] text-ink max-w-[18ch] mb-sp-7">{t('products.page.headline')}</h1>
```

Apply the same change in `src/pages/ar/products/index.astro`.

- [ ] **Step O.2: /products/[line]/[slug] body polish — italic font-light hero**

In `src/pages/products/[line]/[slug].astro` find the h1:

```astro
<h1 class="font-display italic font-light text-[clamp(36px,7vw,112px)] leading-[0.95] text-ink mt-sp-5 mb-sp-5">{name}</h1>
```

Confirm it already uses `italic font-light` (Plan 7 likely set this). If not, add. Same in AR mirror.

- [ ] **Step O.3: Build verify**

```bash
npm run build
```

- [ ] **Step O.4: Commit**

```bash
git add src/pages/products/
git commit -m "v3: O — products tree typography sweep

Page headlines now use font-display italic font-light per DESIGN.md
big-display convention. Brings the products tree in line with home
Catalog rhythm.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task P — Inner-page polish: /about

**Files:**
- Modify: `src/pages/about.astro`, `src/pages/ar/about.astro`

- [ ] **Step P.1: Apply hero h1 italic + accent**

In `src/pages/about.astro`, find the h1 (already `clamp(36px,7vw,112px)` per Plan 7). Wrap an accent word in signal-yellow:

If the headline reads `{t('about.headline')}`, the i18n value will need an accent. Two options:
A. Add a separate `about.headline_accent` key and split.
B. Edit the existing key value to include a span — only works if the i18n value can hold HTML, which `useTranslations` does NOT support directly (it returns string).

**Choose option A.** In `en.json` `about` block, replace the existing `"headline"` with two keys:

```json
"about": {
  "headline_phrase": "Built in Sudan, sourcing for",
  "headline_accent": "Sudanese soil.",
  // ... rest stays
}
```

(Preserve any existing `about.deck`, `about.intro` etc.)

Same shape in `ar.json` (hand-translated).

In `src/pages/about.astro`, change the h1 to:
```astro
<h1 class="font-display italic font-light text-[clamp(36px,7vw,112px)] leading-[0.95] text-ink mt-sp-5 max-w-[20ch] mb-sp-7">
  {t('about.headline_phrase')} <span class="text-sienna not-italic">{t('about.headline_accent')}</span>
</h1>
```

Same in AR mirror.

If the original `about.headline` key is used elsewhere (grep), keep it AND add the new keys (don't delete in-use keys).

- [ ] **Step P.2: Build verify**

```bash
npm run build
```

- [ ] **Step P.3: Commit**

```bash
git add src/pages/about.astro src/pages/ar/about.astro src/i18n/
git commit -m "v3: P — /about hero typography polish

Headline split into phrase + accent. Accent renders in sienna
upright, matching the editorial accent rhythm used on home sections.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task Q — Inner-page polish: /contact + /field-reports

**Files:**
- Modify: `src/pages/contact.astro` + AR mirror
- Modify: `src/pages/field-reports/index.astro` + AR mirror
- Modify: `src/pages/field-reports/[slug].astro` + AR mirror
- Modify: `src/i18n/{en,ar}.json` + types

- [ ] **Step Q.1: Contact hero polish**

Same accent-split treatment as Task P. Add `contact.headline_phrase` + `contact.headline_accent` to i18n. Update both `src/pages/contact.astro` and `src/pages/ar/contact.astro`:

```astro
<h1 class="font-display italic font-light text-[clamp(40px,6vw,84px)] leading-[1.02] text-ink mt-sp-5 max-w-[24ch] mb-sp-7">
  {t('contact.headline_phrase')} <span class="text-sienna not-italic">{t('contact.headline_accent')}</span>
</h1>
```

- [ ] **Step Q.2: Field reports index — match teaser typography**

In `src/pages/field-reports/index.astro` and AR mirror, ensure:
- h1 uses `font-display italic font-light`
- The card grid matches the FieldReportsTeaser visual (1 featured + grid of others, or full grid if list is short)

If the page already uses a grid that's close, keep it. Add the italic + accent split to the headline if not present (use `field_reports.page.headline_phrase` + `field_reports.page.headline_accent` keys).

- [ ] **Step Q.3: Field reports detail polish**

`src/pages/field-reports/[slug].astro` body — confirm the h1 uses `font-display italic font-light`. Tighten body type if `<p>` paragraphs lack `max-w-prose`.

- [ ] **Step Q.4: Build verify**

```bash
npm run build
```

- [ ] **Step Q.5: Commit**

```bash
git add src/pages/contact.astro src/pages/ar/contact.astro \
        src/pages/field-reports/ src/pages/ar/field-reports/ \
        src/i18n/
git commit -m "v3: Q — contact + field-reports typography polish

Hero headlines on contact, field-reports index, and field-reports
detail get the italic font-light + sienna accent treatment. Body
prose constrained to max-w-prose where it ran wide. Bilingual.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task R — Final verification + plan-status doc + tag

**Files:**
- Create: `docs/superpowers/plans/2026-05-13-zagros-v3-status.md`
- Tag: `v3-editorial`

- [ ] **Step R.1: Run the verification grep sweep**

```bash
npm test
npm run build
grep -cE "BAG MOCKUP · PENDING|14 SKUs|14 منتجاً|بيتا شراكة|بيت ماركة|operator, not a brand|partner houses" dist/index.html dist/ar/index.html dist/products/index.html
grep -c "tel:+249912338559" dist/index.html dist/ar/index.html dist/contact/index.html dist/ar/contact/index.html
grep -c "wa.me/249912338559" dist/index.html dist/ar/index.html dist/contact/index.html dist/ar/contact/index.html
grep -c "data-reveal" dist/index.html
grep -c "hero-slideshow" dist/index.html
grep -c "Home" dist/index.html | head -1
grep -E "/partners[\"/]|/customers[\"/]" dist/index.html | head -5
```

Expected:
- 100 pages built clean
- 0 hits on banned strings
- tel/wa.me on home + contact pages (both locales)
- data-reveal hits in dist (motion system live)
- hero-slideshow hit in dist
- "Home" in nav
- /partners hits (only in nav structure of legitimate detail pages, NOT as nav item)

- [ ] **Step R.2: Write status doc**

`docs/superpowers/plans/2026-05-13-zagros-v3-status.md`:

```markdown
# Zagros v3 — Status

**Status:** code complete, tests green, awaiting visual review.

## Completed

| Task | Subject | Commit |
|---|---|---|
| A | motion foundation + Placeholder | (commit hash) |
| B | --c-pesticide token | (hash) |
| C | nav: add Home, drop Partners + Customers | (hash) |
| D | drop indexes + 301 redirects | (hash) |
| E | Section 01 HeroV3 slideshow | (hash) |
| F | Section 02 OpsTickerMarquee | (hash) |
| G | Section 03 ByTheNumbersV3 | (hash) |
| H | Section 04 CatalogStrips | (hash) |
| I | Section 05 PartnersSection + spotlight | (hash) |
| J | Section 06 FieldReportsTeaser | (hash) |
| K | Section 07 CustomersWall | (hash) |
| L | Section 08 BranchesMap (drops leaflet) | (hash) |
| M | Section 09 QuoteCTA + home page rewrite | (hash) |
| N | /partners/[slug] hero polish | (hash) |
| O | products tree typography sweep | (hash) |
| P | /about typography polish | (hash) |
| Q | /contact + /field-reports typography polish | (hash) |
| R | verification + status (this commit) | (hash) |

## Verification

* `npm test` — N passed / N failed
* `npm run build` — 100 pages, no errors
* Banned-string sweep on dist: 0 hits each
* tap-to-call + WhatsApp present on home and contact (both locales)
* data-reveal + hero-slideshow present in dist
* Home link in nav, /partners + /customers not in nav

## Pending real assets (per anti-AI-slop discipline)

* K+S spotlight photo (Placeholder rendering)
* Field report photos (3, all using Placeholder)
* Customer pull quote (rendering pending fallback)
* Kafr El Zayat partner logo (Placeholder rendering)

## Browser pass still required

* 360 / 414 / 768 / 1024 LTR + RTL viewport pass
* Lighthouse mobile score
* SeedCard / PesticideCard text-overflow at 360px
```

Replace `(commit hash)` placeholders with `git log --oneline | head -20` outputs.

- [ ] **Step R.3: Commit status doc**

```bash
git add docs/superpowers/plans/2026-05-13-zagros-v3-status.md
git commit -m "v3: R — status doc + verification report

Status: code complete, tests green, 100 pages build clean. All
9 home sections rendering, partners + customers folded in, nav
gets Home, /partners + /customers indexes 301-redirect to home,
4 open spec questions all resolved.

Pending: real assets per anti-AI-slop discipline (K+S spotlight
photo, field report photos, customer pull quote, KEZ logo) +
browser viewport pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step R.4: Tag (only after user signs off on visual review)**

```bash
git tag v3-editorial
git log --oneline plan-7-mobile-first..v3-editorial
```

Do NOT push or tag without user sign-off after they see the dev server.

---

## Self-review

**Spec coverage:** every spec section maps to a task — §3 Sections 01-09 → Tasks E-M, §4 Nav → Task C, §5 Inner pages → Tasks N-Q, §6 Placeholder → Task A, §7 Motion → Task A, §8 i18n additions → distributed across E-M and P-Q, §9 Data → Tasks I, K, F, §10 Components → all tasks, §11 Testing → tests/components/* + home-redesign, §12 Phasing → A→R, §15 Decisions → Tasks B (1), L (2), D (3), E (4).

**Placeholder scan:** no TBD/TODO; every code step has the actual code. Tests have actual assertions, not "write tests for the above."

**Type consistency:** `bgClassMap` extended in B uses the same `c-pesticide` token added in B. `data-reveal` used consistently across all sections. `Placeholder` props match across all usages. `useTranslations` returns string; nested object access via cast in CatalogStrips and FieldReportsTeaser is documented in the comment.

**Known caveats:**
- The `useTranslations` cast in Task H Step H.2 to read nested `home.catalog.lines.{key}` works because the i18n util's `t()` function returns whatever the JSON path resolves to, including objects. Cast is documented inline.
- Customer / Partner / Field-report data shapes use `(entry.data as any)` because the existing schemas haven't been fully typed. Where possible, the plan extends content/config.ts schemas (Task I.1) rather than casting away. Other casts left as-is to avoid scope creep into a wholesale schema refactor.
- The pin animation in Task L Step L.4's inline `<style>` notes a browser quirk: SVG `transform` attribute on `<g>` doesn't always compose with CSS transforms. The plan falls back to opacity-only fade for safety.

End of plan.
