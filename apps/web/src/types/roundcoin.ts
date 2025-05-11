export interface RoundCoin {
  id: string;
  round: number;
  name: string;
  symbol: string;
  iconUrl: string;
  description: string;
  telegramLink?: string;
  websiteLink?: string;
  twitterLink?: string;
  share: number;
  marketCap: number;
}
