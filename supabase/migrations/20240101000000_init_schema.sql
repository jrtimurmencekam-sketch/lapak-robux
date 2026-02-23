-- Epic 2: Database Schema & Auth Setup

-- Create Users/Profiles extension table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin', 'reseller')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, Admins can read all.
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);


-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  game_id_type TEXT NOT NULL, -- e.g., 'ID & Server', 'Player ID'
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);


-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Null if guest
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  game_id_input JSONB NOT NULL, -- e.g., {"playerId": "123", "zoneId": "456"}
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Everyone can create orders (Guests allowed)
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
-- Users can read their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
-- Note: Admin policies need to be added using a helper function or via explicit check.


-- Set up Storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment_proofs', 'payment_proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anyone can upload a receipt (public/guests)
CREATE POLICY "Anyone can upload payment proof" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment_proofs');

-- Storage RLS: Only authenticated users can view proofs (You could restrict this further to just admins later)
CREATE POLICY "Authenticated users can select payment proof" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'payment_proofs' AND auth.role() = 'authenticated');
