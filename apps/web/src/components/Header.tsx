"use client";

import { Button } from "@workspace/shadcn/components/button";
import { cn } from "@workspace/shadcn/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BattleClock from "./BattleClock";
import { SuiWalletConnectButton } from "./SuiWalletConnectButton";

// CommunicationPanelのインターフェース
interface CommunicationPanelGlobal {
	switchToChat: () => void;
	switchToInbox: () => void;
}

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const roundsClickRef = useRef(false);
	const totalTime = 15; // カウントダウンの合計時間（秒）
	const challengeTime = 5; // チャレンジ期間の時間（秒）
	const challengePoint = ((totalTime - challengeTime) / totalTime) * 100; // チャレンジポイントの位置（%） - 残り時間がchallengeTimeになる地点

	// BattleClockからのステータス
	const [isChallengePeriod, setIsChallengePeriod] = useState(false);
	const [remainingTime, setRemainingTime] = useState(totalTime);

	// プログレスバーの進行度を計算
	const progress = ((totalTime - remainingTime) / totalTime) * 100;

	// 通知アイコンとチャットアイコンを切り替えるための状態
	const [communicationMode, setCommunicationMode] = useState<"chat" | "inbox">(
		"chat",
	);

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

	// Roundsボタンのクリックハンドラ
	const handleRoundsClick = (e: React.MouseEvent) => {
		e.preventDefault();

		roundsClickRef.current = true;

		if (pathname === "/") {
			// 同一ページ内でのスクロール
			const roundsElement = document.getElementById("current-round");
			if (roundsElement) {
				roundsElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		} else {
			// 別ページからホームに遷移
			router.push("/");
		}
	};

	// パネル切り替え関数
	const toggleCommunicationMode = () => {
		const newMode = communicationMode === "chat" ? "inbox" : "chat";
		setCommunicationMode(newMode);

		// グローバルに公開されたメソッドを使用
		if (typeof window !== "undefined") {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const panel = (window as any).__COMMUNICATION_PANEL__ as
				| CommunicationPanelGlobal
				| undefined;
			if (panel) {
				if (newMode === "chat") {
					panel.switchToChat();
				} else {
					panel.switchToInbox();
				}
			}
		}
	};

	return (
		<header className="w-full bg-black pt-6 relative">
			<div className="w-full px-12 h-16 flex items-center">
				{/* 左側グループ - 幅を明示的に指定 */}
				<div className="flex items-center w-1/3">
					{/* 1. ロゴ */}
					<Link href="/" className="flex items-center gap-3 mr-10">
						<Image
							src="/logo.png"
							alt="Ooze.fun Logo"
							width={160}
							height={50}
						/>
					</Link>

					{/* 2. ナビゲーション */}
					<nav className="flex items-center gap-10">
						<a
							href="/rounds"
							onClick={handleRoundsClick}
							className={cn(
								"text-lg font-medium transition-colors cursor-pointer",
								isActive("/rounds")
									? "text-[#ff5e00] font-medium"
									: "text-white hover:text-[#ff5e00]",
							)}
						>
							Rounds
						</a>
						<Link
							href="/champions"
							className={cn(
								"text-lg font-medium transition-colors",
								isActive("/champions")
									? "text-[#ff5e00] font-medium"
									: "text-white hover:text-[#ff5e00]",
							)}
						>
							Champions
						</Link>
						<Link
							href="/losers"
							className={cn(
								"text-lg font-medium transition-colors",
								isActive("/losers")
									? "text-[#ff5e00] font-medium"
									: "text-white hover:text-[#ff5e00]",
							)}
						>
							Losers
						</Link>
					</nav>
				</div>

				{/* 3. カウントダウン（中央配置） - 幅を明示的に指定 */}
				<div className="flex items-center justify-center w-1/3 relative">
					{/* Round 42 表示 - チャレンジ期間中は赤く点滅 */}
					<div className="absolute left-0">
						<span
							className={cn(
								"font-bold text-2xl tracking-wide transition-colors",
								isChallengePeriod
									? "text-red-500 animate-pulse"
									: "text-orange-500",
							)}
						>
							Round 42
						</span>
					</div>

					{/* カウントダウン - 中央配置を維持 */}
					<div className="flex justify-center items-center">
						<BattleClock
							totalSeconds={totalTime}
							challengeSeconds={challengeTime}
							onChallengeStatusChange={setIsChallengePeriod}
							onRemainingTimeChange={setRemainingTime}
						/>
					</div>
				</div>

				{/* 右側グループ - 幅を明示的に指定 */}
				<div className="flex items-center justify-end w-1/3">
					{/* 検索バー */}
					<div className="mr-5 relative">
						<div className="flex items-center bg-[#161a23] rounded-md px-2 h-9 w-64">
							<svg
								className="w-4 h-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Search Icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								placeholder="Search token or address"
								className="bg-transparent border-0 text-sm text-white placeholder-gray-500 focus:outline-none pl-2 w-full"
							/>
						</div>
					</div>

					{/* Communication mode toggle button */}
					<button
						type="button"
						onClick={toggleCommunicationMode}
						className={cn(
							"mr-5 transition-colors relative",
							"text-white hover:text-[#ff5e00]",
						)}
					>
						{communicationMode === "chat" ? (
							/* Notification bell icon */
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Notifications</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
								{/* Unread badge */}
								<circle cx="18" cy="6" r="3" fill="#FF5E00" />
							</svg>
						) : (
							/* Chat icon */
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>Chat</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						)}
					</button>

					{/* 5. プライマリボタン */}
					<Link href="/create" className="mr-5">
						<Button
							className={cn(
								"bg-[#5D20D3] hover:bg-[#4D1BB0] text-white rounded-xl border-0 text-sm px-5 h-12 w-36",
								isActive("/create") && "ring-2 ring-pink-400 ring-opacity-50",
							)}
						>
							Create Coin
						</Button>
					</Link>

					{/* 6. ウォレットメニュー */}
					<div className="w-auto">
						<SuiWalletConnectButton />
					</div>
				</div>
			</div>

			{/* プログレスバー - カウントダウンに連動 */}
			<div className="w-full h-1 bg-gray-800 mt-2 relative">
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
		</header>
	);
}
