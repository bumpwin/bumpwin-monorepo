import { ChampionDetailPage } from "@/app/champions/[id]/ChampionDetailPage";
import { mockChampionCoinMetadata } from "@/mock/mockData";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const coin = mockChampionCoinMetadata.find((c) => c.id === id);
    if (!coin) return notFound();

    return <ChampionDetailPage coin={coin} id={id} />;
  });
}
