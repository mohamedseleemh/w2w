CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  timezone TEXT,

  -- Security Settings
  two_factor_enabled BOOLEAN DEFAULT false,
  login_notifications BOOLEAN DEFAULT true,
  session_timeout_minutes INT DEFAULT 1440,

  -- Preferences
  language VARCHAR(2) DEFAULT 'ar',
  theme VARCHAR(10) DEFAULT 'auto',
  dashboard_layout VARCHAR(20) DEFAULT 'grid',
  items_per_page INT DEFAULT 20,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for admin_profiles
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can see their own profile
CREATE POLICY "Admins can view their own profile"
ON admin_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can update their own profile
CREATE POLICY "Admins can update their own profile"
ON admin_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to handle profile updates and set updated_at
CREATE OR REPLACE FUNCTION handle_admin_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER on_admin_profile_update
BEFORE UPDATE ON admin_profiles
FOR EACH ROW
EXECUTE PROCEDURE handle_admin_profile_update();
