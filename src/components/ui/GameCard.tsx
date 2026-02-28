import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  id: string;
  title: string;
  imageUrl: string;
  developer?: string;
  variant?: 'vertical' | 'horizontal';
}

export default function GameCard({ id, title, imageUrl, developer = 'Developer', variant = 'vertical' }: GameCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/product/${id}`}
        className="group flex items-center gap-2.5 bg-surface border border-white/5 rounded-xl p-2.5 hover:bg-surface-hover hover:border-primary/20 transition-all duration-300"
      >
        <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">?</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-[10px] text-white/40 truncate mt-0.5">{developer}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${id}`}
      className="group flex flex-col bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,215,0,0.08)] transition-all duration-300"
    >
      <div className="relative w-full aspect-square overflow-hidden bg-white/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            No Image
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-[10px] text-white/40 truncate mt-0.5">{developer}</p>
      </div>
    </Link>
  );
}
