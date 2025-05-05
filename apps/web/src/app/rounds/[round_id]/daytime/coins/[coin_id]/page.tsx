import CoinDetailClient from "@/components/CoinDetailClient";
import { defaultChartData, mockChartData } from "@/mock/mockChartData";
import { mockCoinDetails } from "@/mock/mockCoinDetail";
import { notFound } from "next/navigation";

export default async function CoinDetailPage({
  params,
}: {
  params: Promise<{ round_id: string; coin_id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const { coin_id, round_id } = resolvedParams;

  // Get coin data from mock
  const coinData = mockCoinDetails[coin_id.toLowerCase()];

  // If coin not found, show 404
  if (!coinData) {
    return notFound();
  }

  // Get chart data from mock
  const chartData = mockChartData[coin_id.toLowerCase()] || defaultChartData;

  // Pass all data to client component for rendering with state
  return (
    <CoinDetailClient
      coinData={coinData}
      chartData={chartData}
      round_id={round_id}
    />
  );
}
