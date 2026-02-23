import { Crown, Trophy, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const topSpenders = [
    { rank: 1, name: "Bagas Maulana", amount: "Rp 10.500.000", avatar: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=100&auto=format&fit=crop" },
    { rank: 2, name: "Sultan X", amount: "Rp 8.200.000", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop" },
    { rank: 3, name: "Gamer Santuy", amount: "Rp 5.150.000", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop" },
    { rank: 4, name: "Pro Player 99", amount: "Rp 3.800.000", avatar: null },
    { rank: 5, name: "Istri Sultan", amount: "Rp 2.950.000", avatar: null },
  ];

  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] mb-2" />;
      case 2: return <Trophy className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)] mb-2" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)] mb-2" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-amber-500 mb-4 drop-shadow-sm uppercase tracking-wider">
          Leaderboard Sultan
        </h1>
        <p className="text-white/60">Peringkat top spender bulan ini. Jadilah nomor satu!</p>
      </div>

      <div className="bg-accent/30 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Top 3 Podium (Visual only for larger screens) */}
        <div className="hidden md:flex justify-center items-end gap-6 mb-16 pt-8">
          {/* Rank 2 */}
          <div className="flex flex-col items-center">
            {getRankIcon(2)}
            <div className="w-20 h-20 rounded-full border-4 border-gray-300 relative overflow-hidden mb-4 shadow-[0_0_15px_rgba(209,213,219,0.3)]">
              <img src={topSpenders[1].avatar!} alt={topSpenders[1].name} className="w-full h-full object-cover" />
            </div>
            <div className="w-28 h-24 bg-gradient-to-t from-gray-400/20 to-gray-300/10 rounded-t-lg flex items-center justify-center flex-col border-t border-gray-400/30">
              <span className="font-bold text-gray-300 text-xl font-mono">2</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center">
            {getRankIcon(1)}
            <div className="w-28 h-28 rounded-full border-4 border-yellow-400 relative overflow-hidden mb-4 shadow-[0_0_20px_rgba(250,204,21,0.5)] z-10">
              <img src={topSpenders[0].avatar!} alt={topSpenders[0].name} className="w-full h-full object-cover" />
            </div>
            <div className="w-32 h-32 bg-gradient-to-t from-yellow-500/20 to-yellow-400/10 rounded-t-lg flex items-center justify-center flex-col border-t border-yellow-400/30">
              <span className="font-bold text-yellow-400 text-3xl font-mono">1</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center">
            {getRankIcon(3)}
            <div className="w-16 h-16 rounded-full border-4 border-amber-600 relative overflow-hidden mb-4 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
              <img src={topSpenders[2].avatar!} alt={topSpenders[2].name} className="w-full h-full object-cover" />
            </div>
            <div className="w-24 h-20 bg-gradient-to-t from-amber-700/20 to-amber-600/10 rounded-t-lg flex items-center justify-center flex-col border-t border-amber-600/30">
              <span className="font-bold text-amber-600 text-lg font-mono">3</span>
            </div>
          </div>
        </div>

        {/* List View (For mobile and rank 4+) */}
        <div className="space-y-4 relative z-10">
          {topSpenders.map((user, index) => (
            <div 
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30' :
                index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30' :
                index === 2 ? 'bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30' :
                'bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 text-center font-mono font-bold ${
                  index === 0 ? 'text-yellow-400 text-xl' :
                  index === 1 ? 'text-gray-300 text-lg' :
                  index === 2 ? 'text-amber-500 text-lg' :
                  'text-white/40'
                }`}>
                  #{user.rank}
                </div>
                
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`font-bold ${index < 3 ? 'text-white' : 'text-white/80'}`}>{user.name}</h3>
                  <p className="text-xs text-secondary-foreground lg:hidden">{user.amount}</p>
                </div>
              </div>

              <div className="hidden lg:block text-right">
                <span className={`font-mono font-bold ${index === 0 ? 'text-yellow-400' : 'text-primary'}`}>
                  {user.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
