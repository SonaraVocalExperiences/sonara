export const prerender = false;

import { sanityClient } from 'sanity:client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { SANITY_PREVIEW_COOKIE } from '../../../lib/sanity/preview';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect, request }) => {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(sanityClient, request.url);

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  const isHttps = new URL(request.url).protocol === 'https:';

  cookies.set(SANITY_PREVIEW_COOKIE, 'true', {
    path: '/',
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
  });

  return redirect(redirectTo);
};
