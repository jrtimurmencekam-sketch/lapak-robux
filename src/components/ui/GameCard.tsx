import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  id: string;
  title: string;
  imageUrl: string;
  developer?: string;
}

export default function GameCard({ id, title, imageUrl, developer = 'Developer' }: GameCardProps) {
  return (
    <Link 
      href={`/product/${id}`}
      className="group flex flex-col items-center bg-accent/40 rounded-2xl p-3 hover:bg-accent hover:ring-2 hover:ring-primary/50 transition-all duration-300"
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-xl bg-white/5">
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
      <h3 className="text-sm font-semibold text-white text-center line-clamp-1 w-full">{title}</h3>
      <p className="text-xs text-white/50 text-center line-clamp-1 w-full mt-1">{developer}</p>
    </Link>
  );
}
