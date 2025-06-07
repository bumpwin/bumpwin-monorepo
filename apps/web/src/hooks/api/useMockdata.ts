import { type QueryClient, useQuery } from "@tanstack/react-query";

// Query keys for consistent caching
export const mockdataKeys = {
  all: ["mockdata"] as const,
  coins: () => [...mockdataKeys.all, "coins"] as const,
  coin: (id: string) => [...mockdataKeys.coins(), id] as const,
  coinMetadata: () => [...mockdataKeys.all, "coin-metadata"] as const,
  dominance: () => [...mockdataKeys.all, "dominance"] as const,
  champions: () => [...mockdataKeys.all, "champions"] as const,
};

// Hook for fetching all coins with optional pagination
export const useCoins = (options?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: [...mockdataKeys.coins(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.set("limit", options.limit.toString());
      if (options?.offset) searchParams.set("offset", options.offset.toString());

      const url = `/mockdata/coins${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch coins");
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching specific coin by ID
export const useCoin = (id: string) => {
  return useQuery({
    queryKey: mockdataKeys.coin(id),
    queryFn: async () => {
      const response = await fetch(`/mockdata/coins/${encodeURIComponent(id)}`);
      const result = (await response.json()) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || `Failed to fetch coin ${id}`);
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id, // Only run if id is provided
  });
};

// Hook for fetching coin metadata (used in charts and tables) with optional pagination
export const useCoinMetadata = (options?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: [...mockdataKeys.coinMetadata(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.set("limit", options.limit.toString());
      if (options?.offset) searchParams.set("offset", options.offset.toString());

      const url = `/mockdata/coin-metadata${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch coin metadata");
      }

      return result.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes (chart data updated more frequently)
    gcTime: 8 * 60 * 1000,
  });
};

// Hook for fetching dominance chart data with optional filtering
export const useDominanceData = (options?: {
  timeframe?: "1h" | "24h" | "7d" | "30d";
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...mockdataKeys.dominance(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.timeframe) searchParams.set("timeframe", options.timeframe);
      if (options?.limit) searchParams.set("limit", options.limit.toString());

      const url = `/mockdata/dominance${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch dominance data");
      }

      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (frequently updated chart data)
    gcTime: 6 * 60 * 1000,
  });
};

// Hook for fetching champions data with optional filtering
export const useChampions = (options?: { limit?: number; round?: number }) => {
  return useQuery({
    queryKey: [...mockdataKeys.champions(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.set("limit", options.limit.toString());
      if (options?.round) searchParams.set("round", options.round.toString());

      const url = `/mockdata/champions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as {
        success: boolean;
        data?: unknown;
        error?: string;
      };

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch champions");
      }

      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (champions change less frequently)
    gcTime: 15 * 60 * 1000,
  });
};

// Prefetch utility functions for better performance
export const prefetchCoins = async (
  queryClient: QueryClient,
  options?: { limit?: number; offset?: number },
) => {
  await queryClient.prefetchQuery({
    queryKey: [...mockdataKeys.coins(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.set("limit", options.limit.toString());
      if (options?.offset) searchParams.set("offset", options.offset.toString());

      const url = `/mockdata/coins${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as { success: boolean; data?: unknown };
      return result.success ? result.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchChampions = async (
  queryClient: QueryClient,
  options?: { limit?: number; round?: number },
) => {
  await queryClient.prefetchQuery({
    queryKey: [...mockdataKeys.champions(), options],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.limit) searchParams.set("limit", options.limit.toString());
      if (options?.round) searchParams.set("round", options.round.toString());

      const url = `/mockdata/champions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const result = (await response.json()) as { success: boolean; data?: unknown };
      return result.success ? result.data : [];
    },
    staleTime: 10 * 60 * 1000,
  });
};
