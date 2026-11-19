# Beneru

Personal authority hub for **Reuben Magallanes (Beneru)**, Marketing Head and Co-Founder of [Spawntel](https://spawntel.com).

- **Production Domain**: [https://beneru.spawntel.com](https://beneru.spawntel.com)
- **Primary Focus**: AI Direction & Marketing Systems
- **Company Booking Funnel**: [https://spawntel.com](https://spawntel.com)

## Architecture

- **Frontend**: Static [Astro](https://astro.build) build into `./dist` using tinted-glass design tokens (`src/styles/tokens.css`, `src/styles/global.css`), structured verified data (`src/data/{site,work,systems,privacy}.ts`), and documented build pages at `/work/<slug>/` plus `/privacy/`.
- **Edge & API**: Cloudflare Workers Static Assets (`wrangler.jsonc`, `worker/index.ts`) serving `./dist` with edge headers (`public/_headers`), edge 301 redirects (`public/_redirects`), and `/api/funnel-click` Spawntel attribution notifications via Cloudflare Email Service.

## Commands

```bash
npm run dev           # Start local Astro dev server
npm run build         # Build production static bundle to ./dist
npm run worker:dev    # Build and test locally via Wrangler
npm run worker:deploy # Build and deploy static assets + Worker to Cloudflare
```
