// Seed script to populate Supabase with categories and products
// Run with: npx tsx scripts/seed.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zgwlnyjbgkmbfnoaprtc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd2xueWpiZ2ttYmZub2FwcnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTUwNTIsImV4cCI6MjA4NzMzMTA1Mn0.TCT_l1Id6R605AmxhTd7yhG4Yp2RoxO3Z0e56zA0yq8'
);

async function seed() {
  console.log('🌱 Seeding categories...');

  // 1. Create categories
  const categories = [
    { name: 'Top Up Game', slug: 'top-up-game' },
    { name: 'Voucher', slug: 'voucher' },
    { name: 'Pulsa & Data', slug: 'pulsa-data' },
    { name: 'Tagihan PLN', slug: 'pln' },
  ];

  const { data: catData, error: catErr } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select();

  if (catErr) {
    console.error('❌ Category error:', catErr.message);
    return;
  }
  console.log('✅ Categories created:', catData?.map(c => c.name).join(', '));

  const topUpCat = catData?.find(c => c.slug === 'top-up-game');
  const voucherCat = catData?.find(c => c.slug === 'voucher');
  const pulsaCat = catData?.find(c => c.slug === 'pulsa-data');
  const plnCat = catData?.find(c => c.slug === 'pln');

  // 2. Create products
  console.log('🌱 Seeding products...');

  const products = [
    {
      title: 'Mobile Legends Indonesia',
      slug: 'mlbb-indonesia',
      description: 'Top up Diamond Mobile Legends server Indonesia. Proses cepat dan aman!',
      image_url: '/diamond ml indo.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 1050,
      game_id_type: 'ml', // userId + serverId
      nominals: JSON.stringify([
        { id: 'ml-3', name: '3 Diamonds', price: 1050 },
        { id: 'ml-5', name: '5 Diamonds', price: 1050 },
        { id: 'ml-12', name: '12 Diamonds', price: 2450 },
        { id: 'ml-19', name: '19 Diamonds', price: 3850 },
        { id: 'ml-28', name: '28 Diamonds', price: 5250 },
        { id: 'ml-44', name: '44 Diamonds', price: 7000 },
        { id: 'ml-59', name: '59 Diamonds', price: 9800 },
        { id: 'ml-86', name: '86 Diamonds', price: 14000 },
        { id: 'ml-172', name: '172 Diamonds', price: 26600 },
        { id: 'ml-257', name: '257 Diamonds', price: 38500 },
        { id: 'ml-344', name: '344 Diamonds', price: 50400 },
        { id: 'ml-429', name: '429 Diamonds', price: 62300 },
        { id: 'ml-514', name: '514 Diamonds', price: 73500 },
        { id: 'ml-600', name: '600 Diamonds', price: 84000 },
        { id: 'ml-706', name: '706 Diamonds', price: 98000 },
        { id: 'ml-878', name: '878 Diamonds', price: 122500 },
        { id: 'ml-1050', name: '1050 Diamonds', price: 147000 },
        { id: 'ml-1412', name: '1412 Diamonds', price: 196000 },
        { id: 'ml-2195', name: '2195 Diamonds', price: 294000 },
        { id: 'ml-4394', name: '4394 Diamonds', price: 588000 },
      ]),
    },
    {
      title: 'Mobile Legends Global',
      slug: 'mlbb-global',
      description: 'Top up Diamond MLBB server Global (Turki, Brazil, Filipina, dll). Harga lebih murah!',
      image_url: '/globalrussia-ezgif.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 840,
      game_id_type: 'ml',
      nominals: JSON.stringify([
        { id: 'mlg-5', name: '5 Diamonds', price: 840 },
        { id: 'mlg-12', name: '12 Diamonds', price: 2100 },
        { id: 'mlg-19', name: '19 Diamonds', price: 3360 },
        { id: 'mlg-28', name: '28 Diamonds', price: 4550 },
        { id: 'mlg-44', name: '44 Diamonds', price: 6300 },
        { id: 'mlg-86', name: '86 Diamonds', price: 12250 },
        { id: 'mlg-172', name: '172 Diamonds', price: 23100 },
        { id: 'mlg-257', name: '257 Diamonds', price: 33600 },
        { id: 'mlg-344', name: '344 Diamonds', price: 44100 },
        { id: 'mlg-514', name: '514 Diamonds', price: 64400 },
        { id: 'mlg-706', name: '706 Diamonds', price: 87500 },
        { id: 'mlg-1050', name: '1050 Diamonds', price: 129500 },
        { id: 'mlg-2195', name: '2195 Diamonds', price: 262500 },
      ]),
    },
    {
      title: 'Mobile Legends Paket Irit',
      slug: 'mlbb-paket-irit',
      description: 'Paket Diamond ML termurah! Cocok untuk beli skin hemat.',
      image_url: '/MLBBIndofix-ezgif (1).webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 19600,
      game_id_type: 'ml',
      nominals: JSON.stringify([
        { id: 'mli-weekly', name: 'Weekly Diamond Pass', price: 19600 },
        { id: 'mli-twilight', name: 'Twilight Pass', price: 35000 },
        { id: 'mli-starlight', name: 'Starlight Member', price: 104300 },
        { id: 'mli-starlightplus', name: 'Starlight Plus', price: 244300 },
      ]),
    },
    {
      title: 'Free Fire',
      slug: 'free-fire',
      description: 'Top up Diamond Free Fire Garena. Proses instan 24 jam!',
      image_url: '/freefire.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 1050,
      game_id_type: 'ff', // userId only
      nominals: JSON.stringify([
        { id: 'ff-5', name: '5 Diamonds', price: 1050 },
        { id: 'ff-12', name: '12 Diamonds', price: 2100 },
        { id: 'ff-50', name: '50 Diamonds', price: 5250 },
        { id: 'ff-70', name: '70 Diamonds', price: 7000 },
        { id: 'ff-140', name: '140 Diamonds', price: 14000 },
        { id: 'ff-355', name: '355 Diamonds', price: 35000 },
        { id: 'ff-720', name: '720 Diamonds', price: 70000 },
        { id: 'ff-1450', name: '1450 Diamonds', price: 140000 },
        { id: 'ff-2180', name: '2180 Diamonds', price: 210000 },
        { id: 'ff-3640', name: '3640 Diamonds', price: 350000 },
      ]),
    },
    {
      title: 'PUBG Mobile',
      slug: 'pubg-mobile',
      description: 'Top up UC (Unknown Cash) PUBG Mobile. Beli Royal Pass dan skin keren!',
      image_url: '/pubg.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 10500,
      game_id_type: 'pubg', // userId only
      nominals: JSON.stringify([
        { id: 'pubg-60', name: '60 UC', price: 10500 },
        { id: 'pubg-325', name: '325 UC', price: 52500 },
        { id: 'pubg-660', name: '660 UC', price: 105000 },
        { id: 'pubg-1800', name: '1800 UC', price: 262500 },
        { id: 'pubg-3850', name: '3850 UC', price: 525000 },
        { id: 'pubg-8100', name: '8100 UC', price: 1050000 },
      ]),
    },
    {
      title: 'Roblox',
      slug: 'roblox',
      description: 'Beli Robux untuk Roblox. Kustomisasi avatar dan akses game premium!',
      image_url: '/roblox.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 10500,
      game_id_type: 'roblox', // username only
      nominals: JSON.stringify([
        { id: 'rbx-80', name: '80 Robux', price: 10500 },
        { id: 'rbx-160', name: '160 Robux', price: 21000 },
        { id: 'rbx-240', name: '240 Robux', price: 31500 },
        { id: 'rbx-320', name: '320 Robux', price: 42000 },
        { id: 'rbx-400', name: '400 Robux', price: 52500 },
        { id: 'rbx-800', name: '800 Robux', price: 105000 },
        { id: 'rbx-1700', name: '1700 Robux', price: 210000 },
        { id: 'rbx-4500', name: '4500 Robux', price: 525000 },
        { id: 'rbx-10000', name: '10000 Robux', price: 1050000 },
      ]),
    },
    {
      title: 'Magic Chess',
      slug: 'magic-chess',
      description: 'Top up Diamond Magic Chess by Moonton. Game auto-battler terpopuler!',
      image_url: '/magicchess.webp',
      category_id: topUpCat?.id,
      is_active: true,
      price: 2450,
      game_id_type: 'ml', // same as MLBB (userId + serverId)
      nominals: JSON.stringify([
        { id: 'mc-12', name: '12 Diamonds', price: 2450 },
        { id: 'mc-28', name: '28 Diamonds', price: 5250 },
        { id: 'mc-44', name: '44 Diamonds', price: 7000 },
        { id: 'mc-86', name: '86 Diamonds', price: 14000 },
        { id: 'mc-172', name: '172 Diamonds', price: 26600 },
        { id: 'mc-344', name: '344 Diamonds', price: 50400 },
        { id: 'mc-706', name: '706 Diamonds', price: 98000 },
      ]),
    },

    // ========== VOUCHER PRODUCTS ==========
    {
      title: 'Google Play Gift Card',
      slug: 'google-play',
      description: 'Beli voucher Google Play untuk pembelian game, apps, dan langganan YouTube Premium!',
      image_url: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=400&auto=format&fit=crop',
      category_id: voucherCat?.id,
      is_active: true,
      price: 10500,
      game_id_type: 'voucher',
      nominals: JSON.stringify([
        { id: 'gp-15k', name: 'Voucher Rp 15.000', price: 10500 },
        { id: 'gp-20k', name: 'Voucher Rp 20.000', price: 14000 },
        { id: 'gp-50k', name: 'Voucher Rp 50.000', price: 35000 },
        { id: 'gp-100k', name: 'Voucher Rp 100.000', price: 70000 },
        { id: 'gp-150k', name: 'Voucher Rp 150.000', price: 105000 },
        { id: 'gp-300k', name: 'Voucher Rp 300.000', price: 210000 },
        { id: 'gp-500k', name: 'Voucher Rp 500.000', price: 350000 },
      ]),
    },
    {
      title: 'Steam Wallet Code',
      slug: 'steam-wallet',
      description: 'Beli kode Steam Wallet untuk top up saldo Steam. Beli game PC murah!',
      image_url: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=400&auto=format&fit=crop',
      category_id: voucherCat?.id,
      is_active: true,
      price: 8400,
      game_id_type: 'voucher',
      nominals: JSON.stringify([
        { id: 'stm-12k', name: 'Wallet Rp 12.000', price: 8400 },
        { id: 'stm-45k', name: 'Wallet Rp 45.000', price: 31500 },
        { id: 'stm-60k', name: 'Wallet Rp 60.000', price: 42000 },
        { id: 'stm-90k', name: 'Wallet Rp 90.000', price: 63000 },
        { id: 'stm-120k', name: 'Wallet Rp 120.000', price: 84000 },
        { id: 'stm-250k', name: 'Wallet Rp 250.000', price: 175000 },
        { id: 'stm-400k', name: 'Wallet Rp 400.000', price: 280000 },
      ]),
    },

    // ========== PULSA & DATA PRODUCTS ==========
    {
      title: 'Pulsa Telkomsel',
      slug: 'pulsa-telkomsel',
      description: 'Isi pulsa Telkomsel (Simpati, AS, Loop) dan paket data murah!',
      image_url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=400&auto=format&fit=crop',
      category_id: pulsaCat?.id,
      is_active: true,
      price: 3850,
      game_id_type: 'phone',
      nominals: JSON.stringify([
        { id: 'tsel-5k', name: 'Pulsa Rp 5.000', price: 3500 },
        { id: 'tsel-10k', name: 'Pulsa Rp 10.000', price: 7000 },
        { id: 'tsel-15k', name: 'Pulsa Rp 15.000', price: 10500 },
        { id: 'tsel-20k', name: 'Pulsa Rp 20.000', price: 14000 },
        { id: 'tsel-25k', name: 'Pulsa Rp 25.000', price: 17500 },
        { id: 'tsel-50k', name: 'Pulsa Rp 50.000', price: 35000 },
        { id: 'tsel-100k', name: 'Pulsa Rp 100.000', price: 70000 },
      ]),
    },
    {
      title: 'Pulsa XL Axiata',
      slug: 'pulsa-xl',
      description: 'Top up pulsa XL dan AXIS. Proses cepat dan otomatis!',
      image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&auto=format&fit=crop',
      category_id: pulsaCat?.id,
      is_active: true,
      price: 3500,
      game_id_type: 'phone',
      nominals: JSON.stringify([
        { id: 'xl-5k', name: 'Pulsa Rp 5.000', price: 3500 },
        { id: 'xl-10k', name: 'Pulsa Rp 10.000', price: 7000 },
        { id: 'xl-25k', name: 'Pulsa Rp 25.000', price: 17500 },
        { id: 'xl-50k', name: 'Pulsa Rp 50.000', price: 35000 },
        { id: 'xl-100k', name: 'Pulsa Rp 100.000', price: 70000 },
      ]),
    },

    // ========== TOKEN PLN ==========
    {
      title: 'Token Listrik PLN',
      slug: 'token-pln',
      description: 'Beli token listrik PLN prabayar. Langsung masuk ke meteran Anda!',
      image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=400&auto=format&fit=crop',
      category_id: plnCat?.id,
      is_active: true,
      price: 14000,
      game_id_type: 'pln',
      nominals: JSON.stringify([
        { id: 'pln-20k', name: 'Token Rp 20.000', price: 14000 },
        { id: 'pln-50k', name: 'Token Rp 50.000', price: 35000 },
        { id: 'pln-100k', name: 'Token Rp 100.000', price: 70000 },
        { id: 'pln-200k', name: 'Token Rp 200.000', price: 140000 },
        { id: 'pln-500k', name: 'Token Rp 500.000', price: 350000 },
        { id: 'pln-1jt', name: 'Token Rp 1.000.000', price: 700000 },
      ]),
    },
  ];

  // Logic Hitungan: Auto-generate high-tier nominals up to >= 3.000.000 IDR
  for (const product of products) {
    const nominals = JSON.parse(product.nominals);
    if (nominals.length === 0) continue;

    const lastNominal = nominals[nominals.length - 1];
    
    // Extract base count and item name (e.g. "4394 Diamonds" -> "4394", "Diamonds")
    const nameMatch = lastNominal.name.match(/^([\d.,]+)\s+(.*)$/);
    if (!nameMatch) continue; // Skip string-only items like "Starlight Plus"

    const baseCount = parseFloat(nameMatch[1].replace(/,/g, ''));
    const itemName = nameMatch[2];
    const basePrice = lastNominal.price;

    let currentPrice = basePrice;
    let multiplier = 2;

    while (currentPrice < 3000000) {
      const newPrice = basePrice * multiplier;
      const newCount = baseCount * multiplier;
      
      const newPrefix = lastNominal.id.split('-')[0];
      const newId = `${newPrefix}-auto-${Math.floor(newCount)}`;
      
      if (!nominals.some((n: any) => n.id === newId)) {
        nominals.push({
          id: newId,
          name: `${Math.floor(newCount)} ${itemName}`,
          price: newPrice
        });
      }
      
      currentPrice = newPrice;
      multiplier++;
    }
    
    product.nominals = JSON.stringify(nominals);
  }

  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert(product, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Product "${product.title}" error:`, error.message);
    } else {
      console.log(`✅ ${product.title}`);
    }
  }

  console.log('\n🎉 Seeding complete!');
}

seed();
