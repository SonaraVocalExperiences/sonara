export const projectId = '9aw7995u';
export const dataset = 'production';

/** Business name, never translated. */
export const siteName = 'Sonara Vocal Experiences';

/** The single source for locales: Studio languages, Astro i18n routes, and the language switcher.
 *  The first entry is the default locale, served unprefixed at `/`. `id` is used in URLs and
 *  Sanity's `language` values; `hreflang` (BCP 47, with region) in `<html lang>`, alternate links,
 *  and the switcher's `lang`/`hreflang`, so a region change never needs a content migration.
 *  `title` is the Studio label. `label` is the switcher's visible abbreviation, and must be the
 *  start of `name` (the language's own name, its accessible name) to satisfy WCAG 2.5.3. */
export const locales = [
  {
    id: 'es',
    hreflang: 'es-ES',
    title: 'Español',
    label: 'ES',
    name: 'Español',
  },
  {
    id: 'ca',
    hreflang: 'ca-ES',
    title: 'Català',
    label: 'CA',
    name: 'Català',
  },
  {
    id: 'en',
    hreflang: 'en-US',
    title: 'English',
    label: 'EN',
    name: 'English',
  },
] as const;

export type LocaleId = (typeof locales)[number]['id'];

export const defaultLocale: LocaleId = locales[0].id;

/** UI strings that live in code rather than Sanity, keyed by locale id: accessible names with no
 *  visible text, and fixed messages the owner shouldn't have to maintain. `Record<LocaleId, …>`
 *  makes a new locale fail to compile until it has every one.
 *  - `switcherLabel` names the language switcher's `<nav>` landmark.
 *  - `menuLabel` names the main `<nav>` landmark, the small-screen menu button, and its dialog.
 *  - `closeLabel` names the menu dialog's close button.
 *  - `formSentTitle`, `formSent`, `formFailedTitle` and `formFailed` are the contact form's result messages. */
export type Messages = {
  switcherLabel: string;
  menuLabel: string;
  closeLabel: string;
  formSentTitle: string;
  formSent: string;
  formFailedTitle: string;
  formFailed: string;
};

export const messages: Record<LocaleId, Messages> = {
  es: {
    switcherLabel: 'Idioma',
    menuLabel: 'Menú',
    closeLabel: 'Cerrar',
    formSentTitle: 'Mensaje enviado correctamente',
    formSent: 'Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.',
    formFailedTitle: 'Algo ha salido mal',
    formFailed: 'No se ha podido enviar el mensaje. Inténtalo de nuevo.',
  },
  ca: {
    switcherLabel: 'Idioma',
    menuLabel: 'Menú',
    closeLabel: 'Tancar',
    formSentTitle: 'Missatge enviat correctament',
    formSent: 'Gràcies pel teu missatge. Ens posarem en contacte amb tu aviat.',
    formFailedTitle: 'Alguna cosa ha anat malament',
    formFailed: "No s'ha pogut enviar el missatge. Torna-ho a provar.",
  },
  en: {
    switcherLabel: 'Language',
    menuLabel: 'Menu',
    closeLabel: 'Close',
    formSentTitle: 'Message sent successfully',
    formSent: "Thank you for your message. We'll get in touch with you soon.",
    formFailedTitle: 'Something went wrong',
    formFailed: 'Message failed to send. Please try again.',
  },
};
