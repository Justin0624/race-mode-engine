# Auth Setup Guide

## Overview

Race Mode Engine uses [Supabase Auth](https://supabase.com/auth) for authentication. Users can sign in with Google, Apple, or Facebook — no passwords to manage.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is fine)
2. Click "New Project"
3. Choose a name, password, and region
4. Once created, go to **Settings > API**
5. Copy your:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
6. Paste these into `.env.local`

## Step 2: Set Up OAuth Providers

Go to **Authentication > Providers** in your Supabase dashboard.

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use existing)
3. Go to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Choose "Web application"
6. Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**
8. In Supabase: Enable Google provider, paste Client ID and Secret

### Apple

1. Go to [Apple Developer](https://developer.apple.com/) (requires $99/year membership)
2. Create an App ID with "Sign In with Apple" capability
3. Create a Services ID (this is your Client ID)
4. Add your Supabase callback URL as a redirect: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
5. Create a Key for Sign In with Apple
6. In Supabase: Enable Apple provider with your Service ID, Team ID, and Key

### Facebook

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app (Consumer type)
3. Add Facebook Login product
4. In Settings > Basic, get your **App ID** and **App Secret**
5. Add valid OAuth redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
6. In Supabase: Enable Facebook provider with App ID and Secret

## Step 3: Configure Redirect URLs

In Supabase **Authentication > URL Configuration**:

- **Site URL**: `http://localhost:5173` (for dev) or your production URL
- **Redirect URLs**: Add both:
  - `http://localhost:5173/coach`
  - `https://your-production-url.com/coach`

## Step 4: Database Tables (Future)

When we add setup saving, we'll need these tables. Run this SQL in the Supabase SQL editor:

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's cars
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  model TEXT NOT NULL, -- 'b7', 'b84', 't7'
  name TEXT, -- user's nickname for this car
  setup JSONB NOT NULL DEFAULT '{}', -- current setup snapshot
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Race sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  track TEXT NOT NULL,
  conditions JSONB DEFAULT '{}',
  starting_setup JSONB NOT NULL,
  ending_setup JSONB NOT NULL,
  changes JSONB DEFAULT '[]', -- array of {symptom, recommendation, change, result}
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track profiles (shared data)
CREATE TABLE tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  surface TEXT, -- 'ozite', 'crc_black', 'astroturf', etc.
  grip_level TEXT, -- baseline grip
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own cars" ON cars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cars" ON cars FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view tracks" ON tracks FOR SELECT TO authenticated USING (true);
```

## Testing

After setup, run `npm run dev` and navigate to `http://localhost:5173`. You should see the login page with Google/Apple/Facebook buttons. Clicking one will redirect to the provider's login flow and back to the app.

The "Skip for now" option lets users try the coach without signing in — they just can't save their setups.
