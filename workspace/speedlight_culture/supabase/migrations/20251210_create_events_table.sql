-- Create Events Table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  date_text text,
  time_text text,
  location text,
  description text,
  image text,
  type text default 'social',
  type_label text default 'Community Event',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table events enable row level security;

-- Policies
create policy "Public view events" on events for select using (true);
create policy "Users insert own events" on events for insert with check (auth.uid() = user_id);
create policy "Users update own events" on events for update using (auth.uid() = user_id);
create policy "Users delete own events" on events for delete using (auth.uid() = user_id);
