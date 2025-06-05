"use client";

import { CoinCard } from "@/components/CoinCard";
import { mockCoins } from "@/mock/mockCoins";
import type { CoinCardProps } from "@/types/coincard";
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
import { match } from "ts-pattern";

type SortType = "marketCap" | "new";

export function CoinList() {
  const [coins, setCoins] = useState<CoinCardProps[]>(mockCoins);
  const [sortType, setSortType] = useState<SortType>("marketCap");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    return match(sortType)
      .with("marketCap", () => [...filtered].sort((a, b) => b.marketCap - a.marketCap))
      .with("new", () => [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedCoins().map((coin) => (
          <CoinCard key={coin.address} {...coin} onToggleFavorite={handleToggleFavorite} />
        ))}
      </div>
    </div>
  );
}
