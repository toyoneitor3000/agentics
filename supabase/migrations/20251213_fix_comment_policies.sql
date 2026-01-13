-- Add Update and Delete policies for project_comments
CREATE POLICY "Users can update own comments" ON project_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON project_comments FOR DELETE USING (auth.uid() = user_id);
