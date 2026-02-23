export default function GameCardSkeleton() {
  return (
    <div className="flex flex-col items-center bg-accent/20 rounded-2xl p-3 animate-pulse">
      <div className="relative w-full aspect-square mb-3 rounded-xl bg-white/5" />
      <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
  );
}
