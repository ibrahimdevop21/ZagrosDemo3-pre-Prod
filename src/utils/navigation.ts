export function getLocalizedPath(lang: string, path: string = ''): string {
    if (lang === 'en') {
        return path ? `/${path}` : '/';
    }
    return path ? `/${lang}/${path}` : `/${lang}`;
}
