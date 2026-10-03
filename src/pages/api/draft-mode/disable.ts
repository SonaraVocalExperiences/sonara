import type { APIRoute } from 'astro';

import { clearPreviewCookie } from '../../../lib/sanity/preview';

export const GET: APIRoute = ({ cookies, redirect }) => {
  clearPreviewCookie(cookies);
  return redirect('/');
};
