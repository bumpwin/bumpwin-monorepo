"use client";

import { mockprice } from "@/app/client";
import BattleCoinDetailCard from "@/components/BattleCoinDetailCard";
import { ChartTitle } from "@/components/ChartTitle";
import ChampionSwapUI from "@/components/ui/swap/variants/ChampionSwapUI";
import type { BattleCoin } from "@/types/battle";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/shadcn/components/card";
import {
  LWCChart,
  type OHLCData,
} from "@workspace/shadcn/components/chart/lwc-chart";

interface ChampionDetailPageProps {
  coin: BattleCoin;
  id: string;
}

export const ChampionDetailPage = ({ coin }: ChampionDetailPageProps) => {
  const { data: priceData } = useQuery({
    queryKey: ["mockprice", coin.id],
    queryFn: async () => {
      const res = await mockprice({
        query: { seed: coin.id, freq: "day", count: "30" },
      });
      const json = await res.json();

      if ("error" in json) {
        throw new Error(json.error as string);
      }

      return json.data.map(
        (item: {
          timestamp: number;
          open: number;
          high: number;
          low: number;
          close: number;
        }) => {
          const date = new Date(item.timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const timeStr = `${year}-${month}-${day}`;

          return {
            time: timeStr,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          };
        },
      );
    },
  });

  const fallbackData: OHLCData[] = [];
  const currentPrice =
    priceData && priceData.length > 0
      ? (priceData[priceData.length - 1]?.close ?? 0)
      : 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      {/* メイン2カラム */}
      <div className="flex flex-1 px-8 pb-8 gap-8 items-start min-h-[600px]">
        {/* 左: 詳細/チャート */}
        <div className="flex-1 flex flex-col gap-6">
          {/* チャート */}
          <Card className="bg-black/20 border border-[#23262F] shadow-lg">
            <CardHeader>
              <ChartTitle coin={coin} />
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LWCChart
                  data={priceData || fallbackData}
                  currentPrice={currentPrice}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右: Swap UI */}
        <div className="w-[400px] sticky top-8">
          <ChampionSwapUI coin={coin} />
          <BattleCoinDetailCard coin={coin} />
        </div>
      </div>
    </div>
  );
};
