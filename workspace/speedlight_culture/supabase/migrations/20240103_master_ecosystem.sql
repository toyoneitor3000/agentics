-- ==============================================================================
-- SPEEDLIGHT ECOSYSTEM MASTER MIGRATION
-- Covers: Projects, Marketplace, Forum, Academy Lessons, Gamification
-- ==============================================================================

-- 1. CLASSIFIEDS / MARKETPLACE (Mercado de Piezas)
create table if not exists marketplace_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price decimal(12,2) not null,
  currency text default 'COP',
  condition text check (condition in ('Nuevo', 'Usado', 'Restaurado')),
  category text, -- e.g., 'Motor', 'Suspensión', 'Interior'
  images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()),
  status text default 'available' check (status in ('available', 'sold', 'hidden'))
);

alter table marketplace_items enable row level security;
create policy "Public view items" on marketplace_items for select using (status = 'available');
create policy "Users insert own items" on marketplace_items for insert with check (auth.uid() = user_id);
create policy "Users update own items" on marketplace_items for update using (auth.uid() = user_id);

-- 2. PROJECTS (Taller Digital)
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null, -- "Mi S13 Drift Build"
  description text,
  make text,         -- Brand (Nissan)
  model text,        -- Model (Silvia)
  year integer,
  specs jsonb,       -- { "turbo": "Garrett gt28", "ecu": "Haltech" }
  cover_image text,
  gallery_images text[], -- Array of URLs
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table projects enable row level security;
create policy "Public view projects" on projects for select using (true);
create policy "Users insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users update own projects" on projects for update using (auth.uid() = user_id);

-- 3. FORUM & COMMENTS (Comunidad)
create table if not exists forum_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  category text not null, -- 'Mecánica', 'Off-Topic', 'Q&A'
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('project', 'post', 'lesson')),
  target_id uuid not null, -- Polymorphic relation (stores ID of project, post, or lesson)
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table forum_posts enable row level security;
alter table comments enable row level security;
create policy "Public view posts" on forum_posts for select using (true);
create policy "Users insert posts" on forum_posts for insert with check (auth.uid() = user_id);
create policy "Public view comments" on comments for select using (true);
create policy "Users insert comments" on comments for insert with check (auth.uid() = user_id);

-- 4. ACADEMY EXTENSIONS (Salón de Clases)
-- Lessons table linked to a course slug (since courses are hardcoded for now, we map by slug)
create table if not exists lessons (
  id uuid default gen_random_uuid() primary key,
  course_slug text not null, -- Links to hardcoded course list
  title text not null,
  description text,
  video_url text not null, -- Mux / YouTube / Vimeo ID
  order_index integer not null,
  xp_reward integer default 100
);

-- Tracking progress per lesson
create table if not exists lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique(user_id, lesson_id)
);

alter table lessons enable row level security;
alter table lesson_progress enable row level security;
create policy "Public view lessons" on lessons for select using (true);
create policy "Users view own progress" on lesson_progress for select using (auth.uid() = user_id);
create policy "Users update own progress" on lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users modify own progress" on lesson_progress for update using (auth.uid() = user_id);


-- 5. GAMIFICATION LOGIC (Motor de XP)
-- Function to add XP
create or replace function add_xp(user_uuid uuid, xp_amount int)
returns void as $$
begin
  update profiles
  set xp = xp + xp_amount,
      -- Simple Level Formula: Level = (XP / 1000) + 1
      level = floor((xp + xp_amount) / 1000) + 1
  where id = user_uuid;
end;
$$ language plpgsql security definer;

-- Trigger: Give XP when a specific action happens (Example: Commenting)
create or replace function reward_comment_xp()
returns trigger as $$
begin
  perform add_xp(new.user_id, 20); -- 20 XP per comment
  return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_posted
  after insert on comments
  for each row execute procedure reward_comment_xp();
