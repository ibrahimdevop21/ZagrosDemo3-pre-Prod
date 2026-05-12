import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CustomersWall from '../../src/components/home/CustomersWall.astro';

describe('CustomersWall', () => {
  it('renders 6 customer logo tiles', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    const tiles = html.match(/data-customer-logo/g) ?? [];
    expect(tiles.length).toBe(6);
  });

  it('falls back to pull_quote_pending text when no quote is set', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    expect(html).toMatch(/pull quote pending|قيد التأكيد/);
  });

  it('uses ink ground for the section', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CustomersWall);
    expect(html).toMatch(/bg-ink/);
  });
});
