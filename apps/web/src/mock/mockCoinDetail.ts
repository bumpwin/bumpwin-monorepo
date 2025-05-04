export interface CoinDetailData {
	id: string;
	name: string;
	symbol: string;
	marketCap: number;
	price: number;
	high24h: number;
	low24h: number;
	volume24h: number;
	priceChange24h: number;
	priceChangePercentage24h: number;
	createdAt: Date;
	logoUrl: string;
	description: string;
}

export const mockCoinDetails: Record<string, CoinDetailData> = {
	elmobonik: {
		id: "elmobonik",
		name: "ELMOBONK",
		symbol: "ELMO BONK",
		marketCap: 36970000, // $36.97K
		price: 0.251953,
		high24h: 0.253278,
		low24h: 0.27959,
		volume24h: 125000,
		priceChange24h: 0.000501,
		priceChangePercentage24h: 0.02, // 0.02%
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		logoUrl: "/coins/elmo.png",
		description:
			"Elmo gets bonked! The ultimate meme coin that combines the iconic character with BONK mechanics.",
	},
	doge: {
		id: "doge",
		name: "DOGE EMPEROR",
		symbol: "DOGE",
		marketCap: 1250000, // $1.25M
		price: 0.187542,
		high24h: 0.192103,
		low24h: 0.181236,
		volume24h: 580000,
		priceChange24h: 0.003215,
		priceChangePercentage24h: 1.74, // 1.74%
		createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
		logoUrl: "/coins/doge.png",
		description:
			"The champion that started it all. A revolutionary token that captured the zeitgeist of the 2021 bull run.",
	},
	pepe: {
		id: "pepe",
		name: "PEPE SATOSHI",
		symbol: "PEPE",
		marketCap: 985000, // $985K
		price: 0.321456,
		high24h: 0.329876,
		low24h: 0.314567,
		volume24h: 432000,
		priceChange24h: -0.005421,
		priceChangePercentage24h: -1.65, // -1.65%
		createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
		logoUrl: "/coins/pepe.png",
		description:
			"The legendary first meme coin to reach 1B market cap in 2023. Famous for its rapid rise and community strength.",
	},
	"1": {
		id: "1",
		name: "ELMOBONK",
		symbol: "ELMO BONK",
		marketCap: 36970000,
		price: 0.251953,
		high24h: 0.253278,
		low24h: 0.27959,
		volume24h: 125000,
		priceChange24h: 0.000501,
		priceChangePercentage24h: 0.02,
		createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		logoUrl: "/coins/elmo.png",
		description:
			"Elmo gets bonked! The ultimate meme coin that combines the iconic character with BONK mechanics.",
	},
	"2": {
		id: "2",
		name: "DOGE EMPEROR",
		symbol: "DOGE",
		marketCap: 1250000,
		price: 0.187542,
		high24h: 0.192103,
		low24h: 0.181236,
		volume24h: 580000,
		priceChange24h: 0.003215,
		priceChangePercentage24h: 1.74,
		createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
		logoUrl: "/coins/doge.png",
		description:
			"The champion that started it all. A revolutionary token that captured the zeitgeist of the 2021 bull run.",
	},
	"3": {
		id: "3",
		name: "PEPE SATOSHI",
		symbol: "PEPE",
		marketCap: 985000,
		price: 0.321456,
		high24h: 0.329876,
		low24h: 0.314567,
		volume24h: 432000,
		priceChange24h: -0.005421,
		priceChangePercentage24h: -1.65,
		createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
		logoUrl: "/coins/pepe.png",
		description:
			"The legendary first meme coin to reach 1B market cap in 2023. Famous for its rapid rise and community strength.",
	},
};
