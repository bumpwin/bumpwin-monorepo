"use client";

import { useBattleClock } from "@/app/providers/BattleClockProvider";
import { CreateCoinModal } from "@/app/rounds/components/CreateCoinModal";
import BattleClock from "@/components/BattleClock";
import { SuiWalletConnectButton } from "@/components/SuiWalletConnectButton";
import WordmarkLogo from "@/components/WordmarkLogo";
import { cn } from "@workspace/shadcn/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const roundsClickRef = useRef(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const {
    isChallengePeriod,
    remainingTime,
    totalTime,
    challengeTime,
    setIsChallengePeriod,
  } = useBattleClock();

  // プログレスバーの進行度を計算
  const progress = ((totalTime - remainingTime) / totalTime) * 100;
  const challengePoint = ((totalTime - challengeTime) / totalTime) * 100;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") {
      return true;
    }
    // ルートパス以外は前方一致で判定
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
      setShowCreateModal(true);
    } else {
      router.push("/rounds?intent=create-coin");
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    if (pathname === "/rounds") {
      router.push("/rounds");
    }
  };

  return (
    <>
      <header
        id="app-bar"
        className="sticky top-0 z-50 w-full border-b bg-gray-900 backdrop-blur-md shadow-lg shadow-gray-900"
      >
        <div className="w-full px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 左側グループ */}
            <div className="flex items-center gap-0">
              <Link
                href="/"
                className="flex items-center w-auto shrink-0 mr-[-6.5rem]"
              >
                <div className="scale-50 origin-left inline-flex translate-y-[-2px]">
                  <WordmarkLogo />
                </div>
              </Link>
              <nav className="hidden md:flex items-center">
                <Link
                  href="/battle"
                  className={cn(
                    "px-6 py-2 rounded-lg text-xl font-bold transition-colors cursor-pointer",
                    isActive("/battle")
                      ? "bg-[#ff5e00]/20 text-[#ff5e00] shadow-md"
                      : "text-gray-100 hover:bg-gray-700/60 hover:text-white",
                  )}
                >
                  Battle
                </Link>
                <Link
                  href="/champions"
                  className={cn(
                    "px-6 py-2 rounded-lg text-xl font-bold transition-colors",
                    isActive("/champions")
                      ? "bg-[#ff5e00]/20 text-[#ff5e00] shadow-md"
                      : "text-gray-100 hover:bg-gray-700/60 hover:text-white",
                  )}
                >
                  Champions
                </Link>
                <Link
                  href="/losers"
                  className={cn(
                    "px-6 py-2 rounded-lg text-xl font-bold transition-colors",
                    isActive("/losers")
                      ? "bg-[#ff5e00]/20 text-[#ff5e00] shadow-md"
                      : "text-gray-100 hover:bg-gray-700/60 hover:text-white",
                  )}
                >
                  Losers
                </Link>
                {/* Round 表示 - チャレンジ期間中は赤く点滅 */}
                {/* <div className="ml-12">
                  <span
                    className={cn(
                      "font-bold text-2xl tracking-wide transition-colors",
                      isChallengePeriod
                        ? "text-red-500 animate-pulse"
                        : "text-orange-500",
                    )}
                  >
                    Round {currentRound}
                  </span>
                </div> */}
              </nav>
            </div>

            {/* 中央のカウントダウン */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center py-1">
              <BattleClock
                totalSeconds={remainingTime}
                challengeSeconds={challengeTime}
                onChallengeStatusChange={setIsChallengePeriod}
              />
            </div>

            {/* 右側グループ */}
            <div className="flex items-center justify-end gap-4">
              {/* Claim outcome ボタン */}
              <Link href="/rounds?intent=claim-outcome">
                <button
                  type="button"
                  className="rounded-full px-5 py-2 text-xl font-bold border-2 border-transparent bg-black transition-all duration-150 cursor-pointer
                    bg-black
                    bg-clip-padding
                    text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text
                    hover:border-yellow-400"
                >
                  Claim outcome
                </button>
              </Link>

              {/* Create Coin ボタン（Loginと同じ豪華さ・サイズ） */}
              <button
                type="button"
                onClick={handleCreateCoinClick}
                className="rounded-full px-5 py-1 text-xl font-bold border-2 border-purple-400 bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-150 cursor-pointer"
              >
                Create Coin
              </button>

              {/* ウォレット接続ボタン（豪華なConnectボタン） */}
              <div className="h-12 flex items-center">
                <SuiWalletConnectButton />
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="w-full h-0.5 bg-gray-800 relative">
            {/* チャレンジポイントのマーカー */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-500 z-10 rounded-full"
              style={{ left: `${challengePoint}%` }}
            />

            {/* プログレスバー - 左から右へ進行、色はカウントダウンに連動 */}
            <div
              className={cn(
                "h-full transition-all duration-100 ease-linear",
                isChallengePeriod ? "bg-red-500" : "bg-orange-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Create Coin Modal */}
      <CreateCoinModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
      />
    </>
  );
}
