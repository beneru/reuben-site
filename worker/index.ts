/**
 * Beneru site Worker.
 *
 * Static pages are served from ./dist by the Cloudflare Workers Assets binding.
 * This Worker runs for /api/* (see run_worker_first in wrangler.jsonc):
 *
 *   POST /api/funnel-click    Notify Reuben when a visitor clicks through to spawntel.com
 *   POST /api/status-notify   Bearer-authenticated owner update email endpoint
 *
 * Legacy direct booking routes (/api/slots, /api/book, /api/cancel, /api/ics)
 * have been retired with 410 Gone now that discovery bookings route to https://spawntel.com.
 */

import { FUNNEL_PLACEMENTS, SPAWNTEL_URL, type FunnelPlacement } from '../shared/funnel';

interface EmailAddress {
  email: string;
  name?: string;
}

interface SendEmailBinding {
  send(message: {
    to: string | EmailAddress | (string | EmailAddress)[];
    from: string | EmailAddress;
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string | EmailAddress;
  }): Promise<{ messageId: string }>;
}

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  EMAIL: SendEmailBinding;
  OWNER_EMAIL: string;
  OWNER_NAME: string;
  FROM_EMAIL: string;
  SITE_URL: string;
  NTFY_TOPIC?: string;
  NOTIFY_SECRET?: string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max);
}

function cleanMultiline(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max);
}

/* ------------------------------------------------------------------ */
/* Email                                                               */
/* ------------------------------------------------------------------ */

function emailShell(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f7f2ff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:32px;border:1px solid #efe5ff">
<tr><td>
<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6700ff">Beneru</p>
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">${title}</h1>
${inner}
</td></tr></table>
<p style="font-size:12px;color:#999;margin-top:16px">Beneru &middot; AI Direction &amp; Marketing Systems &middot; Connected to Spawntel</p>
</td></tr></table></body></html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:14px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;font-size:14px">${value}</td></tr>`;
}

function button(href: string, label: string, primary = true): string {
  const style = primary
    ? 'background:#6700ff;color:#fff;border:1px solid #6700ff'
    : 'background:#fff;color:#6700ff;border:1px solid #d9c7ff';
  return `<a href="${escapeHtml(href)}" style="display:inline-block;${style};padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;margin:4px 8px 4px 0">${label}</a>`;
}

