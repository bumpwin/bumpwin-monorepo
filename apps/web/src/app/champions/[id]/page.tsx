import { mockChampionCoinMetadata } from "@/mock/mockData";
import { PriceChart, type PriceChartData } from "@workspace/shadcn/components/chart/price-chart";
import { LWCChart, type OHLCData } from "@workspace/shadcn/components/chart/lwc-chart";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// モックの価格データを生成（日付形式を確実にYYYY-MM-DD文字列で）
function generateMockPriceData(coinId: string): PriceChartData[] {
  const data: PriceChartData[] = [];
  const now = new Date();
  const baseValue = 100 + Number.parseInt(coinId) * 20; // コインIDによって初期値を変える
  let value = baseValue;
  
  // トレンドを設定（コインIDに基づく）
  const trend = Number.parseInt(coinId) % 3 === 0 ? 2 : Number.parseInt(coinId) % 3 === 1 ? 0.5 : -1;
  
  for (let i = 0; i < 30; i++) {
    // 過去30日分のデータを生成
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    
    // 日付を YYYY-MM-DD 形式に変換
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
    const day = String(date.getDate()).padStart(2, '0');
    const timeStr = `${year}-${month}-${day}`;
    
    // トレンドに従って価格を変動させる（ランダム性も含める）
    value = value + trend + (Math.random() - 0.5) * 15;
    
    data.push({
      time: timeStr,
      value: Math.max(10, value), // 最低価格は10
    });
  }
  console.log(`Generated price data for coin ${coinId}:`, data);
  return data;
}

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

  const priceData = generateMockPriceData(id);
  const ohlcData = generateOHLCData(id);
  
  // コインの色から適切なチャートラインの色を生成
  const chartColor = coin.color || "rgba(76, 175, 80, 1)";
  
  // 現在の価格（最新のクローズ値）
  const currentPrice = ohlcData.length > 0 ? ohlcData[ohlcData.length - 1].close : 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
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
        <p className="text-gray-300 text-center text-lg mb-4 max-w-md">
          {coin.description}
        </p>
        
        {/* 2つのタブでチャートを切り替え表示 */}
        <div className="w-full bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-xl font-semibold text-white">
                  ${currentPrice.toFixed(6)}
                </div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                <div className="text-xl font-semibold text-white">
                  ${(coin?.marketCap || 0).toLocaleString()}
                </div>
              </div>
            </div>
          
            <div className="mb-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white mb-2">Price Chart</h3>
            </div>
            
            {/* ローソク足チャート */}
            <div className="mb-6">
              <LWCChart 
                data={ohlcData} 
                currentPrice={currentPrice}
                height={360}
                className="mt-3" 
              />
            </div>
            
            {/* ラインチャート */}
            <div className="mb-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-gray-300">Price History</h3>
            </div>
            <PriceChart data={priceData} height={240} lineColor={chartColor} />
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
          {coin.telegramLink && (
            <a
              href={coin.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Telegram"
              >
                <title>Telegram Link</title>
                <path d="M9.04 13.94l-.37 3.66c.53 0 .76-.23 1.04-.5l2.5-2.38 5.18 3.78c.95.52 1.62.25 1.86-.88l3.38-15.88c.31-1.44-.52-2-1.44-1.66L2.2 9.24c-1.39.56-1.37 1.36-.24 1.7l4.1 1.28 9.52-6.02c.45-.28.87-.13.53.18z" />
              </svg>
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
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Website"
              >
                <title>Website Link</title>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
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
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Twitter"
              >
                <title>Twitter Link</title>
                <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" />
              </svg>
            </a>
          )}
        </div>
        <Link
          href="/champions"
          className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors underline"
        >
          ← Back to Champions
        </Link>
      </div>
    </div>
  );
}
