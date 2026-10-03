import type { AstroCookies } from 'astro';

/** Set by the draft-mode API routes; read on every page render to decide
 *  whether to fetch draft content and enable stega. */
const PREVIEW_COOKIE = '__sanity_preview';

export function isPreview(cookies: AstroCookies): boolean {
  return cookies.get(PREVIEW_COOKIE)?.value === 'true';
}

export function setPreviewCookie(cookies: AstroCookies, secure: boolean): void {
  cookies.set(PREVIEW_COOKIE, 'true', {
    httpOnly: true,
    sameSite: secure ? 'none' : 'lax',
    secure,
    path: '/',
  });
}

export function clearPreviewCookie(cookies: AstroCookies): void {
  cookies.delete(PREVIEW_COOKIE, { path: '/' });
}
