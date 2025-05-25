"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSuiClient,
} from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { logger } from "@workspace/logger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { getSuiBalance } from "@workspace/sui";
import { ChevronDown, Copy as CopyIcon, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SuiWalletConnectButton() {
  // Using _balance to indicate we know it's not currently used but keeping it for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-extrabold !opacity-100"
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
            <div className="flex items-center px-2 h-12 rounded-full bg-[#5D20D3] min-w-[180px] shadow-xl">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5D20D3] -ml-4 overflow-hidden">
                {currentWallet?.icon && (
                  <Image
                    src={currentWallet.icon}
                    alt={currentWallet.name}
                    width={24}
                    height={24}
                    className="w-11 h-11"
                  />
                )}
              </div>
              <span className="flex-1 text-white text-xl font-bold text-center ml-2 tracking-wide">
                {formatAddress(account.address)}
              </span>
              <ChevronDown className="w-6 h-6 text-white flex-shrink-0 ml-2" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[240px] mt-2 rounded-2xl shadow-2xl border border-gray-800 bg-[#18122B] p-3"
          >
            <DropdownMenuItem
              onClick={copyAddressToClipboard}
              className="focus:bg-[#5D20D3]/10 hover:bg-[#5D20D3]/20 cursor-pointer rounded-xl px-4 py-3 transition flex items-center gap-4 text-xl text-white font-bold"
            >
              <CopyIcon className="w-7 h-7 text-violet-400" />
              <span>Copy Address</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="focus:bg-red-900/10 hover:bg-red-900/20 cursor-pointer rounded-xl px-4 py-3 transition flex items-center gap-4 text-xl font-bold text-red-500 mt-2"
            >
              <LogOut className="w-7 h-7 text-red-400" />
              <span>Disconnect</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
