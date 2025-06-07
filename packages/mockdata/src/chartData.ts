export interface DominanceChartDataPoint {
  timestamp: number;
  shares: number[];
}

export const generateDominanceChartData = (
  points = 144,
  intervalMs = 10,
  shareCount = 4,
): DominanceChartDataPoint[] => {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: i * intervalMs,
    shares: Array.from({ length: shareCount }, () => 15 + Math.random() * 20),
  }));
};

// Legacy compatibility - exact match with tempMockData
export const mockDominanceChartData = generateDominanceChartData();
