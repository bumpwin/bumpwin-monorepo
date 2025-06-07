import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/components/ui/globals.css";
import "@mysten/dapp-kit/dist/index.css";
import AppBar from "@/components/layout/AppBar";
import { ConfettiEffect } from "@/components/ui/ConfettiEffect";
import { Providers } from "@/providers/Providers";
import { Toaster } from "sonner";

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
  description: "Stake & win before time runs out! The ultimate meme coin battle platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        // Do not modify background color - used for debugging purposes
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-blue-300 antialiased`}
      >
        <Providers>
          <AppBar />
          <main className="flex-1">{children}</main>
          <Toaster position="bottom-right" duration={1500} />
          <ConfettiEffect />
        </Providers>
      </body>
    </html>
  );
}
