-- 1. Project Likes
CREATE TABLE IF NOT EXISTS project_likes (
  user_id uuid REFERENCES auth.users NOT NULL,
  project_id uuid REFERENCES projects NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, project_id)
);

-- 2. Project Comments & Ratings
CREATE TABLE IF NOT EXISTS project_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

-- 3. Gift System
CREATE TABLE IF NOT EXISTS gift_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  price integer NOT NULL, -- Value in 'Credits' or Pesos
  icon text NOT NULL -- Emoji or Icon name
);

-- Seed basic gifts
INSERT INTO gift_types (id, name, price, icon) VALUES
('bujia', 'Bujía', 100, '⚡'),
('aceite', 'Cuarto de Aceite', 200, '🛢️'),
('filtro', 'Filtro de Aire', 500, '💨'),
('llanta', 'Llanta Nueva', 2000, '🍩'),
('nitro', 'Tanque Nitro', 5000, '🚀'),
('turbo', 'Kit Turbo', 10000, '🐌')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS project_gifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects NOT NULL,
  sender_id uuid REFERENCES auth.users NOT NULL,
  gift_id text REFERENCES gift_types(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gifts ENABLE ROW LEVEL SECURITY;

-- Policies (Open for now for dev speed, assume public read, auth insert)
CREATE POLICY "Public read likes" ON project_likes FOR SELECT USING (true);
CREATE POLICY "Auth insert likes" ON project_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON project_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read comments" ON project_comments FOR SELECT USING (true);
CREATE POLICY "Auth insert comments" ON project_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read gifts" ON project_gifts FOR SELECT USING (true);
CREATE POLICY "Auth insert gifts" ON project_gifts FOR INSERT WITH CHECK (auth.uid() = sender_id);
