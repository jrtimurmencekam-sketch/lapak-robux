'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Zap, Ticket, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AccountInputProps {
  gameIdType?: string;
  onChange: (data: any) => void;
}

// ══════════════════════════════════════════════════
// Validation rules per game / service type
// ══════════════════════════════════════════════════
interface ValidationRule {
  pattern: RegExp;
  minLength: number;
  maxLength: number;
  errorMessage: string;
  hint: string;
}

const validationRules: Record<string, Record<string, ValidationRule>> = {
  ml: {
    userId: {
      pattern: /^\d+$/,
      minLength: 5,
      maxLength: 10,
      errorMessage: 'User ID harus berupa angka, 5-10 digit',
      hint: 'Contoh: 12345678 (cek di profil game → ID)',
    },
    zoneId: {
      pattern: /^\d+$/,
      minLength: 4,
      maxLength: 4,
      errorMessage: 'Zone ID harus 4 digit angka',
      hint: 'Contoh: 2505 (angka dalam tanda kurung di profil)',
    },
  },
  'ID & Server': {
    userId: {
      pattern: /^\d+$/,
      minLength: 5,
      maxLength: 10,
      errorMessage: 'User ID harus berupa angka, 5-10 digit',
      hint: 'Contoh: 12345678',
    },
    zoneId: {
      pattern: /^\d+$/,
      minLength: 4,
      maxLength: 4,
      errorMessage: 'Zone ID harus 4 digit angka',
      hint: 'Contoh: 2505',
    },
  },
  ff: {
    playerId: {
      pattern: /^\d+$/,
      minLength: 8,
      maxLength: 12,
      errorMessage: 'Player ID harus berupa angka, 8-12 digit',
      hint: 'Contoh: 123456789 (cek di profil Free Fire)',
    },
  },
  pubg: {
    playerId: {
      pattern: /^\d+$/,
      minLength: 8,
      maxLength: 12,
      errorMessage: 'Player ID harus berupa angka, 8-12 digit',
      hint: 'Contoh: 5123456789 (cek di Settings → Basic Info)',
    },
  },
  genshin: {
    playerId: {
      pattern: /^\d+$/,
      minLength: 9,
      maxLength: 10,
      errorMessage: 'UID harus berupa angka, 9-10 digit',
      hint: 'Contoh: 812345678 (cek di menu Paimon)',
    },
  },
  roblox: {
    playerId: {
      pattern: /^[a-zA-Z0-9_]+$/,
      minLength: 3,
      maxLength: 30,
      errorMessage: 'Username hanya boleh huruf, angka, dan underscore',
      hint: 'Contoh: ProGamer_123 (username Roblox Anda)',
    },
  },
  phone: {
    phoneNumber: {
      pattern: /^08\d+$/,
      minLength: 10,
      maxLength: 15,
      errorMessage: 'Nomor HP harus diawali 08 dan 10-15 digit',
      hint: 'Contoh: 081234567890',
    },
  },
  pln: {
    meterId: {
      pattern: /^\d+$/,
      minLength: 10,
      maxLength: 13,
      errorMessage: 'ID Pelanggan harus 10-13 digit angka',
      hint: 'Contoh: 1234567890 (cek di meteran atau struk PLN)',
    },
  },
};

const whatsappRule: ValidationRule = {
  pattern: /^08\d+$/,
  minLength: 10,
  maxLength: 15,
  errorMessage: 'Nomor WA harus diawali 08 dan 10-15 digit',
  hint: 'Contoh: 081234567890',
};

// ══════════════════════════════════════════════════
// Validate single field
// ══════════════════════════════════════════════════
function validateField(value: string, rule: ValidationRule): { valid: boolean; message: string } {
  if (!value || value.trim() === '') {
    return { valid: false, message: '' }; // empty = no error shown yet
  }
  if (!rule.pattern.test(value)) {
    return { valid: false, message: rule.errorMessage };
  }
  if (value.length < rule.minLength || value.length > rule.maxLength) {
    return { valid: false, message: rule.errorMessage };
  }
  return { valid: true, message: '' };
}

// ══════════════════════════════════════════════════
// Validation indicator component
// ══════════════════════════════════════════════════
function FieldStatus({ value, rule }: { value: string; rule: ValidationRule }) {
  if (!value) return <p className="text-xs text-white/40 mt-2">{rule.hint}</p>;
  const result = validateField(value, rule);
  if (result.valid) {
    return (
      <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Format valid
      </p>
    );
  }
  return (
    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
      <AlertCircle className="w-3 h-3" /> {result.message}
    </p>
  );
}

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const inputErrorClass = "w-full bg-white/5 border border-red-500/50 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors";
const inputValidClass = "w-full bg-white/5 border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors";

