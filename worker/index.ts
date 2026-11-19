/**
 * Beneru site Worker.
 *
 * Static pages are served from ./dist by the assets binding. This Worker
 * only runs for /api/* (see run_worker_first in wrangler.jsonc).
 *
 *   GET  /api/slots?date=YYYY-MM-DD   available slots for a day
 *   POST /api/book                    create a booking (JSON body)
 *   GET  /api/cancel?id=..&token=..   confirmation page with a cancel button
 *   POST /api/cancel                  actually cancel (form post)
 *
 * Double-booking protection lives in the database (unique index on
 * date+time for confirmed rows), not in a read-then-write check, so it
 * holds even when two people submit the same slot at the same instant.
 */

import {
  BOOKING,
  GOALS,
  MEETING_TYPES,
  formatDateLabel,
  formatSlotLabel,
  isBookableDate,
  isValidDateString,
  manilaNow,
  openSlotsForDate,
  slotStartUtc,
} from '../shared/booking';
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
    attachments?: {
      content: string;
      filename: string;
      type: string;
      disposition: 'attachment' | 'inline';
    }[];
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
  /** "true" once Email Sending (Workers Paid) is enabled for the domain. */
  SEND_CUSTOMER_CONFIRMATION?: string;
  /** Optional instant webhook / push notification endpoints (0 tokens) */
  DISCORD_WEBHOOK_URL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  NTFY_TOPIC?: string;
  NOTIFY_SECRET?: string;
}

interface BookingRow {
  id: string;
  date: string;
  time: string;
  name: string;
  business: string;
  email: string;
  phone: string | null;
  goal: string;
  meeting_type: string;
  notes: string | null;
  status: string;
  cancel_token: string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/* ------------------------------------------------------------------ */
/* Slots                                                               */
/* ------------------------------------------------------------------ */

async function bookedTimes(env: Env, date: string): Promise<Set<string>> {
  const { results } = await env.DB.prepare(
    "SELECT time FROM bookings WHERE date = ?1 AND status = 'confirmed'",
  )
    .bind(date)
    .all<{ time: string }>();
  return new Set(results.map((r) => r.time));
}

async function slotsPayload(env: Env, date: string) {
  const open = openSlotsForDate(date);
  const taken = await bookedTimes(env, date);
  return {
    date,
    timezone: BOOKING.timezoneLabel,
    durationMinutes: BOOKING.slotMinutes,
    slots: open.map((time) => ({
      time,
      label: formatSlotLabel(time),
      available: !taken.has(time),
    })),
  };
}

async function handleSlots(url: URL, env: Env): Promise<Response> {
  const date = url.searchParams.get('date') ?? '';
  if (!isValidDateString(date)) {
    return json({ ok: false, error: 'Use a date in YYYY-MM-DD format.' }, 400);
  }
  if (!isBookableDate(date)) {
    return json({ ok: true, ...(await slotsPayload(env, date)), slots: [] });
  }
  return json({ ok: true, ...(await slotsPayload(env, date)) });
}

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

async function handleBook(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) {
    return json({ ok: false, error: 'Expected a JSON body.' }, 415);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  // Honeypot: real people never see or fill this field.
  if (clean(body.website, 200)) {
    return json({ ok: true, booking: { id: 'ignored' } });
  }

  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const name = clean(body.name, 120);
  const business = clean(body.business, 160);
  const email = clean(body.email, 200).toLowerCase();
  const phone = clean(body.phone, 40);
  const goalKey = clean(body.goal, 40);
  const rawMeeting = clean(body.meeting_type, 40);
  const meetingKey = rawMeeting in MEETING_TYPES ? rawMeeting : 'google_meet';
  const notes = cleanMultiline(body.notes, 2000);

  const errors: string[] = [];
  if (!name) errors.push('Your name is required.');
  if (!business) errors.push('Business name is required.');
  if (!EMAIL_RE.test(email)) errors.push('A valid email is required.');
  if (!(goalKey in GOALS)) errors.push('Pick what you want to automate.');
  if (!isValidDateString(date)) errors.push('Pick a date.');
  if (!/^\d{2}:\d{2}$/.test(time)) errors.push('Pick a time slot.');
  if (errors.length) return json({ ok: false, error: errors.join(' ') }, 400);

  if (!openSlotsForDate(date).includes(time)) {
    return json(
      {
        ok: false,
        error: 'That time is no longer bookable. Please pick another slot.',
        ...(await slotsPayload(env, date)),
      },
      409,
    );
  }

  const { date: today } = manilaNow();
  const active = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM bookings WHERE email = ?1 AND status = 'confirmed' AND date >= ?2",
  )
    .bind(email, today)
    .first<{ n: number }>();
  if ((active?.n ?? 0) >= BOOKING.maxActivePerEmail) {
    return json(
      {
        ok: false,
        error: `You already have ${BOOKING.maxActivePerEmail} upcoming bookings. Cancel one from your confirmation email, or reply to it and we'll sort it out.`,
      },
      429,
    );
  }

