-- Migration: Add missing columns and RLS policies for seeding

-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS nominals JSONB;

-- Add INSERT/UPDATE/DELETE policies for categories (admin operations)
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE USING (true);

-- Add INSERT/UPDATE/DELETE policies for products (admin operations)
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Allow public to see ALL products (both active and inactive, for admin panel)
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Allow admin to view and update ALL orders
CREATE POLICY "Anyone can view all orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