function getInputClass(value: string, rule: ValidationRule) {
  if (!value) return inputClass;
  const result = validateField(value, rule);
  return result.valid ? inputValidClass : inputErrorClass;
}

export default function AccountInput({ gameIdType = 'ID & Server', onChange }: AccountInputProps) {
  const [fields, setFields] = useState<Record<string, string>>({});

  // Auto-set voucher data on mount
  useEffect(() => {
    if (gameIdType === 'voucher') {
      onChange({ voucherOrder: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIdType]);

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  };

  const rules = validationRules[gameIdType] || {};

  const renderInputFields = () => {
    // ── Phone ──
    if (gameIdType === 'phone') {
      const rule = rules.phoneNumber;
      return (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" /> Nomor HP
          </label>
          <input 
            type="tel" 
            placeholder="08123456789"
            maxLength={rule?.maxLength || 15}
            className={rule ? getInputClass(fields.phoneNumber || '', rule) : inputClass}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
          />
          {rule && <FieldStatus value={fields.phoneNumber || ''} rule={rule} />}
        </div>
      );
    }

    // ── PLN ──
    if (gameIdType === 'pln') {
      const rule = rules.meterId;
      return (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> ID Pelanggan / Nomor Meter
          </label>
          <input 
            type="text" 
            placeholder="1234567890"
            maxLength={rule?.maxLength || 20}
            className={rule ? getInputClass(fields.meterId || '', rule) : inputClass}
            onChange={(e) => updateField('meterId', e.target.value)}
          />
          {rule && <FieldStatus value={fields.meterId || ''} rule={rule} />}
        </div>
      );
    }

    // ── Voucher ──
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

    // ── ML / ID & Server ──
    if (gameIdType === 'ml' || gameIdType === 'ID & Server') {
      const userRule = rules.userId;
      const zoneRule = rules.zoneId;
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">User ID (ID Game)</label>
            <input 
              type="text" 
              placeholder="12345678"
              maxLength={userRule?.maxLength || 20}
              className={userRule ? getInputClass(fields.userId || '', userRule) : inputClass}
              onChange={(e) => updateField('userId', e.target.value)}
            />
            {userRule && <FieldStatus value={fields.userId || ''} rule={userRule} />}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Zone ID (Server)</label>
            <input 
              type="text" 
              placeholder="2505"
              maxLength={zoneRule?.maxLength || 10}
              className={zoneRule ? getInputClass(fields.zoneId || '', zoneRule) : inputClass}
              onChange={(e) => updateField('zoneId', e.target.value)}
            />
            {zoneRule && <FieldStatus value={fields.zoneId || ''} rule={zoneRule} />}
          </div>
        </>
      );
    }

    // ── Other games (ff, pubg, genshin, roblox, etc.) ──
    const playerRule = rules.playerId;
    const labelMap: Record<string, string> = {
      ff: 'Player ID (Free Fire)',
      pubg: 'Player ID (PUBG Mobile)',
      genshin: 'UID (Genshin Impact)',
      roblox: 'Username (Roblox)',
    };
    const placeholderMap: Record<string, string> = {
      ff: '123456789',
      pubg: '5123456789',
      genshin: '812345678',
      roblox: 'ProGamer_123',
    };

    return (
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-white/70 mb-2">
          {labelMap[gameIdType] || 'Player ID'}
        </label>
        <input 
          type="text" 
          placeholder={placeholderMap[gameIdType] || 'Masukkan ID Anda'}
          maxLength={playerRule?.maxLength || 30}
          className={playerRule ? getInputClass(fields.playerId || '', playerRule) : inputClass}
          onChange={(e) => updateField('playerId', e.target.value)}
        />
        {playerRule && <FieldStatus value={fields.playerId || ''} rule={playerRule} />}
      </div>
    );
  };

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
          placeholder="081234567890"
          maxLength={15}
          className={getInputClass(fields.whatsapp || '', whatsappRule)}
          onChange={(e) => updateField('whatsapp', e.target.value)}
        />
        <FieldStatus value={fields.whatsapp || ''} rule={whatsappRule} />
      </div>
      
      <p className="text-xs text-white/40 mt-3 flex items-start gap-1">
        <span className="text-primary">*</span> Pastikan data yang dimasukkan sudah benar. Kami tidak bertanggung jawab atas kesalahan ketik.
      </p>
    </div>
  );
}
