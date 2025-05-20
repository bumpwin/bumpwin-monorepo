"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClient,
  useCurrentWallet,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

export function SuiWalletConnectButton() {
  const [balance, setBalance] = useState<string | null>(null);
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
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
                opacity: 1,
                color: 'transparent',
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
                  <img
                    src={currentWallet.icon}
                    alt={currentWallet.name}
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
          <DropdownMenuContent align="end" className="w-[200px] mt-2">
            <DropdownMenuItem
              onClick={copyAddressToClipboard}
              className="focus:bg-[#5D20D3]/10 hover:bg-[#5D20D3]/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title>Copy Address Icon</title>
                  <rect
                    x="9"
                    y="9"
                    width="13"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copy Address
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="text-red-600 focus:text-red-600 focus:bg-red-900/10 hover:bg-red-900/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <title>Disconnect Icon</title>
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Disconnect
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
