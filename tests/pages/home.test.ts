import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/index.astro';

describe('home page', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });

  it('contains all 9 caption-strip section markers (01/10 through 09/10)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    for (let i = 1; i <= 9; i++) {
      const marker = `${String(i).padStart(2, '0')} / 10`;
      expect(html, `missing section marker ${marker}`).toContain(marker);
    }
  });

  it('includes a customers logo strip with at least one real customer name', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    // CustomersStrip uses alt text "Ministry of Agriculture & Natural Resources Sudan — وزارة..."
    expect(html).toContain('Ministry of Agriculture');
    expect(html).toContain('/trusted-customer-logos/');
  });

  it('every <img> tag has a non-empty alt attribute', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    const imgs = html.match(/<img[^>]+>/g) ?? [];
    for (const img of imgs) {
      expect(img, `Image without alt: ${img}`).toMatch(/alt="[^"]+"/);
    }
  });
});
