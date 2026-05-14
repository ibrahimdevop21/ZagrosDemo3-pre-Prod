import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/index.astro';

/**
 * v3 home page composition tests. The 9-section editorial publication
 * superseded the old caption-strip composition; assertions reflect v3.
 */

describe('home page', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });

  it('renders all 9 v3 sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('hero-slideshow');                 // 01
    expect(html).toContain('marquee-track');                  // 02
    expect(html).toMatch(/data-count-target="39"/);           // 03
    expect(html).toContain('bg-c-pesticide');                 // 04
    expect(html.toLowerCase()).toMatch(/spotlight/);          // 05
    expect(html).toMatch(/REPORT ·/);                          // 06
    expect(html).toMatch(/data-customer-logo/);               // 07
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 1000 500"/);   // 08
    expect(html).toMatch(/Request a quote/);                  // 09
  });

  it('includes the customer logo wall with at least one real customer logo', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('/trusted-customer-logos/');
  });

  it('every visible <img> tag has a non-empty alt attribute (decorative images use role=presentation)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    const imgs = html.match(/<img[^>]+>/g) ?? [];
    for (const img of imgs) {
      // Skip images explicitly marked decorative (slideshow uses alt="" +
      // role="presentation" + aria-hidden="true" — valid a11y pattern).
      const isDecorative =
        img.includes('role="presentation"') ||
        img.includes('aria-hidden="true"');
      if (isDecorative) continue;
      expect(img, `Image missing alt: ${img}`).toMatch(/alt="[^"]+"/);
    }
  });
});
