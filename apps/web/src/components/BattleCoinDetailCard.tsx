"use client";

import { DarkCard } from "@/components/ui/dark-card";
import { getMemeMarketData } from "@/mock/mockData";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/shadcn/components/card";
import type { MemeMetadata } from "@workspace/types";
import Image from "next/image";

interface BattleCoinDetailCardProps {
  coin: MemeMetadata & { round?: number };
}

const BattleCoinDetailCard: React.FC<BattleCoinDetailCardProps> = ({
  coin,
}) => {
  const marketData = getMemeMarketData(coin.id);

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
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Market Cap</span>
            <span className="text-white">
              ${marketData?.marketCap.toLocaleString() || "0"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price</span>
            <span className="text-white">
              ${marketData?.price.toFixed(6) || "0.000000"}
            </span>
          </div>
        </div>
      </CardContent>
    </DarkCard>
  );
};

export default BattleCoinDetailCard;
