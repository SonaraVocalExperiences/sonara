# sonara

Single-page trilingual site for Sonara — Vocal Experiences for Wellbeing, ported from Wix
(sonaravocalexperiences.com). Astro 7 and Sanity 6, deployed on Netlify. Spanish is the default
locale at `/`, with `/ca` and `/en`.

## Toolchain

Node 24 (`.nvmrc`) and pnpm 12.9.1 (`packageManager`), installed standalone.

Verify every change with `pnpm lint`, `pnpm check`, `pnpm format:check`, and `pnpm build`. All
must pass. CI (`.github/workflows/ci.yml`) runs all but the build, which Netlify covers.

`SANITY_API_READ_TOKEN` is only needed for draft preview (the dataset is public), so
`astro.config.mjs` warns rather than fails without it, which lets CI run with no secrets.

## Local development

- Astro 7 allows one dev server per project; if `pnpm dev` is already running, test against it.
- `504 (Outdated Optimize Dep)` in `/admin` means Vite re-bundled dependencies while the Studio tab
  was open. Hard-reload the tab (or restart `pnpm dev`); it is not a code or content problem.
- In Cursor, `.astro` files show `JSX.IntrinsicElements` errors: Open VSX only has Astro extension
  2.16.20, which predates the Astro 7 type support in 2.17. Trust `pnpm check`, which uses the
  project's language server.

## Hard constraints

- Never use Vercel or any Vercel product (v0, hosting, etc.).
- Hosting is Netlify (free tier). Build settings live in `netlify.toml`, not the dashboard.
- Prefer free, open-source, low-cost tools.

## Identifiers

- Sanity project `9aw7995u`, dataset `production`
- GitHub `SonaraVocalExperiences/sonara`, default branch `main`
- Production domain `www.sonaravocalexperiences.com` (`site` in `astro.config.mjs`; matches the old
  Wix canonical, so Netlify should redirect the bare domain to it). Not yet pointed at Netlify.

## Working with the owner

The client is non-technical and edits only through Sanity Studio, embedded at `/admin`. Never
design a workflow that requires them to touch the repo, a terminal, or git. All copy lives in
Sanity, never in the repo; never hardcode locale-specific strings in `.astro` files.

## Architecture

