"use client";

import { api } from "@/app/client";
import BattleCoinDetailCard from "@/components/BattleCoinDetailCard";
import { ChartTitle } from "@/components/ChartTitle";
import ChampionSwapUI from "@/components/ui/swap/variants/ChampionSwapUI";
import type { RoundCoin } from "@/types/roundcoin";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@workspace/shadcn/components/card";
import { LWCChart, type OHLCData } from "@workspace/shadcn/components/chart/lwc-chart";

interface ChampionDetailPageProps {
  coin: RoundCoin;
  id: string;
}

export const ChampionDetailPage = ({ coin }: ChampionDetailPageProps) => {
  const { data: priceData } = useQuery({
    queryKey: ["mockprice", coin.id],
    queryFn: async () => {
      const res = await api.mockprice.$get({
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
    priceData && priceData.length > 0 ? (priceData[priceData.length - 1]?.close ?? 0) : 0;

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      {/* メイン2カラム */}
      <div className="flex min-h-[600px] flex-1 items-start gap-8 px-8 pb-8">
        {/* 左: 詳細/チャート */}
        <div className="flex flex-1 flex-col gap-6">
          {/* チャート */}
          <Card className="border border-[#23262F] bg-black/20 shadow-lg">
            <CardHeader>
              <ChartTitle coin={coin} />
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LWCChart data={priceData || fallbackData} currentPrice={currentPrice} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右: Swap UI */}
        <div className="sticky top-8 w-[400px]">
          <ChampionSwapUI coin={coin} />
          <BattleCoinDetailCard coin={coin} />
        </div>
      </div>
    </div>
  );
};
