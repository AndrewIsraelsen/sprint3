-- Create key_indicators table
CREATE TABLE IF NOT EXISTS key_indicators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  goal_hours NUMERIC NOT NULL DEFAULT 1,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS key_indicators_user_id_idx ON key_indicators(user_id);
CREATE INDEX IF NOT EXISTS key_indicators_user_id_order_idx ON key_indicators(user_id, display_order);

-- Enable Row Level Security
ALTER TABLE key_indicators ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own indicators
CREATE POLICY "Users can view their own key indicators"
  ON key_indicators
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own indicators
CREATE POLICY "Users can insert their own key indicators"
  ON key_indicators
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own indicators
CREATE POLICY "Users can update their own key indicators"
  ON key_indicators
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own indicators
CREATE POLICY "Users can delete their own key indicators"
  ON key_indicators
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_key_indicators_updated_at
  BEFORE UPDATE ON key_indicators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
