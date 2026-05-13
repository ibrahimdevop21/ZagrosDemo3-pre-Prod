import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import About from '../../src/pages/about.astro';
import Contact from '../../src/pages/contact.astro';
import Privacy from '../../src/pages/privacy.astro';
import Terms from '../../src/pages/terms.astro';

describe('static pages', () => {
  it('about renders with all 6 caption-strip section markers', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('</html>');
    for (const n of ['01 / 06', '02 / 06', '03 / 06', '04 / 06', '05 / 06', '06 / 06']) {
      expect(html, `missing ${n}`).toContain(n);
    }
  });

  it('about shows the 6 real branches, not a pending chip', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('Khartoum');
    expect(html).toContain('Port Sudan');
    expect(html).toContain('Al Qadarif');
    expect(html).toContain('Al Managil');
    expect(html).toContain('Ad-Damar');
    expect(html).toContain('Ad-Daba');
    expect(html).not.toMatch(/Branch list pending|قائمة الفروع بانتظار/);
  });

  it('about shows founding year 1987 prominently', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('1987');
  });

  it('about keeps team-pending state (genuinely unknown per source-of-truth §11)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toMatch(/Team profiles pending|نبذات الفريق بانتظار/);
  });

  it('about shows IATA membership', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(About);
    expect(html).toContain('International Agricultural Trade Association');
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
