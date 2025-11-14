# Apply Migrations via Supabase Dashboard (Safe Version)

## Instructions:

1. **Go to Supabase Dashboard:**
   - Open: https://supabase.com/dashboard
   - Select your "Sprint3" project

2. **Open SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy and paste this SQL:**

```sql
-- Safe migrations that won't fail if objects already exist

-- ============================================================================
-- MIGRATION 005: Indicator Measurement Types
-- ============================================================================

ALTER TABLE key_indicators
  ADD COLUMN IF NOT EXISTS measurement_type TEXT DEFAULT 'time' CHECK (measurement_type IN ('time', 'frequency')),
  ADD COLUMN IF NOT EXISTS goal_frequency INTEGER;

COMMENT ON COLUMN key_indicators.measurement_type IS 'Type of measurement: "time" for hours-based goals, "frequency" for count-based goals';
COMMENT ON COLUMN key_indicators.goal_frequency IS 'Target count per week for frequency-based indicators';

ALTER TABLE key_indicators
  ALTER COLUMN goal_hours DROP NOT NULL;

-- ============================================================================
-- MIGRATION 006: Event Recurrence Fields
-- ============================================================================

ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS recurrence_end_date DATE,
  ADD COLUMN IF NOT EXISTS backup_pattern TEXT DEFAULT 'none' CHECK (backup_pattern IN ('none', 'diagonal'));

COMMENT ON COLUMN calendar_events.recurrence_end_date IS 'Optional end date for recurring events. NULL = repeats indefinitely';
COMMENT ON COLUMN calendar_events.backup_pattern IS 'Visual pattern for backup events';

-- ============================================================================
-- MIGRATION 007: Default Indicators Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_default_indicators()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.key_indicators (user_id, event_type, measurement_type, goal_hours, goal_frequency, display_order)
  VALUES
    (NEW.id, 'Gospel Study', 'time', NULL, NULL, 0),
    (NEW.id, 'School', 'time', NULL, NULL, 1),
    (NEW.id, 'Work', 'time', NULL, NULL, 2),
    (NEW.id, 'Dates', 'frequency', NULL, NULL, 3),
    (NEW.id, 'Hobby', 'time', NULL, NULL, 4),
    (NEW.id, 'Exercise', 'time', NULL, NULL, 5);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_signup_create_default_indicators ON auth.users;

CREATE TRIGGER on_user_signup_create_default_indicators
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_indicators();

COMMENT ON FUNCTION public.create_default_indicators() IS 'Automatically creates 6 default key indicators for new users';
```

4. **Click "Run" button** (bottom right)

5. **Verify Success:**
   - You should see: "Success. No rows returned" or similar
   - No error messages

## What This Does:

✅ Adds `measurement_type` and `goal_frequency` columns to `key_indicators`
✅ Adds `recurrence_end_date` and `backup_pattern` columns to `calendar_events`
✅ Creates trigger to auto-generate 6 default indicators for new users
✅ Safe to run multiple times (uses `IF NOT EXISTS` and `CREATE OR REPLACE`)

## After Running:

Your app will now be able to:
- Track indicators by time OR frequency
- Edit indicator goals inline
- Auto-create default indicators on signup
