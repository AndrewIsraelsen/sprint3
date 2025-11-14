-- Add recurrence support to calendar events
-- Allows events to repeat daily, weekly, or monthly with optional end date

-- Add recurrence fields
ALTER TABLE calendar_events
  ADD COLUMN recurrence_end_date DATE,
  ADD COLUMN backup_pattern TEXT DEFAULT 'none' CHECK (backup_pattern IN ('none', 'diagonal'));

-- Add comments for documentation
COMMENT ON COLUMN calendar_events.recurrence_end_date IS 'Optional end date for recurring events. NULL = repeats indefinitely';
COMMENT ON COLUMN calendar_events.backup_pattern IS 'Visual pattern for backup events: "none" or "diagonal" (strikethrough lines)';

-- Note: repeat_pattern already exists in calendar_events (from migration 002)
-- Values: 'Does not repeat', 'Daily', 'Weekly', 'Monthly', 'Yearly'
