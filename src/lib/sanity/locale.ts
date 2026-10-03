import { defaultLocale, locales, type LocaleId } from '../../../sanity.constants';

export { defaultLocale, locales };

export type SiteLocale = LocaleId;

/** The current request's locale entry (from `Astro.currentLocale`), falling back to the default. */
export function localeOf(currentLocale: string | undefined): (typeof locales)[number] {
  return locales.find((l) => l.id === currentLocale) ?? locales[0];
}

/** The current request's locale id (from `Astro.currentLocale`). */
export function siteLocale(currentLocale: string | undefined): SiteLocale {
  return localeOf(currentLocale).id;
}

/** URL prefix for a locale. The default locale is unprefixed at `/`. */
export function localePath(locale: SiteLocale): string {
  return locale === defaultLocale ? '/' : `/${locale}`;
}

type IntlValue = { _type: `internationalizedArray${string}Value`; language?: string; value?: string };

/** `T` with every internationalizedArray field resolved to one locale's string. */
export type Localized<T> =
  T extends ReadonlyArray<infer E>
    ? E extends IntlValue
      ? string
      : Localized<E>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

/** Pick one locale's value out of an internationalizedArray field, falling back
 *  to the default locale and then the first entry. */
function pickLocale(field: ReadonlyArray<IntlValue>, locale: SiteLocale): string {
  const byLanguage = (language: string) => field.find((entry) => entry.language === language)?.value;
  return byLanguage(locale) ?? byLanguage(defaultLocale) ?? field[0]?.value ?? '';
}

/** An empty array carries no `_type` to recognize, so it passes through as `[]`;
 *  Sanity unsets a field rather than storing an empty array, so this is rare. */
function isIntlArray(value: unknown): value is IntlValue[] {
  return Array.isArray(value) && /^internationalizedArray\w*Value$/.test(value[0]?._type ?? '');
}

/** Resolve every internationalizedArray in a query result to one locale, at any
 *  depth, so components read plain strings and no field has to be listed here. */
export function localize<T>(value: T, locale: SiteLocale): Localized<T> {
  if (isIntlArray(value)) return pickLocale(value, locale) as Localized<T>;
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as Localized<T>;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localize(item, locale)])
    ) as Localized<T>;
  }
  return value as Localized<T>;
}
