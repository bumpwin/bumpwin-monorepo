export const CHART_COLORS = ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"] as const;

export const getColorByIndex = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

export const getColorBySymbol = (symbol: string): string => {
  // Simple hash function for consistent color assignment
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CHART_COLORS[Math.abs(hash) % CHART_COLORS.length];
};
