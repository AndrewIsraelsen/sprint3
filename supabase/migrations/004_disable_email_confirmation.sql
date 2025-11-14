-- Disable email confirmation requirement
-- This allows users to log in immediately after signup without email verification

-- Update auth.users to automatically confirm emails
-- Note: This SQL is for documentation. The actual setting must be changed in Supabase Dashboard:
-- Authentication > Settings > Email Auth > Confirm email = OFF

-- For existing users who are stuck in unconfirmed state, confirm them:
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Create a trigger to auto-confirm new signups
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically confirm email on user creation
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

-- Create trigger to auto-confirm users
CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_user();

-- Comment for documentation
COMMENT ON FUNCTION public.auto_confirm_user() IS 'Automatically confirms user emails on signup to bypass email verification';
