"use client";

import { SuiWalletConnectButton } from "@/components/SuiWalletConnectButton";
import BattleClock from "@/components/battle/BattleClock";
import WordmarkLogo from "@/components/branding/WordmarkLogo";
import { cn } from "@/lib/utils";
import { useBattleClock } from "@/providers/BattleClockProvider";
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
    <header className="sticky top-0 z-50 w-full border-gray-800 border-b bg-gray-900/95 shadow-gray-900/50 shadow-lg backdrop-blur-md">
      <div className="flex h-16 items-center">
        {/* 左寄せセクション */}
        <div className="flex flex-1 items-center gap-6 pl-4">
          <Link href="/about">
            <div className="mr-2 mb-2 flex max-w-[200px] scale-[0.45] items-center">
              <WordmarkLogo />
            </div>
          </Link>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-center font-semibold text-gray-300 text-xl transition-all duration-200",
                "w-24 hover:text-orange-400",
                "hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
                isActive(href) && "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]",
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 中央寄せセクション */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-full items-center justify-center">
            <BattleClock
              totalSeconds={remainingTime}
              challengeSeconds={challengeTime}
              onChallengeStatusChange={setIsChallengePeriod}
            />
          </div>
        </div>

        {/* 右寄せセクション */}
        <div className="flex flex-1 items-center justify-end gap-3 pr-4">
          {/* Claim outcome ボタン */}
          <Link href="/rounds?intent=claim-outcome" className="flex items-center">
            <button
              type="button"
              className="rounded-full px-4 py-1.5 font-medium text-amber-400 text-sm transition-all duration-200 hover:border hover:border-amber-400/40 hover:bg-amber-900/30 hover:text-amber-300"
            >
              Claim outcome
            </button>
          </Link>

          {/* Create Coin ボタン */}
          <button
            type="button"
            onClick={handleCreateCoinClick}
            className="rounded-full border border-indigo-400/50 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 font-medium text-sm text-white shadow-indigo-900/30 shadow-lg transition-all duration-200 hover:scale-105 hover:border-indigo-300/70 hover:from-violet-600 hover:to-indigo-600"
          >
            Create Coin
          </button>

          {/* ウォレット接続ボタン */}
          <div className="flex h-10 items-center">
            <SuiWalletConnectButton />
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="relative h-0.5 w-full bg-gray-800/50">
        {/* チャレンジポイントのマーカー */}
        <div
          className="absolute top-[-1px] bottom-[-1px] z-10 w-1 rounded-full bg-red-500"
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
