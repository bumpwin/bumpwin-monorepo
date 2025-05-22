export interface Coin {
  id: string;
  symbol: string;
  name: string;
  iconUrl: string;
  round: number;
  share?: number;
  marketCap?: number;
  description: string;
  telegramLink?: string;
  websiteLink?: string;
  twitterLink?: string;
  color: string;
  createdBy?: string;
}
