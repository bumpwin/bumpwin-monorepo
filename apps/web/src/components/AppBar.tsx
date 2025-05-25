"use client";

import BattleClock from "@/components/BattleClock";
import { SuiWalletConnectButton } from "@/components/SuiWalletConnectButton";
import WordmarkLogo from "@/components/WordmarkLogo";
import { useBattleClock } from "@/providers/BattleClockProvider";
import { cn } from "@workspace/shadcn/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const roundsClickRef = useRef(false);
  const {
    isChallengePeriod,
    remainingTime,
    totalTime,
    challengeTime,
    setIsChallengePeriod,
    phase,
  } = useBattleClock();

  const navLinks = [
    { href: "/battle", label: "Battle" },
    { href: "/champions", label: "Champions" },
    { href: "/losers", label: "Losers" },
  ];

  // プログレスバーの進行度を計算
  const progress = ((totalTime - remainingTime) / totalTime) * 100;
  const challengePoint = ((totalTime - challengeTime) / totalTime) * 100;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    return path !== "/" && pathname.startsWith(path);
  };

  // ホームページに遷移したときにスクロール処理
  useEffect(() => {
    if (pathname === "/" && roundsClickRef.current) {
      roundsClickRef.current = false;

      // DOM読み込み完了後に実行
      setTimeout(() => {
        const roundsElement = document.getElementById("current-round");
        if (roundsElement) {
          roundsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [pathname]);

  const handleCreateCoinClick = () => {
    if (pathname === "/rounds") {
      router.push("/rounds?intent=create-coin");
    } else {
      router.push("/rounds?intent=create-coin");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur-md shadow-lg shadow-gray-900/50">
      <div className="flex h-16 items-center">
        {/* 左寄せセクション */}
        <div className="flex items-center pl-4 gap-6 flex-1">
          <Link href="/battle">
            <div className="scale-[0.45] max-w-[200px] flex items-center mb-2 mr-2">
              <WordmarkLogo />
            </div>
          </Link>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-xl text-gray-300 font-semibold transition-all duration-200 flex items-center justify-center",
                "hover:text-orange-400 w-24",
                "hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
                isActive(href) &&
                  "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 中央寄せセクション */}
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center justify-center h-full">
            <BattleClock
              totalSeconds={remainingTime}
              challengeSeconds={challengeTime}
              onChallengeStatusChange={setIsChallengePeriod}
            />
          </div>
        </div>

        {/* 右寄せセクション */}
        <div className="flex items-center justify-end gap-3 pr-4 flex-1">
          {/* Claim outcome ボタン */}
          <Link
            href="/rounds?intent=claim-outcome"
            className="flex items-center"
          >
            <button
              type="button"
              className="rounded-full px-4 py-1.5 text-sm font-medium
                text-amber-400 hover:text-amber-300
                hover:bg-amber-900/30 hover:border hover:border-amber-400/40
                transition-all duration-200"
            >
              Claim outcome
            </button>
          </Link>

          {/* Create Coin ボタン */}
          <button
            type="button"
            onClick={handleCreateCoinClick}
            className="rounded-full px-4 py-1.5 text-sm font-medium
              bg-gradient-to-r from-indigo-600 to-violet-600
              text-white border border-indigo-400/50
              hover:from-violet-600 hover:to-indigo-600 hover:border-indigo-300/70
              shadow-lg shadow-indigo-900/30 transition-all duration-200
              hover:scale-105"
          >
            Create Coin
          </button>

          {/* ウォレット接続ボタン */}
          <div className="h-10 flex items-center">
            <SuiWalletConnectButton />
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-0.5 bg-gray-800/50 relative">
        {/* チャレンジポイントのマーカー */}
        <div
          className="absolute top-[-1px] bottom-[-1px] w-1 bg-red-500 z-10 rounded-full"
          style={{ left: `${challengePoint}%` }}
        />

        {/* プログレスバー - 左から右へ進行、色はカウントダウンに連動 */}
        <div
          className={cn(
            "h-full transition-all duration-100 ease-linear",
            isChallengePeriod
              ? "bg-red-500"
              : phase === "daytime"
                ? "bg-yellow-500"
                : "bg-purple-500",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