  const booking: BookingRow = {
    id: crypto.randomUUID(),
    date,
    time,
    name,
    business,
    email,
    phone: phone || null,
    goal: goalKey,
    meeting_type: meetingKey,
    notes: notes || null,
    status: 'confirmed',
    cancel_token: randomToken(),
  };

  try {
    await env.DB.prepare(
      `INSERT INTO bookings (id, date, time, name, business, email, phone, goal, meeting_type, notes, status, cancel_token)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'confirmed', ?11)`,
    )
      .bind(
        booking.id,
        booking.date,
        booking.time,
        booking.name,
        booking.business,
        booking.email,
        booking.phone,
        booking.goal,
        booking.meeting_type,
        booking.notes,
        booking.cancel_token,
      )
      .run();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('UNIQUE')) {
      return json(
        {
          ok: false,
          conflict: true,
          error: 'Someone just booked that slot. Please pick another time.',
          ...(await slotsPayload(env, date)),
        },
        409,
      );
    }
    console.error('booking insert failed', message);
    return json({ ok: false, error: 'Could not save your booking. Please try again.' }, 500);
  }

  ctx.waitUntil(dispatchBookingNotifications(env, booking));

  return json({
    ok: true,
    booking: {
      id: booking.id,
      date: booking.date,
      time: booking.time,
      dateLabel: formatDateLabel(booking.date),
      timeLabel: formatSlotLabel(booking.time),
      timezone: BOOKING.timezoneLabel,
      meetingType: booking.meeting_type,
      meetingLabel: MEETING_TYPES[booking.meeting_type] || 'Google Meet (Online video call)',
      googleCalendarUrl: googleCalendarUrl(env, booking, 'customer'),
      icsUrl: `/api/ics?id=${booking.id}&token=${booking.cancel_token}`,
    },
  });
}

/* ------------------------------------------------------------------ */
/* Calendar helpers                                                    */
/* ------------------------------------------------------------------ */

function icsStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function icsEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function eventTimes(b: Pick<BookingRow, 'date' | 'time'>) {
  const start = slotStartUtc(b.date, b.time);
  const end = new Date(start.getTime() + BOOKING.slotMinutes * 60 * 1000);
  return { start, end };
}

