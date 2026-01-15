-- Set role to CEO for valid user
UPDATE profiles 
SET role = 'CEO' 
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'camilotoloza1136@gmail.com'
);
