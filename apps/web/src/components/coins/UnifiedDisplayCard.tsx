"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DarkCard } from "@/components/ui/dark-card";
import type { BaseCoinDisplayProps } from "@/types/coin";
import { formatCoinDisplayData, formatCoinMarketCap, getCoinDetailLink } from "@/utils/coinUtils";
import { formatCurrency } from "@/utils/format";
import { Globe, Send, Twitter } from "lucide-react";
import Link from "next/link";
import { match } from "ts-pattern";
import { CoinImage } from "./CoinImage";

// List Layout Component (based on CoinCard)
function ListLayout({ data, className }: { data: BaseCoinDisplayProps; className?: string }) {
  const { formattedMarketCap, imageAlt } = formatCoinDisplayData(data);
  const detailLink = getCoinDetailLink(data);

  return (
    <Link href={detailLink}>
      <Card className={`overflow-hidden ${className || ""}`}>
        <div className="flex p-4">
          {/* Logo */}
          <div className="mr-4">
            <CoinImage src={data.iconUrl} alt={imageAlt} size="md" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 font-medium text-blue-300 text-xs ring-1 ring-blue-500/20 ring-inset">
                    {data.symbol}
                  </span>
                  <CardTitle className="font-bold text-lg text-white">{data.name}</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <CardDescription className="mb-2 line-clamp-2 text-gray-400 text-sm">
                {data.description}
              </CardDescription>
              <div className="font-medium text-gray-300 text-sm">
                {data.marketCap ? formatCurrency(data.marketCap) : formattedMarketCap}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Champion Layout Component (based on ChampionCoinCard)
function ChampionLayout({ data, className }: { data: BaseCoinDisplayProps; className?: string }) {
  const { formattedMarketCap, imageAlt } = formatCoinDisplayData(data);
  const detailLink = getCoinDetailLink(data);

  return (
    <Link href={detailLink}>
      <Card className={`overflow-hidden ${className || ""}`}>
        {data.showRound && data.round && (
          <div className="bg-slate-700 px-4 py-1 font-medium text-gray-300 text-sm">
            &lt; Round {data.round} &gt;
          </div>
        )}
        <div className="flex h-[180px] p-4">
          {/* Logo */}
          <div className="mr-4">
            <CoinImage src={data.iconUrl} alt={imageAlt} size="md" />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-md bg-blue-950 px-2 py-1 font-medium text-blue-300 text-xs ring-1 ring-blue-500/20 ring-inset">
                    {data.symbol}
                  </span>
                  <h3 className="font-bold text-lg text-white">{data.name}</h3>
                </div>
              </div>
            </div>

            <CardContent className="flex flex-1 flex-col p-0">
              <p className="mb-2 line-clamp-2 flex-grow text-gray-400 text-sm">
                {data.description}
              </p>
              <div className="mt-auto flex items-end justify-between">
                <div className="font-medium text-gray-300 text-sm">
                  {data.marketCap ? formatCurrency(data.marketCap) : formattedMarketCap}
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Battle Layout Component (based on BattleCoinDetailCard)
function BattleLayout({ data, className }: { data: BaseCoinDisplayProps; className?: string }) {
  return (
    <DarkCard className={`mt-4 w-full ${className || ""}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          <CoinImage src={data.iconUrl} alt={data.symbol} size="lg" />
          <div className="text-center">
            <CardTitle className="font-bold text-2xl text-white">{data.symbol}</CardTitle>
            <p className="mt-1 text-gray-400 text-lg">{data.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-gray-300 text-sm">{data.description}</p>
      </CardContent>
    </DarkCard>
  );
}

// Detail Layout Component (based on CoinDetailCard)
function DetailLayout({ data, className }: { data: BaseCoinDisplayProps; className?: string }) {
  const isChampion = data.variant === "champion";

  return (
    <Card
      className={`overflow-hidden border border-[#23262F] bg-black/20 ${
        isChampion ? "hover:border-yellow-400" : "hover:border-purple-400"
      } shadow-lg transition-colors ${className || ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="relative h-24 w-24">
              <CoinImage
                src={data.iconUrl}
                alt={data.name}
                className="h-full w-full rounded-full object-cover"
              />
              <div
                className={`-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
                  isChampion
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-600"
                    : "bg-gradient-to-br from-purple-200 to-purple-600"
                } border-2 border-white text-black`}
              >
                #{data.round ?? 0}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-bold text-xl ${isChampion ? "text-yellow-400" : "text-white"}`}
                  >
                    {data.name}
                  </h3>
                  <span className="text-gray-400 text-sm">({data.symbol})</span>
                </div>
                <p className="mt-1 text-gray-400 text-sm">
                  {data.description.substring(0, 100)}...
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Market Cap:</span>
                <span className="font-medium text-white">
                  {formatCoinMarketCap(data.marketCap)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Created by:</span>
                <span className="font-medium text-white">BUMP.WIN</span>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              {data.websiteLink && (
                <a
                  href={data.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {data.telegramLink && (
                <a
                  href={data.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              {data.twitterLink && (
                <a
                  href={data.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Unified Component
export function UnifiedDisplayCard({ variant = "list", className, ...data }: BaseCoinDisplayProps) {
  const { cardClasses } = formatCoinDisplayData({ variant, ...data });
  const finalClassName = `${cardClasses} ${className || ""}`;

  return match(variant)
    .with("list", () => <ListLayout data={{ variant, ...data }} className={finalClassName} />)
    .with("champion", () => (
      <ChampionLayout data={{ variant, ...data }} className={finalClassName} />
    ))
    .with("battle", () => <BattleLayout data={{ variant, ...data }} className={className} />)
    .with("detail", () => <DetailLayout data={{ variant, ...data }} className={className} />)
    .with("swap", () => <ListLayout data={{ variant, ...data }} className={finalClassName} />)
    .exhaustive();
}
