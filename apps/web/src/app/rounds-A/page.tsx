import { mockmemes } from "@workspace/mockdata";
import { RoundsACard } from "./RoundsACard";
import CommunicationPanel from "@/components/CommunicationPanel";

export default function RoundsAPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      <div className="flex flex-1">
        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto pb-6 pt-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight drop-shadow-lg">Rounds-A Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {mockmemes.map((meme, i) => (
                <RoundsACard
                  key={meme.symbol}
                  imageUrl={meme.iconUrl}
                  symbol={meme.symbol}
                  name={meme.name}
                  percent={i % 2 === 0 ? "0.9%" : "13%"}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>
        </main>
        {/* 右側チャット欄 */}
        <aside className="hidden lg:block">
          <CommunicationPanel />
        </aside>
      </div>
    </div>
  );
}