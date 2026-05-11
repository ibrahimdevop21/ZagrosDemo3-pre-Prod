import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Detail from '../../src/pages/products/[line]/[slug].astro';
import { getCollection } from 'astro:content';

describe('product detail page (unified [line]/[slug])', () => {
  it('renders for every fertilizer SKU without throwing', async () => {
    const container = await AstroContainer.create();
    const fertilizers = await getCollection('fertilizers');
    for (const entry of fertilizers) {
      const html = await container.renderToString(Detail, {
        props: { line: 'fertilizers', entry },
      });
      expect(html, `${entry.slug} failed to render`).toContain('</html>');
      expect(html, `${entry.slug} missing breadcrumb`).toContain('Products');
      expect(html, `${entry.slug} missing grade`).toContain(entry.data.grade);
    }
  });

  it('renders for every seed SKU without throwing', async () => {
    const container = await AstroContainer.create();
    const seeds = await getCollection('seeds');
    for (const entry of seeds) {
      const html = await container.renderToString(Detail, {
        props: { line: 'seeds', entry },
      });
      expect(html, `${entry.slug} failed to render`).toContain('</html>');
      expect(html, `${entry.slug} missing species`).toContain(entry.data.species);
    }
  });

  it('renders for every pesticide SKU without throwing', async () => {
    const container = await AstroContainer.create();
    const pesticides = await getCollection('pesticides');
    for (const entry of pesticides) {
      const html = await container.renderToString(Detail, {
        props: { line: 'pesticides', entry },
      });
      expect(html, `${entry.slug} failed to render`).toContain('</html>');
      expect(html, `${entry.slug} missing active ingredient`).toContain(entry.data.active_ingredient);
    }
  });
});
