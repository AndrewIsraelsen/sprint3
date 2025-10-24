-- Add additional fields to calendar_events table
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS event_type TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS repeat_pattern TEXT DEFAULT 'Does not repeat',
  ADD COLUMN IF NOT EXISTS has_backup BOOLEAN DEFAULT false;

-- Update location column to be called address for consistency
ALTER TABLE calendar_events
  RENAME COLUMN location TO address;

-- Rename description to match frontend (keep it as notes for clarity)
-- We'll map description to notes in the API layer instead
