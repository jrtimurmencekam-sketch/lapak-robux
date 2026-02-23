'use client';

import { useEffect } from 'react';
import { Smartphone, Zap, Ticket, MessageCircle } from 'lucide-react';

interface AccountInputProps {
  gameIdType?: string; // e.g. "ml", "ff", "pubg", "roblox", "phone", "pln", "voucher"
  onChange: (data: any) => void;
}

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

export default function AccountInput({ gameIdType = 'ID & Server', onChange }: AccountInputProps) {

  // Auto-set voucher data on mount so validation passes
  useEffect(() => {
    if (gameIdType === 'voucher') {
      onChange({ voucherOrder: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIdType]);

  // Determine which form to show based on gameIdType
  const renderInputFields = () => {
    // Phone number input for Pulsa & Data
    if (gameIdType === 'phone') {
      return (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" /> Nomor HP
          </label>
          <input 
            type="tel" 
            placeholder="Contoh: 08123456789"
            maxLength={15}
            className={inputClass}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
          />
          <p className="text-xs text-white/40 mt-2">Masukkan nomor HP aktif yang akan diisi pulsa/paket data.</p>
        </div>
      );
    }

    // PLN Meter/Customer ID input
    if (gameIdType === 'pln') {
      return (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> ID Pelanggan / Nomor Meter
          </label>
          <input 
            type="text" 
            placeholder="Contoh: 1234567890"
            maxLength={20}
            className={inputClass}
            onChange={(e) => onChange({ meterId: e.target.value })}
          />
          <p className="text-xs text-white/40 mt-2">Cek nomor meter di meteran listrik atau struk PLN terakhir Anda.</p>
        </div>
      );
    }

    // Voucher — no account input needed
    if (gameIdType === 'voucher') {
      return (
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <Ticket className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Tidak perlu input data akun</p>
              <p className="text-xs text-white/50 mt-1">Kode voucher akan dikirimkan via WhatsApp setelah pembayaran dikonfirmasi oleh Admin.</p>
            </div>
          </div>
        </div>
      );
    }

    // Game: ID & Server (ml, magic-chess)
    if (gameIdType === 'ml' || gameIdType === 'ID & Server') {
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">User ID (ID Game)</label>
            <input 
              type="text" 
              placeholder="Contoh: 12345678"
              className={inputClass}
              onChange={(e) => onChange({ userId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Zone ID (Server)</label>
            <input 
              type="text" 
              placeholder="Contoh: 1234"
              className={inputClass}
              onChange={(e) => onChange({ zoneId: e.target.value })}
            />
          </div>
        </>
      );
    }

    // Game: Player ID only (ff, pubg, roblox, etc.)
    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-white/70 mb-2">Player ID</label>
        <input 
          type="text" 
          placeholder="Masukkan ID Anda"
          className={inputClass}
          onChange={(e) => onChange({ playerId: e.target.value })}
        />
      </div>
    );
  };

  // Dynamic header label
  const getHeaderLabel = () => {
    if (gameIdType === 'phone') return 'Masukkan Nomor HP';
    if (gameIdType === 'pln') return 'Masukkan Data Pelanggan';
    if (gameIdType === 'voucher') return 'Informasi Pengiriman';
    return 'Masukkan Data Akun';
  };

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
        <h2 className="text-xl font-bold text-white">{getHeaderLabel()}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputFields()}
      </div>

      {/* Nomor WhatsApp — WAJIB untuk semua tipe produk */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-400" /> Nomor WhatsApp <span className="text-red-400">*</span>
        </label>
        <input 
          type="tel" 
          placeholder="08123456789"
          maxLength={15}
          className={inputClass}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
        />
        <p className="text-xs text-white/40 mt-2">Wajib diisi agar Admin bisa menghubungi Anda jika ada kendala.</p>
      </div>
      
      <p className="text-xs text-white/40 mt-3 flex items-start gap-1">
        <span className="text-primary">*</span> Pastikan data yang dimasukkan sudah benar. Kami tidak bertanggung jawab atas kesalahan ketik.
      </p>
    </div>
  );
}
