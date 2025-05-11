// Basic dominance data point
export type DominancePoint = {
  date: string; // ISO date format
  [coinName: string]: number | string; // Coin names as keys, values are dominance (0.0-1.0) or date
};

// Coin display information
export type CoinDisplayInfo = {
  id: string; // Unique identifier (matches data key name)
  name: string; // Display name
  color: string; // Chart line color
};

// Chart component input data type
export type DominanceChartData = {
  points: DominancePoint[];
  coins: CoinDisplayInfo[];
};
