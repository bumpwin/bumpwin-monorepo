import Image from "next/image";
import type React from "react";

export interface LoserCardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  mc?: string;
  rank?: number;
  aprLabel?: string;
  aprValue?: string;
  stakingLabel?: string;
  stakingValue?: string;
}

export const LoserCard: React.FC<LoserCardProps> = ({
  imageUrl,
  title,
  subtitle,
  description,
  price,
  mc,
  rank,
  aprLabel,
  aprValue,
  stakingLabel,
  stakingValue,
}) => (
  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-teal-500/30 bg-gray-900 shadow-2xl">
    {typeof rank === "number" && (
      <div className="absolute top-2 right-2 z-10 rounded-full bg-white/90 px-3 py-1 font-bold text-gray-900 text-xs shadow-md">
        #{rank}
      </div>
    )}
    <Image
      src={imageUrl}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    <div className="absolute right-0 bottom-0 left-0 bg-black/70 p-4 backdrop-blur-sm">
      <div className="mb-1 truncate font-bold text-3xl text-white tracking-wider">{title}</div>
      {subtitle && <div className="mb-1 truncate text-gray-300 text-sm">{subtitle}</div>}
      {description && (
        <div className="mb-2 line-clamp-3 whitespace-pre-line text-gray-200 text-xs">
          {description}
        </div>
      )}
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <div className="text-gray-400 text-xs">Price</div>
          <div className="font-bold text-sm text-white">{price ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">MC</div>
          <div className="font-bold text-sm text-white">{mc ?? "—"}</div>
        </div>
      </div>
      {(aprLabel || stakingLabel) && (
        <div className="mt-2 flex items-center justify-between">
          {aprLabel && <div className="text-gray-400 text-xs">{aprLabel}</div>}
          <div className="flex items-center gap-6">
            {stakingLabel && (
              <div>
                <span className="text-gray-400 text-xs">{stakingLabel} </span>
                <div className="font-bold text-sm text-white">{stakingValue}</div>
              </div>
            )}
            {aprValue && !stakingLabel && (
              <div className="font-bold text-sm text-white">{aprValue}</div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
