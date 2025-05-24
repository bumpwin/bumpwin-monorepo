interface StatsBarProps {
  compact?: boolean;
}

function StatCard({
  title,
  value,
  compact = false,
}: { title: string; value: string; compact?: boolean }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#1A1D2A]/90 to-[#13151E] rounded-xl border border-[#343850]/60 shadow-inner group hover:border-[#343850]/80 hover:shadow-[0_0_15px_rgba(0,0,0,0.4)_inset] transition-all duration-300 overflow-hidden relative ${compact ? "p-2 scale-[0.98]" : "p-3"}`}
    >
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      {/* Ambient glow in corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <p
        className={`text-gray-400 ${compact ? "text-xs" : "text-sm"} font-medium mb-0.5 group-hover:text-gray-300 transition-colors duration-300`}
      >
        {title}
      </p>
      <p
        className={`${compact ? "text-lg" : "text-2xl"} font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight group-hover:from-white group-hover:to-white transition-colors duration-300`}
      >
        {value}
      </p>
    </div>
  );
}

const StatsBar = ({ compact = false }: StatsBarProps) => {
  return (
    <div
      className={`w-full transition-all duration-300 ease-out ${
        compact
          ? "py-1.5 bg-[#0F1017]/95 backdrop-blur-lg shadow-lg border-b border-[#343850]/40"
          : "py-3.5 bg-gradient-to-br from-[#1D1F2B]/95 to-[#13151E]/95 backdrop-blur-md border-b border-[#343850]/30"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Stats grid - responsive for all screens */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 transition-all duration-300 ${
            compact ? "opacity-95 transform" : "opacity-100"
          }`}
        >
          <StatCard title="Market Cap" value="$180.09K" compact={compact} />
          <StatCard title="Volume" value="$66K" compact={compact} />
          <StatCard title="Meme Count" value="24" compact={compact} />
          <StatCard title="Trader Count" value="119" compact={compact} />
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
