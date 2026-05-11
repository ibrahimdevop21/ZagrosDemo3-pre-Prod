import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('seeds collection', () => {
  it('has 3 Barenbrug forage SKUs and zero vegetable SKUs (pending client cultivar list)', async () => {
    const entries = await getCollection('seeds');
    const slugs = entries.map((e) => e.slug).sort();
    expect(slugs).toEqual(['forage-alfamaster-ten', 'forage-sardi-10', 'forage-superfine-rhodes']);
    const subcats = new Set(entries.map((e) => e.data.subcategory));
    expect(subcats).toEqual(new Set(['forage']));
  });

  it('every seed has bilingual name', async () => {
    const entries = await getCollection('seeds');
    for (const e of entries) {
      expect(e.data.name.en, `${e.slug} missing EN name`).toBeTruthy();
      expect(e.data.name.ar, `${e.slug} missing AR name`).toBeTruthy();
    }
  });

  it('every seed is Barenbrug-sourced from Australia', async () => {
    const entries = await getCollection('seeds');
    for (const e of entries) {
      expect(e.data.supplier_slug, `${e.slug} supplier_slug wrong`).toBe('barenbrug');
      expect(e.data.origin_country, `${e.slug} origin_country wrong`).toBe('au');
    }
  });

  it('every seed has bilingual key_features', async () => {
    const entries = await getCollection('seeds');
    for (const e of entries) {
      expect(e.data.key_features.length, `${e.slug} key_features empty`).toBeGreaterThan(0);
      for (const kf of e.data.key_features) {
        expect(kf.en, `${e.slug} key_feature missing EN`).toBeTruthy();
        expect(kf.ar, `${e.slug} key_feature missing AR`).toBeTruthy();
      }
    }
  });
});
