'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QrCode, Building2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'qris' | 'transfer';
  label: string;
  account_name: string | null;
  account_number: string | null;
  qris_image_url: string | null;
}

interface PaymentSelectionProps {
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentSelection({ onSelect }: PaymentSelectionProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('id, type, label, account_name, account_number, qris_image_url')
        .eq('is_active', true)
        .order('type', { ascending: true });

      if (!error && data) {
        setMethods(data);
      }
      setIsLoading(false);
    };
    fetchMethods();
  }, []);

  const handleSelect = (method: PaymentMethod) => {
    setSelectedId(method.id);
    onSelect(method);
  };

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">3</div>
        <h2 className="text-xl font-bold text-white">Pilih Pembayaran</h2>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3 relative z-10">
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="h-20 bg-white/5 rounded-2xl" />
        </div>
      ) : methods.length === 0 ? (
        <p className="text-white/40 text-sm text-center py-8 relative z-10">
          Belum ada metode pembayaran yang tersedia. Hubungi admin.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method)}
              className={`flex flex-col items-start p-5 rounded-2xl border transition-all duration-300 ${
                selectedId === method.id
                  ? 'bg-primary/20 border-primary ring-2 ring-primary/50 shadow-[0_0_15px_rgba(255,215,0,0.15)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <span className="text-xs text-white/50 mb-2 font-medium tracking-wider uppercase">
                {method.type === 'qris' ? 'E-Wallet / M-Banking' : 'Bank Transfer'}
              </span>
              <div className="flex items-center gap-3 w-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  method.type === 'qris' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {method.type === 'qris' ? <QrCode className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                </div>
                <span className={`text-base font-bold text-left ${selectedId === method.id ? 'text-primary' : 'text-white'}`}>
                  {method.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
