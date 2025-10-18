# Supabase Setup Instructions

This guide will help you set up Supabase for user profile persistence and approval status tracking.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: `aidesk-space` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose the closest to your users
4. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Project API Key (anon/public)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create Database Tables

In your Supabase dashboard, go to SQL Editor and run this SQL:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  payment_details JSONB DEFAULT '{}',
  onboarding_progress JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'under_review')),
  approval_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_approval_status ON user_profiles(approval_status);
CREATE INDEX idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 5. Set Up Authentication (Optional)

If you want to use Supabase Auth instead of Firebase:

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your preferred providers (Email, Google, etc.)
3. Update your AuthContext to use Supabase Auth

## 6. Test the Setup

1. Restart your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. Try completing the onboarding process to test data persistence

## 7. Admin Panel (Optional)

For managing user approvals, you can:

1. Go to Table Editor in your Supabase dashboard
2. View the `user_profiles` table
3. Update `approval_status` and `approval_notes` as needed
4. Or create a custom admin interface using Supabase

## Troubleshooting

- **Connection errors**: Verify your environment variables are correct
- **RLS errors**: Make sure you're authenticated when testing
- **Permission errors**: Check that your RLS policies are set up correctly

## Next Steps

After setup, the application will:
- Save user onboarding data to Supabase
- Display profile information in the dashboard
- Show approval status and notes
- Allow profile updates and management
