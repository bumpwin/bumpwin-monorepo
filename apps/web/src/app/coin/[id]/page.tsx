import LWCChart from "@/components/LWCChart";
import { defaultChartData, mockChartData } from "@/mock/mockChartData";
import { mockCoinDetails } from "@/mock/mockCoinDetail";
import { notFound } from "next/navigation";

export default async function TokensPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // コインデータを取得
  const coinData = mockCoinDetails[id.toLowerCase()];

  // コインが見つからない場合は404ページへ
  if (!coinData) {
    return notFound();
  }

  // チャートデータを取得（なければデフォルトデータを使用）
  const chartData = mockChartData[id.toLowerCase()] || defaultChartData;

  return (
    <main className="min-h-screen bg-gray-900 p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">{coinData.name}</h1>
        <div className="text-gray-400">{coinData.symbol}</div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <LWCChart data={chartData} currentPrice={coinData.price} />
      </div>
    </main>
  );
}
