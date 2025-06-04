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
  <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-purple-500/30 bg-gray-900 shadow-2xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-3xl">
    {/* 右上順位バッジ */}
    {typeof rank === "number" && (
      <div className="absolute top-3 right-3 z-10 rounded-full border border-purple-500/30 bg-white/90 px-3 font-extrabold text-gray-900 text-lg shadow-md ">
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
    <div className="absolute right-0 bottom-0 left-0 flex flex-col items-start gap-0.5 bg-black/80 px-4 py-2 text-left backdrop-blur-sm">
      <div className="truncate font-extrabold text-2xl text-white tracking-wide">{symbol}</div>
      <div className="mb-2 truncate text-blue-200 text-sm">{name}</div>
      {/* 右下 %chance */}
      <div className="absolute right-[1rem] bottom-[1rem] flex flex-col items-end">
        <span className="font-medium text-gray-400 text-xs leading-none">% chance</span>
        <span className="font-extrabold text-2xl text-green-300 leading-tight">{percent}</span>
      </div>
    </div>
  </div>
);
