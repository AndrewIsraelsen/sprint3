-- Add measurement type support to key indicators
-- Allows indicators to track either time (hours) or frequency (count)

-- Add new columns to key_indicators table
ALTER TABLE key_indicators
  ADD COLUMN measurement_type TEXT DEFAULT 'time' CHECK (measurement_type IN ('time', 'frequency')),
  ADD COLUMN goal_frequency INTEGER;

-- Add comment for documentation
COMMENT ON COLUMN key_indicators.measurement_type IS 'Type of measurement: "time" for hours-based goals, "frequency" for count-based goals';
COMMENT ON COLUMN key_indicators.goal_frequency IS 'Target count per week for frequency-based indicators (e.g., "3 times per week")';

-- Make goal_hours nullable for frequency-based indicators
-- (Though we could keep it for backwards compatibility)
ALTER TABLE key_indicators
  ALTER COLUMN goal_hours DROP NOT NULL;
