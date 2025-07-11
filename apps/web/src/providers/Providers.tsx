"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networks } from "@workspace/sui";
import { useState } from "react";
import "@mysten/dapp-kit/dist/index.css";
import { BattleClockProvider } from "@/providers/BattleClockProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <BattleClockProvider>{children}</BattleClockProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
