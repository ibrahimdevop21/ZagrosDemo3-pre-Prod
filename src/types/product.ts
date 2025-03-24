export interface Product {
  id: string;
  categoryId: string;
  name: {
    en: string;
    ar: string;
  };
  composition: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  usage: {
    en: string;
    ar: string;
  };
  manufacturer: {
    en: string;
    ar: string;
  };
  country: {
    en: string;
    ar: string;
  };
  image: string;
}
