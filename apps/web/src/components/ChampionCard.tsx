import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface ChampionCardProps {
  id: string;
  imageUrl: string;
  symbol: string;
  name: string;
  mcap: number;
  round: number;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  id,
  imageUrl,
  symbol,
  name,
  mcap,
  round,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/champions/${id}`}>
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-yellow-500/30 bg-gray-900 transition-transform duration-200 hover:scale-[1.03] hover:shadow-3xl group cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        {/* Champion of Round badge */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-1 px-3 rounded-full text-sm tracking-wide flex items-center shadow-md border border-yellow-300">
          <Trophy className="w-4 h-4 mr-1.5 text-black" />
          Round {round}
        </div>

        {!imgError ? (
          <Image
            src={imageUrl}
            alt={symbol}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-3xl font-bold text-yellow-500">{symbol}</span>
          </div>
        )}

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
                ? mcap.toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
