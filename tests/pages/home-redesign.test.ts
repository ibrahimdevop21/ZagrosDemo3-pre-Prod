import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HomeEN from '../../src/pages/index.astro';
import HomeAR from '../../src/pages/ar/index.astro';

describe('home page (v3)', () => {
  it('EN renders all 9 sections in order', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeEN);
    expect(html).toContain('hero-slideshow');
    expect(html).toContain('marquee-track');
    expect(html).toMatch(/data-count-target="15"/);
    expect(html).toContain('bg-c-pesticide');
    expect(html.toLowerCase()).toMatch(/spotlight/);
    expect(html).toMatch(/REPORT ·/);
    expect(html).toMatch(/data-customer-logo/);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 100 100"/);
    expect(html).toMatch(/Request a quote/);
  });

  it('AR mirror renders the same 9 sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeAR);
    expect(html).toContain('hero-slideshow');
    expect(html).toContain('marquee-track');
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 100 100"/);
    expect(html).toMatch(/data-customer-logo/);
  });

  it('nav contains Home and not Partners or Customers as primary links', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HomeEN);
    expect(html).toMatch(/href="\/products"/);
    expect(html).not.toMatch(/<a[^>]*href="\/partners"[^>]*>\s*Partners/);
    expect(html).not.toMatch(/<a[^>]*href="\/customers"[^>]*>\s*Customers/);
  });
});
