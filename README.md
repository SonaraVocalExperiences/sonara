# sonara

Website for Sonara.

## Requirements

- Node 24
- pnpm 12

## Local development

```sh
pnpm install
pnpm dev
```

| Command             | Action                             |
| :------------------ | :--------------------------------- |
| `pnpm dev`          | Dev server on `localhost:4321`     |
| `pnpm build`        | Production build to `dist/`        |
| `pnpm check`        | Type-check `.astro` and `.ts`      |
| `pnpm lint`         | ESLint                             |
| `pnpm format`       | Prettier, rewriting files in place |
| `pnpm format:check` | Prettier, check only               |
| `pnpm typegen`      | Regenerate `sanity.types.ts`       |

## Sanity

Project `9aw7995u`, dataset `production`. All copy lives in Sanity rather than the repo, so the
client edits the site without touching code. The Studio is embedded in this app at `/admin`. Local
development needs `http://localhost:4321` in the project's CORS origins.

## Netlify

Deploys `main`. Build settings live in `netlify.toml`. Set `SANITY_API_READ_TOKEN` in the site
environment for draft preview; published pages render without it, and the build log warns if it is
missing.

There is no `pnpm preview`: the Netlify adapter does not support `astro preview`. Use Netlify deploy
previews, or `netlify serve` locally, to test a production build.

## CI

`.github/workflows/ci.yml` runs lint, format check, and type check on every push and pull request,
and fails if `sanity.types.ts` is out of date. It needs no secrets.
