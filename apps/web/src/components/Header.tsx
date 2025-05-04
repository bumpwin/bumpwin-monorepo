"use client";

import Image from "next/image";
import Link from "next/link";
import { SuiWalletConnectButton } from "../components/SuiWalletConnectButton";
import BattleClock from "./BattleClock";
import { Button } from "@workspace/shadcn/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@workspace/shadcn/components/dropdown-menu";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";

export default function Header() {
	const account = useCurrentAccount();

	return (
		<header className="w-full border-b bg-black pt-8">
			<div className="w-full px-12 h-20 flex items-center justify-between">
				{/* 左側グループ */}
				<div className="flex items-center flex-1">
					{/* 1. ロゴ */}
					<div className="flex items-center gap-4 mr-12">
						<Image
							src="/icon.png"
							alt="Ooze.fun Logo"
							width={48}
							height={48}
						/>
						<span className="text-2xl font-bold text-pink-500">ooze.fun</span>
					</div>

					{/* 2. ナビゲーション */}
					<nav className="flex items-center gap-10">
						<Link href="/rounds" className="text-white text-lg hover:text-pink-400 transition-colors">
							Rounds
						</Link>
						<Link href="/champions" className="text-white text-lg hover:text-pink-400 transition-colors">
							Champions
						</Link>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 text-white text-lg hover:text-pink-400 transition-colors">
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
									<Link href="/faq" className="w-full py-1">FAQ</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link href="/docs" className="w-full py-1">Docs</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<a href="https://discord.gg/example" target="_blank" rel="noopener noreferrer" className="w-full py-1">
										Discord
									</a>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>
				</div>

				{/* 3. カウントダウン（中央配置） */}
				<div className="absolute left-1/2 transform -translate-x-1/2 w-96">
					<BattleClock
						totalSeconds={10}
						challengeSeconds={5}
					/>
				</div>

				{/* 右側グループ */}
				<div className="flex items-center flex-1 justify-end">
					{/* 5. プライマリボタン */}
					<Link href="/create" className="mr-6">
						<Button className="bg-gradient-to-r from-[#8a66ff] to-[#b37aff] hover:from-[#7a56ef] hover:to-[#a36aef] rounded-xl border-0 text-base px-6 h-12">
							Create a new coin
						</Button>
					</Link>

					{/* 6. ウォレットメニュー */}
					<div className="w-auto">
						{account ? (
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center px-4 py-2 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:from-blue-600 hover:to-blue-500">
									<span className="text-base">
										{formatAddress(account.address)}
									</span>
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
										className="h-5 w-5 ml-2"
										aria-hidden="true"
									>
										<path d="M6 9L12 15L18 9" />
									</svg>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="text-base">
									<DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2">
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
											<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
											<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
										</svg>
										Copy address
									</DropdownMenuItem>
									<DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2 text-red-500">
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
											<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
											<polyline points="16 17 21 12 16 7" />
											<line x1="21" x2="9" y1="12" y2="12" />
										</svg>
										Disconnect
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<div className="h-12">
								<SuiWalletConnectButton />
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
