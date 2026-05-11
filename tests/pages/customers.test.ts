import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Customers from '../../src/pages/customers/index.astro';

describe('/customers', () => {
  it('renders all 6 real customers with EN names', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Customers);
    expect(html).toContain('Ministry of Agriculture');
    expect(html).toContain('Alrajihi');
    expect(html).toContain('Amtar');
    expect(html).toContain('Dal Agriculture');
    expect(html).toContain('Paramount');
    expect(html).toContain('Premier Farm');
  });

  it('references the 6 logo files', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Customers);
    expect(html).toContain('/trusted-customer-logos/ministry-of-agriculture.svg');
    expect(html).toContain('/trusted-customer-logos/alrajihi.svg');
    expect(html).toContain('/trusted-customer-logos/amtaar.svg');
    expect(html).toContain('/trusted-customer-logos/dal.svg');
    expect(html).toContain('/trusted-customer-logos/Paramount.svg');
    expect(html).toContain('/trusted-customer-logos/premier-farm.webp');
  });

  it('renders no pending-state markers — all 6 customers are real', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Customers);
    // Strip out the global footer newsletter <input placeholder="..."> so we
    // assert only on customer-card body copy, not unrelated form attributes.
    const customersSection = html.split('<footer')[0];
    expect(customersSection).not.toMatch(/pending/i);
    expect(customersSection).not.toContain('— pending —');
    expect(customersSection).not.toMatch(/\bTBD\b/);
    expect(customersSection).not.toMatch(/\bTODO\b/);
  });
});
