-- Re-establish Foreign Keys for Notifications to ensure Supabase 'select(..., actor:actor_id(...))' works
-- We assume profiles.id is the primary key and is of type text (as verified).

-- 1. Actor FK
ALTER TABLE notifications 
ADD CONSTRAINT notifications_actor_id_fkey 
FOREIGN KEY (actor_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- 2. Recipient FK
ALTER TABLE notifications 
ADD CONSTRAINT notifications_recipient_id_fkey 
FOREIGN KEY (recipient_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;
