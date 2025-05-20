import DominanceRechart from "./DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "../mock/mockData";

const InfoBar = () => {
  // DominanceRechart用データ整形
  const chartPoints = mockDominanceChartData.map((point) => ({
    timestamp: point.timestamp,
    ...point.shares.reduce(
      (acc, share, index) => ({
        ...acc,
        [mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]: share,
      }),
      {},
    ),
  }));
  const chartCoins = mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));

  return (
    <div className="w-full bg-black/30 backdrop-blur-md py-3 rounded-xl mb-6">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6 px-4">
        <span className="text-white font-bold text-lg mr-4">Battle Round 12</span>
        <div className="flex flex-row gap-4">
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs">Market Cap</span>
            <span className="text-white font-bold text-lg">$180.09K</span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs">Volume</span>
            <span className="text-white font-bold text-lg">$66K</span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs">Meme Count</span>
            <span className="text-white font-bold text-lg">24</span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center min-w-[120px]">
            <span className="text-gray-400 text-xs">Trader Count</span>
            <span className="text-white font-bold text-lg">119</span>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <DominanceRechart points={chartPoints} coins={chartCoins} height={180} compact hideLegend />
      </div>
    </div>
  );
};

export default InfoBar;
