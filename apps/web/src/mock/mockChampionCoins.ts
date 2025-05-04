import type { CoinCardProps } from "../types/coincard";

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

// Mock data for previous champion coins
export const mockChampionCoins: CoinCardProps[] = [
	{
		address: "0x9876543210abcdef9876543210abcdef98765432",
		symbol: "PEPE",
		name: "PEPE SATOSHI",
		createdAt: new Date(now - 60 * day), // 60 days ago
		isFavorite: false,
		logoUrl: "/icon.png",
		description:
			"The legendary first meme coin to reach 1B market cap in 2023. Famous for its rapid rise and community strength.",
		marketCap: 985000, // $985K
		onToggleFavorite: undefined,
		round: 42,
		performanceTag: "ACE",
		winRate: 0.65,
		priceHistory: Array.from({ length: 30 }, (_, i) => ({
			t: now - (30 - i) * day,
			v: 1.2 + Math.random() * 0.4,
		})),
		role: "Chamber",
		isHighlighted: true,
	},
	{
		address: "0x5432109876abcdef5432109876abcdef54321098",
		symbol: "DOGE",
		name: "DOGE EMPEROR",
		createdAt: new Date(now - 90 * day), // 90 days ago
		isFavorite: true,
		logoUrl: "/icon.png",
		description:
			"The champion that started it all. A revolutionary token that captured the zeitgeist of the 2021 bull run.",
		marketCap: 1250000, // $1.25M
		onToggleFavorite: undefined,
		round: 41,
		performanceTag: "SURGE",
		winRate: 0.54,
		priceHistory: Array.from({ length: 30 }, (_, i) => ({
			t: now - (30 - i) * day,
			v: 0.9 + Math.random() * 0.3,
		})),
		role: "KAY/O",
		isHighlighted: false,
	},
	{
		address: "0x13579abcdef24680abcdef13579abcdef13579ab",
		symbol: "SHIB",
		name: "SHIBA MAXI",
		createdAt: new Date(now - 75 * day), // 75 days ago
		isFavorite: false,
		logoUrl: "/icon.png",
		description:
			"One of the most successful meme tokens of all time, known for its devoted community and ecosystem development.",
		marketCap: 890000, // $890K
		onToggleFavorite: undefined,
		round: 40,
		performanceTag: "NAILBITER",
		winRate: 0.52,
		priceHistory: Array.from({ length: 30 }, (_, i) => ({
			t: now - (30 - i) * day,
			v: 0.7 + Math.random() * 0.2,
		})),
		role: "Raze",
		isHighlighted: false,
	},
];
