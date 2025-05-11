import React from "react";
import { RoundCoin } from "@/types/roundcoin";
import { mockRoundCoins } from "@/mock/mockRoundCoin";
import Image from "next/image";
import DominanceChart from "@/components/DominanceChart";
import { mockDominanceData } from "@/mock/mockDominanceData";

interface RoundCoinTableProps {
  coins?: RoundCoin[];
  onSelectCoin?: (coin: RoundCoin) => void;
  selectedCoinId?: string;
}

const iconSize = 18;

export const RoundCoinTable: React.FC<RoundCoinTableProps> = ({ coins = mockRoundCoins, onSelectCoin, selectedCoinId }) => {
  const handleSelect = (coin: RoundCoin) => {
    if (onSelectCoin) {
      if (selectedCoinId === coin.id) {
        onSelectCoin(undefined as any);
      } else {
        onSelectCoin(coin);
      }
    }
  };

  return (
    <div className="overflow-x-auto w-full m-0 p-0">
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <tbody>
          {coins.map((coin) => [
            <tr
              key={coin.id}
              className={`bg-[#181A20] rounded-lg shadow-sm cursor-pointer transition border-2 ${selectedCoinId === coin.id ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => handleSelect(coin)}
            >
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold text-lg text-white">
                    <Image src={coin.iconUrl} alt={coin.name} width={24} height={24} className="rounded-full" />
                    {coin.name}
                    <span className="text-xs text-gray-400 font-normal ml-1">({coin.symbol})</span>
                    <div className="flex items-center gap-1 ml-2">
                      {coin.telegramLink && (
                        <a href={coin.telegramLink} target="_blank" rel="noopener noreferrer" title="Telegram">
                          <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" className="inline"><path d="M9.04 13.94l-.37 3.66c.53 0 .76-.23 1.04-.5l2.5-2.38 5.18 3.78c.95.52 1.62.25 1.86-.88l3.38-15.88c.31-1.44-.52-2-1.44-1.66L2.2 9.24c-1.39.56-1.37 1.36-.24 1.7l4.1 1.28 9.52-6.02c.45-.28.87-.13.53.18z" fill="#888"/></svg>
                        </a>
                      )}
                      {coin.websiteLink && (
                        <a href={coin.websiteLink} target="_blank" rel="noopener noreferrer" title="Website">
                          <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" className="inline"><circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#aaa" strokeWidth="2"/></svg>
                        </a>
                      )}
                      {coin.twitterLink && (
                        <a href={coin.twitterLink} target="_blank" rel="noopener noreferrer" title="Twitter">
                          <svg width={iconSize} height={iconSize} fill="none" viewBox="0 0 24 24" className="inline"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" fill="#888"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    ${coin.marketCap.toLocaleString()} Vol.
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 align-middle text-center">
                <span className="text-2xl font-bold text-white">{Math.round(coin.share * 100)}%</span>
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="flex gap-2">
                  <button className="bg-green-900/80 text-green-300 font-semibold rounded-lg px-4 py-2 hover:bg-green-800 transition">Buy</button>
                  <button className="bg-red-900/80 text-red-300 font-semibold rounded-lg px-4 py-2 hover:bg-red-800 transition">Sell</button>
                </div>
              </td>
            </tr>,
            selectedCoinId && selectedCoinId === coin.id && (
              <tr key={coin.id + "-chart"}>
                <td colSpan={3} className="p-0 bg-transparent">
                  <div className="overflow-hidden transition-all duration-300" style={{maxHeight: 400}}>
                    <DominanceChart
                      data={mockDominanceData}
                      height={220}
                      coinId={coin.symbol.toLowerCase()}
                      showSingleCoinOnly={true}
                      volume={`$${coin.marketCap.toLocaleString()} Vol.`}
                    />
                  </div>
                </td>
              </tr>
            )
          ])}
        </tbody>
      </table>
    </div>
  );
};

export default RoundCoinTable;
