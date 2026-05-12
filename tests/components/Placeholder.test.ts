import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Placeholder from '../../src/components/editorial/Placeholder.astro';

describe('Placeholder', () => {
  it('renders kind label uppercased', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'hero', label: 'Sudanese farmland' },
    });
    expect(html).toContain('PLACEHOLDER');
    expect(html).toContain('HERO');
    expect(html).toContain('Sudanese farmland');
  });

  it('exposes accessibility role and label', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'partner', label: 'K+S facility' },
    });
    expect(html).toMatch(/role="img"/);
    expect(html).toMatch(/aria-label="[^"]*K\+S facility/);
  });

  it('switches to dark variant for ink-ground sections', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Placeholder, {
      props: { kind: 'logo', label: 'Customer logo', dark: true },
    });
    expect(html).toMatch(/data-variant="dark"/);
  });
});
