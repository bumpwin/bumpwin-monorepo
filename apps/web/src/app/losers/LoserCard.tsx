import Image from "next/image";
import React from "react";

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
  <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-purple-500/30 bg-gray-900">
    {typeof rank === "number" && (
      <div className="absolute top-2 right-2 z-10 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
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
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
      <div className="text-3xl font-bold tracking-wider mb-1 text-white truncate">{title}</div>
      {subtitle && <div className="text-gray-300 text-sm mb-1 truncate">{subtitle}</div>}
      {description && <div className="text-gray-200 text-xs mb-2 whitespace-pre-line line-clamp-3">{description}</div>}
      <div className="flex justify-between items-end mt-2 gap-4">
        <div>
          <div className="text-gray-400 text-xs">Price</div>
          <div className="text-white text-sm font-bold">{price ?? "—"}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">MC</div>
          <div className="text-white text-sm font-bold">{mc ?? "—"}</div>
        </div>
      </div>
      {(aprLabel || stakingLabel) && (
        <div className="flex justify-between items-center mt-2">
          {aprLabel && <div className="text-gray-400 text-xs">{aprLabel}</div>}
          <div className="flex items-center gap-6">
            {stakingLabel && (
              <div>
                <span className="text-gray-400 text-xs">{stakingLabel} </span>
                <div className="text-white text-sm font-bold">{stakingValue}</div>
              </div>
            )}
            {aprValue && !stakingLabel && (
              <div className="text-white text-sm font-bold">{aprValue}</div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
); 