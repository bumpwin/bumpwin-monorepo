"use client";

import { Button } from "@workspace/shadcn/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { cn } from "@workspace/shadcn/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import BattleClock from "./BattleClock";
import { SuiWalletConnectButton } from "./SuiWalletConnectButton";

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const roundsClickRef = useRef(false);

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

	return (
		<header className="w-full border-b bg-black pt-6">
			<div className="w-full px-12 h-16 flex items-center">
				{/* 左側グループ - 幅を明示的に指定 */}
				<div className="flex items-center w-1/3">
					{/* 1. ロゴ */}
					<Link href="/" className="flex items-center gap-3 mr-10">
						<Image src="/icon.png" alt="Ooze.fun Logo" width={40} height={40} />
						<span className="text-xl font-bold text-pink-500">ooze.fun</span>
					</Link>

					{/* 2. ナビゲーション */}
					<nav className="flex items-center gap-8">
						<a
							href="/rounds"
							onClick={handleRoundsClick}
							className={cn(
								"text-base transition-colors cursor-pointer",
								isActive("/rounds")
									? "text-pink-400 font-medium"
									: "text-white hover:text-pink-400",
							)}
						>
							Rounds
						</a>
						<Link
							href="/champions"
							className={cn(
								"text-base transition-colors",
								isActive("/champions")
									? "text-pink-400 font-medium"
									: "text-white hover:text-pink-400",
							)}
						>
							Champions
						</Link>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 text-white text-base hover:text-pink-400 transition-colors">
								More
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="h-5 w-5"
									aria-hidden="true"
								>
									<path d="M6 9L12 15L18 9" />
								</svg>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="text-base">
								<DropdownMenuItem>
									<Link
										href="/faq"
										className={cn(
											"w-full py-1",
											isActive("/faq") && "text-pink-400 font-medium",
										)}
									>
										FAQ
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										href="/docs"
										className={cn(
											"w-full py-1",
											isActive("/docs") && "text-pink-400 font-medium",
										)}
									>
										Docs
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<a
										href="https://discord.gg/example"
										target="_blank"
										rel="noopener noreferrer"
										className="w-full py-1"
									>
										Discord
									</a>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>

				{/* 3. カウントダウン（中央配置） - 幅を明示的に指定 */}
				<div className="flex items-center justify-center w-1/3">
					<BattleClock totalSeconds={10} challengeSeconds={5} />
				</div>

				{/* 右側グループ - 幅を明示的に指定 */}
				<div className="flex items-center justify-end w-1/3">
					{/* Inbox ナビゲーション */}
					<a
						href="/inbox"
						className={cn(
							"mr-5 text-base transition-colors",
							isActive("/inbox")
								? "text-pink-400 font-medium"
								: "text-white hover:text-pink-400",
						)}
					>
						Inbox
					</a>

					{/* 5. プライマリボタン */}
					<Link href="/create" className="mr-5">
						<Button
							className={cn(
								"bg-gradient-to-r from-[#8a66ff] to-[#b37aff] hover:from-[#7a56ef] hover:to-[#a36aef] rounded-xl border-0 text-sm px-5 h-10",
								isActive("/create") && "ring-2 ring-pink-400 ring-opacity-50",
							)}
						>
							Create a new coin
						</Button>
					</Link>

					{/* 6. ウォレットメニュー */}
					<div className="w-auto">
						<SuiWalletConnectButton />
					</div>
				</div>
			</div>
		</header>
	);
}
