/**
 * Zagros Trading — Company data
 *
 * VERIFIED FROM SOURCE OF TRUTH:
 *   - Business model: authorized distributor of K+S (fertilizers) + Barenbrug (forage seeds)
 *   - Two product lines (no pesticides)
 *   - Middle East region (exact service area pending — gap #3)
 *
 * PENDING CLIENT INPUT (do not invent — replace before launch):
 *   - Legal name + founding year
 *   - Mission/values
 *   - Leadership
 *   - Branch addresses + phone numbers
 *   - Email, WhatsApp
 *   - Service-area countries
 *   - Local certifications/registrations
 *
 * Source: ZAGROS_SOURCE_OF_TRUTH.md
 */

export interface CompanyData {
  name: { en: string; ar: string };
  business: { en: string; ar: string };
  established_year: number | null;
  partners: PartnerSummary[];
  branches: Branch[];
  contact: ContactInfo;
  certifications: string[];
}

export interface PartnerSummary {
  slug: string;
  name: string;
  country: string;
  since_year: number;
  category: 'fertilizers' | 'forage_seeds';
}

export interface Branch {
  name: string;
  type: 'HQ' | 'branch' | 'logistics' | 'sales';
  address: string;
  phone: string | null;
  map_url: string | null;
}

export interface ContactInfo {
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  hours: string;
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
    en: 'Authorized Middle East distributor of K+S Group fertilizers and Barenbrug forage seeds.',
    ar: 'الموزع المعتمد لأسمدة K+S وبذور الأعلاف Barenbrug في الشرق الأوسط.',
  },
  established_year: null,
  partners: [
    { slug: 'k-plus-s',  name: 'K+S Group', country: 'Germany',     since_year: 2014, category: 'fertilizers' },
    { slug: 'barenbrug', name: 'Barenbrug', country: 'Netherlands', since_year: 2019, category: 'forage_seeds' },
  ],
  branches: [],
  contact: {
    phone: null,
    email: null,
    whatsapp: null,
    hours: 'Sunday–Thursday, 8:00–17:00',
    social: {
      facebook: null,
      instagram: null,
      youtube: null,
      linkedin: null,
    },
  },
  certifications: [],
};
