-- ============================================================
-- Targeted Supabase Migration from backup: db_cluster-03-11-2025@04-37-36.backup
-- Run this against your NEW Supabase project via psql
-- ============================================================

-- 1. PUBLIC SCHEMA: function
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

-- 2. PUBLIC SCHEMA: user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    avatar text,
    phone text,
    location text,
    bio text,
    skills text[] DEFAULT '{}'::text[],
    availability jsonb DEFAULT '{}'::jsonb,
    payment_details jsonb DEFAULT '{}'::jsonb,
    onboarding_progress jsonb DEFAULT '{}'::jsonb,
    onboarding_completed boolean DEFAULT false,
    approval_status text DEFAULT 'pending'::text,
    approval_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_profiles_approval_status_check CHECK ((approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'under_review'::text])))
);
ALTER TABLE public.user_profiles OWNER TO postgres;

-- Primary key
DO $$ BEGIN
  ALTER TABLE ONLY public.user_profiles ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- Unique constraint
DO $$ BEGIN
  ALTER TABLE ONLY public.user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_status ON public.user_profiles USING btree (approval_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON public.user_profiles USING btree (onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles USING btree (user_id);

-- Trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = (user_id)::uuid));

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE TO authenticated USING ((auth.uid() = (user_id)::uuid));

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT TO authenticated USING ((auth.uid() = (user_id)::uuid));

-- Table grants
GRANT ALL ON TABLE public.user_profiles TO anon;
GRANT ALL ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.user_profiles TO service_role;

