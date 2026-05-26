# Sonara — Vocal Experiences for Wellbeing

## Project overview

Porting sonaravocalexperiences.com from Wix to a modern static site. The developer (Dylan) builds and maintains the codebase. The client (non-technical) manages all site content through Decap CMS — a browser-based editor that requires zero code knowledge.

## Hard constraints

- **Never use Vercel** or any Vercel product (v0, Vercel hosting, etc.)
- **Hosting: Netlify** (free tier) — chosen because it integrates natively with Decap CMS auth
- **Package manager: pnpm** (managed via corepack — do not use npm or yarn)
- **Node: 24 LTS** (`.nvmrc` is present — run `nvm use` before anything)
- All tools should be free, open source, and low-cost

## Tech stack

| Concern         | Tool                                                      |
| --------------- | --------------------------------------------------------- |
| Framework       | Astro 6                                                   |
| Styling         | Tailwind CSS 4                                            |
| CMS             | Decap CMS (git-gateway backend, hosted at `/admin`)       |
| Hosting         | Netlify (free tier)                                       |
| Forms           | Netlify Forms (`data-netlify="true"` on the form element) |
| Linting         | ESLint 10 (flat config — `eslint.config.js`)              |
| Formatting      | Prettier 3 (120-char line length — `.prettierrc`)         |
| Version control | GitHub                                                    |

## Running the project

```bash
nvm use                  # switch to Node 24 LTS
corepack enable          # activate pnpm via corepack (first time only)
pnpm install             # install dependencies
pnpm dev                 # dev server at http://localhost:4321
pnpm build               # production build
pnpm lint                # ESLint
pnpm format              # Prettier
```

To test the CMS locally, run both in separate terminals:

```bash
pnpm dev
pnpm cms   # runs `npx decap-server` — local git backend at http://localhost:8081, then visit /admin
```

## Project structure

```
sonara/
├── public/
│   ├── admin/
│   │   ├── index.html       # Decap CMS entry point
│   │   └── config.yml       # CMS collections & field definitions
│   ├── images/              # uploaded images (via CMS or manually)
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── home/
│   │       ├── es.json      # Spanish content (default language)
│   │       ├── ca.json      # Catalan content
│   │       └── en.json      # English content
│   ├── styles/
│   │   └── global.css       # Tailwind 4 entry point + @theme custom tokens
│   ├── layouts/
│   │   └── Layout.astro     # base HTML shell, accepts `lang` prop
│   ├── components/
│   │   ├── Nav.astro        # fixed top nav with language switcher
│   │   ├── Hero.astro       # full-screen hero section
│   │   ├── VideoSection.astro  # portrait video embed in phone frame
│   │   ├── Approach.astro   # two-col: pillars text + photo
│   │   ├── Testimonials.astro  # three-col large-quote testimonials
│   │   ├── Contact.astro    # CTA + Netlify contact form
│   │   ├── Marquee.astro    # scrolling text banner
│   │   └── Footer.astro     # minimal footer
│   └── pages/
│       ├── index.astro      # Spanish — served at /
│       ├── ca/
│       │   └── index.astro  # Catalan — served at /ca
│       └── en/
│           └── index.astro  # English — served at /en
├── astro.config.mjs
├── netlify.toml
├── eslint.config.js
├── .prettierrc
├── tsconfig.json
├── .nvmrc                   # Node 24
└── package.json             # packageManager: pnpm@11.3.0
```

## i18n approach

- Astro's built-in i18n with `prefixDefaultLocale: false`
- Spanish (`es`) is the default locale, served at `/` with no prefix
- Catalan at `/ca`, English at `/en`
- This follows the Astro recipe: https://docs.astro.build/en/recipes/i18n/#hide-default-language-in-the-url
- Content lives in `src/content/home/{locale}.json` — plain JSON, imported directly by each page
- No Astro content collections used — JSON imports keep it simple and CMS-friendly

## Content management (Decap CMS)

- The CMS is at `yoursite.com/admin` once deployed to Netlify
- Auth is handled by Netlify Identity + git-gateway (configured in Netlify dashboard)
- The CMS edits the JSON files in `src/content/home/` directly via GitHub
- Every CMS save triggers a Netlify rebuild and redeploy automatically
- CMS config is in `public/admin/config.yml` — edit this to add/change fields
- All JSON field names use camelCase to match TypeScript component interfaces

## Brand design

Matching the existing Wix site visually:

- **Sage green**: `#8fa88a` (used for hero bg, testimonials bg, marquee, form card bg)
- **Off-white / cream**: `#f0ede6` (main page background, hero text)
- **Near-black**: `#1a1a18` (body text, dark UI elements)
- Large, heavy display typography (Inter Black / 900 weight)
- Minimal layout — single long-scroll page, no sidebar, no complex navigation
- The approach section photo should be grayscale (`grayscale` Tailwind class already applied)
- Custom tokens live in `src/styles/global.css` under `@theme`

## Section anchors

All section IDs use Spanish (the default locale) and are hardcoded in components — not editable via CMS:

- Approach section: `#enfoque`
- Contact section: `#contacto`

## Current status

**Phase 1 (scaffold) — complete.** All files are in place:

- Astro 6 project with Tailwind 4, i18n, and all components built
- Decap CMS wired up with full field definitions for all 3 languages
- Dev tooling: Node 24, pnpm 9/corepack, ESLint 10 flat config, Prettier 3
- `netlify.toml` in place for Netlify build config

**Next: Phase 2 — pixel-accurate visual design.**
The components exist but styling needs to be refined to match the original site precisely. Key things to polish:

- Typography scale (the site uses very large display text — `clamp()` sizing is a good approach)
- The hero section uses the sage green background with cream/dark text contrast
- Testimonials section: large quote text filling the full column width, bold/black weight
- Nav: transparent/fixed, right-aligned, no logo (just links + language switcher)
- Marquee animation should be smooth and seamless
- Mobile responsiveness throughout

**Phase 3 — content migration:** Replace placeholder copy with final client-approved text and real images/video URL.

**Phase 4 — forms & integrations:** Confirm Netlify Forms is working, test submissions.

**Phase 5 — Netlify deploy:** Connect GitHub repo to Netlify, configure Netlify Identity for CMS auth, point DNS.

**Phase 6 — client handoff:** Walk the client through the CMS. Write a short plain-English guide.

## Known TODOs

- `public/images/enfoque.jpg` — placeholder path, real photo needs to be added
- Video URL in all three `*.json` files is set to `REPLACE_WITH_VIDEO_ID` — needs real YouTube/Vimeo embed URL
- `public/admin/config.yml` backend uses `git-gateway` — requires Netlify Identity to be enabled in the Netlify dashboard before the CMS login will work
