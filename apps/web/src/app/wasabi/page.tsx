import { ResultView } from "@/components/ResultView";
import { getChampions } from "@workspace/mockdata";

export default function WasabiPage() {
  const champions = getChampions();
  const lastChampion = champions[champions.length - 1];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <ResultView
        coin={{
          id: lastChampion?.meme?.id || "0",
          round: lastChampion?.round.round || 4,
          symbol: lastChampion?.meme?.symbol || "JELL",
          name: lastChampion?.meme?.name || "JELL",
          iconUrl: lastChampion?.meme?.iconUrl || "/images/mockmemes/JELL.png",
          share: 68,
          marketCap: 100000,
          description:
            lastChampion?.meme?.description ||
            "JELL Protocol provides jiggle economics and jiggle governance.",
        }}
        forceVisible={true}
      />
    </div>
  );
}
