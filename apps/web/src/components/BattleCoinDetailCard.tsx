"use client";

import { DarkCard } from "@/components/ui/dark-card";
import type { RoundCoin } from "@/types/roundcoin";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/shadcn/components/card";
import Image from "next/image";

interface BattleCoinDetailCardProps {
  coin: RoundCoin;
}

const BattleCoinDetailCard: React.FC<BattleCoinDetailCardProps> = ({
  coin,
}) => {
  return (
    <DarkCard className="w-full mt-4">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-full h-[240px]">
            <Image
              src={coin.iconUrl}
              alt={coin.symbol}
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {coin.symbol}
            </CardTitle>
            <p className="text-lg text-gray-400 mt-1">{coin.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300 whitespace-pre-wrap">
          {coin.description}
        </p>
      </CardContent>
    </DarkCard>
  );
};

export default BattleCoinDetailCard;
