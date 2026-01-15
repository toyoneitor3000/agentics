-- Relax target_type constraint on notifications table to match comments table updates
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_target_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_target_type_check 
    CHECK (target_type IN ('project', 'gallery', 'marketplace', 'event', 'profile', 'post', 'lesson', 'video', 'cinema'));
