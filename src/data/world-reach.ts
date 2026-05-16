/**
 * Canonical geo + supplier data for the home WorldReach section.
 *
 * Single source of truth for: source-country supplier credentials, market
 * coverage, HQ, and Sudan branch locations. The WorldReach component reads
 * this; no geography or supplier names are hardcoded in markup.
 *
 * Country IDs use ISO 3166-1 alpha-2 (lowercase) plus M49 numeric (matches
 * world-atlas/countries-110m.json `id` field). Coordinates are decimal lon/lat,
 * projected at build time via d3-geo so the SAME projection places countries
 * and pins.
 *
 * Confidence semantics — read by the supplier-name slot:
 *   - confirmed : legal name on file from source-of-truth doc
 *   - partial   : brand name on file, full legal name pending verification
 *   - tbc       : nothing on file — explicit elicitation slot for the client
 *   - aggregate : not a single named supplier; descriptor stands in
 *                 (currently only China: 12 OEM manufacturers, surfaced
 *                 per-product on pesticide detail pages)
 */

export type Role = 'hq' | 'source' | 'market' | 'both';
export type Confidence = 'confirmed' | 'partial' | 'tbc' | 'aggregate';

export interface Country {
  alpha2: string;
  m49: string;
  name_en: string;
  name_ar: string;
  lon: number;
  lat: number;
  role: Role;
  /** Only meaningful for source/both. null = TBC slot. */
  supplier_name: string | null;
  product_line_en: string | null;
  product_line_ar: string | null;
  /** null for pure-market countries (no credential). */
  confidence: Confidence | null;
}

export interface Branch {
  city_en: string;
  city_ar: string;
  lon: number;
  lat: number;
  isHq: boolean;
}

