-- ============================================
-- PayRequest Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create status enum
CREATE TYPE request_status AS ENUM ('pending', 'paid', 'declined', 'expired', 'cancelled');

-- 2. Create profiles table (synced from auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Create payment_requests table
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0 AND amount <= 1000000),
  currency TEXT NOT NULL DEFAULT 'USD',
  note TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  shareable_link UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  paid_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Indexes for performance
CREATE INDEX idx_payment_requests_sender_id ON payment_requests(sender_id);
CREATE INDEX idx_payment_requests_recipient_email ON payment_requests(recipient_email);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_expires_at ON payment_requests(expires_at);
CREATE INDEX idx_payment_requests_shareable_link ON payment_requests(shareable_link);

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
  BEFORE UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 7. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own requests"
  ON payment_requests FOR SELECT
  USING (
    sender_id = auth.uid()
    OR recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create requests"
  ON payment_requests FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update involved requests"
  ON payment_requests FOR UPDATE
  USING (
    sender_id = auth.uid()
    OR recipient_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Anyone can view via shareable link"
  ON payment_requests FOR SELECT USING (true);
