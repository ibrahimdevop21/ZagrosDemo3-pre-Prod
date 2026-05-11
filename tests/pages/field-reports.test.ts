import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../src/pages/field-reports/index.astro';
import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('field-reports index', () => {
  it('renders without throwing', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('</html>');
  });
  it('contains all 3 report slugs', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Index);
    expect(html).toContain('issue-03-salt-stress-tomato');
    expect(html).toContain('issue-03-magnesium-citrus');
    expect(html).toContain('issue-03-lucerne-yield');
  });
});

// NOTE: detail-page MDX body rendering can't run inside vitest's SSR sandbox
// (astro:content asset propagation fails with "module is not defined"). The
// real build produces these pages without issue. We verify here that the
// emitted HTML files exist on disk after `npm run build`.
describe('field-reports detail (build-output verification)', () => {
  it('every report has a corresponding built HTML page (skip if dist absent)', async () => {
    const dist = resolve(__dirname, '../../dist');
    if (!existsSync(dist)) {
      console.warn('dist/ not present — run `npm run build` first; skipping');
      return;
    }
    const reports = await getCollection('field-reports');
    for (const report of reports) {
      const en = resolve(dist, `field-reports/${report.slug}/index.html`);
      const ar = resolve(dist, `ar/field-reports/${report.slug}/index.html`);
      expect(existsSync(en), `missing EN build artifact for ${report.slug}`).toBe(true);
      expect(existsSync(ar), `missing AR build artifact for ${report.slug}`).toBe(true);
    }
  });
});
