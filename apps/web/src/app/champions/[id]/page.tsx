"use client";

import { mockChampionCoinMetadata } from "@/mock/mockData";
import { LWCChart, type OHLCData } from "@workspace/shadcn/components/chart/lwc-chart";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/shadcn/components/card";
import { Send, Globe, Twitter, ArrowLeft } from "lucide-react";
import SwapUI from "@/components/SwapUI";
import { useQuery } from "@tanstack/react-query";

// ローソク足チャート用のOHLCデータを生成
function generateOHLCData(coinId: string): OHLCData[] {
  const data: OHLCData[] = [];
  const now = new Date();
  // コインIDによって初期値を変える
  // より小さな値を使用（仮想通貨価格を模倣）
  const baseValue = 0.0001 + (Number.parseInt(coinId) % 3) * 0.0002;
  let price = baseValue;

  for (let i = 0; i < 30; i++) {
    // 過去30日分のデータを生成
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));

    // 日付を YYYY-MM-DD 形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timeStr = `${year}-${month}-${day}`;

    // 前日の価格を基準に変動を生成
    const volatility = 0.05; // 5%の変動
    const changePercent = (Math.random() - 0.5) * volatility * 2; // -5%から+5%

    const open = price;
    const close = open * (1 + changePercent);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02); // 最大2%高い
    const low = Math.min(open, close) * (1 - Math.random() * 0.02); // 最大2%低い

    data.push({
      time: timeStr,
      open,
      high,
      low,
      close
    });

    // 次の日の始値は前日の終値
    price = close;
  }

  return data;
}

export default function ChampionDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const coin = mockChampionCoinMetadata.find((c) => c.id.toString() === id);
  if (!coin) return notFound();

  // mock priceデータをreact-queryでfetch
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["mockprice", id],
    queryFn: async () => {
      const res = await fetch(`/api/mockprice?seed=${id}&freq=day&count=30`);
      if (!res.ok) throw new Error("Failed to fetch price data");
      const json = await res.json();
      // timestamp形式をtime形式に変換（LWCChartの期待する形式に合わせる）
      return json.data.map((item: { timestamp: number; value: number }) => ({
        time: new Date(item.timestamp).toISOString().split('T')[0],
        open: item.value * 0.98,  // 仮の計算: 適当にOHLCデータを生成
        high: item.value * 1.02,
        low: item.value * 0.95,
        close: item.value
      }));
    },
  });

  const ohlcData = generateOHLCData(id);
  const chartColor = coin.color || "rgba(76, 175, 80, 1)";
  const currentPrice = ohlcData.length > 0 ? ohlcData[ohlcData.length - 1]?.close ?? 0 : 0;

  // champion coin を RoundCoin 型にマッピング
  const roundCoin = {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    iconUrl: coin.iconUrl,
    round: coin.round,
    share: coin.share ?? 0,
    marketCap: coin.marketCap ?? 0,
    description: coin.description,
    telegramLink: coin.telegramLink,
    websiteLink: coin.websiteLink,
    twitterLink: coin.twitterLink,
    color: coin.color,
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* チャート（左2/3） */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Card className="w-full bg-black/20 backdrop-blur-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              {isPriceLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
                </div>
              ) : (
                <LWCChart
                  data={priceData || ohlcData}
                  currentPrice={currentPrice}
                  height={400}
                  className="mt-3"
                />
              )}
            </CardContent>
          </Card>
        </div>
        {/* コイン詳細パネル（右1/3） */}
        <div className="flex flex-col gap-6">
          <div>
            <SwapUI coin={roundCoin} />
          </div>
          {/* コイン画像・名前・シンボル */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28 mb-2">
              <Image
                src={coin.iconUrl}
                alt={coin.name}
                width={112}
                height={112}
                className="rounded-full w-full h-full object-cover border-2 border-yellow-400 shadow-lg"
              />
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
                #{coin.round}
              </div>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              {coin.name}
              <span className="text-base text-gray-400">({coin.symbol})</span>
            </div>
          </div>
          {/* bonding curve progress */}
          <div>
            <div className="text-sm text-gray-300 mb-1">bonding curve progress: <span className="font-semibold text-white">1%</span></div>
            <div className="w-full h-2 bg-gray-700 rounded">
              <div className="h-2 bg-green-400 rounded" style={{ width: '1%' }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">graduate this coin to PumpSwap at $68,387 market cap.<br />there is 0.007 SOL in the bonding curve.</div>
          </div>
          {/* コントラクトアドレス */}
          <div>
            <div className="text-sm text-gray-300 mb-1">contract address</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded text-gray-200 select-all">AWWMk...kjR4</span>
              {/* コピー機能は省略 */}
            </div>
          </div>
          {/* 外部リンク */}
          <div className="flex gap-3">
            {coin.telegramLink && (
              <a
                href={coin.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Send size={28} />
              </a>
            )}
            {coin.websiteLink && (
              <a
                href={coin.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Website"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Globe size={28} />
              </a>
            )}
            {coin.twitterLink && (
              <a
                href={coin.twitterLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter size={28} />
              </a>
            )}
          </div>
          {/* トップホルダーリスト（ダミー） */}
          <div>
            <div className="text-sm text-gray-300 mb-1">top holders</div>
            <ul className="text-xs text-gray-200 bg-gray-800 rounded p-2 space-y-1">
              <li>1. bonding curve <span className="float-right">99.97%</span></li>
              <li>2. ZRYco2 <span className="float-right">0.02%</span></li>
              <li>3. Eg1cRg <span className="float-right">0.00%</span></li>
            </ul>
          </div>
          {/* Buy/Sell UI */}
        </div>
      </div>
      {/* 戻るリンク */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/champions"
          className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Champions
        </Link>
      </div>
    </div>
  );
}
