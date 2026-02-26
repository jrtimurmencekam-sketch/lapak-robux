import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

// Anti-Spam Rate Limiting
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
    const BAN_DURATION_MS = 5 * 60 * 60 * 1000;
    const WINDOW_DURATION_MS = 10 * 60 * 1000;
    const MAX_REQUESTS = 3;

    let userRate = rateLimit.get(ip);
    
    if (!userRate) {
      userRate = { count: 1, windowStart: now, unbanTime: null };
      rateLimit.set(ip, userRate);
    } else {
      if (userRate.unbanTime) {
        if (now < userRate.unbanTime) {
          return NextResponse.json(
            { success: false, message: 'Akses order diblokir karena aktivitas spam (Banned 5 Jam).' },
            { status: 429 }
          );
        } else {
          userRate.count = 0;
          userRate.windowStart = now;
          userRate.unbanTime = null;
        }
      }
      if (now - userRate.windowStart > WINDOW_DURATION_MS && !userRate.unbanTime) {
        userRate.count = 1;
        userRate.windowStart = now;
      } else if (!userRate.unbanTime) {
        if (userRate.count >= MAX_REQUESTS) {
          userRate.unbanTime = now + BAN_DURATION_MS;
          return NextResponse.json(
            { success: false, message: 'Terlalu banyak pesanan dalam waktu singkat. Anda diblokir selama 5 Jam.' },
            { status: 429 }
          );
        } else {
          userRate.count += 1;
        }
      }
    }

    const body = await request.json();

    const {
      gameTitle,
      accountData,
      nominalName,
      totalAmount,
      paymentMethod,
      paymentMethodId,
      productSlug,
      nickname,
      orderType,
    } = body;

    // 1. Save order to Supabase (full details, no proof yet)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        game_id_input: accountData,
        total_amount: totalAmount,
        status: 'pending',
        game_title: gameTitle,
        nominal_name: nominalName,
        payment_method: paymentMethod,
        payment_method_id: paymentMethodId,
        product_slug: productSlug,
        nickname: nickname || null,
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase error:', orderError);
      return NextResponse.json(
        { success: false, message: 'Gagal menyimpan pesanan.' },
        { status: 500 }
      );
    }

    const orderId = orderData.id;

    // 2. Build Telegram notification (text only, no proof)
    let accountInfo = '';
    let productIcon = '🎮';
    let productLabel = 'Game';
    const buyerWhatsapp = accountData?.whatsapp || '';

    switch (orderType) {
      case 'account':
        productIcon = '👑';
        productLabel = 'BELI AKUN';
        accountInfo = `📱 *WA Pembeli:* ${buyerWhatsapp || JSON.stringify(accountData)}`;
        break;
      default:
        productIcon = '🎮';
        productLabel = 'Game';
        accountInfo = `👤 *Data Akun:* ${JSON.stringify(accountData)}`;
    }

    const nickLine = nickname ? `\n🏷️ *Nickname:* ${nickname}` : '';
    const waLine = buyerWhatsapp ? `\n📲 *WA Pembeli:* ${buyerWhatsapp}` : '';

    const message = `🛒 *PESANAN BARU MASUK!*\n\n` +
      `📋 *ID Pesanan:* \`${orderId}\`\n` +
      `${productIcon} *${productLabel}:* ${gameTitle}\n` +
      `${accountInfo}${nickLine}\n` +
      `💎 *Nominal:* ${nominalName}\n` +
      `💰 *Total:* Rp ${Number(totalAmount).toLocaleString('id-ID')}\n` +
      `💳 *Pembayaran:* ${paymentMethod.toUpperCase()}${waLine}\n` +
      `⏰ *Waktu:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
      `⏳ _Menunggu pembayaran..._`;

    // 3. Send text notification to Telegram
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

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
