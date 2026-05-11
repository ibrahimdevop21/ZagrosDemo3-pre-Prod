import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

const VALID_CATEGORIES = ['vegetable_seeds', 'forage_seeds', 'fertilizers', 'pesticides'] as const;
type Category = typeof VALID_CATEGORIES[number];

describe('partners collection', () => {
  it('contains all 7 suppliers per source-of-truth §4', async () => {
    const partners = await getCollection('partners');
    const slugs = partners.map(p => p.slug).sort();
    expect(slugs).toEqual([
      'agro-dragon',
      'barenbrug',
      'east-west-seeds',
      'k-plus-s',
      'kafr-el-zayat',
      'kz',
      'saf',
    ]);
  });

  it('attributes Barenbrug to Australia (not Netherlands)', async () => {
    const partners = await getCollection('partners');
    const barenbrug = partners.find(p => p.slug === 'barenbrug');
    expect(barenbrug, 'Barenbrug partner missing').toBeDefined();
    expect(barenbrug!.data.country).toBe('Australia');
    expect(barenbrug!.data.country_code).toBe('au');
  });

  it('every partner has bilingual tagline', async () => {
    const partners = await getCollection('partners');
    for (const p of partners) {
      expect(p.data.tagline.en, `${p.slug} missing EN tagline`).toBeTruthy();
      expect(p.data.tagline.ar, `${p.slug} missing AR tagline`).toBeTruthy();
    }
  });

  it('every partner has a category from the allowed enum', async () => {
    const partners = await getCollection('partners');
    for (const p of partners) {
      expect(VALID_CATEGORIES, `${p.slug} has invalid category ${p.data.category}`).toContain(
        p.data.category as Category
      );
    }
  });

  it('every partner has a country_code', async () => {
    const partners = await getCollection('partners');
    for (const p of partners) {
      expect(p.data.country_code, `${p.slug} missing country_code`).toBeTruthy();
      expect(p.data.country_code.length, `${p.slug} country_code malformed`).toBeGreaterThanOrEqual(2);
    }
  });

  it('at least one partner has a null logo_path (kafr-el-zayat)', async () => {
    const partners = await getCollection('partners');
    const nullLogo = partners.filter(p => p.data.logo_path === null);
    expect(nullLogo.length).toBeGreaterThan(0);
    const slugs = nullLogo.map(p => p.slug);
    expect(slugs).toContain('kafr-el-zayat');
  });

  it('K+S retains its since_year (2014) and Germany attribution', async () => {
    const partners = await getCollection('partners');
    const kps = partners.find(p => p.slug === 'k-plus-s');
    expect(kps).toBeDefined();
    expect(kps!.data.since_year).toBe(2014);
    expect(kps!.data.country).toBe('Germany');
    expect(kps!.data.country_code).toBe('de');
  });
});
