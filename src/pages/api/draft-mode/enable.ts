import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';

import { setPreviewCookie } from '../../../lib/sanity/preview';

const token = import.meta.env.SANITY_API_READ_TOKEN;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  if (!token) {
    return new Response('SANITY_API_READ_TOKEN is not configured', { status: 500 });
  }

  const client = sanityClient.withConfig({ token, useCdn: false });
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client, request.url);

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  setPreviewCookie(cookies, new URL(request.url).protocol === 'https:');
  return redirect(redirectTo);
};
