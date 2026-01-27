/**
 * Country Data - Market Presence
 * ISO-2 country codes with bilingual names
 */

export interface Country {
  code: string;
  name_en: string;
  name_ar: string;
}

export const countries: Country[] = [
  { code: "sd", name_en: "Sudan", name_ar: "السودان" },
  { code: "eg", name_en: "Egypt", name_ar: "مصر" },
  { code: "sa", name_en: "Saudi Arabia", name_ar: "السعودية" },
  { code: "ae", name_en: "UAE", name_ar: "الإمارات" },
  { code: "qa", name_en: "Qatar", name_ar: "قطر" },
  { code: "kw", name_en: "Kuwait", name_ar: "الكويت" },
  { code: "om", name_en: "Oman", name_ar: "عمان" },
  { code: "bh", name_en: "Bahrain", name_ar: "البحرين" },
  { code: "jo", name_en: "Jordan", name_ar: "الأردن" },
  { code: "lb", name_en: "Lebanon", name_ar: "لبنان" },
  { code: "iq", name_en: "Iraq", name_ar: "العراق" },
  { code: "ye", name_en: "Yemen", name_ar: "اليمن" },
  { code: "de", name_en: "Germany", name_ar: "ألمانيا" },
  { code: "nl", name_en: "Netherlands", name_ar: "هولندا" },
  { code: "th", name_en: "Thailand", name_ar: "تايلاند" },
  { code: "cn", name_en: "China", name_ar: "الصين" },
  { code: "in", name_en: "India", name_ar: "الهند" },
  { code: "gb", name_en: "United Kingdom", name_ar: "المملكة المتحدة" }
];
