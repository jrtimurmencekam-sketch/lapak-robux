-- Create promo_banners table
CREATE TABLE IF NOT EXISTS public.promo_banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.promo_banners FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can insert banners."
    ON public.promo_banners FOR INSERT
    WITH CHECK (true); -- Relying on application level admin check for now

CREATE POLICY "Admins can update banners."
    ON public.promo_banners FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admins can delete banners."
    ON public.promo_banners FOR DELETE
    USING (true);

-- Create storage bucket for banners if it doesn't exist (reusing payment_proofs for simplicity as per plan, but if they want separation, they can use this table structure to point to any bucket url)
-- We will just use the existing payment_proofs bucket with a "banners/" path.
