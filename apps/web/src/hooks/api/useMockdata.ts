import { api } from "@/app/client";
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

// Hook for fetching all coins
export const useCoins = () => {
  return useQuery({
    queryKey: mockdataKeys.coins(),
    queryFn: async () => {
      const response = await api.mockdata.coins.$get();
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
      const response = await api.mockdata.coins[":id"].$get({ param: { id } });
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

// Hook for fetching coin metadata (used in charts and tables)
export const useCoinMetadata = () => {
  return useQuery({
    queryKey: mockdataKeys.coinMetadata(),
    queryFn: async () => {
      const response = await api.mockdata["coin-metadata"].$get();
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

// Hook for fetching dominance chart data
export const useDominanceData = () => {
  return useQuery({
    queryKey: mockdataKeys.dominance(),
    queryFn: async () => {
      const response = await api.mockdata.dominance.$get();
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

// Hook for fetching champions data
export const useChampions = () => {
  return useQuery({
    queryKey: mockdataKeys.champions(),
    queryFn: async () => {
      const response = await api.mockdata.champions.$get();
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
export const prefetchCoins = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: mockdataKeys.coins(),
    queryFn: async () => {
      const response = await api.mockdata.coins.$get();
      const result = (await response.json()) as { success: boolean; data?: unknown };
      return result.success ? result.data : [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchChampions = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: mockdataKeys.champions(),
    queryFn: async () => {
      const response = await api.mockdata.champions.$get();
      const result = (await response.json()) as { success: boolean; data?: unknown };
      return result.success ? result.data : [];
    },
    staleTime: 10 * 60 * 1000,
  });
};
