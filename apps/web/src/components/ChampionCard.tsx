import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/champions/1">
      <div className="group relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-xl border border-yellow-500/30 bg-gray-900 shadow-2xl shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-transform duration-200 hover:scale-[1.03] hover:shadow-3xl hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        {/* Champion of Round badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center rounded-full border border-yellow-300 bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 font-bold text-black text-sm tracking-wide shadow-md">
          <Trophy className="mr-1.5 h-4 w-4 text-black" />
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
            <span className="font-bold text-3xl text-yellow-500">{symbol}</span>
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-0.5 bg-black/80 px-4 py-2 backdrop-blur-sm">
          <div className="truncate font-extrabold text-2xl text-white tracking-wide">{symbol}</div>
          <div className="mb-2 truncate text-sm text-yellow-200">{name}</div>
          {/* 右下 MCap */}
          <div className="absolute right-[1rem] bottom-[1rem] flex flex-col items-end">
            <span className="font-medium text-gray-400 text-xs leading-none">MCap</span>
            <span className="font-extrabold text-2xl text-yellow-300 leading-tight">
              ${typeof mcap === "number" && !Number.isNaN(mcap) ? mcap.toLocaleString() : "0"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
