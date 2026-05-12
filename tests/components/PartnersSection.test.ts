import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import PartnersSection from '../../src/components/home/PartnersSection.astro';

describe('PartnersSection', () => {
  it('renders K+S as the spotlight (featured: true)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PartnersSection);
    expect(html).toMatch(/K\+S/);
    expect(html.toLowerCase()).toMatch(/spotlight|في الواجهة/);
  });

  it('renders 6 non-featured partner tiles', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(PartnersSection);
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
