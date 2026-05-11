import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('partners collection', () => {
  it('contains exactly 2 partners', async () => {
    const partners = await getCollection('partners');
    expect(partners.length).toBe(2);
  });

  it('exposes both expected slugs', async () => {
    const partners = await getCollection('partners');
    const slugs = partners.map(p => p.slug).sort();
    expect(slugs).toEqual(['barenbrug', 'k-plus-s']);
  });

  it('every partner has bilingual tagline', async () => {
    const partners = await getCollection('partners');
    for (const p of partners) {
      expect(p.data.tagline.en, `${p.slug} missing EN tagline`).toBeTruthy();
      expect(p.data.tagline.ar, `${p.slug} missing AR tagline`).toBeTruthy();
    }
  });

  it('every partner has at least one product line and matching stats', async () => {
    const partners = await getCollection('partners');
    for (const p of partners) {
      expect(p.data.product_lines.length).toBeGreaterThan(0);
      expect(p.data.stats.products_carried).toBeGreaterThan(0);
    }
  });
});
