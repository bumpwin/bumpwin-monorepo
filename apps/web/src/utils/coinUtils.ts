import type { BaseCoinDisplayProps } from "@/types/coin";
import type { UIMemeMetadata } from "@/types/ui-types";

/**
 * Generate a coin ID for navigation from hex address or existing ID
 */
export const generateCoinId = (coin: UIMemeMetadata): string => {
  if (typeof coin.id === "string" && coin.id.startsWith("0x")) {
    return String((Number.parseInt(coin.id.slice(-2), 16) % 3) + 1);
  }
  return String(coin.id);
};

/**
 * Format currency values with K/M/B suffix
 */
export const formatCoinMarketCap = (value: number | undefined): string => {
  if (!value) return "$0.0";
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(1)}`;
};

/**
 * Get CSS classes for coin card variants
 */
export const getCoinCardClasses = (
  variant: "list" | "champion" | "battle" | "detail" | "swap",
): string => {
  const baseClasses =
    "w-full cursor-pointer overflow-hidden border-gray-700 transition-colors hover:border-blue-400 dark:bg-slate-800";

  switch (variant) {
    case "list":
    case "champion":
      return baseClasses;
    case "battle":
    case "detail":
    case "swap":
      return ""; // These variants handle their own styling
    default:
      return baseClasses;
  }
};

/**
 * Format coin display data for consistent rendering
 */
export const formatCoinDisplayData = (coin: BaseCoinDisplayProps) => {
  return {
    coinId: generateCoinId(coin),
    formattedMarketCap: formatCoinMarketCap(coin.marketCap),
    cardClasses: getCoinCardClasses(coin.variant || "list"),
    imageAlt: `${coin.symbol} logo`,
  };
};

/**
 * Generate navigation link for coin detail pages
 */
export const getCoinDetailLink = (coin: UIMemeMetadata): string => {
  const coinId = generateCoinId(coin);
  return `/rounds/42/daytime/coins/${coinId}`;
};
