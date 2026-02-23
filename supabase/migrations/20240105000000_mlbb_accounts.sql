-- Create mlbb_accounts table for the Account Marketplace
CREATE TABLE IF NOT EXISTS public.mlbb_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    rank TEXT,
    winrate TEXT,
    hero_count INTEGER DEFAULT 0,
    skin_count INTEGER DEFAULT 0,
    legend_skins INTEGER DEFAULT 0,
    collector_skins INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    cover_image_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    whatsapp_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.mlbb_accounts ENABLE ROW LEVEL SECURITY;

-- Public can view available accounts
CREATE POLICY "Anyone can view mlbb accounts"
    ON public.mlbb_accounts FOR SELECT
    USING (true);

-- Admin CRUD policies
CREATE POLICY "Anyone can insert mlbb accounts"
    ON public.mlbb_accounts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update mlbb accounts"
    ON public.mlbb_accounts FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Anyone can delete mlbb accounts"
    ON public.mlbb_accounts FOR DELETE
    USING (true);
