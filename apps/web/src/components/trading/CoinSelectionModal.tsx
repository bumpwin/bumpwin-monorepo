"use client";

import type { CoinMetadata } from "@/app/rounds/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoinMetadata } from "@/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

interface CoinSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoin: (coin: CoinMetadata) => void;
  title?: string;
  description?: string;
}

export const CoinSelectionModal = ({
  isOpen,
  onClose,
  onSelectCoin,
  title = "Select Receive Coin",
  description = "Choose which coin you want to receive in this sealed transaction:",
}: CoinSelectionModalProps) => {
  // Use darknight mode to get current round coins only
  const {
    data: coinMetadata = [],
    isLoading,
    error,
  } = useCoinMetadata({
    limit: 8,
    darknight: true,
  });
  const [selectedCoin, setSelectedCoin] = useState<CoinMetadata | null>(null);

  // Debug log to see what data we're getting
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened - coinMetadata:", coinMetadata);
      console.log("isLoading:", isLoading);
      console.log("error:", error);
    }
  }, [isOpen, coinMetadata, isLoading, error]);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCoin(null);
    }
  }, [isOpen]);

  const handleCoinSelect = (coin: CoinMetadata) => {
    setSelectedCoin(coin);
  };

  const handleConfirm = () => {
    if (selectedCoin) {
      onSelectCoin(selectedCoin);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[95vw] border-[#2A2F45] bg-gradient-to-b from-[#0F1225] to-[#1A1E32] text-white shadow-[0_8px_32px_rgba(124,58,237,0.3)] sm:max-w-6xl"
        showCloseButton={false}
      >
        <DialogHeader className="border-[#2A2F45] border-b pb-6">
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-4">
          {match(isLoading)
            .with(true, () => (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-6 w-6 animate-spin text-[#3C41FF]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Loading coins"
                  >
                    <title>Loading</title>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-gray-300 text-lg">Loading coins...</span>
                </div>
              </div>
            ))
            .with(false, () => (
              <>
                {/* Debug info */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mb-4 rounded-lg bg-gray-800 p-3">
                    <div className="text-gray-400 text-xs">
                      Debug: Found {coinMetadata.length} coins, Error:{" "}
                      {error ? String(error) : "none"}
                    </div>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-2 text-lg text-red-400">Failed to load coins</div>
                      <div className="text-gray-400 text-sm">{String(error)}</div>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!error && coinMetadata.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mb-2 text-gray-300 text-lg">No coins available</div>
                      <div className="text-gray-400 text-sm">Please try again later</div>
                    </div>
                  </div>
                )}

                {/* Coin Grid */}
                {!error && coinMetadata.length > 0 && (
                  <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                    {coinMetadata.map((coin) => (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => handleCoinSelect(coin)}
                        className={cn(
                          "group relative rounded-xl border-2 p-6 transition-all duration-200",
                          selectedCoin?.id === coin.id
                            ? "border-[#3C41FF] bg-[#3C41FF]/10 shadow-[0_0_20px_rgba(60,65,255,0.3)]"
                            : "border-[#2A2F45] bg-[#1A1E32]/50 hover:border-[#3C41FF]/50 hover:bg-[#3C41FF]/5",
                        )}
                      >
                        {/* Selection indicator */}
                        {selectedCoin?.id === coin.id && (
                          <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3C41FF] text-white">
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-label="Selected"
                            >
                              <title>Checkmark</title>
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Coin icon */}
                        <div className="mb-4 flex justify-center">
                          <div className="relative h-16 w-16 overflow-hidden rounded-full">
                            <Image src={coin.icon} alt={coin.name} fill className="object-cover" />
                          </div>
                        </div>

                        {/* Coin info */}
                        <div className="text-center">
                          <div className="font-semibold text-base text-white">{coin.symbol}</div>
                          <div className="truncate text-gray-400 text-sm">{coin.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ))
            .exhaustive()}
        </div>

        {/* Action buttons */}
        {!error && coinMetadata.length > 0 && (
          <DialogFooter className="gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#2A2F45] bg-transparent text-gray-400 hover:bg-[#2A2F45] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedCoin}
              className={cn(
                "flex-1",
                selectedCoin
                  ? "bg-[#3C41FF] text-white shadow-[0_4px_12px_rgba(60,65,255,0.25)] hover:bg-[#3C41FF]/90"
                  : "cursor-not-allowed bg-gray-600 text-gray-400",
              )}
            >
              {selectedCoin ? `Select ${selectedCoin.symbol}` : "Select a coin"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
