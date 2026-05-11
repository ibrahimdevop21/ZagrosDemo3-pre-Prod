import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('pesticides collection', () => {
  it('has 16 SKUs across 3 subcategories (2 insecticides, 12 herbicides, 2 fungicides)', async () => {
    const entries = await getCollection('pesticides');
    expect(entries.length).toBe(16);
    const bySubcat = entries.reduce((acc, e) => {
      acc[e.data.subcategory] = (acc[e.data.subcategory] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(bySubcat.insecticide).toBe(2);
    expect(bySubcat.herbicide).toBe(12);
    expect(bySubcat.fungicide).toBe(2);
  });

  it('every pesticide has bilingual name, code, type, form, AI content, manufacturer, description', async () => {
    const entries = await getCollection('pesticides');
    for (const e of entries) {
      expect(e.data.name.en, `${e.slug} missing EN name`).toBeTruthy();
      expect(e.data.name.ar, `${e.slug} missing AR name`).toBeTruthy();
      expect(e.data.code.en, `${e.slug} missing EN code`).toBeTruthy();
      expect(e.data.code.ar, `${e.slug} missing AR code`).toBeTruthy();
      expect(e.data.type.en, `${e.slug} missing EN type`).toBeTruthy();
      expect(e.data.type.ar, `${e.slug} missing AR type`).toBeTruthy();
      expect(e.data.form.en, `${e.slug} missing EN form`).toBeTruthy();
      expect(e.data.form.ar, `${e.slug} missing AR form`).toBeTruthy();
      expect(e.data.active_ingredient_content.en, `${e.slug} missing EN AI content`).toBeTruthy();
      expect(e.data.active_ingredient_content.ar, `${e.slug} missing AR AI content`).toBeTruthy();
      expect(e.data.manufacturer.en, `${e.slug} missing EN manufacturer`).toBeTruthy();
      expect(e.data.manufacturer.ar, `${e.slug} missing AR manufacturer`).toBeTruthy();
      expect(e.data.description.en, `${e.slug} missing EN description`).toBeTruthy();
      expect(e.data.description.ar, `${e.slug} missing AR description`).toBeTruthy();
    }
  });

  it('every pesticide has at least one target pest and one target crop', async () => {
    const entries = await getCollection('pesticides');
    for (const e of entries) {
      expect(e.data.target_pests.length, `${e.slug} target_pests empty`).toBeGreaterThan(0);
      expect(e.data.target_crops.length, `${e.slug} target_crops empty`).toBeGreaterThan(0);
    }
  });

  it('origin countries are from the expected set (eg, in, cn)', async () => {
    const entries = await getCollection('pesticides');
    const allowed = new Set(['eg', 'in', 'cn']);
    for (const e of entries) {
      expect(allowed.has(e.data.origin_country), `${e.slug} origin_country invalid: ${e.data.origin_country}`).toBe(true);
    }
  });

  it('p14 Orafen, p15 Mancoxyl, p16 Orastrobin omit image_url (assets missing)', async () => {
    const entries = await getCollection('pesticides');
    const noImage = ['p14-orafen', 'p15-mancoxyl', 'p16-orastrobin'];
    for (const slug of noImage) {
      const e = entries.find((x) => x.slug === slug);
      expect(e, `${slug} not found`).toBeTruthy();
      expect(e?.data.image_url, `${slug} should omit image_url`).toBeUndefined();
    }
  });
});
