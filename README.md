# Beneru

The official personal brand and AI Marketing Direction platform for **Beneru** (Reuben Magallanes).

- **Production Domain**: [https://beneru.spawntel.com](https://beneru.spawntel.com)
- **Primary Focus**: AI Marketing Direction, Inbound Lead Capture, and Content Multiplication Systems
- **Parent Company**: [Spawntel](https://spawntel.com)

## Architecture

- **Frontend**: Clean semantic HTML & CSS with Lucide vector icons and responsive UI/UX.
- **Backend / Edge**: Cloudflare Workers with asset routing and D1 Database (`beneru-bookings`).
- **Notifications**: Zero-token real-time alert dispatch via Cloudflare Email, ntfy.sh instant mobile push, and webhook integrations.

## Commands

```bash
npm run dev           # Start local dev server
npm run build         # Build production bundle to ./dist
npm run worker:deploy # Deploy assets and edge worker to Cloudflare (beneru.spawntel.com)
```
