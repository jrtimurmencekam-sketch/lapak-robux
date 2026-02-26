'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle, AlertCircle, CheckCircle2, Loader2, UserCheck } from 'lucide-react';

interface AccountInputProps {
  gameIdType?: string;
  onChange: (data: any) => void;
}

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
};

const whatsappRule: ValidationRule = {
  pattern: /^08\d+$/,
  minLength: 10,
  maxLength: 15,
  errorMessage: 'Nomor WA harus diawali 08 dan 10-15 digit',
  hint: 'Contoh: 081234567890',
};

function validateField(value: string, rule: ValidationRule): { valid: boolean; message: string } {
  if (!value || value.trim() === '') {
    return { valid: false, message: '' };
  }
  if (!rule.pattern.test(value)) {
    return { valid: false, message: rule.errorMessage };
  }
  if (value.length < rule.minLength || value.length > rule.maxLength) {
    return { valid: false, message: rule.errorMessage };
  }
  return { valid: true, message: '' };
}

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
  const [nickname, setNickname] = useState<string | null>(null);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
    onChange({ [key]: value });
  };

  const rules = validationRules[gameIdType] || {};

  // ══════════════════════════════════════════════════
  // Auto-check nickname for ML games
  // ══════════════════════════════════════════════════
  useEffect(() => {
    if (gameIdType !== 'ml' && gameIdType !== 'ID & Server') return;

    const userId = fields.userId || '';
    const zoneId = fields.zoneId || '';
    const userRule = rules.userId;
    const zoneRule = rules.zoneId;

    // Only check when both are valid
    if (!userRule || !zoneRule) return;
    const userValid = validateField(userId, userRule).valid;
    const zoneValid = validateField(zoneId, zoneRule).valid;

    if (!userValid || !zoneValid) {
      setNickname(null);
      return;
    }

    // Debounce 500ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setNicknameLoading(true);
      setNickname(null);
      try {
        const res = await fetch(`/api/check-nickname?id=${userId}&zone=${zoneId}`);
        const data = await res.json();
        if (data.success && data.nickname) {
          setNickname(data.nickname);
          onChange({ nickname: data.nickname });
        } else {
          setNickname(null);
        }
      } catch {
        setNickname(null);
      } finally {
        setNicknameLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.userId, fields.zoneId, gameIdType]);

  const renderInputFields = () => {
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

          {/* Nickname result */}
          {(nicknameLoading || nickname) && (
            <div className="md:col-span-2">
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                nickname 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-white/5 border-white/10'
              }`}>
                {nicknameLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-white/60">Mengecek nickname...</span>
                  </>
                ) : nickname ? (
                  <>
                    <UserCheck className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">
                      Nickname: <span className="font-bold text-green-400">{nickname}</span>
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          )}
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

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
        <h2 className="text-xl font-bold text-white">Masukkan Data Akun</h2>
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
