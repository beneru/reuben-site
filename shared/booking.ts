/**
 * Booking rules shared by the browser (calendar UI) and the Worker (API).
 * Change availability here and both sides stay in sync.
 *
 * All times are Asia/Manila (UTC+8, no daylight saving).
 * Slots are fixed-length and never overlap: SLOT_MINUTES is both the
 * call length and the step between slots. The database enforces one
 * confirmed booking per (date, time), so two bookings can never collide.
 */

export const BOOKING = {
  timezoneLabel: 'Philippine Time (PHT, UTC+8)',
  utcOffset: '+08:00',
  /** Length of each call and spacing between slot start times. */
  slotMinutes: 30,
  /** 0 = Sunday ... 6 = Saturday. */
  openDays: [1, 2, 3, 4, 5, 6],
  /** First slot starts at this hour (24h). */
  dayStartHour: 9,
  /** Last slot must END by this hour (24h). */
  dayEndHour: 18,
  /** Lunch break, no slots start inside [start, end). Set to null to disable. */
  breakStart: '12:00' as string | null,
  breakEnd: '13:00' as string | null,
  /** Minimum notice before a slot can be booked. */
  minNoticeMinutes: 120,
  /** How far ahead people can book. */
  maxDaysAhead: 30,
  /** Max active future bookings per email address (spam guard). */
  maxActivePerEmail: 2,
} as const;

export const GOALS: Record<string, string> = {
  customer_service: 'Replying to customer DMs & inquiries',
  reservations: 'Table bookings & confirmations',
  inventory: 'Inventory tracking & stock alerts',
  marketing: 'Automated promos & customer retention',
  all: 'Full automation audit',
};

export const MEETING_TYPES: Record<string, string> = {
  google_meet: 'Google Meet (Online video call)',
  zoom: 'Zoom (Online video call)',
  phone: 'Phone / Viber Call',
};

const pad = (n: number) => String(n).padStart(2, '0');

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number): string {
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

/** Current date (YYYY-MM-DD) and minutes-since-midnight in Manila. */
export function manilaNow(now: Date = new Date()): { date: string; minutes: number } {
  const shifted = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const iso = shifted.toISOString();
  return {
    date: iso.slice(0, 10),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

/** Day of week for a YYYY-MM-DD string (calendar date, timezone independent). */
export function dayOfWeek(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Every slot start time for a given open day, ignoring bookings and notice. */
export function allSlotsForDay(): string[] {
  const out: string[] = [];
  const start = BOOKING.dayStartHour * 60;
  const lastStart = BOOKING.dayEndHour * 60 - BOOKING.slotMinutes;
  const bStart = BOOKING.breakStart ? toMinutes(BOOKING.breakStart) : null;
  const bEnd = BOOKING.breakEnd ? toMinutes(BOOKING.breakEnd) : null;
  for (let t = start; t <= lastStart; t += BOOKING.slotMinutes) {
    const end = t + BOOKING.slotMinutes;
    if (bStart !== null && bEnd !== null && t < bEnd && end > bStart) continue;
    out.push(fromMinutes(t));
  }
  return out;
}

/** Is this calendar date open for booking at all (day of week + window)? */
export function isBookableDate(date: string, now: Date = new Date()): boolean {
  if (!isValidDateString(date)) return false;
  if (!(BOOKING.openDays as readonly number[]).includes(dayOfWeek(date))) return false;
  const today = manilaNow(now).date;
  if (date < today) return false;
  if (date > addDays(today, BOOKING.maxDaysAhead)) return false;
  return true;
}

/** Slot start times on `date` that are still in the future with enough notice. */
export function openSlotsForDate(date: string, now: Date = new Date()): string[] {
  if (!isBookableDate(date, now)) return [];
  const { date: today, minutes } = manilaNow(now);
  const cutoff = date === today ? minutes + BOOKING.minNoticeMinutes : -1;
  return allSlotsForDay().filter((s) => toMinutes(s) >= cutoff);
}

/** UTC Date for a Manila date + time. */
export function slotStartUtc(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${BOOKING.utcOffset}`);
}

export function formatSlotLabel(time: string): string {
  const mins = toMinutes(time);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}

/** First calendar date starting from today that has at least one open slot. */
export function findFirstOpenDate(now: Date = new Date()): string {
  const { date: today } = manilaNow(now);
  for (let i = 0; i <= BOOKING.maxDaysAhead; i++) {
    const candidate = addDays(today, i);
    if (isBookableDate(candidate, now) && openSlotsForDate(candidate, now).length > 0) {
      return candidate;
    }
  }
  return today;
}

export function formatDateLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
