import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";

interface ChampCardProps {
  image: string;
  name: string;
  round: string;
  mcap: string;
  volume: string;
  subtitle?: string;
  tradeUrl?: string;
  allChampionsUrl?: string;
  className?: string;
}

export function ChampCard({
  image,
  name,
  round,
  mcap,
  volume,
  subtitle,
  tradeUrl,
  allChampionsUrl,
  className,
}: ChampCardProps) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl shadow-2xl border border-yellow-500/30 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-yellow-500/10 before:z-0 bg-gradient-to-br from-gray-900/80 to-gray-800/40 ${className || ""}`}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl z-0" />
      <Image
        src={image}
        alt={`Champion - ${name}`}
        fill
        className="w-full h-full object-cover relative z-10"
      />
      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-1 px-4 rounded-lg text-sm uppercase tracking-wider flex items-center shadow-lg z-20">
        <Trophy className="w-4 h-4 mr-1" />
        Champion
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm px-4 py-3 z-10 w-full">
        <div className="text-2xl font-bold tracking-wider text-amber-400 -mb-1">
          {name}
        </div>
        <div className="text-gray-300 text-sm mb-2">{subtitle || round}</div>
        <div className="grid grid-cols-2 gap-3 border-t border-gray-700/70 pt-2">
          <div>
            <span className="text-gray-400 text-xs block">mcap </span>
            <div className="flex items-center">
              <span className="text-white text-sm font-bold">{mcap}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">24h vol </span>
            <div className="flex items-center">
              <span className="text-white text-sm font-bold">{volume}</span>
            </div>
          </div>
        </div>
        {tradeUrl && (
          <Link
            href={tradeUrl}
            className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-black hover:opacity-90 transition-all duration-300 hover:scale-[1.02] text-center text-sm"
          >
            Trade This Champ
          </Link>
        )}
        {allChampionsUrl && (
          <Link
            href={allChampionsUrl}
            className="mt-2 ml-2 inline-block px-4 py-2 bg-gray-800/70 border border-yellow-500/30 rounded-lg font-bold text-yellow-400 hover:bg-gray-700 transition-all duration-300 hover:border-yellow-500 text-sm"
          >
            View All Champions
          </Link>
        )}
      </div>
    </div>
  );
}
