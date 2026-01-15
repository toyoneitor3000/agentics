-- 1. Project Saves (Bookmarks)
CREATE TABLE IF NOT EXISTS project_saves (
  user_id uuid REFERENCES auth.users NOT NULL,
  project_id uuid REFERENCES projects NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, project_id)
);

-- 2. Project Shares (Log for counting)
CREATE TABLE IF NOT EXISTS project_shares (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects NOT NULL,
  user_id uuid REFERENCES auth.users, -- Nullable if shared by anon (if allowed) or just track logged users
  platform text, -- 'whatsapp', 'facebook', 'link', etc.
  created_at timestamptz DEFAULT now()
);

-- 3. Update Gift Types
-- First, clear existing to reset to the specific requested list
DELETE FROM gift_types;

INSERT INTO gift_types (id, name, price, icon) VALUES
('llanta', 'Llanta', 100, '🍩'),
('spray', 'Pintura', 150, '🎨'),
('filtro', 'Filtro', 200, '💨'),
('asiento', 'Asiento', 500, '💺'),
('motor', 'Motor', 1000, '⚙️'),
('turbo', 'Turbo', 2000, '🐌'),
('nitro', 'Nitro', 5000, '🚀')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    icon = EXCLUDED.icon;

-- 4. Enable RLS
ALTER TABLE project_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_shares ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read saves" ON project_saves FOR SELECT USING (true);
CREATE POLICY "Auth insert saves" ON project_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave" ON project_saves FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read shares" ON project_shares FOR SELECT USING (true);
CREATE POLICY "Public insert shares" ON project_shares FOR INSERT WITH CHECK (true); -- Allow anyone to log a share
