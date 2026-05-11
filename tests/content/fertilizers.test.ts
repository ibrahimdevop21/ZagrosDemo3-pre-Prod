import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('fertilizers collection', () => {
  it('has 11 K+S SKUs with the expected slugs', async () => {
    const entries = await getCollection('fertilizers');
    const slugs = entries.map((e) => e.slug).sort();
    // Source-of-truth §2.1: 7 confirmed v1 K+S SKUs (soluNPK 20-20-20, soluNPK 12-12-36,
    //   soluNOP, KaliSOP gran, KaliSOP fine, EPSO Top, plus brochure extras flagged
    //   pending_client: soluUP, soluMAP, soluMKP, soluAMS Premium, soluCN).
    expect(slugs).toContain('solu-npk-20-20-20');
    expect(slugs).toContain('solu-npk-12-12-36');
    expect(slugs).toContain('solu-nop');
    expect(slugs).toContain('kalisop-gran');
    expect(slugs).toContain('kalisop-fine');
    expect(slugs).toContain('epso-top');
    expect(slugs).toContain('solu-up');
    expect(slugs).toContain('solu-map');
    expect(slugs).toContain('solu-mkp');
    expect(slugs).toContain('solu-ams-premium');
    expect(slugs).toContain('solu-cn');
    expect(entries.length).toBe(11);
  });

  it('every fertilizer has bilingual name', async () => {
    const entries = await getCollection('fertilizers');
    for (const e of entries) {
      expect(e.data.name.en, `${e.slug} missing EN name`).toBeTruthy();
      expect(e.data.name.ar, `${e.slug} missing AR name`).toBeTruthy();
    }
  });

  it('every entry has supplier_slug "k-plus-s"', async () => {
    const entries = await getCollection('fertilizers');
    for (const e of entries) {
      expect(e.data.supplier_slug, `${e.slug} supplier_slug wrong`).toBe('k-plus-s');
    }
  });

  it('soluUP/MAP/MKP/AMS Premium/CN are flagged pending_client; the other 6 are confirmed', async () => {
    const entries = await getCollection('fertilizers');
    const pending = new Set(['solu-up', 'solu-map', 'solu-mkp', 'solu-ams-premium', 'solu-cn']);
    for (const e of entries) {
      const expected = pending.has(e.slug) ? 'pending_client' : 'confirmed';
      expect(e.data.stock_confirmation, `${e.slug} stock_confirmation mismatch`).toBe(expected);
    }
  });
});
