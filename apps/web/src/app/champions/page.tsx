import Link from "next/link";
import { ChampionCoinCard } from "../../components/ChampionCoinCard";
import CommunicationPanel from "../../components/CommunicationPanel";
import { mockChampionCoins } from "../../mock/mockChampionCoins";

export default function ChampionsPage() {
  return (
    <div className="relative flex">
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Champions</h1>
            <Link href="/coins" className="text-blue-500 hover:underline">
              View All Coins
            </Link>
          </div>

          <div className="grid gap-4">
            {mockChampionCoins.map((coin) => (
              <ChampionCoinCard key={coin.address} {...coin} />
            ))}
          </div>
        </div>
      </div>
      <CommunicationPanel />
    </div>
  );
}
