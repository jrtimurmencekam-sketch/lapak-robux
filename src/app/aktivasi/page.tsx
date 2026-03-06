'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, UserCheck } from 'lucide-react';

// Game configuration derived from AccountInput logic
const GAMES = [
  { id: 'ml', name: 'Mobile Legends', type: 'ml' },
  { id: 'ff', name: 'Free Fire', type: 'ff' },
  { id: 'pubg', name: 'PUBG Mobile', type: 'pubg' },
  { id: 'genshin', name: 'Genshin Impact', type: 'genshin' },
  { id: 'roblox', name: 'Roblox', type: 'roblox' },
];

export default function CekTrackingPage() {
  const [game, setGame] = useState('ml');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Nickname checking state
  const [nickname, setNickname] = useState<string | null>(null);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-check nickname for ML
  useEffect(() => {
    if (game !== 'ml') {
      setNickname(null);
      return;
    }

    const userId = fields.userId || '';
    const zoneId = fields.zoneId || '';

    // Basic validation
    const isUserIdValid = /^\d+$/.test(userId) && userId.length >= 5 && userId.length <= 10;
    const isZoneIdValid = /^\d+$/.test(zoneId) && zoneId.length >= 4 && zoneId.length <= 6;

    if (!isUserIdValid || !isZoneIdValid) {
      setNickname(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setNicknameLoading(true);
      setNickname(null);
      try {
        const res = await fetch(`/api/check-nickname?id=${userId}&zone=${zoneId}`);
        const data = await res.json();
        if (data.success && data.nickname) {
          setNickname(data.nickname);
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
  }, [fields.userId, fields.zoneId, game]);

  // Static WA number for this specific page
  const [waNumber, setWaNumber] = useState('6285135853962');

  const [showModal, setShowModal] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsErrorShake(false);
    
    // Simulate delay for feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (fields.orderId === '8124-2412') {
        setOrder({
          id: '8124-2412',
          status: 'pending_activation',
          message: 'Anda perlu melakukan aktivasi id sebesar Rp.99.000 melalui admin'
        });
        setShowModal(true);
      } else {
        setError('Nomor Orderan tidak ditemukan atau salah. Pastikan nomor yang diberikan Admin benar.');
        setIsErrorShake(true);
        // Reset shake after animation
        setTimeout(() => setIsErrorShake(false), 500);
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan saat mencari pesanan.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => {
    switch(game) {
      case 'ml':
        return (
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="User ID (Contoh: 12345678)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                onChange={(e) => setFields({ ...fields, userId: e.target.value })}
              />
              <input
                type="text"
                placeholder="Zone ID (Contoh: 2505)"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                onChange={(e) => setFields({ ...fields, zoneId: e.target.value })}
              />
            </div>
            
            {/* Nickname Result Display */}
            {(nicknameLoading || nickname) && (
              <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
                nickname 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-white/5 border-white/10'
              }`}>
                {nicknameLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-sm text-white/60 font-medium">Memvalidasi ID...</span>
                  </>
                ) : nickname ? (
                  <>
                    <UserCheck className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white">
                      Nickname ditemukan: <span className="font-bold text-green-400">{nickname}</span>
                    </span>
                  </>
                ) : null}
              </div>
            )}
          </div>
        );
      case 'ff':
      case 'pubg':
      case 'genshin':
      case 'roblox':
        return (
          <div className="mb-4">
            <input
              type="text"
              placeholder={
                game === 'ff' ? 'Player ID (Contoh: 123456789)' : 
                game === 'pubg' ? 'Player ID (Contoh: 5123456789)' : 
                game === 'genshin' ? 'UID (Contoh: 812345678)' : 
                'Username Roblox'
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              onChange={(e) => setFields({ ...fields, playerId: e.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Logic to determine if we should show the second stage (Order Number input)
  const isAccountValid = game === 'ml' ? !!nickname : (fields.playerId && fields.playerId.length > 3);

  const waMessage = encodeURIComponent(`Halo Admin, saya mau aktivasi ID untuk pesanan ${fields.orderId}.`);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex-1 flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Cek Status Pesanan</h1>
        <p className="text-white/60">Lacak pesanan Anda dengan memasukkan ID Game & Nomor Orderan.</p>
      </div>

      <div className={`bg-[#1a1b1e] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 transition-all duration-300 ${isErrorShake ? 'animate-shake' : ''}`}>
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Langkah 1: Pilih Game & Masukkan ID</label>
            <div className="space-y-4">
              <select
                value={game}
                onChange={(e) => {
                  setGame(e.target.value);
                  setFields({});
                  setNickname(null);
                  setOrder(null);
                  setError('');
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none cursor-pointer"
              >
                {GAMES.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#1a1b1e] text-white">
                    {g.name}
                  </option>
                ))}
              </select>
              {renderInputs()}
            </div>
          </div>

          {/* Step 2: Order Number (Hanya muncul jika Step 1 valid) */}
          {isAccountValid && (
            <div className="pt-6 border-t border-white/10 animate-in fade-in zoom-in-95 duration-500">
              <label className="block text-sm font-bold text-white/50 uppercase tracking-wider mb-3">Langkah 2: Nomor Orderan yang diberikan Admin</label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Masukkan Nomor Orderan dari Admin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  onChange={(e) => setFields({ ...fields, orderId: e.target.value })}
                />
                
                <button
                  type="submit"
                  disabled={isLoading || !fields.orderId}
                  className="w-full bg-primary text-primary-foreground font-black px-8 py-4 rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Search className="w-5 h-5" />
                      CEK STATUS PESANAN
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      {/* RESULT MODAL */}
      {showModal && order && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#1a1b1e] border border-white/10 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300 text-center">
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 inline-flex p-4 rounded-3xl bg-yellow-500/10 border border-yellow-500/20">
              <Search className="w-8 h-8 text-yellow-500" />
            </div>

            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Status Pesanan Ditemukan</h3>
            
            <p className="text-lg font-bold text-white/70 mb-8 leading-relaxed italic">
              "{order.message}"
            </p>

            <div className="space-y-4">
              <a 
                href={`https://wa.me/${waNumber}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-black px-8 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#25D366]/20 text-lg"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              HUBUNGI ADMIN SEKARANG
            </a>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-4 text-white/40 font-bold hover:text-white transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
