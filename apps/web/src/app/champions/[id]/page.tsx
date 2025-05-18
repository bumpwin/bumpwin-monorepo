import { mockChampionCoinMetadata } from "@/mock/mockData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ChampionDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coin = mockChampionCoinMetadata.find((c) => c.id.toString() === id);
  if (!coin) return notFound();

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-40 h-40 mb-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[6px] shadow-[0_0_32px_8px_rgba(255,215,0,0.25)]">
            <div className="absolute inset-0 rounded-full bg-white p-[3px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image
                  src={coin.icon}
                  alt={coin.name}
                  width={160}
                  height={160}
                  className="rounded-full w-full h-full object-cover border-0"
                />
                <div className="absolute left-3 top-3 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
            #{coin.round}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          {coin.name}
          <span className="text-xl text-gray-400">({coin.symbol})</span>
        </h1>
        <p className="text-gray-300 text-center text-lg mb-4 max-w-md">
          {coin.description}
        </p>
        <div className="flex gap-4 mb-6">
          {coin.telegramLink && (
            <a
              href={coin.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9.04 13.94l-.37 3.66c.53 0 .76-.23 1.04-.5l2.5-2.38 5.18 3.78c.95.52 1.62.25 1.86-.88l3.38-15.88c.31-1.44-.52-2-1.44-1.66L2.2 9.24c-1.39.56-1.37 1.36-.24 1.7l4.1 1.28 9.52-6.02c.45-.28.87-.13.53.18z" />
              </svg>
            </a>
          )}
          {coin.websiteLink && (
            <a
              href={coin.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Website"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
          )}
          {coin.twitterLink && (
            <a
              href={coin.twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" />
              </svg>
            </a>
          )}
        </div>
        <Link
          href="/champions"
          className="text-blue-400 hover:text-blue-300 text-base font-medium transition-colors underline"
        >
          ← Back to Champions
        </Link>
      </div>
    </div>
  );
}
