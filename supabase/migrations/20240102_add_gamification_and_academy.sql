alter table profiles 
add column if not exists xp integer default 0,
add column if not exists level integer default 1,
add column if not exists role text default 'Rookie',
add column if not exists bio text,
add column if not exists location text,
add column if not exists background_url text;

-- Create table for user enrollments (Speedlight Academy)
create table if not exists enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  course_slug text not null,
  progress integer default 0,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()),
  completed boolean default false,
  unique(user_id, course_slug)
);

-- RLS for enrollments
alter table enrollments enable row level security;

create policy "Users can view their own enrollments" on enrollments
  for select using ((select auth.uid()) = user_id);

create policy "System can insert enrollments" on enrollments
  for insert with check ((select auth.uid()) = user_id);
