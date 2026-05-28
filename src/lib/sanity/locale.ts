export const siteLocales = ['es', 'ca', 'en'] as const;

export type SiteLocale = (typeof siteLocales)[number];

export const defaultLocale: SiteLocale = 'es';

export function localePath(locale: SiteLocale): string {
  return locale === defaultLocale ? '/' : `/${locale}`;
}
