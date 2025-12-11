-- Migration: Add Founder Number and Backfill
-- File: supabase/migrations/20251211_add_founder_info.sql

-- 1. Add columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS founder_number BIGINT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Create Sequence
CREATE SEQUENCE IF NOT EXISTS profiles_founder_number_seq START 1;

-- 3. Backfill Logic
DO $$
BEGIN
    -- Try to sync created_at from auth.users if possible
    -- This block attempts to update profiles.created_at to match auth.users.created_at
    -- ensuring the order is historically accurate.
    BEGIN
        UPDATE public.profiles p
        SET created_at = u.created_at
        FROM auth.users u
        WHERE p.id = u.id;
    EXCEPTION WHEN OTHERS THEN
        -- If query fails (e.g. permissions), ignore and use existing profiles order (which might be random if created_at is all NOW())
        RAISE NOTICE 'Could not access auth.users for date sync, proceeding with current data.';
    END;

    -- Backfill founder_number for existing rows that are null
    -- We order by created_at.
    WITH ordered_profiles AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
        FROM public.profiles
        WHERE founder_number IS NULL
    )
    UPDATE public.profiles p
    SET founder_number = op.rn,
        is_founder = (op.rn <= 500)
    FROM ordered_profiles op
    WHERE p.id = op.id;

    -- Update sequence to start after the max number
    PERFORM setval('profiles_founder_number_seq', COALESCE((SELECT MAX(founder_number) FROM public.profiles), 0) + 1);
END $$;

-- 4. Set Default for new inserts
ALTER TABLE profiles ALTER COLUMN founder_number SET DEFAULT nextval('profiles_founder_number_seq');

-- 5. Trigger to set is_founder Status automatically for new users
CREATE OR REPLACE FUNCTION public.set_founder_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.founder_number <= 500 THEN
    NEW.is_founder := TRUE;
  ELSE
    NEW.is_founder := FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_set_founder_status ON profiles;
CREATE TRIGGER tr_set_founder_status
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_founder_status();

