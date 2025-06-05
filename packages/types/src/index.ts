// DON'T CHANGE THIS FILE

export type MEME_ID = `0x${string}`;

export interface MemeMetadata {
  id: MEME_ID;
  name: string;
  symbol: string;
  description: string;
  iconUrl: string;
}

export type RoundData =
  | {
      id: string;
      round: number;
      memeIds: MEME_ID[];
      championMemeId: MEME_ID;
      startTime: number;
      endTime: number;
      status: "completed";
    }
  | {
      id: string;
      round: number;
      memeIds: MEME_ID[];
      startTime: number;
      endTime: number;
      status: "active" | "upcoming";
    };

export interface MemeMarketData {
  price: number;
  marketCap: number;
}

export const memeMetadataRecord: Record<MEME_ID, MemeMetadata> = {};
export const roundDataRecord: Record<string, RoundData> = {};
export const memeMarketDataRecord: Record<MEME_ID, MemeMarketData> = {};
