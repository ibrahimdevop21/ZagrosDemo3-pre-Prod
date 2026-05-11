import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/index.astro';

describe('home page', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });

  it('contains all 8 caption-strip section markers', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    for (let i = 1; i <= 8; i++) {
      const marker = `${String(i).padStart(2, '0')} / 09`;
      expect(html, `missing section marker ${marker}`).toContain(marker);
    }
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
