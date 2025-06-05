interface SharrowStatsBarProps {
  round?: string | number;
  marketCap?: string;
  volume?: string;
  memeCount?: string | number;
  traderCount?: string | number;
  className?: string;
}

const SharrowStatsBar = ({
  round = 7,
  marketCap = "$180.09K",
  volume = "$66K",
  memeCount = 24,
  traderCount = 119,
  className = "",
}: SharrowStatsBarProps) => {
  return (
    <div
      className={`flex w-full items-center justify-center gap-4 rounded-lg bg-black/40 px-3 py-1.5 font-semibold text-base text-white shadow-sm sm:text-lg ${className}`}
      style={{ letterSpacing: "0.01em" }}
    >
      <span className="flex items-center gap-1">
        🏁 <span>Round</span> <span className="font-bold">{round}</span>
      </span>
      <span className="flex items-center gap-1">
        🪙 <span>Total MCap</span> <span className="font-bold">{marketCap}</span>
      </span>
      <span className="flex items-center gap-1">
        📊 <span>Vol.</span> <span className="font-bold">{volume}</span>
      </span>
      <span className="flex items-center gap-1">
        🍬 <span>memes</span> <span className="font-bold">{memeCount}</span>
      </span>
      <span className="flex items-center gap-1">
        👤 <span>traders</span> <span className="font-bold">{traderCount}</span>
      </span>
    </div>
  );
};

export default SharrowStatsBar;
