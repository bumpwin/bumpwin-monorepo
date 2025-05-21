export type RoundState = "waiting" | "active" | "ended";

export interface RoundMetrics {
  mcap: string;
  volume: string;
  memes: number;
  traders: number;
}

export interface ChampionData {
  id: number;
  symbol: string;
  name: string;
  icon: string;
}

export interface Round {
  round: number;
  status: string;
  state: RoundState;
  metrics: RoundMetrics;
  startTime: string;
  endTime: string;
  champion?: ChampionData;
}

export interface CoinMetadata {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  telegramLink: string;
  websiteLink: string;
  twitterLink: string;
}

export interface ChartPoint {
  timestamp: string | number;
  [key: string]: string | number;
}

export interface ChartCoin {
  symbol: string;
  name: string;
  color: string;
}
