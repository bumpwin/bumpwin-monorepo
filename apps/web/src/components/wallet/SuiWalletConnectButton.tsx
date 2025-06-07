"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSuiClient,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { logger } from "@workspace/logger";
import { getSuiBalance } from "@workspace/sui";
import { ChevronDown, Copy as CopyIcon, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SuiWalletConnectButton() {
  // Using _balance to indicate we know it's not currently used but keeping it for future use
  const [_balance, setBalance] = useState<string | null>(null);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: disconnect } = useDisconnectWallet();
  const { currentWallet } = useCurrentWallet();

  // Fetch SUI balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getSuiBalance(suiClient, account.address);
        setBalance(balance);
        // Balance is fetched but not used in the UI right now
        // This will be used in a future update
      }
    };
    fetchBalance();
  }, [account, suiClient]);

  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard
        .writeText(account.address)
        .then(() => {
          toast.success("Address copied to clipboard");
        })
        .catch((err) => {
          logger.error("[Wallet] Failed to copy address", { error: err });
          toast.error("Failed to copy address");
        });
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch (error) {
      logger.error("[Wallet] Failed to disconnect wallet", { error });
    }
  };

  return (
    <div className="w-full">
      {!account ? (
        <ConnectButton
          connectText={
            <span
              className="!opacity-100 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text font-extrabold text-transparent"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                opacity: 1,
                color: "transparent",
              }}
            >
              Login
            </span>
          }
          className="!rounded-full !px-10 !py-2 !text-xl !font-bold !bg-gray-900 !border-2 !border-transparent hover:!border-violet-400 hover:!bg-black/60 !transition-all !duration-150 !cursor-pointer"
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex h-12 min-w-[180px] items-center rounded-full bg-[#5D20D3] px-2 shadow-xl">
              <div className="-ml-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#5D20D3]">
                {currentWallet?.icon && (
                  <Image
                    src={currentWallet.icon}
                    alt={currentWallet.name}
                    width={24}
                    height={24}
                    className="h-11 w-11"
                  />
                )}
              </div>
              <span className="ml-2 flex-1 text-center font-bold text-white text-xl tracking-wide">
                {formatAddress(account.address)}
              </span>
              <ChevronDown className="ml-2 h-6 w-6 flex-shrink-0 text-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="mt-2 w-[240px] rounded-2xl border border-gray-800 bg-[#18122B] p-3 shadow-2xl"
          >
            <DropdownMenuItem
              onClick={copyAddressToClipboard}
              className="flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 font-bold text-white text-xl transition hover:bg-[#5D20D3]/20 focus:bg-[#5D20D3]/10"
            >
              <CopyIcon className="h-7 w-7 text-violet-400" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="mt-2 flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 font-bold text-red-500 text-xl transition hover:bg-red-900/20 focus:bg-red-900/10"
            >
              <LogOut className="h-7 w-7 text-red-400" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
