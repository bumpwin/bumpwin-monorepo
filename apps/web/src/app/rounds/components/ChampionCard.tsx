import { Trophy } from "lucide-react";
import Image from "next/image";
import React from "react";
import type { CoinMetadata, Round } from "../types";
import { getSafeIcon, getSafeSymbol } from "../utils";

interface ChampionCardProps {
  round: Round;
  mockCoinMetadata: CoinMetadata[];
}

export function ChampionCard({ round, mockCoinMetadata }: ChampionCardProps) {
  return (
    <div className="w-[320px] h-full">
      <div className="relative h-full w-full rounded-xl shadow-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.25)] bg-black/70 overflow-hidden">
        {/* Champion badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-1 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-lg z-20">
          <Trophy className="w-3 h-3 mr-1" />
          CHAMPION
        </div>

        {/* Coin image - taking most of the height */}
        <div className="w-full pt-[75%] relative">
          <Image
            src={getSafeIcon(
              mockCoinMetadata,
              round.round % mockCoinMetadata.length,
            )}
            alt={getSafeSymbol(
              mockCoinMetadata,
              round.round % mockCoinMetadata.length,
            )}
            fill
            className="object-cover absolute top-0 left-0"
          />
        </div>

        {/* Info footer */}
        <div className="bg-black/80 backdrop-blur-sm px-3 py-2">
          <div className="text-2xl font-extrabold text-yellow-400 tracking-wide truncate">
            {getSafeSymbol(
              mockCoinMetadata,
              round.round % mockCoinMetadata.length,
            )}
          </div>
          <div className="text-sm text-gray-300 truncate mb-1">
            Round {round.round} Winner
          </div>

          <div className="grid grid-cols-2 gap-1 border-t border-gray-700 pt-1">
            <div>
              <span className="text-gray-400 text-xs block">MCap</span>
              <div className="flex items-center">
                <span className="text-white text-sm font-bold">
                  {round.metrics.mcap}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-xs block">volume</span>
              <div className="flex items-center">
                <span className="text-white text-sm font-bold">
                  {round.metrics.volume}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