function buildIcs(env: Env, b: BookingRow, method: 'REQUEST' | 'CANCEL' = 'REQUEST'): string {
  const { start, end } = eventTimes(b);
  const goal = GOALS[b.goal] ?? b.goal;
  const meetingLabel = MEETING_TYPES[b.meeting_type] ?? 'Google Meet (Online video call)';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Beneru//Automation Audit//EN',
    'CALSCALE:GREGORIAN',
    `METHOD:${method === 'CANCEL' ? 'CANCEL' : 'PUBLISH'}`,
    'BEGIN:VEVENT',
    `UID:${b.id}@beneru`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsEscape(`Automation Audit: ${b.business} x Beneru`)}`,
    `LOCATION:${icsEscape(meetingLabel)}`,
    `DESCRIPTION:${icsEscape(
      `Free ${BOOKING.slotMinutes}-minute automation audit.\nBusiness: ${b.business}\nMeeting Format: ${meetingLabel}\nContact: ${b.name} <${b.email}>${b.phone ? ` / ${b.phone}` : ''}\nFocus: ${goal}${b.notes ? `\nNotes: ${b.notes}` : ''}`,
    )}`,
    `ORGANIZER;CN=${icsEscape(env.OWNER_NAME)}:mailto:${env.OWNER_EMAIL}`,
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

function googleCalendarUrl(env: Env, b: BookingRow, audience: 'owner' | 'customer'): string {
  const { start, end } = eventTimes(b);
  const goal = GOALS[b.goal] ?? b.goal;
  const meetingLabel = MEETING_TYPES[b.meeting_type] ?? 'Google Meet (Online video call)';
  const title =
    audience === 'owner' ? `Audit call: ${b.business} (${b.name})` : `Automation Audit with ${env.OWNER_NAME}`;
  const details =
    audience === 'owner'
      ? `Business: ${b.business}\nMeeting Format: ${meetingLabel}\nContact: ${b.name} <${b.email}>${b.phone ? ` / ${b.phone}` : ''}\nFocus: ${goal}${b.notes ? `\nNotes: ${b.notes}` : ''}`
      : `Free ${BOOKING.slotMinutes}-minute automation audit for ${b.business}.\nMeeting Format: ${meetingLabel}\nFocus: ${goal}\n\nCall details or link will be sent prior to the call. Need to reschedule? Reply to your confirmation email.`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    details,
    location: meetingLabel,
    ctz: 'Asia/Manila',
  });
  if (audience === 'owner') params.set('add', b.email);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
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

async function sendBookingEmails(env: Env, b: BookingRow): Promise<void> {
  const when = `${formatDateLabel(b.date)}, ${formatSlotLabel(b.time)}`;
  const goal = GOALS[b.goal] ?? b.goal;
  const meetingLabel = MEETING_TYPES[b.meeting_type] ?? 'Google Meet (Online video call)';
  const ics = buildIcs(env, b);
  const cancelUrl = `${env.SITE_URL}/api/cancel?id=${b.id}&token=${b.cancel_token}`;

  const ownerHtml = emailShell(
    `New audit booked: ${escapeHtml(b.business)}`,
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      ${detailRow('When', `<strong>${escapeHtml(when)}</strong> (${BOOKING.timezoneLabel})`)}
      ${detailRow('Length', `${BOOKING.slotMinutes} minutes`)}
      ${detailRow('Meeting Format', `<strong>${escapeHtml(meetingLabel)}</strong>`)}
      ${detailRow('Name', escapeHtml(b.name))}
      ${detailRow('Business', escapeHtml(b.business))}
      ${detailRow('Email', `<a href="mailto:${escapeHtml(b.email)}">${escapeHtml(b.email)}</a>`)}
      ${b.phone ? detailRow('Phone', escapeHtml(b.phone)) : ''}
      ${detailRow('Focus', escapeHtml(goal))}
      ${b.notes ? detailRow('Notes', escapeHtml(b.notes).replace(/\n/g, '<br>')) : ''}
    </table>
    ${button(googleCalendarUrl(env, b, 'owner'), 'Add to Google Calendar')}
    ${button(cancelUrl, 'Cancel this booking', false)}
    <p style="font-size:13px;color:#666;margin-top:20px">Hit <strong>Reply</strong> to email ${escapeHtml(b.name)} directly. The slot is now blocked on the site.</p>`,
  );

  const ownerText = [
    `New audit booked: ${b.business}`,
    `When: ${when} (${BOOKING.timezoneLabel})`,
    `Meeting Format: ${meetingLabel}`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.phone ? `Phone: ${b.phone}` : '',
    `Focus: ${goal}`,
    b.notes ? `Notes: ${b.notes}` : '',
    '',
    `Add to Google Calendar: ${googleCalendarUrl(env, b, 'owner')}`,
    `Cancel: ${cancelUrl}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await env.EMAIL.send({
      to: { email: env.OWNER_EMAIL, name: env.OWNER_NAME },
      from: { email: env.FROM_EMAIL, name: 'Beneru Bookings' },
      replyTo: { email: b.email, name: b.name },
      subject: `New booking: ${b.business}, ${when}`,
      html: ownerHtml,
      text: ownerText,
      attachments: [{ content: ics, filename: 'audit-call.ics', type: 'text/calendar', disposition: 'attachment' }],
    });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('owner email failed', e.code, e.message);
  }

  if (env.SEND_CUSTOMER_CONFIRMATION !== 'true') return;

  const customerHtml = emailShell(
    `You're booked, ${escapeHtml(b.name.split(' ')[0])}.`,
    `<p style="font-size:15px;line-height:1.6;margin:0 0 16px">Your free automation audit for <strong>${escapeHtml(b.business)}</strong> is confirmed.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      ${detailRow('When', `<strong>${escapeHtml(when)}</strong>`)}
      ${detailRow('Time zone', BOOKING.timezoneLabel)}
      ${detailRow('Length', `${BOOKING.slotMinutes} minutes`)}
      ${detailRow('Meeting Format', `<strong>${escapeHtml(meetingLabel)}</strong>`)}
      ${detailRow('Focus', escapeHtml(goal))}
    </table>
    ${button(googleCalendarUrl(env, b, 'customer'), 'Add to Google Calendar')}
    <p style="font-size:14px;line-height:1.6;color:#444;margin-top:20px">Your meeting link (${escapeHtml(meetingLabel)}) will be sent before our scheduled call. Need to change the time? Reply to this email, or <a href="${escapeHtml(cancelUrl)}" style="color:#6700ff">cancel the booking</a> and pick a new slot.</p>
    <p style="font-size:14px;margin-top:20px">Ben</p>`,
  );

  try {
    await env.EMAIL.send({
      to: { email: b.email, name: b.name },
      from: { email: env.FROM_EMAIL, name: env.OWNER_NAME },
      replyTo: { email: env.OWNER_EMAIL, name: env.OWNER_NAME },
      subject: `Confirmed: Automation audit, ${when}`,
      html: customerHtml,
      text: `Your free automation audit for ${b.business} is confirmed.\nWhen: ${when} (${BOOKING.timezoneLabel})\nLength: ${BOOKING.slotMinutes} minutes\nMeeting: ${meetingLabel}\n\nAdd to Google Calendar: ${googleCalendarUrl(env, b, 'customer')}\nCancel: ${cancelUrl}\n\nBen`,
      attachments: [{ content: ics, filename: 'audit-call.ics', type: 'text/calendar', disposition: 'attachment' }],
    });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('customer email failed', e.code, e.message);
  }
}

