import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('product content collection', () => {
  it('contains exactly 14 SKUs (11 K+S + 3 Barenbrug)', async () => {
    const products = await getCollection('products');
    expect(products.length).toBe(14);
  });

  it('exposes all 11 K+S fertilizer slugs', async () => {
    const products = await getCollection('products');
    const ksSlugs = products.filter((p) => p.data.brand === 'K+S').map((p) => p.slug);
    expect(ksSlugs).toEqual(expect.arrayContaining([
      'solu-up',
      'solu-npk-20-20-20',
      'solu-npk-12-12-36',
      'solu-mkp',
      'solu-map',
      'solu-ams-premium',
      'solu-nop',
      'solu-cn',
      'epso-top',
      'kalisop-fine',
      'kalisop-gran',
    ]));
    expect(ksSlugs.length).toBe(11);
  });

  it('exposes all 3 Barenbrug forage slugs', async () => {
    const products = await getCollection('products');
    const bbSlugs = products.filter((p) => p.data.brand === 'Barenbrug').map((p) => p.slug);
    expect(bbSlugs).toEqual(expect.arrayContaining([
      'superfine-rhodes',
      'sardi-10-series-2',
      'alfamaster-ten',
    ]));
    expect(bbSlugs.length).toBe(3);
  });

  it('every product has bilingual name', async () => {
    const products = await getCollection('products');
    for (const p of products) {
      expect(p.data.name.en, `${p.slug} missing EN name`).toBeTruthy();
      expect(p.data.name.ar, `${p.slug} missing AR name`).toBeTruthy();
    }
  });

  it('every fertilizer has a bag_color_token (forage seeds may omit it)', async () => {
    const products = await getCollection('products');
    for (const p of products) {
      if (p.data.category === 'fertilizer') {
        expect(p.data.bag_color_token, `${p.slug} missing bag_color_token`).toBeTruthy();
      }
    }
  });
});
