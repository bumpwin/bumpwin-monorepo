interface StatsBarProps {
  compact?: boolean;
}

const StatsBar = ({ compact = false }: StatsBarProps) => {
  return (
    <div
      className={`w-full bg-black/30 backdrop-blur-md rounded-xl mb-6 ${
        compact ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-6 px-4">
        <span
          className={`text-white font-bold flex-shrink-0 ${
            compact ? "text-lg" : "text-2xl mr-4"
          }`}
        >
          Battle Round 7
        </span>
        <div className="flex flex-1 flex-row gap-4 justify-end">
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Market Cap
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              $180.09K
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Volume
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              $66K
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Meme Count
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              24
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Trader Count
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              119
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
