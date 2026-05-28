import { sanityClient } from 'sanity:client';
import type { HomeContent } from './queries';
import { homePageQuery } from './queries';
import type { SiteLocale } from './locale';

export type { HomeContent } from './queries';

interface GetHomeContentOptions {
  preview?: boolean;
}

export async function getHomeContent(
  locale: SiteLocale,
  options: GetHomeContentOptions = {},
): Promise<HomeContent> {
  const { preview = false } = options;

  const content = await sanityClient.fetch<HomeContent | null>(
    homePageQuery(),
    { locale },
    preview
      ? { perspective: 'drafts', stega: true, useCdn: false }
      : { perspective: 'published', stega: false, useCdn: false },
  );

  if (!content) {
    throw new Error(
      'Homepage content not found in Sanity. Open /admin, edit Homepage, publish, then rebuild.',
    );
  }

  return content;
}
