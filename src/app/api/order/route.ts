import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

// Anti-Spam Rate Limiting (Reset saat server restart)
// Count requests dalam window 10 menit. Jika lebih dari batas, IP diban selama 5 jam.
interface RateLimitState {
  count: number;
  windowStart: number;
  unbanTime: number | null;
}
const rateLimit = new Map<string, RateLimitState>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const BAN_DURATION_MS = 5 * 60 * 60 * 1000; // 5 jam hukuman ban
    const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 menit batas waktu ngitung order
    const MAX_REQUESTS = 3; // Max 3 order dalam 10 menit

    let userRate = rateLimit.get(ip);
    
    if (!userRate) {
      // Pembeli baru, catat pertama kali
      userRate = { count: 1, windowStart: now, unbanTime: null };
      rateLimit.set(ip, userRate);
    } else {
      // 1. Cek apakah IP ini sedang kena hukuman (banned)
      if (userRate.unbanTime) {
        if (now < userRate.unbanTime) {
          console.warn(`[Anti-Spam] Memblokir order dari IP Banned: ${ip}`);
          return NextResponse.json(
            { success: false, message: 'Akses order diblokir karena aktivitas spam (Banned 5 Jam).' },
            { status: 429 }
          );
        } else {
          // Masa hukuman ban sudah habis, bebas buat order lagi dari 0
          userRate.count = 0;
          userRate.windowStart = now;
          userRate.unbanTime = null;
        }
      }

      // 2. Cek apakah sudah lewat 10 menit sejak order pertama mereka (Reset normal)
      if (now - userRate.windowStart > WINDOW_DURATION_MS && !userRate.unbanTime) {
        userRate.count = 1;
        userRate.windowStart = now;
      } else if (!userRate.unbanTime) {
        // 3. Masih di dalam 10 menit, hitung jumlah ordernya
        if (userRate.count >= MAX_REQUESTS) {
          // Pelanggaran! Beri hukuman Ban 5 Jam
          userRate.unbanTime = now + BAN_DURATION_MS;
          console.warn(`[Anti-Spam] IP ${ip} melebihi batas 3 order/10mnt. DIBANNED for 5 hours.`);
          return NextResponse.json(
            { success: false, message: 'Terlalu banyak klik pesanan dalam waktu singkat (Spam). Anda diblokir selama 5 Jam.' },
            { status: 429 }
          );
        } else {
          // Masih aman (belum lewat batas 3 order)
          userRate.count += 1;
        }
      }
    }

    const formData = await request.formData();

    // Extract order data
    const gameTitle = formData.get('gameTitle') as string;
    const accountData = formData.get('accountData') as string;
    const nominalName = formData.get('nominalName') as string;
    const totalAmount = Number(formData.get('totalAmount'));
    const paymentMethod = formData.get('paymentMethod') as string;
    const paymentProof = formData.get('paymentProof') as File | null;
    const orderType = (formData.get('orderType') as string) || 'game';

    // 1. Save order to Supabase (without photo)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        game_id_input: JSON.parse(accountData),
        total_amount: totalAmount,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase error:', orderError);
      // Continue to send Telegram even if DB fails
    }

    const orderId = orderData?.id || 'N/A';

    // 2. Build Telegram message dynamically based on order type
    let accountInfo = '';
    let productIcon = '🎮';
    let productLabel = 'Game';
    let buyerWhatsapp = '';

    // Try to extract WA number from accountData JSON
    try {
      const parsed = JSON.parse(accountData);
      buyerWhatsapp = parsed.whatsapp || '';
    } catch { /* not JSON */ }

    switch (orderType) {
      case 'phone':
        productIcon = '📱';
        productLabel = 'Layanan';
        accountInfo = `📞 *Nomor HP:* ${accountData}`;
        break;
      case 'pln':
        productIcon = '⚡';
        productLabel = 'Layanan';
        accountInfo = `🔌 *ID Pelanggan:* ${accountData}`;
        break;
      case 'voucher':
        productIcon = '🎟️';
        productLabel = 'Voucher';
        accountInfo = `📧 *Pengiriman:* Via WhatsApp`;
        break;
      case 'account':
        productIcon = '👑';
        productLabel = 'BELI AKUN';
        accountInfo = `📱 *WA Pembeli:* ${buyerWhatsapp || accountData}`;
        break;
      default:
        productIcon = '🎮';
        productLabel = 'Game';
        accountInfo = `👤 *Data Akun:* ${accountData}`;
    }

    const waLine = buyerWhatsapp ? `\n📲 *WA Pembeli:* ${buyerWhatsapp}` : '';

    const message = `🛒 *PESANAN BARU MASUK!*\n\n` +
      `📋 *ID Pesanan:* \`${orderId}\`\n` +
      `${productIcon} *${productLabel}:* ${gameTitle}\n` +
      `${accountInfo}\n` +
      `💎 *Nominal:* ${nominalName}\n` +
      `💰 *Total:* Rp ${totalAmount.toLocaleString('id-ID')}\n` +
      `💳 *Pembayaran:* ${paymentMethod.toUpperCase()}${waLine}\n` +
      `⏰ *Waktu:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    // 3. Send to Telegram
    if (paymentProof && paymentProof.size > 0) {
      // Send photo with caption
      const tgForm = new FormData();
      tgForm.append('chat_id', TELEGRAM_CHAT_ID);
      tgForm.append('caption', message);
      tgForm.append('parse_mode', 'Markdown');
      tgForm.append('photo', paymentProof);

      const tgRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        { method: 'POST', body: tgForm }
      );

      if (!tgRes.ok) {
        const errBody = await tgRes.text();
        console.error('Telegram sendPhoto error:', errBody);
      }
    } else {
      // Send text only (no payment proof)
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message + '\n\n⚠️ _Tidak ada bukti bayar (E-Wallet)_',
            parse_mode: 'Markdown',
          }),
        }
      );

      if (!tgRes.ok) {
        const errBody = await tgRes.text();
        console.error('Telegram sendMessage error:', errBody);
      }
    }

    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Pesanan berhasil dibuat!' 
    });

  } catch (error: any) {
    console.error('API /order error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}
