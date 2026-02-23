-- Buat tabel site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert nilai default untuk WhatsApp Admin
INSERT INTO site_settings (key, value, description) 
VALUES ('whatsapp_number', '6281234567890', 'Nomor WhatsApp Admin untuk tombol floating chat (Gunakan format 62...)')
ON CONFLICT (key) DO NOTHING;

-- Aktifkan RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy (Semua orang bisa baca, hanya Anon/Authenticated default yang bisa update dari Admin Panel)
CREATE POLICY "Public can read site settings" 
ON site_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" 
ON site_settings FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert site settings" 
ON site_settings FOR INSERT WITH CHECK (true);
