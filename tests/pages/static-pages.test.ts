import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import About from '../../src/pages/about.astro';
import Contact from '../../src/pages/contact.astro';
import Privacy from '../../src/pages/privacy.astro';
import Terms from '../../src/pages/terms.astro';

describe('static pages', () => {
  it('about renders with all 4 caption-strip section markers', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('</html>');
    for (const n of ['01 / 05', '02 / 05', '03 / 05', '04 / 05']) {
      expect(html, `missing ${n}`).toContain(n);
    }
  });

  it('contact renders with form + direct panel', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    expect(html).toContain('</html>');
    expect(html).toContain('<form');
    expect(html).toMatch(/route_(sales|agronomy|press|careers)|Sales|Agronomy/);
  });

  it('privacy renders all 6 section markers and a pending-review chip', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Privacy);
    for (const n of ['§ 01', '§ 02', '§ 03', '§ 04', '§ 05', '§ 06']) {
      expect(html, `missing ${n}`).toContain(n);
    }
    expect(html.toLowerCase()).toContain('pending');
  });

  it('terms renders all 6 section markers and a pending-review chip', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Terms);
    for (const n of ['§ 01', '§ 02', '§ 03', '§ 04', '§ 05', '§ 06']) {
      expect(html, `missing ${n}`).toContain(n);
    }
    expect(html.toLowerCase()).toContain('pending');
  });
});
