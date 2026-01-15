-- Migración para soportar Cuentas de Negocio y Conversión
-- Objetivo: Diferenciar usuarios estándar de empresas y permitir verificación.

-- 1. Actualizar tabla Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' CHECK (account_type IN ('personal', 'business')),
ADD COLUMN IF NOT EXISTS business_category TEXT, -- 'workshop', 'parts', 'media', 'dealer', etc.
ADD COLUMN IF NOT EXISTS is_verified_business BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tax_id TEXT; -- NIT / RUT (Opcional al inicio, requerido para verificación)

-- 2. Crear tabla de Solicitudes de Verificación (Para subir el RUT)
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    document_url TEXT NOT NULL, -- URL del RUT en Storage
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de Seguridad
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Solo el dueño puede ver su solicitud
CREATE POLICY "Users can view own verification requests" ON public.verification_requests
    FOR SELECT USING ((auth.uid())::text = user_id);

-- Solo el dueño puede crear solicitud
CREATE POLICY "Users can create verification requests" ON public.verification_requests
    FOR INSERT WITH CHECK ((auth.uid())::text = user_id);

-- Crear Bucket para Documentos Privados (RUTs no pueden ser públicos)
-- Nota: Esto se debe configurar en Supabase Storage manualmente o vía API si no existe,
-- pero definimos la intención aquí. El bucket debería llamarse 'private_documents'.
