export const prerender = false;

import { SANITY_PREVIEW_COOKIE } from '../../../lib/sanity/preview';
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete(SANITY_PREVIEW_COOKIE, { path: '/' });
  return redirect('/');
};
