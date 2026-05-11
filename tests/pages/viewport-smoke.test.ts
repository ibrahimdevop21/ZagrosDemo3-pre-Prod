import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Contact from '../../src/pages/contact.astro';

describe('viewport smoke checks', () => {
  it('contact page has tel: and wa.me links wired', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    expect(html).toContain('tel:+249912338559');
    expect(html).toContain('wa.me/249912338559');
  });

  it('contact form inputs use text-base (no iOS auto-zoom)', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Contact);
    // Capture every form-input element and assert each has a 16px-equivalent class
    const inputs = html.match(/<(input|textarea|select)[^>]*>/g) ?? [];
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      // Skip type="hidden" — they don't need text sizing
      if (/type=["']?hidden/.test(input)) continue;
      expect(input, `Input lacks text-base class: ${input}`).toMatch(/\btext-(base|lg|xl|2xl)\b/);
    }
  });
});
