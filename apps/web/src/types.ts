export interface Coin {
  id: string;
  symbol: string;
  name: string;
  iconUrl: string;
  round: number;
  share?: number;
  marketCap?: number;
  description: string;
  telegramLink?: string;
  websiteLink?: string;
  twitterLink?: string;
  color?: string;
  createdBy?: string;
}

// Missing type exports for dominance data
export interface CoinDisplayInfo {
  id: string;
  symbol: string;
  name: string;
  color?: string;
  iconUrl?: string;
}

export interface DominancePoint {
  time: string;
  [key: string]: number | string; // Dynamic coin values
}

export interface DominanceChartData {
  points: DominancePoint[];
  coins: CoinDisplayInfo[];
}