-- 3. AUTH USERS DATA (restores existing user accounts)
-- Note: Inserting directly into auth.users requires postgres superuser access via direct DB connection
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous)
VALUES
('00000000-0000-0000-0000-000000000000', '7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523', 'authenticated', 'authenticated', 'emmanuelsharp819@gmail.com', '$2a$10$zoy1baxzDyOA.TXNeouY/OHrT6sfn2VwbwZA7fMJb3ikdQ3NPnFT.', '2025-10-24 17:54:03.927564+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-24 18:19:48.606876+00', '{"provider": "email", "providers": ["email", "google"]}', '{"iss": "https://accounts.google.com", "sub": "113378813187045243819", "name": "Emmanuel Sharp", "email": "emmanuelsharp819@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKbaena68Fy3DRGEYZhvTsGL5nMMfh9uZp8PpWIRZiNHiPNxQ=s96-c", "full_name": "Emmanuel Sharp", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKbaena68Fy3DRGEYZhvTsGL5nMMfh9uZp8PpWIRZiNHiPNxQ=s96-c", "provider_id": "113378813187045243819", "email_verified": true, "phone_verified": false}', NULL, '2025-10-24 17:54:03.856726+00', '2025-10-27 19:33:56.858677+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
('00000000-0000-0000-0000-000000000000', '93460872-d872-497a-bc65-f70d30fa951b', 'authenticated', 'authenticated', 'akisolve@gmail.com', NULL, '2025-10-23 10:42:53.719837+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-23 12:57:45.068915+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "116448800775313439144", "name": "Aki solution", "email": "akisolve@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLTfbzVtz57RCaKyjw-ck5cmax2OL4cv868twNUD6v2EB-jYw=s96-c", "full_name": "Aki solution", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLTfbzVtz57RCaKyjw-ck5cmax2OL4cv868twNUD6v2EB-jYw=s96-c", "provider_id": "116448800775313439144", "email_verified": true, "phone_verified": false}', NULL, '2025-10-23 10:42:53.710768+00', '2025-10-25 14:08:24.03673+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
('00000000-0000-0000-0000-000000000000', 'fcf5a4eb-199b-4af3-8f75-4419e533b35b', 'authenticated', 'authenticated', 'briancheruiyot00@gmail.com', '$2a$10$kxSC14BrJc6KzJdGhM/1Se6tIHEJTLDmNDcTRMUFk4YQvo3rL6HWO', '2025-10-23 10:19:13.155737+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-26 11:22:52.082071+00', '{"provider": "email", "providers": ["email", "google"]}', '{"iss": "https://accounts.google.com", "sub": "100012345811574941147", "name": "Brian Cheruiyot", "email": "briancheruiyot00@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKOW6YNk6wnwB8leAnrwW3t5X_lzj_XOUqU6cR84wNR2jie2LBM=s96-c", "full_name": "Brian Cheruiyot", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKOW6YNk6wnwB8leAnrwW3t5X_lzj_XOUqU6cR84wNR2jie2LBM=s96-c", "provider_id": "100012345811574941147", "email_verified": true, "phone_verified": false}', NULL, '2025-10-23 10:19:13.124035+00', '2025-10-26 16:37:27.91578+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
('00000000-0000-0000-0000-000000000000', 'af10e325-4fd8-4597-a5c6-4706ff5d977b', 'authenticated', 'authenticated', 'info@kenyabynumbers.com', '$2a$10$9ADkyhoikkoZDmQZcsijMeAjEQ8Rz0wphURoyigx48TYF/MQHVuLK', '2025-10-26 10:57:50.870111+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-26 17:13:39.932774+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "af10e325-4fd8-4597-a5c6-4706ff5d977b", "email": "info@kenyabynumbers.com", "email_verified": true, "phone_verified": false}', NULL, '2025-10-26 10:57:50.856691+00', '2025-10-27 02:24:27.608908+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
('00000000-0000-0000-0000-000000000000', 'c1964512-e1c3-4ec7-9747-daeb2e0b70e7', 'authenticated', 'authenticated', 'wambulapatience@gmail.com', '$2a$10$YJ6nBIhUWAwiqmEpG0pVL.UuWX26HAAZTA1OUYC/YY67izo9JX36i', '2025-10-26 19:05:08.181712+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-26 19:05:08.204224+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c1964512-e1c3-4ec7-9747-daeb2e0b70e7", "email": "wambulapatience@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-10-26 19:05:08.071592+00', '2025-10-27 09:44:47.786855+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false)
ON CONFLICT (id) DO NOTHING;

-- 4. AUTH IDENTITIES DATA
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id)
VALUES
('fcf5a4eb-199b-4af3-8f75-4419e533b35b', 'fcf5a4eb-199b-4af3-8f75-4419e533b35b', '{"sub": "fcf5a4eb-199b-4af3-8f75-4419e533b35b", "email": "briancheruiyot00@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-23 10:19:13.139745+00', '2025-10-23 10:19:13.139801+00', '2025-10-23 10:19:13.139801+00', '575dcb2b-635d-4ff0-a32f-ac12cf722d5b'),
('113378813187045243819', '7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523', '{"iss": "https://accounts.google.com", "sub": "113378813187045243819", "name": "Emmanuel Sharp", "email": "emmanuelsharp819@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKbaena68Fy3DRGEYZhvTsGL5nMMfh9uZp8PpWIRZiNHiPNxQ=s96-c", "full_name": "Emmanuel Sharp", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKbaena68Fy3DRGEYZhvTsGL5nMMfh9uZp8PpWIRZiNHiPNxQ=s96-c", "provider_id": "113378813187045243819", "email_verified": true, "phone_verified": false}', 'google', '2025-10-24 17:55:21.483117+00', '2025-10-24 17:55:21.483162+00', '2025-10-24 18:19:48.583659+00', '2f2bd037-bf92-4e41-a08c-682c11fd6d53'),
('100012345811574941147', 'fcf5a4eb-199b-4af3-8f75-4419e533b35b', '{"iss": "https://accounts.google.com", "sub": "100012345811574941147", "name": "Brian Cheruiyot", "email": "briancheruiyot00@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKOW6YNk6wnwB8leAnrwW3t5X_lzj_XOUqU6cR84wNR2jie2LBM=s96-c", "full_name": "Brian Cheruiyot", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKOW6YNk6wnwB8leAnrwW3t5X_lzj_XOUqU6cR84wNR2jie2LBM=s96-c", "provider_id": "100012345811574941147", "email_verified": true, "phone_verified": false}', 'google', '2025-10-23 10:41:14.694324+00', '2025-10-23 10:41:14.694383+00', '2025-10-26 11:19:03.699853+00', 'c3049e8d-82b8-4e83-a259-3ea2a7a72244'),
('c1964512-e1c3-4ec7-9747-daeb2e0b70e7', 'c1964512-e1c3-4ec7-9747-daeb2e0b70e7', '{"sub": "c1964512-e1c3-4ec7-9747-daeb2e0b70e7", "email": "wambulapatience@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-26 19:05:08.138599+00', '2025-10-26 19:05:08.139156+00', '2025-10-26 19:05:08.139156+00', '7bb76c98-3161-497e-8668-b58f197b2f65'),
('116448800775313439144', '93460872-d872-497a-bc65-f70d30fa951b', '{"iss": "https://accounts.google.com", "sub": "116448800775313439144", "name": "Aki solution", "email": "akisolve@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocLTfbzVtz57RCaKyjw-ck5cmax2OL4cv868twNUD6v2EB-jYw=s96-c", "full_name": "Aki solution", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocLTfbzVtz57RCaKyjw-ck5cmax2OL4cv868twNUD6v2EB-jYw=s96-c", "provider_id": "116448800775313439144", "email_verified": true, "phone_verified": false}', 'google', '2025-10-23 10:42:53.716098+00', '2025-10-23 10:42:53.716147+00', '2025-10-23 12:57:45.063976+00', 'f067c50f-7234-45b9-a760-4bbf7590b610'),
('7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523', '7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523', '{"sub": "7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523", "email": "emmanuelsharp819@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-24 17:54:03.909092+00', '2025-10-24 17:54:03.909153+00', '2025-10-24 17:54:03.909153+00', '1609f94a-093a-4ca6-bad2-1fae45f8e740'),
('af10e325-4fd8-4597-a5c6-4706ff5d977b', 'af10e325-4fd8-4597-a5c6-4706ff5d977b', '{"sub": "af10e325-4fd8-4597-a5c6-4706ff5d977b", "email": "info@kenyabynumbers.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-26 10:57:50.867456+00', '2025-10-26 10:57:50.867503+00', '2025-10-26 10:57:50.867503+00', '49b3e915-f857-4c3b-9443-34bd5c060db6')
ON CONFLICT (id) DO NOTHING;

-- 5. PUBLIC USER_PROFILES DATA
INSERT INTO public.user_profiles (id, user_id, name, email, avatar, phone, location, bio, skills, availability, payment_details, onboarding_progress, onboarding_completed, approval_status, approval_notes, created_at, updated_at)
VALUES
('dce32659-d607-4ca5-bfa7-fdcd6f995d8a', '7e23df3f-b5a2-4ef4-a289-b1a5b6a1a523', 'emmanuelsharp819', 'emmanuelsharp819@gmail.com', NULL, NULL, NULL, NULL, '{}', '{"timezone": "", "hours_per_week": 0, "preferred_schedule": ""}', '{"method": "paypal"}', '{"payment": true}', false, 'pending', NULL, '2025-10-24 17:54:05.397175+00', '2025-10-27 19:35:15.067204+00'),
('9a134c28-6084-4bfc-9175-04cf30f77f5e', 'fcf5a4eb-199b-4af3-8f75-4419e533b35b', 'briancheruiyot00', 'briancheruiyot00@gmail.com', NULL, 'KERICHO', 'KERICHO', NULL, '{python}', '{"timezone": "Africa/Nairobi", "hours_per_week": 2, "preferred_schedule": "2"}', '{"method": "paypal", "card_cvv": "", "card_expiry": "", "card_number": "", "paypal_email": "akisolve@gmail.com", "card_holder_name": "", "bank_account_name": "Brian Cheruiyot", "bank_account_number": "1313424425", "bank_routing_number": "111212313231"}', '{"personal_info": true}', true, 'pending', NULL, '2025-10-23 10:19:14.584752+00', '2025-10-26 11:23:00.60654+00'),
('8bdc3110-9b9f-4226-b4f6-d6a2af116f3e', 'af10e325-4fd8-4597-a5c6-4706ff5d977b', 'info', 'info@kenyabynumbers.com', NULL, NULL, NULL, NULL, '{}', '{"timezone": "", "hours_per_week": 0, "preferred_schedule": ""}', '{"method": "paypal"}', '{"availability": true}', false, 'pending', NULL, '2025-10-26 10:57:51.761667+00', '2025-10-26 17:17:14.743747+00'),
('1589babc-bd6c-46ab-89fe-c5f6b3d021b1', '93460872-d872-497a-bc65-f70d30fa951b', 'Aki solution', 'akisolve@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLTfbzVtz57RCaKyjw-ck5cmax2OL4cv868twNUD6v2EB-jYw=s96-c', NULL, NULL, NULL, '{}', '{"timezone": "", "hours_per_week": 0, "preferred_schedule": ""}', '{"method": "paypal"}', '{"availability": true}', false, 'pending', NULL, '2025-10-23 10:42:59.566783+00', '2025-10-25 14:08:47.419833+00'),
('df39ab0a-0383-4551-bce9-72afa0ac7a28', 'c1964512-e1c3-4ec7-9747-daeb2e0b70e7', 'wambulapatience', 'wambulapatience@gmail.com', NULL, NULL, NULL, NULL, '{}', '{"timezone": "", "hours_per_week": 0, "preferred_schedule": ""}', '{"method": "paypal"}', '{"availability": true}', false, 'pending', NULL, '2025-10-26 19:05:10.677636+00', '2025-10-27 09:55:51.612432+00')
ON CONFLICT (id) DO NOTHING;
