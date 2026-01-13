-- Migration: Migrate Legacy Supabase Auth Dependencies to BetterAuth (Text IDs)
-- Description: Unlinks tables from auth.users (UUID), drops blocking policies, and converts User IDs to TEXT.
--              Resilient to missing tables using DO blocks. Correct dependency order. Encapsulates orphan data handling.

-- 1. Disable RLS and Drop Policies (Helper Block)
DO $$
DECLARE
    t text;
    pol record;
    tables text[] := ARRAY[
        'profiles', 'projects', 'marketplace_items', 'forum_posts', 'comments', 
        'lesson_progress', 'gallery_albums', 'gallery_photos', 'likes', 'photo_likes', 'follows', 'notifications',
        'enrollments', 'events'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            -- Disable RLS first
            EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
            
            -- Drop all policies to free up column dependencies (and potential policy dependencies on auth.uid())
            FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = t LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, t);
            END LOOP;
        END IF;
    END LOOP;
END $$;


-- 2. Drop Foreign Keys on ALL tables (Child tables first, then profiles)
DO $$
BEGIN
    -- Drop Child Table Constraints naming referencing profiles or auth.users
    
    -- PROJECTS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_id_fkey;
    END IF;
    -- EVENTS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
        ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
    END IF;
    -- MARKETPLACE
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplace_items') THEN
        ALTER TABLE marketplace_items DROP CONSTRAINT IF EXISTS marketplace_items_user_id_fkey;
    END IF;
    -- FORUM
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_posts') THEN
        ALTER TABLE forum_posts DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;
    END IF;
    -- COMMENTS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
    END IF;
    -- LESSONS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lesson_progress') THEN
        ALTER TABLE lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_user_id_fkey;
    END IF;
    -- ENROLLMENTS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments') THEN
        ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;
    END IF;
    -- GALLERY
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_albums') THEN
        ALTER TABLE gallery_albums DROP CONSTRAINT IF EXISTS gallery_albums_user_id_fkey;
    END IF;
    -- LIKES
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'likes') THEN
        ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
    END IF;
    -- PHOTO LIKES
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'photo_likes') THEN
        ALTER TABLE photo_likes DROP CONSTRAINT IF EXISTS photo_likes_user_id_fkey;
    END IF;
    -- NOTIFICATIONS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_recipient_id_fkey;
        ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_actor_id_fkey;
    END IF;
    -- FOLLOWS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_follower_id_fkey;
        ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_following_id_fkey;
    END IF;

    -- Drop Profiles Constraint (referencing auth.users)
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

END $$;


-- 3. Alter Columns to TEXT
-- Profiles
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Child Tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        ALTER TABLE projects ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
        ALTER TABLE events ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplace_items') THEN
        ALTER TABLE marketplace_items ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_posts') THEN
        ALTER TABLE forum_posts ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        ALTER TABLE comments ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lesson_progress') THEN
        ALTER TABLE lesson_progress ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments') THEN
        ALTER TABLE enrollments ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_albums') THEN
        ALTER TABLE gallery_albums ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'likes') THEN
        ALTER TABLE likes ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'photo_likes') THEN
        ALTER TABLE photo_likes ALTER COLUMN user_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        ALTER TABLE notifications ALTER COLUMN recipient_id TYPE TEXT, ALTER COLUMN actor_id TYPE TEXT;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        -- Alter both columns in one go to satisfy CHECK constraints comparing them
        ALTER TABLE follows ALTER COLUMN follower_id TYPE TEXT, ALTER COLUMN following_id TYPE TEXT;
    END IF;
END $$;


-- 3.5. Ensure Data Consistency (Backfill 'user' table to support existing profiles)
-- This is critical for the FK constraint to succeed.
DO $$
BEGIN
    -- Try to copy from auth.users if accessible (Best effort)
    BEGIN
        INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
        SELECT 
            au.id::text, 
            COALESCE(au.raw_user_meta_data->>'full_name', 'Migrated User'), 
            au.email, 
            (au.email_confirmed_at IS NOT NULL), 
            au.created_at, 
            au.created_at
        FROM auth.users au
        WHERE au.id::text IN (SELECT id FROM profiles) -- Only migrate if profile exists
        ON CONFLICT ("id") DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not access auth.users, will use placeholder data for existing profiles.';
    END;

    -- If still missing (orphans), insert placeholders to satisfy FK
    INSERT INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
    SELECT 
        p.id, 
        COALESCE(p.full_name, 'Legacy User'), 
        COALESCE(p.email, 'legacy_' || substr(md5(random()::text), 1, 6) || '@speedlight.com'), 
        true, 
        now(), 
        now()
    FROM profiles p
    WHERE p.id NOT IN (SELECT id FROM "user")
    ON CONFLICT ("id") DO NOTHING;
END $$;


-- 4. Re-establish Tables Links
-- Link profiles to BetterAuth user
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES "user"(id) ON DELETE CASCADE;


-- Link Child Tables to profiles(id)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events') THEN
        ALTER TABLE events ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplace_items') THEN
        ALTER TABLE marketplace_items ADD CONSTRAINT marketplace_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forum_posts') THEN
        ALTER TABLE forum_posts ADD CONSTRAINT forum_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments') THEN
        ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lesson_progress') THEN
        ALTER TABLE lesson_progress ADD CONSTRAINT lesson_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments') THEN
        ALTER TABLE enrollments ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_albums') THEN
        ALTER TABLE gallery_albums ADD CONSTRAINT gallery_albums_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'likes') THEN
        ALTER TABLE likes ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'photo_likes') THEN
        ALTER TABLE photo_likes ADD CONSTRAINT photo_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE;
        ALTER TABLE notifications ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        ALTER TABLE follows ADD CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE;
        ALTER TABLE follows ADD CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;


-- 5. Update Helper Functions
DROP FUNCTION IF EXISTS add_xp(uuid, int);
CREATE OR REPLACE FUNCTION add_xp(user_uuid TEXT, xp_amount int)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET xp = xp + xp_amount,
      level = floor((xp + xp_amount) / 1000) + 1
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Trigger to Auto-Create Profile from BetterAuth User
CREATE OR REPLACE FUNCTION public.handle_better_auth_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, username, created_at)
  VALUES (
    NEW.id,
    NEW.name,
    NEW.email,
    NEW.image,
    COALESCE(
        split_part(NEW.email, '@', 1), 
        'racer_' || substr(md5(random()::text), 1, 6)
    ),
    NEW."createdAt"
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_better_auth_user_created ON "user";
CREATE TRIGGER on_better_auth_user_created
  AFTER INSERT ON "user"
  FOR EACH ROW EXECUTE PROCEDURE public.handle_better_auth_new_user();


-- 7. Fix Notifications Trigger (Follows)
CREATE OR REPLACE FUNCTION notify_new_follow() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (recipient_id, actor_id, type, target_id, target_type, message)
    VALUES (
        NEW.following_id,
        NEW.follower_id,
        'follow',
        NEW.follower_id, 
        'profile',
        'te ha empezado a seguir.'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'follows') THEN
        DROP TRIGGER IF EXISTS on_new_follow ON follows;
        CREATE TRIGGER on_new_follow
            AFTER INSERT ON follows
            FOR EACH ROW EXECUTE FUNCTION notify_new_follow();
    END IF;
END $$;
