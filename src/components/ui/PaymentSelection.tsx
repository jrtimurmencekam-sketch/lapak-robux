'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QrCode, Building2, ChevronDown, ChevronUp, Award } from 'lucide-react';

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
  const [expandedGroup, setExpandedGroup] = useState<string | null>('qris');

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

  const qrisMethods = methods.filter(m => m.type === 'qris');
  const transferMethods = methods.filter(m => m.type === 'transfer');

  const toggleGroup = (group: string) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">3</div>
        <h2 className="text-lg font-bold text-white">Pilih Pembayaran</h2>
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
        <div className="space-y-3 relative z-10">
          {/* QRIS Group */}
          {qrisMethods.length > 0 && (
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleGroup('qris')}
                className="w-full flex items-center justify-between p-4 bg-accent/60 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm font-bold text-white">QRIS (All Payment)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" />
                    BEST PRICE
                  </span>
                  {expandedGroup === 'qris' ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </div>
              </button>
              {expandedGroup === 'qris' && (
                <div className="p-3 space-y-2">
                  {qrisMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleSelect(method)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        selectedId === method.id
                          ? 'bg-primary/10 border-primary ring-1 ring-primary/40'
                          : 'bg-accent/40 border-white/5 hover:bg-accent hover:border-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                        <QrCode className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className={`text-sm font-bold ${selectedId === method.id ? 'text-primary' : 'text-white'}`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bank Transfer Group */}
          {transferMethods.length > 0 && (
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleGroup('transfer')}
                className="w-full flex items-center justify-between p-4 bg-accent/60 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-white">Bank Transfer & E-Wallet</span>
                </div>
                {expandedGroup === 'transfer' ? (
                  <ChevronUp className="w-4 h-4 text-white/40" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/40" />
                )}
              </button>
              {expandedGroup === 'transfer' && (
                <div className="p-3 space-y-2">
                  {transferMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleSelect(method)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
                        selectedId === method.id
                          ? 'bg-primary/10 border-primary ring-1 ring-primary/40'
                          : 'bg-accent/40 border-white/5 hover:bg-accent hover:border-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className={`text-sm font-bold ${selectedId === method.id ? 'text-primary' : 'text-white'}`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
