import { mockmemes } from "@workspace/mockdata";
import { LoserCard } from "@/app/losers/LoserCard";

export default function MockmemesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight drop-shadow-lg">Mockmemes Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {mockmemes.map((meme, i) => (
            <LoserCard
              key={meme.symbol}
              imageUrl={meme.iconUrl}
              title={meme.symbol}
              subtitle={meme.name}
              description={meme.description}
              price={"$0.000123"}
              mc={"$123,456"}
              rank={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 