'use client';
import { useState } from 'react';
import { Gem } from 'lucide-react';

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
    return `Rp. ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
        <h2 className="text-lg font-bold text-white">Pilih Nominal</h2>
      </div>

      <p className="text-xs text-white/40 mb-4 flex items-center gap-1.5">
        <span className="text-primary">✨</span> Top Up Instant
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {nominals.map((nom) => (
          <button
            key={nom.id}
            onClick={() => handleSelect(nom.id, nom.price)}
            className={`flex flex-col items-start p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
              selectedId === nom.id
                ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-[0_0_15px_rgba(255,215,0,0.1)]'
                : 'bg-accent/60 border-white/5 hover:bg-accent hover:border-white/15 cursor-pointer'
            }`}
          >
            {/* Nominal Name */}
            <span className={`text-sm font-bold mb-1.5 ${
              selectedId === nom.id ? 'text-primary' : 'text-white'
            }`}>
              {nom.name}
            </span>

            {/* Price with icon */}
            <div className="flex items-center gap-1.5">
              <Gem className={`w-3.5 h-3.5 ${
                selectedId === nom.id ? 'text-primary/80' : 'text-secondary/70'
              }`} />
              <span className={`text-xs font-bold ${
                selectedId === nom.id ? 'text-primary/90' : 'text-secondary'
              }`}>
                {formatPrice(nom.price)}
              </span>
            </div>

            {/* INSTAN Badge */}
            <div className="mt-2.5 flex items-center gap-1 px-2 py-0.5 bg-secondary/10 rounded text-[9px] font-bold text-secondary/80 tracking-wide">
              <Gem className="w-2.5 h-2.5" />
              RESPONSE INSTAN
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
