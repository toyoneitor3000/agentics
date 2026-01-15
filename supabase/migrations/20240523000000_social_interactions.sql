-- Create Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, project_id),
    UNIQUE(user_id, album_id),
    UNIQUE(user_id, listing_id),
    CHECK (
        (project_id IS NOT NULL AND album_id IS NULL AND listing_id IS NULL) OR
        (project_id IS NULL AND album_id IS NOT NULL AND listing_id IS NULL) OR
        (project_id IS NULL AND album_id IS NULL AND listing_id IS NOT NULL)
    )
);

-- Show RLS Policies for Likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all likes"
    ON public.likes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own likes"
    ON public.likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
    ON public.likes FOR DELETE
    USING (auth.uid() = user_id);

-- Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    album_id UUID REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (
        (project_id IS NOT NULL AND album_id IS NULL AND listing_id IS NULL) OR
        (project_id IS NULL AND album_id IS NOT NULL AND listing_id IS NULL) OR
        (project_id IS NULL AND album_id IS NULL AND listing_id IS NOT NULL)
    )
);

-- Show RLS Policies for Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all comments"
    ON public.comments FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);
