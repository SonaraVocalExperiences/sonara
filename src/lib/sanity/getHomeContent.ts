import { sanityClient } from 'sanity:client';

import type { HomePageQueryResult } from '../../../sanity.types';
import { localize, type Localized, type SiteLocale } from './locale';
import { homePageQuery } from './queries';

export type HomeContent = Localized<NonNullable<HomePageQueryResult>>;

const token = import.meta.env.SANITY_API_READ_TOKEN;

/** Fetch the homepage singleton resolved to one locale. In preview mode we read
 *  drafts with the read token and turn on stega so Visual Editing overlays can map
 *  values back to their fields; otherwise we hit the CDN with published content. */
export async function getHomeContent(locale: SiteLocale, preview: boolean): Promise<HomeContent> {
  const client = preview
    ? sanityClient.withConfig({
        token,
        useCdn: false,
        perspective: 'drafts',
        stega: { enabled: true, studioUrl: '/admin' },
      })
    : sanityClient;

  const doc = await client.fetch(homePageQuery);

  if (!doc) {
    throw new Error('Homepage content not found in Sanity. Open /admin, edit Homepage, and publish.');
  }

  return localize(doc, locale);
}
