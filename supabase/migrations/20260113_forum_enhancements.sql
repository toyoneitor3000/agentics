-- Migración para agregar columnas faltantes al foro
-- Ejecutar: npx supabase db push (o manualmente en el dashboard de Supabase)

-- Agregar columna is_pinned para fijar posts importantes
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;

-- Agregar columna views_count para conteo de vistas
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned ON forum_posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);

-- Índice para comentarios del foro
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);

-- Política de actualización para autores de posts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'forum_posts' AND policyname = 'Users update own posts'
    ) THEN
        CREATE POLICY "Users update own posts" ON forum_posts 
        FOR UPDATE USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Política de eliminación para autores de posts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'forum_posts' AND policyname = 'Users delete own posts'
    ) THEN
        CREATE POLICY "Users delete own posts" ON forum_posts 
        FOR DELETE USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Permitir a admins actualizar is_pinned (actualizar cualquier post)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'forum_posts' AND policyname = 'Admins update any post'
    ) THEN
        CREATE POLICY "Admins update any post" ON forum_posts 
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid()::text 
                AND profiles.role IN ('CEO', 'ADMIN')
            )
        );
    END IF;
END $$;
