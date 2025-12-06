-- PigmentosTkts Database Schema (PostgreSQL/Supabase)

-- 1. Profiles (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'organizer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Events
create table public.events (
  id uuid default gen_random_uuid() primary key,
  organizer_id uuid references public.profiles(id),
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone,
  location_name text not null,
  location_address text,
  price_amount integer not null default 0, -- Stored in cents/lowest unit
  price_currency text default 'MXN',
  total_capacity integer not null,
  remaining_capacity integer not null,
  image_url text,
  status text default 'draft' check (status in ('draft', 'published', 'cancelled', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  total_amount integer not null,
  currency text default 'MXN',
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  payment_provider_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tickets (Individual entry passes)
create table public.tickets (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) not null,
  order_id uuid references public.orders(id) not null,
  owner_id uuid references public.profiles(id),
  qr_code text unique, -- Unique token for QR generation
  status text default 'valid' check (status in ('valid', 'used', 'cancelled')),
  used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Security)
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;

-- Policies would be defined here (e.g., Users can see published events, etc.)
