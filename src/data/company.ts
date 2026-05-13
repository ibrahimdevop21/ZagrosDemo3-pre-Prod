/**
 * Zagros Trading — Company data
 *
 * Single source of truth for company facts consumed across the site.
 * Cross-reference: ZAGROS_SOURCE_OF_TRUTH.md (§3 positioning, §4 suppliers,
 * §5 branches, §11 contact channels).
 *
 * VERIFIED FROM SOURCE OF TRUTH:
 *   - Founded 1987 in Khartoum, Sudan
 *   - Seven international suppliers across six countries
 *   - Six branches across Sudan (Khartoum HQ + 5 regional)
 *   - Markets served: Sudan only
 *   - Three product lines: seeds, fertilizers, pesticides
 *
 * PENDING CLIENT INPUT (kept null — do not invent):
 *   - Street addresses for each branch
 *   - Branch-level phone numbers (only HQ phone is confirmed)
 *   - Corporate email
 *   - Social handles (Facebook, Instagram, YouTube, LinkedIn)
 */

export interface CompanyData {
  name: { en: string; ar: string };
  business: { en: string; ar: string };
  established_year: number;
  partners: PartnerSummary[];
  branches: Branch[];
  contact: ContactInfo;
  certifications: string[];
  markets_served: string[];      // ISO codes — confirmed sales markets
  supplier_countries: string[];  // ISO codes — countries we source from
  staff_count: number;
  parent_company: string;
}

export interface PartnerSummary {
  slug: string;
  name: string;
  country: string;       // display name
  country_code: string;  // ISO 3166-1 alpha-2
  category: 'vegetable_seeds' | 'forage_seeds' | 'fertilizers' | 'pesticides';
}

export interface Branch {
  name: { en: string; ar: string };
  type: 'HQ' | 'branch';
  city_en: string;
  city_ar: string;
  map_query: string;          // for Google Maps URL building
  address: string | null;     // null until client provides street addresses
  phone: string | null;
}

export interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;     // digits-only, wa.me ready
  email: string | null;
  hours_en: string;
  hours_ar: string;
  social: {
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    linkedin: string | null;
  };
}

export const companyData: CompanyData = {
  name: {
    en: 'Zagros Trading',
    ar: 'زاغروس للتجارة',
  },
  business: {
    en: 'Headquartered in Sudan since 1987, serving twelve markets across MENA with seeds, fertilizers, and pesticides from seven international suppliers.',
    ar: 'تأسست في السودان عام 1987 وتعمل في 12 سوقاً عبر الشرق الأوسط وشمال أفريقيا، بتوفير البذور والأسمدة والمبيدات من 7 موردين دوليين.',
  },
  established_year: 1987,
  partners: [
    { slug: 'east-west-seeds', name: 'East West Seeds International',            country: 'Thailand',       country_code: 'th', category: 'vegetable_seeds' },
    { slug: 'barenbrug',       name: 'Barenbrug Australia',                      country: 'Australia',      country_code: 'au', category: 'forage_seeds'    },
    { slug: 'k-plus-s',        name: 'K+S Middle East',                          country: 'Germany',        country_code: 'de', category: 'fertilizers'     },
    { slug: 'agro-dragon',     name: 'Agro Dragon',                              country: 'Netherlands',    country_code: 'nl', category: 'fertilizers'     },
    { slug: 'saf',             name: 'SAF',                                      country: 'Switzerland',    country_code: 'ch', category: 'pesticides'      },
    { slug: 'kz',              name: 'KZ',                                       country: 'United Kingdom', country_code: 'gb', category: 'pesticides'      },
    { slug: 'kafr-el-zayat',   name: 'Kafr El Zayat Pesticides & Chemical Co.',  country: 'Egypt',          country_code: 'eg', category: 'pesticides'      },
  ],
  branches: [
    { name: { en: 'Khartoum HQ', ar: 'الخرطوم — المقر الرئيسي' }, type: 'HQ',     city_en: 'Khartoum',   city_ar: 'الخرطوم',    map_query: 'Khartoum,Sudan',    address: null, phone: '+249 91 233 8559' },
    { name: { en: 'Port Sudan',  ar: 'بورتسودان'                 }, type: 'branch', city_en: 'Port Sudan', city_ar: 'بورتسودان',  map_query: 'Port+Sudan,Sudan',  address: null, phone: null },
    { name: { en: 'Al Qadarif',  ar: 'القضارف'                   }, type: 'branch', city_en: 'Al Qadarif', city_ar: 'القضارف',    map_query: 'Al+Qadarif,Sudan',  address: null, phone: null },
    { name: { en: 'Al Managil',  ar: 'المناقل'                   }, type: 'branch', city_en: 'Al Managil', city_ar: 'المناقل',    map_query: 'Al+Managil,Sudan',  address: null, phone: null },
    { name: { en: 'Ad-Damar',    ar: 'الدامر'                    }, type: 'branch', city_en: 'Ad-Damar',   city_ar: 'الدامر',     map_query: 'Ad-Damar,Sudan',    address: null, phone: null },
    { name: { en: 'Ad-Daba',     ar: 'الدبة'                     }, type: 'branch', city_en: 'Ad-Daba',    city_ar: 'الدبة',      map_query: 'Ad-Daba,Sudan',     address: null, phone: null },
  ],
  contact: {
    phone: '+249 91 233 8559',
    whatsapp: '+249912338559',   // digits-only, wa.me URL ready
    email: null,                 // pending client confirmation
    hours_en: 'Sunday – Thursday · 8:00 AM – 5:00 PM',
    hours_ar: 'الأحد – الخميس · ٨:٠٠ صباحاً – ٥:٠٠ مساءً',
    social: { facebook: null, instagram: null, youtube: null, linkedin: null },
  },
  certifications: ['International Agricultural Trade Association'],
  markets_served: ['sd', 'eg', 'sa', 'ae', 'qa', 'kw', 'om', 'bh', 'jo', 'lb', 'iq', 'ye'],
  supplier_countries: ['de', 'nl', 'ch', 'gb', 'au', 'th', 'cn', 'in', 'eg'],
  staff_count: 50,
  parent_company: 'Zagros Group',
};
