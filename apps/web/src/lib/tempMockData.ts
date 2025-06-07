import type { CoinCardProps } from "@/types/coincard";
// Temporary mock data for migration - to be replaced with proper API calls
import { getMemeMarketDataById, mockmemes } from "@workspace/mockdata";

// Type definitions for legacy compatibility
export interface CoinDetailData {
  address: string;
  symbol: string;
  name: string;
  logoUrl: string;
  description: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  createdAt: Date;
  isFavorite: boolean;
  telegramLink: string;
  websiteLink: string;
  twitterLink: string;
}

// Generate mock coin metadata for chart compatibility
export const mockCoinMetadata = mockmemes.slice(0, 4).map((meme, index) => ({
  id: index,
  symbol: meme.symbol,
  name: meme.name,
  icon: meme.iconUrl,
  color: ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"][index] || "#FF69B4",
  description: meme.description,
  telegramLink: "",
  websiteLink: "",
  twitterLink: "",
}));

// Generate mock champion coin metadata
export const mockChampionCoinMetadata = [
  {
    id: "0",
    round: 1,
    symbol: "SMUG",
    name: "SMUG",
    iconUrl: "/images/mockmemes/SMUG.webp",
    color: "#FF69B4",
    description:
      "SMUG is a meme coin with attitude. Its smug face has become an iconic symbol in the crypto community.",
    telegramLink: "",
    websiteLink: "",
    twitterLink: "",
    createdBy: "BUMP.WIN",
    marketCap: 100000,
    share: 40,
  },
  {
    id: "1",
    round: 2,
    symbol: "YAKIU",
    name: "YAKIU",
    iconUrl: "/images/mockmemes/YAKIU.png",
    color: "#3CB043",
    description:
      "YAKIU brings a unique perspective to the meme coin world with its distinctive character and strong community.",
    telegramLink: "",
    websiteLink: "",
    twitterLink: "",
    createdBy: "BUMP.WIN",
    marketCap: 40000,
    share: 30,
  },
  {
    id: "2",
    round: 3,
    symbol: "JELL",
    name: "JELL",
    iconUrl: "/images/mockmemes/JELL.png",
    color: "#FFD700",
    description:
      "JELL is a digital currency that allows you to send money online quickly and cheaply.",
    telegramLink: "",
    websiteLink: "",
    twitterLink: "",
    createdBy: "BUMP.WIN",
    marketCap: 17000,
    share: 30,
  },
];

export const mockLastChampionCoinMetadata = {
  id: 0,
  round: 4,
  symbol: "JELL",
  name: "JELL",
  iconUrl: "/images/mockmemes/JELL.png",
  color: "#FF69B4",
  description: "JELL Protocol provides jiggle economics and jiggle governance.",
  telegramLink: "",
  websiteLink: "",
  twitterLink: "",
  createdBy: "BUMP.WIN",
  marketCap: 100000,
  share: 68,
};

// Generate mock coins for CoinList component
export const mockCoins: CoinCardProps[] = mockmemes.slice(0, 6).map((meme, index) => {
  const marketData = getMemeMarketDataById(meme.id);
  return {
    address: `0x${index.toString().padStart(40, "0")}`,
    symbol: meme.symbol,
    name: meme.name,
    createdAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
    isFavorite: index === 0,
    logoUrl: meme.iconUrl,
    description: meme.description,
    marketCap: marketData?.marketCap || 50000,
    onToggleFavorite: undefined,
  };
});

// Generate mock dominance chart data
export const mockDominanceChartData = Array.from({ length: 144 }, (_, i) => ({
  timestamp: i * 10,
  shares: Array.from({ length: 4 }, () => 15 + Math.random() * 20),
}));

// Mock coin detail data
export const mockCoinDetail: CoinDetailData = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  symbol: "BONK",
  name: "BONK MUSK",
  logoUrl: "/icon.png",
  description: "A community-driven meme token inspired by Elon Musk's love for Dogecoin.",
  marketCap: 44540,
  price: 0.000123,
  priceChange24h: 5.67,
  priceChangePercentage24h: 5.67,
  volume24h: 12345.67,
  high24h: 0.00015,
  low24h: 0.0001,
  createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
  isFavorite: true,
  telegramLink: "",
  websiteLink: "",
  twitterLink: "",
};
