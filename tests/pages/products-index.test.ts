import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ProductsIndex from '../../src/pages/products.astro';

describe('products index page', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('</html>');
  });

  it('renders all 14 SKUs into the static HTML', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    const matches = html.match(/data-product-slug="[^"]+"/g) ?? [];
    const uniqueSlugs = new Set(matches.map(m => m.replace(/.*data-product-slug="([^"]+)".*/, '$1')));
    expect(uniqueSlugs.size).toBe(14);
  });

  it('renders the partner-anchored section headers (K+S + Barenbrug)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toMatch(/§\s*K\+S\s*·\s*11/);
    expect(html).toMatch(/§\s*Barenbrug\s*·\s*3/);
  });
});