async function sendCancellationEmail(env: Env, b: BookingRow): Promise<void> {
  const when = `${formatDateLabel(b.date)}, ${formatSlotLabel(b.time)}`;
  try {
    await env.EMAIL.send({
      to: { email: env.OWNER_EMAIL, name: env.OWNER_NAME },
      from: { email: env.FROM_EMAIL, name: 'Beneru Bookings' },
      replyTo: { email: b.email, name: b.name },
      subject: `Cancelled: ${b.business}, ${when}`,
      html: emailShell(
        `Booking cancelled: ${escapeHtml(b.business)}`,
        `<p style="font-size:15px;line-height:1.6">${escapeHtml(b.name)} (${escapeHtml(b.email)}) cancelled the audit on <strong>${escapeHtml(when)}</strong>. The slot is open again on the site.</p>`,
      ),
      text: `${b.name} (${b.email}) cancelled the audit on ${when}. The slot is open again.`,
      attachments: [
        {
          content: buildIcs(env, b, 'CANCEL'),
          filename: 'cancel.ics',
          type: 'text/calendar',
          disposition: 'attachment',
        },
      ],
    });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('cancel email failed', e.code, e.message);
  }
}

/* ------------------------------------------------------------------ */
/* Zero-token instant notifications: Discord, Telegram, ntfy.sh       */
/* ------------------------------------------------------------------ */

