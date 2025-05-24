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
      className={`w-full flex items-center justify-center gap-4 text-base sm:text-lg font-semibold text-white bg-black/40 rounded-lg px-3 py-1.5 shadow-sm ${className}`}
      style={{ letterSpacing: "0.01em" }}
    >
      <span className="flex items-center gap-1">
        🏁 <span>Round</span> <span className="font-bold">{round}</span>
      </span>
      <span className="flex items-center gap-1">
        🪙 <span>Total MCap</span>{" "}
        <span className="font-bold">{marketCap}</span>
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
