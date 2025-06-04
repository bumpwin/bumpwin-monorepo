import { ResultView } from "@/components/ResultView";
import { mockLastChampionCoinMetadata } from "@/mock/mockData";

export default function WasabiPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <ResultView
        coin={{
          ...mockLastChampionCoinMetadata,
          id: mockLastChampionCoinMetadata.id.toString(),
        }}
        forceVisible={true}
      />
    </div>
  );
}
