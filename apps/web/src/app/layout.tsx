import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/shadcn/globals.css";
import "@mysten/dapp-kit/dist/index.css";
import { Toaster } from "sonner";
import Header from "../components/Header";
import { Providers } from "./providers/Providers";
import { ConfettiEffect } from "@/components/ConfettiEffect";
// import { ChallengeOverlay } from "@/components/ChallengeOverlay";
import { ResultView } from "@/components/ResultView";
import { mockRoundCoins } from "@/mock/mockRoundCoin";

export const runtime = "edge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
          {/* <InfoBar /> */}
          <Header />
          <main className="flex-1">{children}</main>
          {/* <Footer /> */}
          <Toaster position="bottom-right" duration={1500} />
          <ConfettiEffect />
          {/* <ChallengeOverlay /> */}
          <ResultView coin={mockRoundCoins[0]} />
        </Providers>
      </body>
    </html>
  );
}
