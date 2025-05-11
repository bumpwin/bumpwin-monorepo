import {
  CoinDisplayInfo,
  DominanceChartData,
  DominancePoint,
} from "../types/dominance";

// Mock coin display information
export const mockCoinDisplayInfo: CoinDisplayInfo[] = [
  { id: "doge", name: "Dogecoin", color: "#C2A633" },
  { id: "pepe", name: "Pepe", color: "#3CB043" },
  { id: "wif", name: "WIF", color: "#FF69B4" },
  { id: "shib", name: "Shiba Inu", color: "#F7931A" },
  { id: "bonk", name: "Bonk", color: "#8B4513" },
  { id: "other", name: "Other", color: "#808080" },
];

// Helper function to generate random fluctuation
const fluctuate = (base: number, range: number): number => {
  return Math.max(0, Math.min(1, base + (Math.random() * range * 2 - range)));
};

// Generate mock dominance points for a 25-hour period with minute intervals
const baseDate = new Date("2024-03-01T00:00:00Z");
const generateTimePoints = (hours: number, minuteInterval: number) => {
  const points: DominancePoint[] = [];

  // Initial values
  let doge = 0.35;
  let pepe = 0.25;
  let wif = 0.15;
  let shib = 0.12;
  let bonk = 0.08;
  let other = 0.05;

  for (let h = 0; h < hours; h++) {
    for (let m = 0; m < 60; m += minuteInterval) {
      const currentDate = new Date(baseDate);
      currentDate.setHours(currentDate.getHours() + h);
      currentDate.setMinutes(currentDate.getMinutes() + m);

      // Fluctuate values with small changes
      doge = fluctuate(doge, 0.01);
      pepe = fluctuate(pepe, 0.01);
      wif = fluctuate(wif, 0.01);
      shib = fluctuate(shib, 0.01);
      bonk = fluctuate(bonk, 0.01);

      // Ensure sum is close to 1.0
      const sum = doge + pepe + wif + shib + bonk;
      other = Math.max(0, 1 - sum);

      points.push({
        date: currentDate.toISOString(),
        doge,
        pepe,
        wif,
        shib,
        bonk,
        other,
      });
    }
  }

  return points;
};

// Generate data points for 25 hours with 30-minute intervals
export const mockDominancePoints = generateTimePoints(25, 30);

// Complete chart data for export
export const mockDominanceData: DominanceChartData = {
  points: mockDominancePoints,
  coins: mockCoinDisplayInfo,
};

export default mockDominanceData;
