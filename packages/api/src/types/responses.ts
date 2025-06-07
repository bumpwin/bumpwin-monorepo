// Standard API response types for consistent response format across all endpoints

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  timestamp: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Specific response types for mockdata endpoints
export type CoinsResponse = ApiResponse<unknown[]>; // CoinCardProps[] from @workspace/mockdata
export type CoinResponse = ApiResponse<unknown>; // Single CoinCardProps
export type CoinMetadataResponse = ApiResponse<unknown[]>; // mockCoinMetadata
export type DominanceResponse = ApiResponse<unknown[]>; // mockDominanceChartData
export type ChampionsResponse = ApiResponse<unknown[]>; // getChampions() result

// Helper type for error responses
export type ErrorResponse = ApiErrorResponse;

// Union type for all possible responses
export type AnyApiResponse<T> = ApiResponse<T>;