function htmlPage(title: string, inner: string, status = 200): Response {
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)} | Beneru</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f2ff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;padding:24px}
.card{max-width:460px;background:#fff;border:1px solid #efe5ff;border-radius:20px;padding:32px;box-shadow:0 24px 64px rgba(103,0,255,.08)}
h1{font-size:22px;margin:0 0 12px}p{line-height:1.6;color:#444}a.btn{display:inline-block;background:#6700ff;color:#fff;border:0;border-radius:999px;padding:12px 22px;font-weight:600;font-size:15px;text-decoration:none;margin-top:8px}
a.link{color:#6700ff}</style></head><body><div class="card">${inner}</div></body></html>`;
  return new Response(page, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function retiredBookingResponse(request: Request): Response {
  const accept = request.headers.get('accept') ?? '';
  if (request.method === 'GET' && accept.includes('text/html')) {
    return htmlPage(
      'Booking moved to Spawntel',
      `<h1>Bookings now run on Spawntel</h1>
      <p>Direct booking on beneru.spawntel.com has moved. Schedule your discovery call on Spawntel instead.</p>
      <a class="btn" href="${escapeHtml(SPAWNTEL_URL)}">Continue to Spawntel</a>
      <p style="margin-top:20px"><a class="link" href="/">Back to Beneru</a></p>`,
      410,
    );
  }
  return json(
    {
      ok: false,
      error: 'Direct booking on this endpoint is retired. Book via https://spawntel.com.',
      redirectUrl: SPAWNTEL_URL,
    },
    410,
  );
}

/* ------------------------------------------------------------------ */
/* Spawntel funnel click alerts + owner status notification            */
/* ------------------------------------------------------------------ */

const BOT_UA_RE = /bot|crawl|spider|slurp|headless|lighthouse|wget|curl|python|axios|node-fetch|monitor|pingdom|uptime|preview/i;

const ALLOWED_FUNNEL_HOSTS = new Set([
  'beneru.spawntel.com',
  'beneru.spawntelph.workers.dev',
]);

// Lightweight per-isolate rate limiter for funnel notifications: max 3 alerts per IP per 15 min.
const FUNNEL_WINDOW_MS = 15 * 60 * 1000;
const FUNNEL_MAX_PER_IP = 3;
const FUNNEL_MAP_MAX_KEYS = 512;
const funnelRateMap = new Map<string, number[]>();

function allowFunnelNotification(request: Request, now = Date.now()): boolean {
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  const cutoff = now - FUNNEL_WINDOW_MS;

  if (funnelRateMap.size >= FUNNEL_MAP_MAX_KEYS) {
    for (const [key, stamps] of funnelRateMap) {
      const fresh = stamps.filter((ts) => ts > cutoff);
      if (fresh.length === 0) funnelRateMap.delete(key);
      else funnelRateMap.set(key, fresh);
    }
    if (funnelRateMap.size >= FUNNEL_MAP_MAX_KEYS) {
      const oldestKey = funnelRateMap.keys().next().value;
      if (oldestKey !== undefined) funnelRateMap.delete(oldestKey);
    }
  }

  const recent = (funnelRateMap.get(ip) ?? []).filter((ts) => ts > cutoff);
  if (recent.length >= FUNNEL_MAX_PER_IP) {
    funnelRateMap.set(ip, recent);
    return false;
  }
  recent.push(now);
  funnelRateMap.set(ip, recent);
  return true;
}

function extractAllowedHost(headerValue: string | null): string | null {
  if (!headerValue) return null;
  try {
    const host = new URL(headerValue).hostname.toLowerCase();
    return ALLOWED_FUNNEL_HOSTS.has(host) ? host : null;
  } catch {
    return null;
  }
}

function summarizeReferrer(raw: string): string {
  if (!raw) return 'Direct';
  try {
    const u = new URL(raw);
    return u.hostname || 'Direct';
  } catch {
    return 'Direct';
  }
}

function manilaTimestamp(): string {
  return (
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date()) + ' PHT'
  );
}

async function handleFunnelClick(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const ua = request.headers.get('user-agent') ?? '';
  if (!ua || BOT_UA_RE.test(ua)) {
    return new Response(null, { status: 204 });
  }

  const originHost =
    extractAllowedHost(request.headers.get('origin')) ??
    extractAllowedHost(request.headers.get('referer'));
  if (!originHost) {
    return new Response(null, { status: 204 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 204 });
  }

  if (!allowFunnelNotification(request)) {
    return new Response(null, { status: 204 });
  }

  const rawPlacement = clean(body.placement, 24) as FunnelPlacement;
  const placement: FunnelPlacement = rawPlacement in FUNNEL_PLACEMENTS ? rawPlacement : 'cta';
  const placementLabel = FUNNEL_PLACEMENTS[placement];
  const page = clean(body.page, 120) || '/';
  const referrer = summarizeReferrer(clean(body.referrer, 300));
  const cf = (request as Request & { cf?: { city?: string; region?: string; country?: string } }).cf;
  const locationParts = [cf?.city, cf?.region, cf?.country].filter(Boolean);
  const locationLabel = locationParts.length ? locationParts.join(', ') : 'Unknown';
  const when = manilaTimestamp();

  const html = emailShell(
    'Visitor clicked through to Spawntel',
    `<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Someone on your personal landing page (<strong>beneru.spawntel.com</strong>) clicked through to the <strong>Spawntel</strong> booking funnel.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      ${detailRow('Button', `<strong>${escapeHtml(placementLabel)}</strong>`)}
      ${detailRow('Page', escapeHtml(page))}
      ${detailRow('Source', escapeHtml(referrer))}
      ${detailRow('Location', escapeHtml(locationLabel))}
      ${detailRow('Time', escapeHtml(when))}
    </table>
    ${button(SPAWNTEL_URL, 'Open Spawntel.com')}`,
  );

  const text = [
    'Visitor clicked from beneru.spawntel.com to spawntel.com.',
    `Button: ${placementLabel}`,
    `Page: ${page}`,
    `Source: ${referrer}`,
    `Location: ${locationLabel}`,
    `Time: ${when}`,
  ].join('\n');

  const notify = async () => {
    const tasks: Promise<unknown>[] = [
      env.EMAIL.send({
        to: { email: env.OWNER_EMAIL, name: env.OWNER_NAME },
        from: { email: env.FROM_EMAIL, name: 'Beneru Funnel' },
        subject: `Beneru -> Spawntel click (${placementLabel})`,
        html,
        text,
      }).catch((err) => console.error('funnel email failed', err)),
    ];

    if (env.NTFY_TOPIC) {
      tasks.push(
        fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
          method: 'POST',
          headers: {
            Title: `Beneru -> Spawntel (${placementLabel})`,
            Tags: 'rocket,link',
            Priority: 'default',
          },
          body: `Visitor from ${locationLabel} (${referrer}) clicked ${placementLabel} on ${page}.`,
        }).catch((err) => console.error('funnel ntfy failed', err)),
      );
    }

    await Promise.allSettled(tasks);
  };

  ctx.waitUntil(notify());
  return new Response(null, { status: 204 });
}

async function handleStatusNotify(request: Request, env: Env): Promise<Response> {
  if (!env.NOTIFY_SECRET) return json({ ok: false, error: 'Not found' }, 404);
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${env.NOTIFY_SECRET}`) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  const subject = clean(body.subject, 160) || 'Beneru landing page update';
  const heading = clean(body.heading, 160) || subject;
  const summary = cleanMultiline(body.summary, 3000);
  const items = Array.isArray(body.items)
    ? body.items.map((item) => clean(item, 300)).filter(Boolean).slice(0, 12)
    : [];

  const listHtml = items.length
    ? `<ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.65;color:#222">${items
        .map((item) => `<li style="margin-bottom:6px">${escapeHtml(item)}</li>`)
        .join('')}</ul>`
    : '';

  const html = emailShell(
    escapeHtml(heading),
    `<p style="font-size:15px;line-height:1.65;margin:0 0 16px">${escapeHtml(summary)}</p>
    ${listHtml}
    ${button('https://beneru.spawntel.com', 'Open Beneru Landing Page')}
    ${button(SPAWNTEL_URL, 'Open Spawntel.com', false)}`,
  );

  const text = [
    heading,
    '',
    summary,
    ...(items.length ? ['', ...items.map((item) => `- ${item}`)] : []),
    '',
    'Beneru: https://beneru.spawntel.com',
    `Spawntel: ${SPAWNTEL_URL}`,
  ].join('\n');

  const res = await env.EMAIL.send({
    to: { email: env.OWNER_EMAIL, name: env.OWNER_NAME },
    from: { email: env.FROM_EMAIL, name: 'Beneru Updates' },
    subject,
    html,
    text,
  });

  return json({ ok: true, messageId: res.messageId });
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

const RETIRED_BOOKING_PATHS = new Set(['/api/slots', '/api/book', '/api/cancel', '/api/ics']);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (!pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      if (pathname === '/api/funnel-click' && method === 'POST') return await handleFunnelClick(request, env, ctx);
      if (pathname === '/api/status-notify' && method === 'POST') return await handleStatusNotify(request, env);
      if (RETIRED_BOOKING_PATHS.has(pathname)) return retiredBookingResponse(request);
      return json({ ok: false, error: 'Not found' }, 404);
    } catch (err) {
      console.error('unhandled', err instanceof Error ? err.stack : err);
      return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
