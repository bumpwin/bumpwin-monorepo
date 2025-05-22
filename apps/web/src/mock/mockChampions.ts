import type { ChampionCoin } from "@/types/champion";

export const mockChampionCoins: ChampionCoin[] = [
  {
    id: "1",
    round: 1,
    name: "Pepe",
    symbol: "PEPE",
    iconUrl: "/icon.png",
    description:
      "Pepe is a meme coin that has gained significant popularity in the crypto community. It's known for its fun and engaging community.",
    telegramLink: "https://t.me/pepecoin",
    websiteLink: "https://www.pepecoin.com",
    twitterLink: "https://twitter.com/pepecoin",
    share: 0.3,
    marketCap: 5000000000,
  },
  {
    id: "2",
    round: 2,
    name: "Doge",
    symbol: "DOGE",
    iconUrl: "/icon.png",
    description:
      "Doge is one of the most popular meme coins in the cryptocurrency market. It started as a joke but has become a serious investment for many.",
    telegramLink: "https://t.me/dogecoin",
    websiteLink: "https://www.dogecoin.com",
    twitterLink: "https://twitter.com/dogecoin",
    share: 0.2,
    marketCap: 3000000000,
  },
  {
    id: "3",
    round: 3,
    name: "Bonk",
    symbol: "BONK",
    iconUrl: "/icon.png",
    description:
      "Bonk is a digital currency that allows you to send money online quickly and cheaply. It's easy to use and has a low transaction fee.",
    telegramLink: "https://t.me/bonkcoin",
    websiteLink: "https://www.bonkcoin.com",
    twitterLink: "https://twitter.com/bonkcoin",
    share: 0.1,
    marketCap: 1000000000,
  },
];
