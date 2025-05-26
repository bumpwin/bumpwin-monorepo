import { ResultView } from "@/components/ResultView";
import {
  getMemeMarketData,
  mockLastChampionCoinMetadata,
} from "@/mock/mockData";

export default function WasabiPage() {
  const marketData = getMemeMarketData(mockLastChampionCoinMetadata.id);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <ResultView
        coin={{
          address: mockLastChampionCoinMetadata.id,
          symbol: mockLastChampionCoinMetadata.symbol,
          name: mockLastChampionCoinMetadata.name,
          logoUrl: mockLastChampionCoinMetadata.iconUrl,
          description: mockLastChampionCoinMetadata.description,
          marketCap: marketData?.marketCap ?? 0,
          isFavorite: false,
          price: marketData?.price,
        }}
        forceVisible={true}
      />
    </div>
  );
}
