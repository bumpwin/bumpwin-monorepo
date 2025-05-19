import { notFound } from "next/navigation";
import { mockChampionCoinMetadata } from "@/mock/mockData";
import { ChampionDetailPage } from "./ChampionDetailPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return params.then(({ id }) => {
    const coin = mockChampionCoinMetadata.find((c) => c.id === id);
    if (!coin) return notFound();

    return <ChampionDetailPage coin={coin} id={id} />;
  });
}
