import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/partners/index.astro';
import Detail from '../../src/pages/partners/[slug].astro';
import { getCollection } from 'astro:content';

describe('partners index', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });
  it('contains both partner names', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('K+S Group');
    expect(html).toContain('Barenbrug');
  });
});

describe('partners deep-dive', () => {
  it('renders for every partner with hero + lines table', async () => {
    const container = await AstroContainer.create();
    const partners = await getCollection('partners');
    for (const partner of partners) {
      const html = await container.renderToString(Detail, { props: { partner } });
      expect(html, `${partner.slug} failed to render`).toContain('</html>');
      expect(html).toContain(partner.data.name);
      expect(html).toContain(partner.data.country);
    }
  });
});
