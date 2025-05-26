"use client";

import { CoinCard } from "@/components/CoinCard";
import type { CoinCardProps } from "@/types/coincard";
import { mockMemeMetadata } from "@workspace/mockdata";
import { Button } from "@workspace/shadcn/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { cn } from "@workspace/shadcn/lib/utils";
import { ChevronDown, RotateCw } from "lucide-react";
import { useState } from "react";

type SortType = "marketCap" | "new";

export function CoinList() {
  const [coins, setCoins] = useState<CoinCardProps[]>(
    mockMemeMetadata.map((meme) => ({
      address: meme.id,
      symbol: meme.symbol,
      name: meme.name,
      logoUrl: meme.iconUrl,
      description: meme.description,
      marketCap: 45000, // デフォルト値
      isFavorite: false,
      onToggleFavorite: undefined,
    })),
  );
  const [sortType, setSortType] = useState<SortType>("marketCap");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleToggleFavorite = (address: string) => {
    setCoins((prevCoins) =>
      prevCoins.map((coin) =>
        coin.address === address
          ? { ...coin, isFavorite: !coin.isFavorite }
          : coin,
      ),
    );
  };

  const handleSort = (type: SortType) => {
    setSortType(type);
  };

  const handleToggleWatchlist = () => {
    setShowOnlyFavorites(!showOnlyFavorites);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Sort and filter coins based on the selected sort type and watchlist toggle
  const filteredAndSortedCoins = () => {
    let filtered = coins;

    if (showOnlyFavorites) {
      filtered = filtered.filter((coin) => coin.isFavorite);
    }

    switch (sortType) {
      case "marketCap":
        return [...filtered].sort((a, b) => b.marketCap - a.marketCap);
      case "new":
        return filtered; // createdAt は使用しないので、そのまま返す
      default:
        return filtered;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">Round 42 Contestants</h2>
        </div>

        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 h-8"
              >
                {sortType === "marketCap" ? "Market cap" : "New"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("new")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("marketCap")}>
                Market cap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "bg-slate-800 border-slate-700 hover:bg-slate-700 h-8",
              showOnlyFavorites && "text-yellow-400",
            )}
            onClick={handleToggleWatchlist}
          >
            ⭐️
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700 h-8 w-8"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RotateCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedCoins().map((coin) => (
          <CoinCard
            key={coin.address}
            {...coin}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
