import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('field-reports collection', () => {
  it('contains the 3 illustrative seed reports', async () => {
    const reports = await getCollection('field-reports');
    expect(reports.length).toBeGreaterThanOrEqual(3);
  });

  it('has exactly one featured report', async () => {
    const featured = await getCollection('field-reports', ({ data }) => data.featured === true);
    expect(featured.length).toBe(1);
  });

  it('every report has bilingual title and summary', async () => {
    const reports = await getCollection('field-reports');
    for (const r of reports) {
      expect(r.data.title.en, `${r.slug} missing EN title`).toBeTruthy();
      expect(r.data.title.ar, `${r.slug} missing AR title`).toBeTruthy();
      expect(r.data.summary.en, `${r.slug} missing EN summary`).toBeTruthy();
      expect(r.data.summary.ar, `${r.slug} missing AR summary`).toBeTruthy();
    }
  });

  it('every illustrative report is flagged for stripping before launch', async () => {
    const reports = await getCollection('field-reports');
    for (const r of reports) {
      expect(r.data.illustrative, `${r.slug} must be marked illustrative until real content lands`).toBe(true);
    }
  });

  it('related_products reference real catalog SKUs', async () => {
    const reports = await getCollection('field-reports');
    const products = await getCollection('products');
    const validSlugs = new Set(products.map(p => p.slug));
    for (const r of reports) {
      for (const slug of r.data.related_products) {
        expect(validSlugs.has(slug), `${r.slug} references missing product ${slug}`).toBe(true);
      }
    }
  });
});
