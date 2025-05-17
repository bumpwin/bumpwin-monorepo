"use client";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { networks } from "@workspace/sui";
import { useState } from "react";
import { LenisProvider } from "../../providers/LenisProvider";
import "@mysten/dapp-kit/dist/index.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <LenisProvider options={{
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 1,
            infinite: false,
          }}>
            {children}
          </LenisProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
