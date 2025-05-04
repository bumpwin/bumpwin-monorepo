"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { mockChampionCoins } from "../mock/mockChampionCoins";
import type { CoinCardProps } from "../types/coincard";
import { ChampionCoinCard } from "./ChampionCoinCard";

// 実際のコンポーネント実装
function ChampionCoinListContent() {
	const [coins, setCoins] = useState<CoinCardProps[]>(mockChampionCoins);
	const [sortType] = useState<"marketCap" | "new">("marketCap");
	const [showOnlyFavorites] = useState(false);

	const handleToggleFavorite = (address: string) => {
		setCoins((prevCoins) =>
			prevCoins.map((coin) =>
				coin.address === address
					? { ...coin, isFavorite: !coin.isFavorite }
					: coin,
			),
		);
	};

	// Sort and filter coins based on the selected sort type and watchlist toggle
	const filteredAndSortedCoins = () => {
		let filtered = coins;

		if (showOnlyFavorites) {
			filtered = filtered.filter((coin) => coin.isFavorite);
		}

		switch (sortType) {
			case "marketCap":
				return [...filtered].sort((a, b) => b.marketCap - a.marketCap);
			case "new":
				return [...filtered].sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
				);
			default:
				return filtered;
		}
	};

	return (
		<div className="container mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<h2 className="text-xl font-bold text-white mr-2">
						🏆 PREVIOUS CHAMPIONS 🏆
					</h2>
				</div>

				<div className="flex items-center">
					<a
						href="/champions"
						className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-800 text-white hover:bg-slate-700 hover:text-blue-400 h-8 rounded-md px-3 border border-slate-700"
					>
						View More
					</a>
				</div>
			</div>

			{/* Horizontal scrolling container */}
			<div className="relative">
				<div
					id="champion-scroll-container"
					className="flex overflow-x-auto pb-2 scrollbar-hide"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					<div className="flex gap-4">
						{filteredAndSortedCoins()
							.slice(0, 3)
							.map((coin) => (
								<div
									key={coin.address}
									className="min-w-[calc(33.33%-8px)] max-w-[calc(33.33%-8px)] flex"
								>
									<div className="w-full">
										<ChampionCoinCard
											{...coin}
											onToggleFavorite={handleToggleFavorite}
										/>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}

// サーバーサイドレンダリングを無効化した動的インポート
export const ChampionCoinList = dynamic(
	() => Promise.resolve(ChampionCoinListContent),
	{
		ssr: false,
		loading: () => <div className="container mx-auto px-4 h-[300px]" />,
	},
);
