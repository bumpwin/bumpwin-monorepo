"use client";

import type { CoinCardProps } from "@/types/coincard";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { cn } from "@workspace/shadcn/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../utils/format";

export function ChampionCoinCard({
	address,
	symbol,
	name,
	description,
	logoUrl,
	marketCap,
	isFavorite: initialIsFavorite,
	onToggleFavorite,
	round,
	performanceTag,
	winRate,
	priceHistory,
	role,
	isHighlighted,
}: CoinCardProps) {
	const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

	const handleToggleFavorite = () => {
		setIsFavorite(!isFavorite);
		if (onToggleFavorite) {
			onToggleFavorite(address);
		}
	};

	const formattedWinRate = winRate
		? `${Math.round(winRate * 100)}% Win Rate`
		: null;

	return (
		<Card
			className={cn(
				"w-full overflow-hidden dark:bg-slate-800 border-gray-700",
				isHighlighted && "border-2 border-blue-500",
			)}
		>
			{round && (
				<div className="bg-slate-700 px-4 py-1 text-sm font-medium text-gray-300">
					&lt; Round {round} &gt;
				</div>
			)}
			<div className="flex p-4 h-[180px]">
				{/* Logo */}
				<div className="flex-shrink-0 mr-4">
					<div className="relative w-16 h-16">
						<Image
							src={logoUrl}
							alt={`${symbol} logo`}
							fill
							className="object-cover rounded-md"
						/>
					</div>
					{role && (
						<div className="mt-2 text-xs text-center text-gray-400">{role}</div>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0 flex flex-col">
					<div className="mb-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
									{symbol}
								</span>
								<h3 className="text-lg font-bold text-white">{name}</h3>
								{performanceTag && (
									<span className="ml-2 font-bold text-sm text-yellow-400">
										**{performanceTag}**
									</span>
								)}
							</div>
							<button
								type="button"
								className="text-gray-400 hover:text-yellow-400 focus:outline-none"
								onClick={handleToggleFavorite}
								aria-label={
									isFavorite ? "Remove from favorites" : "Add to favorites"
								}
							>
								<Star
									className={cn(
										"h-5 w-5",
										isFavorite
											? "fill-yellow-400 text-yellow-400"
											: "fill-transparent",
									)}
								/>
							</button>
						</div>
					</div>

					<CardContent className="p-0 flex-1 flex flex-col">
						{formattedWinRate && (
							<div className="text-sm text-green-400 font-medium mb-1">
								{formattedWinRate}
							</div>
						)}
						<p className="line-clamp-2 text-gray-400 text-sm mb-2 flex-grow">
							{description}
						</p>
						<div className="flex justify-between items-end mt-auto">
							<div className="text-sm font-medium text-gray-300">
								{formatCurrency(marketCap)}
							</div>
							{priceHistory && priceHistory.length > 0 && (
								<div className="w-24 h-12">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={priceHistory}>
											<Line
												type="monotone"
												dataKey="v"
												stroke="#3b82f6"
												strokeWidth={1.5}
												dot={false}
												isAnimationActive={false}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							)}
						</div>
					</CardContent>
				</div>
			</div>
		</Card>
	);
}
