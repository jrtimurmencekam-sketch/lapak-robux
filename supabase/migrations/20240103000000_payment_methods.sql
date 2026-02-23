-- Epic 8: Payment Methods Management

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('qris', 'transfer')),
  label TEXT NOT NULL,                    -- e.g. "QRIS", "BCA", "Mandiri"
  account_name TEXT,                      -- Nama pemilik rekening
  account_number TEXT,                    -- Nomor rekening (NULL untuk QRIS)
  qris_image_url TEXT,                    -- URL gambar QRIS (NULL untuk transfer)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Everyone can view active payment methods
CREATE POLICY "Active payment methods are viewable by everyone" 
  ON public.payment_methods FOR SELECT USING (true);

-- Admin CRUD policies
CREATE POLICY "Anyone can insert payment methods" 
  ON public.payment_methods FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update payment methods" 
  ON public.payment_methods FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete payment methods" 
  ON public.payment_methods FOR DELETE USING (true);
