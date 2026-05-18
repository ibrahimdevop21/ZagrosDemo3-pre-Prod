import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ProductsIndex from '../../src/pages/products/index.astro';

describe('/products line picker', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    expect(html).toContain('</html>');
  });

  it('renders ProductsListing with all products from all three lines', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ProductsIndex);
    // ProductsListing loads all three collections and renders them with data-facet-line attributes
    expect(html).toContain('data-facet-line="seeds"');
    expect(html).toContain('data-facet-line="fertilizers"');
    expect(html).toContain('data-facet-line="pesticides"');
    // Subcategory groups are rendered
    expect(html).toContain('data-subcategory-group=');
    // Filter sidebar is present with line facets
    expect(html).toContain('data-facet="line"');
    // No invented framing
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