- `output: 'server'` with `@astrojs/netlify`, required for draft-mode preview cookies.
- The Studio uses browser history (the integration's default for server output), served by
  `/admin/[...params]`. Don't set `studioRouterHistory: 'hash'`: hash mode only mounts `/admin`, so
  Visual Editing's "Open in Studio" links (`/admin/intent/...`, built from `stega.studioUrl`) 404.
- `sanity.constants.ts` is the single source for project ID, dataset, and locales (ids, Studio
  titles, switcher labels; the first is the default) plus `messages`, a dictionary keyed by locale
  id of the few accessible names that have no visible text and so live in code, not Sanity
  (`messagesOf(Astro.currentLocale)`). Both are imported by `sanity.config.ts`, `astro.config.mjs`,
  and `src/lib/sanity/locale.ts`. Never hardcode a locale code elsewhere. Components get the
  current locale from `siteLocale(Astro.currentLocale)`, not from props. Short ids (`es`, `ca`,
  `en`) are used in URLs and Sanity `language` values; each locale's regional `hreflang`
  (`es-ES`, `ca-ES`, `en-US`) is used only for `<html lang>` and the canonical/alternate links in
  `Layout.astro`, so changing a region never needs a content migration.
- Content model: one `homePage` singleton (`schemaTypes/documents/homePage.ts`) with one collapsible
  object per page section (`seo`, `nav`, `hero`, `video`, `approach`, `contact`, `footer`) plus the
  `testimonials` array. Copy fields are `internationalizedArrayString` / `internationalizedArrayText`;
  URLs, email, and phone are plain. `seo` (title, description, share image) feeds `<title>`, the
  meta description, and the Open Graph tags in `Layout.astro`, which stega-cleans everything in
  `<head>`; the title falls back to `siteName` from `sanity.constants.ts` (the business name, never
  translated). The share image is the approach photo resized, so `og:image:alt` reuses
  `approach.imageAlt`. `HomePageView.astro` builds the share image URL (1200 × 630, hotspot crop)
  and adds schema.org `Organization` JSON-LD from `contact` through Layout's `head` slot.
- Types come from Sanity TypeGen. `homePageQuery` fetches the whole singleton with no projection,
  so schema changes need no query edit. `localize()` in `src/lib/sanity/locale.ts` resolves every
  internationalized array at any depth to one locale (fallback `es`, then first entry), and
  `HomeContent` is `Localized<HomePageQueryResult>`. `HomePageView.astro` passes each component its
  own section (`hero={content.hero ?? {}}`), typed as `NonNullable<HomeContent['hero']>`, so a
  component's props are exactly the fields it renders and no other file lists fields.
- After a schema change: `pnpm check` (runs `pnpm typegen` first), fix any type errors where fields
  are used, and commit the regenerated `sanity.types.ts`. Builds use the committed file.
  `.sanity/schema.json` is an ignored intermediate, which is why `schema extract` runs with
  `--force`. Keep queries free of JS interpolation, or TypeGen cannot read them and `fetch` returns
  `any`.
- Renaming or moving a field also needs a content migration (`sanity/migrate` `defineMigration` in
  `migrations/<name>/`, keyed by an old→new field table that refuses unmapped fields). Verify it
  offline against an exported copy of the document, then the owner runs it: dry run first, then
  `--no-dry-run`, with `SANITY_AUTH_TOKEN` set to the write token from `.env`. Delete the folder
  once applied. Adding a field needs no migration.
- Required fields are typed optional on purpose (`enforceRequiredFields` off): validation only blocks
  publishing, and preview renders drafts, so components must tolerate missing values.
- The three locale pages only render `HomePageView.astro`, which fetches through `getHomeContent()`.
- Inter is self-hosted, not Google Fonts, so no visitor data goes to Google. Astro's Fonts API
  (`fonts` in `astro.config.mjs`, `<Font>` in `Layout.astro`) serves `@fontsource-variable/inter`'s
  subset files by unicode range as two families: `--font-inter` (latin, preloaded, with a
  metric-matched fallback so text doesn't resize when the font swaps in) and `--font-inter-scripts`
  (every other subset, so a browser-translated page still gets Inter; each file only downloads when
  a page uses its characters). Two families because `<Font preload>` can't single out one subset;
  `--font-sans` lists scripts first. The `local` provider is used rather than `npm`, which measures
  the fallback from the package's first (Cyrillic) file and over-sizes it.
- Published reads go through the Sanity CDN. Preview (Presentation tool → `/api/draft-mode/enable`)
  sets a cookie; requests with it read drafts with the read token and enable stega for Visual Editing.
- `src/shims/react-compiler-runtime.mjs` works around rolldown-vite (Vite 8) dropping that package's
  named exports, which breaks the embedded Studio's Visual Editing. It is aliased in
  `astro.config.mjs`, and `react-compiler-runtime` is pinned exactly for its subpath import. Remove
  both once `@sanity/ui` or rolldown-vite fixes the interop. Re-tested 2026-10-03 (@sanity/astro
  3.5.1, Vite 8.3): without the shim, the preview-mode `VisualEditing` island fails to hydrate with
  a missing-export `SyntaxError`.
- `@sanity/astro`'s own dev plugin (`sanity:module-dedupe`) sets `resolve.dedupe` and pre-bundles
  React and friends, so this config doesn't repeat them. Its hardcoded `lodash/startCase.js` entry
  logs a harmless "Failed to resolve dependency" warning at startup; don't add lodash to silence it.
- `@sanity/visual-editing` stays on v5 to match `@sanity/astro@3.5`'s own range; a v6 direct dep
  installs two majors and breaks dep pre-bundling.
- `@sanity/client` stays on v7 because visual-editing v5 declares `^7.24.0` as its peer. Nothing
  here needs v8; move both up together once `@sanity/astro` adopts visual-editing v6. The embedded
  Studio brings its own client v8 as a dependency, which is expected.
- Section anchors are Spanish and hardcoded, not CMS-editable: `#enfoque`, `#contacto`.
- Scrolling is the browser default: no `scroll-behavior: smooth` and no scroll scripts. Smooth
  scrolling behaves differently across browsers (Chrome animates scroll restoration on refresh,
  Safari doesn't), and `<ClientRouter />` replaced the browser's scroll restoration with its own,
  which broke refresh. The language-switch crossfade is the CSS-only `@view-transition` instead.

## Status

Scaffold, Sanity migration, and the toolchain upgrade to the shared Astro 7 / Sanity 6 baseline are
done. Next is pixel-accurate visual design against the Wix site: `clamp()` type scale, testimonials
as full-width heavy quotes, a seamless marquee, and mobile responsiveness.

## Open items

- **Contact form will not receive submissions as built.** Netlify Forms only detects forms in static
  HTML at deploy time, and every page here is server-rendered. Add a static form definition (e.g.
  `public/__forms.html` with matching fields) and submit to it with `fetch`.
- Video URL in Sanity is a placeholder (`REPLACE_WITH_VIDEO_ID`).
- Netlify: connect the repo, set `SANITY_API_READ_TOKEN`, add the production origin to Sanity CORS
  (with credentials, or the embedded Studio cannot log in), register `<domain>/admin` under the
  Sanity project's Studios so it is listed in the dashboard, and point DNS.
- Client handoff: walk them through the Studio and write a short plain-English guide.
