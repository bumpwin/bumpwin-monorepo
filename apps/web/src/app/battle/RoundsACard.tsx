import Image from "next/image";

export interface RoundsACardProps {
  imageUrl: string;
  symbol: string;
  name: string;
  percent: string;
  rank?: number;
}

export const RoundsACard: React.FC<RoundsACardProps> = ({
  imageUrl,
  symbol,
  name,
  percent,
  rank,
}) => (
  <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-purple-500/30 bg-gray-900 transition-transform duration-200 hover:scale-[1.03] hover:shadow-3xl group">
    {/* 右上順位バッジ */}
    {typeof rank === "number" && (
      <div className="absolute top-3 right-3 z-10 bg-white/90 text-gray-900 text-lg font-extrabold px-3 rounded-full shadow-md border border-purple-500/30 ">
        #{rank}
      </div>
    )}
    <Image
      src={imageUrl}
      alt={symbol}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-4 py-2 flex flex-col gap-0.5">
      <div className="text-2xl font-extrabold text-white tracking-wide truncate">{symbol}</div>
      <div className="text-sm text-blue-200 truncate mb-2">{name}</div>
      {/* 右下 %chance */}
      <div className="absolute right-[1rem] bottom-[1rem] flex flex-col items-end">
        <span className="text-xs text-gray-400 font-medium leading-none">% chance</span>
        <span className="text-2xl font-extrabold text-green-300 leading-tight">{percent}</span>
      </div>
    </div>
  </div>
);