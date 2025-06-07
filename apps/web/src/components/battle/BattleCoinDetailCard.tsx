"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkCard } from "@/components/ui/dark-card";
import type { CoinWithRound } from "@/types/coin-with-round";
import Image from "next/image";

interface BattleCoinDetailCardProps {
  coin: CoinWithRound;
}

const BattleCoinDetailCard: React.FC<BattleCoinDetailCardProps> = ({ coin }) => {
  return (
    <DarkCard className="mt-4 w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-[240px] w-full">
            <Image src={coin.iconUrl} alt={coin.symbol} fill className="object-contain" />
          </div>
          <div className="text-center">
            <CardTitle className="font-bold text-2xl text-white">{coin.symbol}</CardTitle>
            <p className="mt-1 text-gray-400 text-lg">{coin.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-gray-300 text-sm">{coin.description}</p>
      </CardContent>
    </DarkCard>
  );
};

export default BattleCoinDetailCard;
