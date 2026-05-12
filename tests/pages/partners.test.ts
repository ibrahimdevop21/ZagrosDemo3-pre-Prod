import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Detail from '../../src/pages/partners/[slug].astro';
import { getCollection } from 'astro:content';

// /partners index was removed in v3 (partners section moved to homepage).
// Detail pages survive as deep-link targets. Tests below cover those only.

describe('partners deep-dive', () => {
  it('renders for every partner with hero + lines table', async () => {
    const container = await AstroContainer.create();
    const partners = await getCollection('partners');
    expect(partners.length).toBe(7);
    for (const partner of partners) {
      const html = await container.renderToString(Detail, { props: { partner } });
      expect(html, `${partner.slug} failed to render`).toContain('</html>');
      // HTML-encode & for the Kafr El Zayat name (Pesticides & Chemical Co.)
      const nameEncoded = partner.data.name.replace(/&/g, '&amp;');
      expect(html).toContain(nameEncoded);
      expect(html).toContain(partner.data.country);
    }
  });

  it('renders the kafr-el-zayat detail page with no logo (text fallback)', async () => {
    const container = await AstroContainer.create();
    const partners = await getCollection('partners');
    const kez = partners.find(p => p.slug === 'kafr-el-zayat');
    expect(kez).toBeDefined();
    expect(kez!.data.logo_path).toBeNull();
    const html = await container.renderToString(Detail, { props: { partner: kez! } });
    expect(html).toContain('Kafr El Zayat');
    expect(html).toContain('Egypt');
  });

  it('renders empty product_lines as a "catalog forthcoming" state', async () => {
    const container = await AstroContainer.create();
    const partners = await getCollection('partners');
    const saf = partners.find(p => p.slug === 'saf');
    expect(saf).toBeDefined();
    expect(saf!.data.product_lines.length).toBe(0);
    const html = await container.renderToString(Detail, { props: { partner: saf! } });
    // either EN or AR copy depending on lang context in detail page
    expect(html.toLowerCase()).toMatch(/catalog forthcoming|الكتالوج قيد الإعداد/);
  });
});
