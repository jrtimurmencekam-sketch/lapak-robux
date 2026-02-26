import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('orderId') as string;
    const paymentProof = formData.get('paymentProof') as File | null;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 });
    }
    if (!paymentProof || paymentProof.size === 0) {
      return NextResponse.json({ success: false, message: 'Payment proof required' }, { status: 400 });
    }

    // 1. Get order details from DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, message: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // 2. Build Telegram message
    const nickLine = order.nickname ? `\n🏷️ *Nickname:* ${order.nickname}` : '';
    const waLine = order.game_id_input?.whatsapp ? `\n📲 *WA:* ${order.game_id_input.whatsapp}` : '';

    const message = `💰 *BUKTI BAYAR MASUK!*\n\n` +
      `📋 *ID Pesanan:* \`${orderId}\`\n` +
      `🎮 *Produk:* ${order.game_title || 'N/A'}\n` +
      `👤 *Data Akun:* ${JSON.stringify(order.game_id_input)}${nickLine}\n` +
      `💎 *Nominal:* ${order.nominal_name || 'N/A'}\n` +
      `💰 *Total:* Rp ${Number(order.total_amount).toLocaleString('id-ID')}\n` +
      `💳 *Pembayaran:* ${(order.payment_method || 'N/A').toUpperCase()}${waLine}\n` +
      `⏰ *Waktu Upload:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

    // 3. Send photo with caption to Telegram
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

    // 4. Update order status to processing
    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', orderId);

    return NextResponse.json({ 
      success: true, 
      message: 'Bukti pembayaran berhasil diupload!' 
    });

  } catch (error: any) {
    console.error('API /order/proof error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}
