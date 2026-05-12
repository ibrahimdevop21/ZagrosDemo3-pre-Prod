import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import HeroV3 from '../../src/components/home/HeroV3.astro';

describe('HeroV3', () => {
  it('renders all 4 slide images', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('/hero/irrigation.webp');
    expect(html).toContain('/hero/crop.webp');
    expect(html).toContain('/hero/vegetable.webp');
    expect(html).toContain('/hero/pest.webp');
  });

  it('first slide preloads with fetchpriority=high', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toMatch(/<img[^>]*src="\/hero\/irrigation\.webp"[^>]*fetchpriority="high"/);
  });

  it('renders the locked headline with signal-yellow accent word', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('Sudanese soil');
    expect(html).toMatch(/text-signal/);
  });

  it('exposes 4 progress dots', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    const dots = html.match(/class="dot relative/g) ?? [];
    expect(dots.length).toBe(4);
  });

  it('uses hero-slideshow class for CSS animation hook', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(HeroV3);
    expect(html).toContain('hero-slideshow');
  });
});
