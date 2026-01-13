-- Drop Policies first to allow column type change

-- project_likes
DROP POLICY IF EXISTS "Auth insert likes" ON project_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON project_likes;
DROP POLICY IF EXISTS "Users can unlike" ON project_likes;
DROP POLICY IF EXISTS "Public read likes" ON project_likes;
ALTER TABLE project_likes DROP CONSTRAINT IF EXISTS project_likes_user_id_fkey;
ALTER TABLE project_likes ALTER COLUMN user_id TYPE text;
-- Recreate (Note: DB connection bypasses RLS, but for completeness)
CREATE POLICY "Auth insert likes" ON project_likes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own likes" ON project_likes FOR DELETE USING (auth.uid()::text = user_id);
CREATE POLICY "Public read likes" ON project_likes FOR SELECT USING (true);

-- project_saves
DROP POLICY IF EXISTS "Auth insert saves" ON project_saves;
DROP POLICY IF EXISTS "Users can delete own saves" ON project_saves;
DROP POLICY IF EXISTS "Users can unsave" ON project_saves;
DROP POLICY IF EXISTS "Users can view own saves" ON project_saves;
ALTER TABLE project_saves DROP CONSTRAINT IF EXISTS project_saves_user_id_fkey;
ALTER TABLE project_saves ALTER COLUMN user_id TYPE text;
CREATE POLICY "Auth insert saves" ON project_saves FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own saves" ON project_saves FOR DELETE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can view own saves" ON project_saves FOR SELECT USING (auth.uid()::text = user_id);

-- project_shares
DROP POLICY IF EXISTS "Auth insert shares" ON project_shares;
ALTER TABLE project_shares DROP CONSTRAINT IF EXISTS project_shares_user_id_fkey;
ALTER TABLE project_shares ALTER COLUMN user_id TYPE text;
CREATE POLICY "Auth insert shares" ON project_shares FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- project_comments
DROP POLICY IF EXISTS "Auth insert comments" ON project_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON project_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON project_comments;
ALTER TABLE project_comments DROP CONSTRAINT IF EXISTS project_comments_user_id_fkey;
ALTER TABLE project_comments DROP CONSTRAINT IF EXISTS project_comments_user_id_profiles_fkey;
ALTER TABLE project_comments ALTER COLUMN user_id TYPE text;
CREATE POLICY "Auth insert comments" ON project_comments FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own comments" ON project_comments FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own comments" ON project_comments FOR DELETE USING (auth.uid()::text = user_id);

-- follows
-- Assuming no RLS on follows yet or I should create them. 
-- Just alter columns for now.
ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_follower_id_fkey;
ALTER TABLE follows DROP CONSTRAINT IF EXISTS follows_following_id_fkey;
ALTER TABLE follows ALTER COLUMN follower_id TYPE text;
ALTER TABLE follows ALTER COLUMN following_id TYPE text;
