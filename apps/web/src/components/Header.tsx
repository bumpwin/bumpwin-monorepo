"use client";

import { Button } from "@workspace/shadcn/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import BattleClock from "./BattleClock";
import { SuiWalletConnectButton } from "./SuiWalletConnectButton";

export default function Header() {
	return (
		<header className="w-full border-b bg-black pt-6">
			<div className="w-full px-12 h-16 flex items-center">
				{/* 左側グループ - 幅を明示的に指定 */}
				<div className="flex items-center w-1/3">
					{/* 1. ロゴ */}
					<div className="flex items-center gap-3 mr-10">
						<Image src="/icon.png" alt="Ooze.fun Logo" width={40} height={40} />
						<span className="text-xl font-bold text-pink-500">ooze.fun</span>
					</div>

					{/* 2. ナビゲーション */}
					<nav className="flex items-center gap-8">
						<Link
							href="/rounds"
							className="text-white text-base hover:text-pink-400 transition-colors"
						>
							Rounds
						</Link>
						<Link
							href="/champions"
							className="text-white text-base hover:text-pink-400 transition-colors"
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
									<Link href="/faq" className="w-full py-1">
										FAQ
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href="/docs" className="w-full py-1">
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
						className="mr-5 text-white text-base hover:text-pink-400 transition-colors"
					>
						Inbox
					</a>

					{/* 5. プライマリボタン */}
					<Link href="/create" className="mr-5">
						<Button className="bg-gradient-to-r from-[#8a66ff] to-[#b37aff] hover:from-[#7a56ef] hover:to-[#a36aef] rounded-xl border-0 text-sm px-5 h-10">
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
