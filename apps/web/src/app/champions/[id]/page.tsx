import { mockChampionCoinMetadata } from "@/mock/mockData";
import { LWCChart, type OHLCData } from "@workspace/shadcn/components/chart/lwc-chart";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/shadcn/components/card";
import { Send, Globe, Twitter, ArrowLeft } from "lucide-react";

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

export default async function ChampionDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coin = mockChampionCoinMetadata.find((c) => c.id.toString() === id);
  if (!coin) return notFound();

  const ohlcData = generateOHLCData(id);

  // コインの色から適切なチャートラインの色を生成
  const chartColor = coin.color || "rgba(76, 175, 80, 1)";

  // 現在の価格（最新のクローズ値）
  const currentPrice = ohlcData.length > 0 ? ohlcData[ohlcData.length - 1]?.close ?? 0 : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-40 h-40 mb-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[6px] shadow-[0_0_32px_8px_rgba(255,215,0,0.25)]">
            <div className="absolute inset-0 rounded-full bg-white p-[3px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image
                  src={coin.iconUrl}
                  alt={coin.name}
                  width={160}
                  height={160}
                  className="rounded-full w-full h-full object-cover border-0"
                />
                <div className="absolute left-3 top-3 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
            #{coin.round}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          {coin.name}
          <span className="text-xl text-gray-400">({coin.symbol})</span>
        </h1>

        <p className="text-gray-300 text-center text-lg mb-2 max-w-md">
          {coin.description}
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-black/30 border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-white">
                ${currentPrice.toFixed(6)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-white">
                ${(coin?.marketCap || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full bg-black/20 backdrop-blur-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white">Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <LWCChart
              data={ohlcData}
              currentPrice={currentPrice}
              height={400}
              className="mt-3"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-4">
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
