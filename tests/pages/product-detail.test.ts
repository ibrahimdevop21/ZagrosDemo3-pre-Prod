import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Detail from '../../src/pages/products/[slug].astro';
import { getCollection } from 'astro:content';

describe('product detail page', () => {
  it('renders for every catalog SKU without throwing', async () => {
    const container = await AstroContainer.create();
    const products = await getCollection('products');
    for (const product of products) {
      const html = await container.renderToString(Detail, { props: { product } });
      expect(html, `${product.slug} failed to render`).toContain('</html>');
      expect(html, `${product.slug} missing breadcrumb`).toContain('Products');
      expect(html, `${product.slug} missing grade`).toContain(product.data.grade);
    }
  });
});
