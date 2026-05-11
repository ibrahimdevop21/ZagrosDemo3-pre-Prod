import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ProductsIndex from '../../src/pages/products/index.astro';

describe('/products line picker', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('</html>');
  });

  it('renders 3 line cards with accurate SKU counts and no invented framing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('Seeds');
    expect(html).toContain('Fertilizers');
    expect(html).toContain('Pesticides');
    // Counts: 3 forage seeds, 11 K+S fertilizers, 16 pesticides
    expect(html).toMatch(/>3<\/dd>/);   // seed count
    expect(html).toMatch(/>11<\/dd>/);  // fertilizer count
    expect(html).toMatch(/>16<\/dd>/);  // pesticide count
    // Banned framing
    expect(html).not.toMatch(/14 SKUs/);
    expect(html).not.toMatch(/14 منتجاً/);
    expect(html).not.toMatch(/partner houses/);
    expect(html).not.toMatch(/operator, not a brand/);
  });

  it('links to the three line pages', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('/products/seeds');
    expect(html).toContain('/products/fertilizers');
    expect(html).toContain('/products/pesticides');
  });
});
