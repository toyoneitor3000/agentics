-- TABLAS PARA EL SISTEMA DE MENSAJERIA (MESSENGER)

-- 1. CONVERSACIONES
-- Almacena la relación entre usuarios. Para 1-a-1, esto verifica si ya existe un chat.
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message text,
  last_message_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PARTICIPANTES
-- Vincula usuarios con conversaciones.
create table if not exists conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (conversation_id, user_id)
);

-- 3. MENSAJES
-- El contenido real.
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  type text default 'text' check (type in ('text', 'image', 'product', 'voice', 'location')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone,
  metadata jsonb -- Para guardar datos extra como duración de audio, precio de producto, etc.
);

-- POLÍTICAS DE SEGURIDAD (RLS) - CRÍTICO PARA PRIVACIDAD

-- Habilitar RLS
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;

-- Policies for Conversations
create policy "Users can view conversations they are part of"
  on conversations for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_participants.conversation_id = conversations.id
      and conversation_participants.user_id = auth.uid()
    )
  );

-- Policies for Participants
create policy "Users can view participants of their conversations"
  on conversation_participants for select
  using (
    exists (
      select 1 from conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id
      and cp.user_id = auth.uid()
    )
  );

-- Policies for Messages
create policy "Users can view messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversation_participants
      where conversation_participants.conversation_id = messages.conversation_id
      and conversation_participants.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on messages for insert
  with check (
    exists (
      select 1 from conversation_participants
      where conversation_participants.conversation_id = messages.conversation_id
      and conversation_participants.user_id = auth.uid()
    )
  );
