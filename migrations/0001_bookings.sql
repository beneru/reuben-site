-- Bookings for the free automation audit call.
-- The partial unique index is what makes double-booking impossible:
-- only ONE confirmed row can exist per (date, time). Cancelled rows
-- are ignored by the index, so a cancelled slot becomes bookable again.

CREATE TABLE IF NOT EXISTS bookings (
  id            TEXT PRIMARY KEY,
  date          TEXT NOT NULL,          -- YYYY-MM-DD (Asia/Manila)
  time          TEXT NOT NULL,          -- HH:MM 24h (Asia/Manila)
  name          TEXT NOT NULL,
  business      TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  goal          TEXT NOT NULL,
  meeting_type  TEXT NOT NULL DEFAULT 'google_meet',
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'confirmed',  -- confirmed | cancelled
  cancel_token  TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  cancelled_at  TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_one_per_slot
  ON bookings (date, time)
  WHERE status = 'confirmed';

CREATE INDEX IF NOT EXISTS bookings_by_date  ON bookings (date);
CREATE INDEX IF NOT EXISTS bookings_by_email ON bookings (email);
