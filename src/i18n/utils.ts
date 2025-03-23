import en from './en.json';
import ar from './ar.json';
import type { UITranslations } from './types';

export const languages = {
  en: 'English',
  ar: 'العربية'
} as const;

export type Language = keyof typeof languages;

export const defaultLang = 'en';

export const ui = {
  en,
  ar
} as unknown as Record<Language, UITranslations>;

export const showDefaultLang = false;

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Language;
  return defaultLang;
}

type DotNotation<T> = T extends object
  ? { [K in keyof T]: `${K & string}${T[K] extends object ? `.${DotNotation<T[K]>}` : ''}` }[keyof T]
  : never;

export function useTranslations(lang: Language) {
  return function t(key: string) {
    const keys = key.split('.');
    let result = keys.reduce((obj, k) => obj && (obj as any)[k], ui[lang]);
    if (result === undefined && lang !== defaultLang) {
      result = keys.reduce((obj, k) => obj && (obj as any)[k], ui[defaultLang]);
    }
    return result || key;
  };
}

export function getRouteFromUrl(url: URL): string {
  const [, , ...rest] = url.pathname.split('/');
  if (rest.length === 0) return '/';
  return '/' + rest.join('/');
}
