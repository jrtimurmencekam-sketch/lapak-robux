'use client';
import { useState } from 'react';

interface NominalSelectionProps {
  nominals: { id: string; name: string; price: number }[];
  onSelect: (nominalId: string, price: number) => void;
}

export default function NominalSelection({ nominals, onSelect }: NominalSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, price: number) => {
    setSelectedId(id);
    onSelect(id, price);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">2</div>
        <h2 className="text-xl font-bold text-white">Pilih Nominal</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {nominals.map((nom) => {
          const isOutOfStock = nom.price < 70000;
          return (
            <button
              key={nom.id}
              onClick={() => !isOutOfStock && handleSelect(nom.id, nom.price)}
              disabled={isOutOfStock}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isOutOfStock 
                  ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                  : selectedId === nom.id
                    ? 'bg-primary/20 border-primary ring-1 ring-primary'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 cursor-pointer'
              }`}
            >
              {!isOutOfStock && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl z-20">
                  -30%
                </div>
              )}
              <span className={`text-sm font-semibold mb-1 ${
                isOutOfStock ? 'text-white/40 line-through' : selectedId === nom.id ? 'text-primary' : 'text-white'
              } relative z-10`}>
                {nom.name}
              </span>
              <span className={`text-xs font-bold ${
                isOutOfStock ? 'text-red-400' : selectedId === nom.id ? 'text-primary/90' : 'text-white/60'
              } relative z-10`}>
                {isOutOfStock ? 'HABIS' : formatPrice(nom.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
