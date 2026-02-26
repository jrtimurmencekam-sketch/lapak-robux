-- =============================================
-- Migration: Add invoice-related columns to orders table
-- =============================================

-- Tambah kolom baru untuk halaman invoice
ALTER TABLE orders ADD COLUMN IF NOT EXISTS game_title text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS nominal_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method_id uuid;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_slug text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS nickname text;
