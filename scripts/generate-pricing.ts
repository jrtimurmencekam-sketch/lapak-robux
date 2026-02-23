import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env.local reader
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) envVars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabase = createClient(supabaseUrl, supabaseKey);

async function generatePricingTable() {
  console.log('Fetching active products and categories...');
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*, products(*)');

  if (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }

  let md = '# Daftar Harga Lapak Robux\n\n';
  md += '> *Harga dapat berubah sewaktu-waktu dan belum termasuk biaya layanan/admin fee payment gateway.*\n\n';
  md += '---\n\n';

  categories?.forEach(cat => {
    md += `## 🎮 Kategori: ${cat.name}\n\n`;
    
    const activeProducts = cat.products?.filter((p: any) => p.is_active) || [];
    
    if (activeProducts.length === 0) {
      md += '*Belum ada produk aktif di kategori ini.*\n\n';
      return;
    }

    activeProducts.forEach((p: any) => {
      md += `### ${p.title}\n\n`;
      md += `| Item / Nominal | Harga (Rp) |\n`;
      md += `|---|---|\n`;

      const nominals = typeof p.nominals === 'string' 
        ? JSON.parse(p.nominals) 
        : (p.nominals || []);

      const sortedNominals = [...nominals].sort((a, b) => a.price - b.price);

      sortedNominals.forEach(n => {
        md += `| ${n.name} | Rp ${n.price.toLocaleString('id-ID')} |\n`;
      });
      
      md += '\n';
    });
  });

  const outputPath = path.join(process.cwd(), 'harga-lapak-robux.md');
  fs.writeFileSync(outputPath, md, 'utf-8');
  console.log(`✅ File berhasil di-generate: ${outputPath}`);
}

generatePricingTable();
