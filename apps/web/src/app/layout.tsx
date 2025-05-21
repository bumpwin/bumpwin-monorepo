import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/shadcn/globals.css";
import "@mysten/dapp-kit/dist/index.css";
import AppBar from "@/components/AppBar";
import { ConfettiEffect } from "@/components/ConfettiEffect";
// import { ChallengeOverlay } from "@/components/ChallengeOverlay";
import { ResultView } from "@/components/ResultView";
import { mockCoinMetadata } from "@/mock/mockData";
import { Toaster } from "sonner";
import { Providers } from "./providers/Providers";

export const runtime = "edge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "BUMP.WIN - Meme Coin Battle Royale",
  description:
    "Stake & win before time runs out! The ultimate meme coin battle platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppBar />
          <main className="flex-1">{children}</main>
          {/* <Footer /> */}
          <Toaster position="bottom-right" duration={1500} />
          <ConfettiEffect />
          {/* <ChallengeOverlay /> */}
          {mockCoinMetadata[0] && (
            <ResultView
              coin={{
                ...mockCoinMetadata[0],
                id: mockCoinMetadata[0].id.toString(),
                iconUrl: mockCoinMetadata[0].icon,
                round: 1,
                share: 25,
                marketCap: 100000,
              }}
            />
          )}
        </Providers>
      </body>
    </html>
  );
}
