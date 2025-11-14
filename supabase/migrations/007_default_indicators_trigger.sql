-- Auto-create 6 default key indicators for new users
-- Triggered after user signup

-- Create function to insert default indicators
CREATE OR REPLACE FUNCTION public.create_default_indicators()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert 6 default indicators with no preset goals (user must set manually)
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_signup_create_default_indicators ON auth.users;

-- Create trigger to run after user insertion
CREATE TRIGGER on_user_signup_create_default_indicators
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_indicators();

-- Add comment for documentation
COMMENT ON FUNCTION public.create_default_indicators() IS 'Automatically creates 6 default key indicators (Gospel Study, School, Work, Dates, Hobby, Exercise) for new users. Goals must be set manually by user.';
