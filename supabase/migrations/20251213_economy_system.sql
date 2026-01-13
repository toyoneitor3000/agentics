-- Protocolo de Economía y Reputación V1
-- Diseñado para Speedlight Culture (Escalabilidad Global + Latam)

-- 1. SISTEMA DE REPUTACIÓN (XP)
-- Tabla inmutable para registrar cada ganancia de XP.
-- Esto permite recalcular niveles si cambiamos la fórmula en el futuro.
CREATE TABLE IF NOT EXISTS public.xp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, -- Cantidad de XP ganada (puede ser negativo para penalizaciones)
    action_type TEXT NOT NULL, -- 'comment_upvoted', 'gift_received', 'post_featured', etc.
    source_id UUID, -- Referencia al ID del comentario, post o regalo que generó esto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice para calcular XP total rápido
CREATE INDEX IF NOT EXISTS idx_xp_logs_user ON public.xp_logs(user_id);

-- 2. ECONOMÍA: BILLETERA (Saldo Real)
-- Cada usuario tiene una wallet. Manejaremos saldo en 'cents' (enteros) para evitar errores de redondeo.
-- Ejemplo: 1000 = $10.00 USD (o la moneda base que definamos, por simplicidad interna se suele usar USD cents).
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    balance BIGINT DEFAULT 0 NOT NULL, -- Saldo disponible para gastar/retirar
    currency TEXT DEFAULT 'USD' NOT NULL, -- Por defecto USD para estandarizar
    is_frozen BOOLEAN DEFAULT FALSE, -- Para congelar cuentas sospechosas
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CATÁLOGO DE REGALOS (Store)
-- Los items que se pueden comprar y regalar.
CREATE TABLE IF NOT EXISTS public.gift_catalog (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- 'Turbo', 'Café', 'Motor V8'
    slug TEXT NOT NULL UNIQUE, -- 'turbo_boost'
    icon_url TEXT NOT NULL,
    price_cents INTEGER NOT NULL, -- Cuánto le cuesta al usuario (ej: 200 cents = $2.00)
    creator_revenue_cents INTEGER NOT NULL, -- Cuánto recibe el creador (ej: 120 cents = $1.20)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRANSACCIONES (The Ledger)
-- Historial inmutable de movimiento de dinero. NUNCA se borra.
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_wallet_id UUID REFERENCES public.wallets(id), -- Null si es una recarga del sistema
    receiver_wallet_id UUID REFERENCES public.wallets(id), -- Null si es un pago a la plataforma
    amount_cents INTEGER NOT NULL,
    transaction_type TEXT NOT NULL, -- 'deposit', 'gift_sent', 'withdrawal', 'platform_fee'
    gift_catalog_id UUID REFERENCES public.gift_catalog(id), -- Si fue un regalo
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}', -- Datos extra (referencia pasarela, id del post regalado)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- POLÍTICAS DE SEGURIDAD (RLS)
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_catalog ENABLE ROW LEVEL SECURITY;

-- Wallets: Uno solo puede ver su propia plata. Nadie más.
CREATE POLICY "Users can view own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Uno solo ve sus movimientos.
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (
        sender_wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()) OR
        receiver_wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
    );

-- Catalog: Todo el mundo puede ver qué comprar.
CREATE POLICY "Anyone can view active gifts" ON public.gift_catalog
    FOR SELECT USING (is_active = true);

-- Trigger automático: Crear wallet cuando se crea usuario (o on-demand)
-- (Podemos implementarlo luego o dejarlo bajo demanda para ahorrar filas a usuarios inactivos)

-- Datos Semilla (Seed Data) - Regalos Básicos
INSERT INTO public.gift_catalog (name, slug, icon_url, price_cents, creator_revenue_cents)
VALUES 
    ('Café de Taller', 'coffee_taller', '☕', 100, 60), -- $1.00 USD -> $0.60 Creator
    ('Octanaje Extra', 'octane_boost', '⛽', 500, 300), -- $5.00 USD -> $3.00 Creator
    ('Turbo Nuevo', 'new_turbo', '🐌', 2000, 1200), -- $20.00 USD -> $12.00 Creator
    ('Motor V8', 'v8_engine', '🦾', 10000, 7000) -- $100.00 USD -> $70.00 Creator (Mejor margen para items caros)
ON CONFLICT (slug) DO NOTHING;
