import React from 'react';
import Image from 'next/image';
import { Round, CoinMetadata } from '../types';
import { getSafeIcon, getSafeSymbol } from '../utils';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z"
              clipRule="evenodd"
            />
          </svg>
          CHAMPION
        </div>

        {/* Coin image - taking most of the height */}
        <div className="w-full pt-[75%] relative">
          <Image
            src={getSafeIcon(mockCoinMetadata, round.round % mockCoinMetadata.length)}
            alt={getSafeSymbol(mockCoinMetadata, round.round % mockCoinMetadata.length)}
            fill
            className="object-cover absolute top-0 left-0"
          />
        </div>

        {/* Info footer */}
        <div className="bg-black/80 backdrop-blur-sm px-3 py-2">
          <div className="text-2xl font-extrabold text-yellow-400 tracking-wide truncate">
            {getSafeSymbol(mockCoinMetadata, round.round % mockCoinMetadata.length)}
          </div>
          <div className="text-sm text-gray-300 truncate mb-1">Round {round.round} Winner</div>

          <div className="grid grid-cols-2 gap-1 border-t border-gray-700 pt-1">
            <div>
              <span className="text-gray-400 text-xs block">MCap</span>
              <div className="flex items-center">
                <span className="text-white text-sm font-bold">{round.metrics.mcap}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-xs block">volume</span>
              <div className="flex items-center">
                <span className="text-white text-sm font-bold">{round.metrics.volume}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 