import { getChampions } from "@workspace/mockdata";
import { notFound } from "next/navigation";
import { ChampionDetailPage } from "./ChampionDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const champions = getChampions();
    const champion = champions.find((c) => c.round.round.toString() === id);
    if (!champion || !champion.meme) return notFound();

    return (
      <ChampionDetailPage
        coin={{
          id: champion.meme.id,
          round: champion.round.round,
          symbol: champion.meme.symbol,
          name: champion.meme.name,
          iconUrl: champion.meme.iconUrl,
          description: champion.meme.description,
          marketCap: 100000,
          share: 40,
        }}
        id={id}
      />
    );
  });
}
