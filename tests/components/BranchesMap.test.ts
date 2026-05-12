import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import BranchesMap from '../../src/components/home/BranchesMap.astro';

describe('BranchesMap', () => {
  it('renders an inline SVG (not Leaflet)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    expect(html).toMatch(/<svg[^>]*viewBox="0 0 100 100"/);
    expect(html).not.toMatch(/leaflet/i);
  });

  it('renders 6 branch list items', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    const items = html.match(/data-branch-item/g) ?? [];
    expect(items.length).toBe(6);
  });

  it('renders 6 map pins', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(BranchesMap);
    const pins = html.match(/data-pin/g) ?? [];
    expect(pins.length).toBe(6);
  });
});
