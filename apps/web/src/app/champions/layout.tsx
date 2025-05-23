import LayoutWithChat from "@/app/layouts/layout-with-chat";

export default function BattleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWithChat>
      <div className="flex-1 overflow-y-auto pb-6 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center py-8 px-4 relative overflow-hidden">
            {/* バックグラウンドエフェクト */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-500/20 to-transparent opacity-60 blur-2xl" />

            <h1
              className="text-5xl font-extrabold text-center mb-14 tracking-tight z-10 relative drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]"
              style={{
                background:
                  "linear-gradient(90deg, #FFD700 0%, #FFEB80 50%, #FFC700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              HALL OF CHAMPIONS
            </h1>

            <div className="mt-6 text-center font-bold">
              <span
                className="text-2xl bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent tracking-wider"
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