export const countries: Country[] = [
  // HQ — Sudan (Khartoum coords)
  { alpha2: 'sd', m49: '729', name_en: 'Sudan', name_ar: 'السودان', lon: 32.56, lat: 15.50,
    role: 'hq', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },

  // Source + market — Egypt (Cairo)
  { alpha2: 'eg', m49: '818', name_en: 'Egypt', name_ar: 'مصر', lon: 31.24, lat: 30.04,
    role: 'both', supplier_name: 'Kafr El Zayat Pesticides & Chemical Co.',
    product_line_en: 'Pesticides', product_line_ar: 'مبيدات', confidence: 'confirmed' },

  // Source countries — 8 (capitals for pin placement)
  { alpha2: 'de', m49: '276', name_en: 'Germany', name_ar: 'ألمانيا', lon: 13.40, lat: 52.52,
    role: 'source', supplier_name: 'K+S Middle East FZE',
    product_line_en: 'Fertilizers', product_line_ar: 'أسمدة', confidence: 'confirmed' },
  { alpha2: 'nl', m49: '528', name_en: 'Netherlands', name_ar: 'هولندا', lon: 4.90, lat: 52.37,
    role: 'source', supplier_name: 'Agro Dragon',
    product_line_en: 'Fertilizers', product_line_ar: 'أسمدة', confidence: 'partial' },
  { alpha2: 'ch', m49: '756', name_en: 'Switzerland', name_ar: 'سويسرا', lon: 7.45, lat: 46.95,
    role: 'source', supplier_name: null,
    product_line_en: 'Pesticides', product_line_ar: 'مبيدات', confidence: 'tbc' },
  { alpha2: 'gb', m49: '826', name_en: 'United Kingdom', name_ar: 'بريطانيا', lon: -0.13, lat: 51.51,
    role: 'source', supplier_name: null,
    product_line_en: 'Pesticides', product_line_ar: 'مبيدات', confidence: 'tbc' },
  { alpha2: 'au', m49: '036', name_en: 'Australia', name_ar: 'أستراليا', lon: 149.13, lat: -35.28,
    role: 'source', supplier_name: 'Barenbrug / Heritage Seeds',
    product_line_en: 'Forage seeds', product_line_ar: 'بذور أعلاف', confidence: 'confirmed' },
  { alpha2: 'th', m49: '764', name_en: 'Thailand', name_ar: 'تايلاند', lon: 100.50, lat: 13.76,
    role: 'source', supplier_name: 'East West Seeds International',
    product_line_en: 'Vegetable seeds', product_line_ar: 'بذور خضروات', confidence: 'confirmed' },
  { alpha2: 'cn', m49: '156', name_en: 'China', name_ar: 'الصين', lon: 116.41, lat: 39.90,
    role: 'source', supplier_name: '12 OEM manufacturers',
    product_line_en: 'Pesticides', product_line_ar: 'مبيدات', confidence: 'aggregate' },
  { alpha2: 'in', m49: '356', name_en: 'India', name_ar: 'الهند', lon: 77.21, lat: 28.61,
    role: 'source', supplier_name: 'Mahamaya Lifesciences',
    product_line_en: 'Pesticides', product_line_ar: 'مبيدات', confidence: 'confirmed' },

  // Markets — 10 (capitals; Sudan + Egypt already mapped above)
  { alpha2: 'sa', m49: '682', name_en: 'Saudi Arabia', name_ar: 'السعودية', lon: 46.68, lat: 24.71,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'ae', m49: '784', name_en: 'UAE', name_ar: 'الإمارات', lon: 54.37, lat: 24.45,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'qa', m49: '634', name_en: 'Qatar', name_ar: 'قطر', lon: 51.53, lat: 25.29,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'kw', m49: '414', name_en: 'Kuwait', name_ar: 'الكويت', lon: 47.99, lat: 29.38,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'om', m49: '512', name_en: 'Oman', name_ar: 'عُمان', lon: 58.41, lat: 23.59,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'bh', m49: '048', name_en: 'Bahrain', name_ar: 'البحرين', lon: 50.58, lat: 26.22,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'jo', m49: '400', name_en: 'Jordan', name_ar: 'الأردن', lon: 35.93, lat: 31.95,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'lb', m49: '422', name_en: 'Lebanon', name_ar: 'لبنان', lon: 35.50, lat: 33.89,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'iq', m49: '368', name_en: 'Iraq', name_ar: 'العراق', lon: 44.36, lat: 33.31,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
  { alpha2: 'ye', m49: '887', name_en: 'Yemen', name_ar: 'اليمن', lon: 44.21, lat: 15.35,
    role: 'market', supplier_name: null, product_line_en: null, product_line_ar: null, confidence: null },
];

// Sudan branch network — 6 cities, real coordinates. Khartoum is the HQ;
// the country-level HQ marker and the Khartoum branch are the same place,
// so the map draws the HQ bullseye at Khartoum and small branch markers
// for the other 5 cities only.
export const branches: Branch[] = [
  { city_en: 'Khartoum',   city_ar: 'الخرطوم',   lon: 32.56, lat: 15.50, isHq: true  },
  { city_en: 'Port Sudan', city_ar: 'بورتسودان', lon: 37.22, lat: 19.62, isHq: false },
  { city_en: 'Al Qadarif', city_ar: 'القضارف',   lon: 35.38, lat: 14.04, isHq: false },
  { city_en: 'Al Managil', city_ar: 'المناقل',   lon: 32.99, lat: 14.25, isHq: false },
  { city_en: 'Ad-Damar',   city_ar: 'الدامر',    lon: 33.97, lat: 17.59, isHq: false },
  { city_en: 'Ad-Daba',    city_ar: 'الدبة',     lon: 30.95, lat: 18.05, isHq: false },
];

// Convenience selectors used by the section's credentials grid.
export const sourceCountries = countries.filter(
  (c) => c.role === 'source' || c.role === 'both',
);
export const marketCountries = countries.filter(
  (c) => c.role === 'market' || c.role === 'both' || c.role === 'hq',
);
export const m49Set = (codes: string[]) => new Set(codes);
export const sourceM49 = m49Set(sourceCountries.map((c) => c.m49));
export const marketM49 = m49Set(marketCountries.map((c) => c.m49));
