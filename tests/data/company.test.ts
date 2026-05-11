import { describe, it, expect } from 'vitest';
import { companyData } from '../../src/data/company';

describe('companyData', () => {
  it('reflects real Zagros facts from source-of-truth', () => {
    expect(companyData.established_year).toBe(2010);
    expect(companyData.partners.length).toBeGreaterThanOrEqual(7);
    expect(companyData.partners.map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        'east-west-seeds',
        'barenbrug',
        'k-plus-s',
        'agro-dragon',
        'saf',
        'kz',
        'kafr-el-zayat',
      ]),
    );
    expect(companyData.branches.length).toBe(6);
    expect(companyData.branches[0].name.en).toMatch(/Khartoum/);
    expect(companyData.contact.phone).toBe('+249 91 233 8559');
  });

  it('records Sudan as the served market and lists supplier countries', () => {
    expect(companyData.markets_served).toEqual(['sd']);
    expect(companyData.supplier_countries).toEqual(
      expect.arrayContaining(['de', 'nl', 'ch', 'gb', 'au', 'th', 'cn', 'in', 'eg']),
    );
  });

  it('flags HQ branch and exposes bilingual branch names', () => {
    const hq = companyData.branches.find((b) => b.type === 'HQ');
    expect(hq).toBeDefined();
    expect(hq?.name.en).toMatch(/Khartoum/);
    expect(hq?.name.ar).toMatch(/الخرطوم/);
  });

  it('exposes a wa.me-ready whatsapp number with no spaces', () => {
    expect(companyData.contact.whatsapp).toBe('+249912338559');
  });

  it('leaves email and social handles null until client confirms', () => {
    expect(companyData.contact.email).toBeNull();
    expect(companyData.contact.social.facebook).toBeNull();
    expect(companyData.contact.social.instagram).toBeNull();
    expect(companyData.contact.social.youtube).toBeNull();
    expect(companyData.contact.social.linkedin).toBeNull();
  });
});
