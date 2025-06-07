import { apiClient } from "@/lib/api/client";
import { type QueryClient, useQuery } from "@tanstack/react-query";

// Query keys for consistent caching
export const mockdataKeys = {
  all: ["mockdata"] as const,
  coins: () => [...mockdataKeys.all, "coins"] as const,
  coin: (id: string) => [...mockdataKeys.coins(), id] as const,
  coinMetadata: () => [...mockdataKeys.all, "coin-metadata"] as const,
  dominance: () => [...mockdataKeys.all, "dominance"] as const,
  champions: () => [...mockdataKeys.all, "champions"] as const,
  mockmemes: () => [...mockdataKeys.all, "mockmemes"] as const,
};

// Hook for fetching all coins with optional pagination
export const useCoins = (options?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: [...mockdataKeys.coins(), options],
    queryFn: async () => {
      const query: Record<string, string> = {};
      if (options?.limit) query.limit = options.limit.toString();
      if (options?.offset) query.offset = options.offset.toString();

      const response = await apiClient.mockdata.coins.$get({ query });
      const result = await response.json();

      if (!result.success) {
        throw new Error("error" in result ? result.error : "Failed to fetch coins");
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
      const response = await apiClient.mockdata.coins[":id"].$get({
        param: { id },
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error("error" in result ? result.error : `Failed to fetch coin ${id}`);
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
      const query: Record<string, string> = {};
      if (options?.limit) query.limit = options.limit.toString();
      if (options?.offset) query.offset = options.offset.toString();

      const response = await apiClient.mockdata["coin-metadata"].$get({ query });
      const result = await response.json();

      if (!result.success) {
        throw new Error("error" in result ? result.error : "Failed to fetch coin metadata");
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
      const query: Record<string, string> = {};
      if (options?.timeframe) query.timeframe = options.timeframe;
      if (options?.limit) query.limit = options.limit.toString();

      const response = await apiClient.mockdata.dominance.$get({ query });
      const result = await response.json();

      if (!result.success) {
        throw new Error("error" in result ? result.error : "Failed to fetch dominance data");
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
      const query: Record<string, string> = {};
      if (options?.limit) query.limit = options.limit.toString();
      if (options?.round) query.round = options.round.toString();

      const response = await apiClient.champions.$get({ query });
      const result = await response.json();

      // Champions endpoint returns data directly, not wrapped in success/error format
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (champions change less frequently)
    gcTime: 15 * 60 * 1000,
  });
};

// Hook for fetching mockmemes gallery data
export const useMockmemes = () => {
  return useQuery({
    queryKey: mockdataKeys.mockmemes(),
    queryFn: async () => {
      const response = await apiClient.mockdata.mockmemes.$get();
      const result = await response.json();

      if (!result.success) {
        throw new Error("error" in result ? result.error : "Failed to fetch mockmemes");
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (static data)
    gcTime: 10 * 60 * 1000,
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
      const query: Record<string, string> = {};
      if (options?.limit) query.limit = options.limit.toString();
      if (options?.offset) query.offset = options.offset.toString();

      const response = await apiClient.mockdata.coins.$get({ query });
      const result = await response.json();
      return "success" in result && result.success ? result.data : [];
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
      const query: Record<string, string> = {};
      if (options?.limit) query.limit = options.limit.toString();
      if (options?.round) query.round = options.round.toString();

      const response = await apiClient.champions.$get({ query });
      const result = await response.json();
      // Champions endpoint returns data directly
      return result;
    },
    staleTime: 10 * 60 * 1000,
  });
};
