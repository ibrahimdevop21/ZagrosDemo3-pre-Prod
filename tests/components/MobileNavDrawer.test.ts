import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Nav from '../../src/components/global/Nav.astro';

/**
 * Plan 7 Task C — Mobile nav drawer.
 *
 * The desktop nav fold moves from `md:` (768px) to `lg:` (1024px). Below `lg:`,
 * a 44×44 hamburger button replaces the inline nav links and language/CTA
 * cluster, and a `<dialog data-mobile-nav-drawer>` holds the full mobile menu.
 *
 * These tests assert the structural mobile-first scaffolding:
 *   1. Hamburger button exists, is ARIA-labelled, and only shows below `lg:`.
 *   2. The `<dialog>` exists with all 6 localized nav labels, the language
 *      toggle, and the "Request a quote" CTA.
 *   3. The desktop `<ul>` follows the mobile-first up-scale pattern: it is
 *      `hidden` by default and becomes `flex` at `lg:` and above.
 */

describe('Nav (mobile)', () => {
  it('renders a hamburger button with aria-label and lg:hidden class', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    // Hamburger is ARIA-labelled (EN "Open menu" or AR "فتح القائمة")
    expect(html).toMatch(/aria-label="(Open menu|فتح القائمة)"/);
    // And carries the `lg:hidden` class so it disappears at desktop
    expect(html).toMatch(/data-mobile-nav-trigger/);
    expect(html).toMatch(/lg:hidden/);
  });

  it('renders a <dialog> with all 6 nav links, language toggle, and CTA', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    expect(html).toContain('<dialog');
    expect(html).toMatch(/data-mobile-nav-drawer/);

    // All 6 localized nav labels appear inside the rendered markup
    expect(html).toMatch(/Products|المنتجات/);
    expect(html).toMatch(/Field Reports|التقارير الميدانية/);
    expect(html).toMatch(/Partners|الشركاء/);
    expect(html).toMatch(/Customers|العملاء/);
    expect(html).toMatch(/About|عن زاغروس/);
    expect(html).toMatch(/Contact|تواصل/);

    // Language toggle ("العربية" in EN context, "English" in AR context)
    expect(html).toMatch(/العربية|English/);

    // Primary CTA
    expect(html).toMatch(/Request a quote|اطلب عرض سعر/);
  });

  it('desktop nav links use the mobile-first up-scale pattern (hidden lg:flex)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Nav);

    // The `<ul>` containing the nav links must be hidden by default,
    // then become `flex` at the `lg:` breakpoint.
    expect(html).toMatch(/hidden lg:flex/);
  });
});