async function sendDiscordNotification(env: Env, b: BookingRow, isCancelled = false): Promise<void> {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const when = `${formatDateLabel(b.date)} at ${formatSlotLabel(b.time)} (PHT)`;
  const goal = GOALS[b.goal] ?? b.goal;
  const meetingLabel = MEETING_TYPES[b.meeting_type] ?? 'Google Meet (Online video call)';
  const gcalUrl = googleCalendarUrl(env, b, 'owner');

  const title = isCancelled
    ? `❌ Booking Cancelled: ${b.business}`
    : `🎉 New Automation Audit: ${b.business}`;

  const description = isCancelled
    ? `**${b.name}** cancelled their audit scheduled for **${when}**. That slot is now available again on the site.`
    : `A client just booked an automation audit on **${env.SITE_URL || 'beneru.spawntel.com'}**.`;

  const color = isCancelled ? 0xef4444 : 0x6700ff;

  const fields = isCancelled
    ? [
        { name: 'Client', value: `${b.name} (<${b.email}>)`, inline: true },
        { name: 'Freed Slot', value: when, inline: true },
      ]
    : [
        { name: 'Client Name', value: b.name, inline: true },
        { name: 'Business Name', value: b.business, inline: true },
        { name: 'Email', value: `[${b.email}](mailto:${b.email})`, inline: true },
        { name: 'Phone / Viber', value: b.phone || 'Not provided', inline: true },
        { name: 'Date & Time', value: `**${when}**`, inline: true },
        { name: 'Meeting Format', value: meetingLabel, inline: true },
        { name: 'Primary Focus', value: goal, inline: false },
        { name: 'Notes', value: b.notes ? b.notes.slice(0, 500) : 'None provided', inline: false },
        { name: 'Calendar Link', value: `[Add to Google Calendar](${gcalUrl})`, inline: false },
      ];

  const payload = {
    username: 'Beneru Bookings',
    avatar_url: 'https://beneru.spawntel.com/PFP.webp',
    embeds: [
      {
        title,
        description,
        color,
        fields,
        footer: { text: 'Beneru Booking Engine • Zero-token real-time alert' },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error('discord webhook failed', res.status, await res.text());
    }
  } catch (err) {
    console.error('discord notification error', err);
  }
}

async function sendTelegramNotification(env: Env, b: BookingRow, isCancelled = false): Promise<void> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const when = `${formatDateLabel(b.date)} at ${formatSlotLabel(b.time)} (PHT)`;
  const goal = GOALS[b.goal] ?? b.goal;
  const meetingLabel = MEETING_TYPES[b.meeting_type] ?? 'Google Meet';

  const text = isCancelled
    ? `❌ *Booking Cancelled*\n\n*Business:* ${b.business}\n*Client:* ${b.name} (${b.email})\n*Slot:* ${when}\nSlot is now available.`
    : `🎉 *New Automation Audit Booked!*\n\n*Business:* ${b.business}\n*Client:* ${b.name}\n*Email:* ${b.email}\n*Phone:* ${b.phone || 'N/A'}\n*Schedule:* ${when}\n*Format:* ${meetingLabel}\n*Focus:* ${goal}\n*Notes:* ${b.notes || 'None'}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
    if (!res.ok) {
      console.error('telegram notification failed', res.status, await res.text());
    }
  } catch (err) {
    console.error('telegram notification error', err);
  }
}

async function sendNtfyNotification(env: Env, b: BookingRow, isCancelled = false): Promise<void> {
  const topic = env.NTFY_TOPIC;
  if (!topic) return;

  const when = `${formatDateLabel(b.date)} at ${formatSlotLabel(b.time)}`;
  const title = isCancelled
    ? `Cancelled: ${b.business}`
    : `New Audit: ${b.business}`;
  const body = isCancelled
    ? `${b.name} cancelled for ${when}. Slot is reopened.`
    : `${b.name} booked for ${when} via ${MEETING_TYPES[b.meeting_type] || 'Google Meet'}. Phone: ${b.phone || 'N/A'}`;

  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: {
        Title: title,
        Tags: isCancelled ? 'x,warning' : 'tada,calendar',
        Priority: isCancelled ? 'default' : 'high',
      },
      body,
    });
  } catch (err) {
    console.error('ntfy notification error', err);
  }
}

async function dispatchBookingNotifications(env: Env, b: BookingRow): Promise<void> {
  await Promise.allSettled([
    sendBookingEmails(env, b),
    sendDiscordNotification(env, b, false),
    sendTelegramNotification(env, b, false),
    sendNtfyNotification(env, b, false),
  ]);
}

async function dispatchCancellationNotifications(env: Env, b: BookingRow): Promise<void> {
  await Promise.allSettled([
    sendCancellationEmail(env, b),
    sendDiscordNotification(env, b, true),
    sendTelegramNotification(env, b, true),
    sendNtfyNotification(env, b, true),
  ]);
}

/* ------------------------------------------------------------------ */
/* Cancel + ICS download                                               */
/* ------------------------------------------------------------------ */

async function findBooking(env: Env, id: string, token: string): Promise<BookingRow | null> {
  if (!id || !token) return null;
  return env.DB.prepare('SELECT * FROM bookings WHERE id = ?1 AND cancel_token = ?2')
    .bind(id, token)
    .first<BookingRow>();
}

function htmlPage(title: string, inner: string, status = 200): Response {
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Beneru</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f2ff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;padding:24px}
.card{max-width:460px;background:#fff;border:1px solid #efe5ff;border-radius:20px;padding:32px;box-shadow:0 24px 64px rgba(103,0,255,.08)}
h1{font-size:22px;margin:0 0 12px}p{line-height:1.6;color:#444}button,a.btn{display:inline-block;background:#6700ff;color:#fff;border:0;border-radius:999px;padding:12px 22px;font-weight:600;font-size:15px;cursor:pointer;text-decoration:none;margin-top:8px}
a.link{color:#6700ff}</style></head><body><div class="card">${inner}</div></body></html>`;
  return new Response(page, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function handleCancelPage(url: URL, env: Env): Promise<Response> {
  const id = url.searchParams.get('id') ?? '';
  const token = url.searchParams.get('token') ?? '';
  const b = await findBooking(env, id, token);
  if (!b) {
    return htmlPage('Not found', '<h1>Booking not found</h1><p>This link is invalid or expired.</p><a class="link" href="/">Back to site</a>', 404);
  }
  const when = `${formatDateLabel(b.date)}, ${formatSlotLabel(b.time)}`;
  if (b.status === 'cancelled') {
    return htmlPage('Already cancelled', `<h1>Already cancelled</h1><p>The booking on ${escapeHtml(when)} was cancelled.</p><a class="btn" href="/#demo">Book a new time</a>`);
  }
  // A GET never mutates: email link scanners pre-open links, and that must not cancel bookings.
  return htmlPage(
    'Cancel booking',
    `<h1>Cancel this booking?</h1>
     <p><strong>${escapeHtml(b.business)}</strong><br>${escapeHtml(when)} (${BOOKING.timezoneLabel})</p>
     <form method="POST" action="/api/cancel">
       <input type="hidden" name="id" value="${escapeHtml(b.id)}">
       <input type="hidden" name="token" value="${escapeHtml(b.cancel_token)}">
       <button type="submit">Yes, cancel it</button>
     </form>
     <p style="margin-top:20px"><a class="link" href="/">Keep my booking</a></p>`,
  );
}

async function handleCancelPost(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const form = await request.formData();
  const id = String(form.get('id') ?? '');
  const token = String(form.get('token') ?? '');
  const b = await findBooking(env, id, token);
  if (!b) {
    return htmlPage('Not found', '<h1>Booking not found</h1><p>This link is invalid or expired.</p>', 404);
  }
  if (b.status !== 'cancelled') {
    await env.DB.prepare(
      "UPDATE bookings SET status = 'cancelled', cancelled_at = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ?1",
    )
      .bind(b.id)
      .run();
    ctx.waitUntil(dispatchCancellationNotifications(env, b));
  }
  return htmlPage(
    'Cancelled',
    '<h1>Booking cancelled</h1><p>The slot is free again. Want a different time?</p><a class="btn" href="/#demo">Pick a new slot</a>',
  );
}

async function handleIcs(url: URL, env: Env): Promise<Response> {
  const b = await findBooking(env, url.searchParams.get('id') ?? '', url.searchParams.get('token') ?? '');
  if (!b || b.status !== 'confirmed') return new Response('Not found', { status: 404 });
  return new Response(buildIcs(env, b), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="automation-audit.ics"',
      'Cache-Control': 'no-store',
    },
  });
}

/* ------------------------------------------------------------------ */
/* Spawntel funnel click alerts + owner status notification            */
/* ------------------------------------------------------------------ */

const BOT_UA_RE = /bot|crawl|spider|slurp|headless|lighthouse|wget|curl|python|axios|node-fetch|monitor|pingdom|uptime|preview/i;

const ALLOWED_FUNNEL_HOSTS = new Set([
  'beneru.spawntel.com',
  'beneru.spawntelph.workers.dev',
]);

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
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date()) + ' PHT';
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
      if (pathname === '/api/slots' && method === 'GET') return await handleSlots(url, env);
      if (pathname === '/api/book' && method === 'POST') return await handleBook(request, env, ctx);
      if (pathname === '/api/cancel' && method === 'GET') return await handleCancelPage(url, env);
      if (pathname === '/api/cancel' && method === 'POST') return await handleCancelPost(request, env, ctx);
      if (pathname === '/api/ics' && method === 'GET') return await handleIcs(url, env);
      return json({ ok: false, error: 'Not found' }, 404);
    } catch (err) {
      console.error('unhandled', err instanceof Error ? err.stack : err);
      return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
