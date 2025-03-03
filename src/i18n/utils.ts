import en from './en.json';
import ar from './ar.json';

export const languages = {
  en: 'English',
  ar: 'العربية'
};

export const defaultLang = 'en';

export const ui = {
  en,
  ar
} as const;

export const showDefaultLang = false;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    const keys = key.split('.');
    let result = keys.reduce((obj, k) => obj && obj[k], ui[lang] as any);
    if (result === undefined && lang !== defaultLang) {
      result = keys.reduce((obj, k) => obj && obj[k], ui[defaultLang] as any);
    }
    return result || key;
  };
}

export function getRouteFromUrl(url: URL): string {
  const [, , ...rest] = url.pathname.split('/');
  if (rest.length === 0) return '/';
  return '/' + rest.join('/');
}
