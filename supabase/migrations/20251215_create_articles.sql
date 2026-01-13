-- Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'General',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Public articles are viewable by everyone') THEN
        CREATE POLICY "Public articles are viewable by everyone" ON articles
            FOR SELECT USING (published = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can create articles') THEN
        CREATE POLICY "Users can create articles" ON articles
            FOR INSERT WITH CHECK (auth.uid() = author_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can update their own articles') THEN
        CREATE POLICY "Users can update their own articles" ON articles
            FOR UPDATE USING (auth.uid() = author_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Users can delete their own articles') THEN
        CREATE POLICY "Users can delete their own articles" ON articles
            FOR DELETE USING (auth.uid() = author_id);
    END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles (slug);
CREATE INDEX IF NOT EXISTS articles_published_idx ON articles (published);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles (created_at DESC);
