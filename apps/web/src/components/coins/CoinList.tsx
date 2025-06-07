"use client";

import { CoinCard } from "@/components/coins/CoinCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCoins } from "@/hooks";
import { cn } from "@/lib/utils";
import type { CoinCardProps } from "@/types/coin";
import { ChevronDown, RotateCw } from "lucide-react";
import React, { useState } from "react";
import { match } from "ts-pattern";

type SortType = "marketCap" | "new";

export function CoinList() {
  const { data: apiCoins = [], isLoading, refetch } = useCoins();
  const [coins, setCoins] = useState<CoinCardProps[]>([]);
  const [sortType, setSortType] = useState<SortType>("marketCap");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Convert API data to CoinCardProps format
  React.useEffect(() => {
    const convertedCoins: CoinCardProps[] = apiCoins.map((coin) => ({
      ...coin,
      price: 0.00001, // Default price
      priceChange24h: 0,
      priceChangePercentage24h: 0,
      volume24h: 50000,
      high24h: 0.00002,
      low24h: 0.000005,
      createdAt: new Date(),
      isFavorite: false,
    }));
    setCoins(convertedCoins);
  }, [apiCoins]);

  const handleToggleFavorite = (address: string) => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) =>
        coin.address === address ? { ...coin, isFavorite: !coin.isFavorite } : coin,
      ),
    );
  };

  const handleSort = (type: SortType) => {
    setSortType(type);
  };

  const handleToggleWatchlist = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sort and filter coins based on the selected sort type and watchlist toggle
  const filteredAndSortedCoins = () => {
    let filtered = coins;

    if (showOnlyFavorites) {
      filtered = filtered.filter((coin) => coin.isFavorite);
    }

    return match(sortType)
      .with("marketCap", () => [...filtered].sort((a, b) => b.marketCap - a.marketCap))
      .with("new", () =>
        [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      )
      .otherwise(() => filtered);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-bold text-white text-xl">Round 42 Contestants</h2>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
              >
                {sortType === "marketCap" ? "Market cap" : "New"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("new")}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("marketCap")}>
                Market cap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-slate-700 bg-slate-800 hover:bg-slate-700",
              showOnlyFavorites && "text-yellow-400",
            )}
            onClick={handleToggleWatchlist}
          >
            ⭐️
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-700 bg-slate-800 text-blue-400 hover:bg-slate-700"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading coins...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCoins().map((coin) => (
            <CoinCard key={coin.address} {...coin} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
