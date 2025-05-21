import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface ChampionCardProps {
  imageUrl: string;
  symbol: string;
  name: string;
  mcap: number;
  round: number;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  imageUrl,
  symbol,
  name,
  mcap,
  round,
}) => (
  <Link href="/champions/1">
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-yellow-500/30 bg-gray-900 transition-transform duration-200 hover:scale-[1.03] hover:shadow-3xl group cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
      {/* Champion of Round badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-1 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-lg">
        <Trophy className="w-3 h-3 mr-1" />
        Champion of #{round}
      </div>
      <Image
        src={imageUrl}
        alt={symbol}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-4 py-2 flex flex-col gap-0.5">
        <div className="text-2xl font-extrabold text-white tracking-wide truncate">
          {symbol}
        </div>
        <div className="text-sm text-yellow-200 truncate mb-2">{name}</div>
        {/* 右下 MCap */}
        <div className="absolute right-[1rem] bottom-[1rem] flex flex-col items-end">
          <span className="text-xs text-gray-400 font-medium leading-none">
            MCap
          </span>
          <span className="text-2xl font-extrabold text-yellow-300 leading-tight">
            $
            {typeof mcap === "number" && !Number.isNaN(mcap)
              ? (mcap / 1000000).toFixed(1)
              : "0"}
            M
          </span>
        </div>
      </div>
    </div>
  </Link>
);
