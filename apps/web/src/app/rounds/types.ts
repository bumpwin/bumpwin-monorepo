export type RoundState = "waiting" | "active" | "ended";

export type RoundIntent = "create-coin" | "claim-outcome" | null;

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

// CoinMetadata type has been replaced by MemeMetadata from @workspace/types
// Import MemeMetadata when you need coin metadata

export interface ChartPoint {
  timestamp: string | number;
  [key: string]: string | number;
}

export interface ChartCoin {
  symbol: string;
  name: string;
  color: string;
}
