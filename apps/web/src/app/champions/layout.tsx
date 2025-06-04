import LayoutWithChat from "@/layouts/layout-with-chat";

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWithChat>
      <div className="mb-10 flex-1 overflow-y-auto pt-4 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Title Section */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-8">
            {/* バックグラウンドエフェクト */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 to-transparent opacity-60 blur-2xl" />

            <h1
              className="relative z-10 mb-8 text-center font-extrabold text-5xl tracking-tight drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]"
              style={{
                background: "linear-gradient(90deg, #FFD700 0%, #FFEB80 50%, #FFC700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              HALL OF CHAMPIONS
            </h1>

            <div className="mt-2 text-center font-bold">
              <span
                className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-2xl text-transparent tracking-wider"
                style={{ textShadow: "0 0 10px rgba(253, 224, 71, 0.6)" }}
              >
                The greatest champions of the Battle Royale
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </LayoutWithChat>
  );
}
