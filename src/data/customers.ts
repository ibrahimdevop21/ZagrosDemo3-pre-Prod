/**
 * Zagros Trading — Customer references
 *
 * Six anchor customers carried forward from the v1 site. All names and logo
 * files are real (verified in `ZAGROS_SOURCE_OF_TRUTH.md` §7) — do not invent.
 *
 * Logo files live in `public/trusted-customer-logos/`. Filenames preserved
 * verbatim from v1 (note the capital "P" in Paramount.svg).
 *
 * Sectors:
 *   - `government`      — public-sector procurement (the agriculture ministry)
 *   - `commercial_farm` — private commercial growers and agricultural projects
 */

export type CustomerSector = 'government' | 'commercial_farm';

export interface Customer {
  slug: string;
  name: { en: string; ar: string };
  logo: string;
  sector: CustomerSector;
}

export const customers: Customer[] = [
  {
    slug: 'ministry-of-agriculture',
    name: {
      en: 'Ministry of Agriculture & Natural Resources Sudan',
      ar: 'وزارة الزراعة والموارد الطبيعية السودان',
    },
    logo: '/trusted-customer-logos/ministry-of-agriculture.svg',
    sector: 'government',
  },
  {
    slug: 'alrajihi',
    name: {
      en: 'Alrajihi Agriculture Project',
      ar: 'مشروع الراجحي الزراعي',
    },
    logo: '/trusted-customer-logos/alrajihi.svg',
    sector: 'commercial_farm',
  },
  {
    slug: 'amtar',
    name: {
      en: 'Amtar Agriculture Project',
      ar: 'مشروع امطار الزراعي',
    },
    logo: '/trusted-customer-logos/amtaar.svg',
    sector: 'commercial_farm',
  },
  {
    slug: 'dal',
    name: {
      en: 'Dal Agriculture',
      ar: 'دال الزراعية',
    },
    logo: '/trusted-customer-logos/dal.svg',
    sector: 'commercial_farm',
  },
  {
    slug: 'paramount',
    name: {
      en: 'Paramount Agriculture',
      ar: 'باراماونت الزراعية',
    },
    logo: '/trusted-customer-logos/Paramount.svg',
    sector: 'commercial_farm',
  },
  {
    slug: 'premier-farm',
    name: {
      en: 'Premier Farm',
      ar: 'بريمير فارم',
    },
    logo: '/trusted-customer-logos/premier-farm.webp',
    sector: 'commercial_farm',
  },
];
