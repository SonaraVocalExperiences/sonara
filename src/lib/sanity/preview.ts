export const SANITY_PREVIEW_COOKIE = '__sanity_preview';

export function isPreviewRequest(cookies: AstroCookies): boolean {
  return cookies.get(SANITY_PREVIEW_COOKIE)?.value === 'true';
}

interface AstroCookies {
  get(name: string): { value: string } | undefined;
}
