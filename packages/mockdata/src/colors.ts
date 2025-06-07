import type { MemeMetadata } from "@workspace/types";
import { mockmemes } from "./mockMemes";

export const CHART_COLORS = ["#FF69B4", "#3CB043", "#FFD700", "#00BFFF"] as const;

export interface MemeWithColor extends MemeMetadata {
  color: string;
}

// Generate chart-compatible metadata with colors
export const getMemeWithColor = (meme: MemeMetadata, index: number): MemeWithColor => ({
  ...meme,
  color: CHART_COLORS[index % CHART_COLORS.length],
});

export const getMemesWithColors = (memes: MemeMetadata[], limit?: number): MemeWithColor[] => {
  const memesToProcess = limit ? memes.slice(0, limit) : memes;
  return memesToProcess.map((meme, index) => getMemeWithColor(meme, index));
};

// Legacy compatibility - without color (dynamic assignment in UI)
export const getMockCoinMetadata = (limit = 4) => {
  return mockmemes.slice(0, limit).map((meme, index) => ({
    id: index,
    symbol: meme.symbol,
    name: meme.name,
    icon: meme.iconUrl,
    description: meme.description,
    telegramLink: "",
    websiteLink: "",
    twitterLink: "",
  }));
};

// Direct export for legacy compatibility
export const mockCoinMetadata = getMockCoinMetadata();
