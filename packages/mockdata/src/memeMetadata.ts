import type { MEME_ID, MemeMetadata } from "@workspace/types";
import { mockmemes } from "./mockMemes";

// Create a record of meme metadata by ID
export const mockMemeMetadata: Record<MEME_ID, MemeMetadata> = mockmemes.reduce(
  (acc, meme) => {
    acc[meme.id] = meme;
    return acc;
  },
  {} as Record<MEME_ID, MemeMetadata>,
);

export const getMemeMetadataById = (memeId: MEME_ID): MemeMetadata | undefined =>
  mockMemeMetadata[memeId];

export const getMemeMetadataBySymbol = (symbol: string): MemeMetadata | undefined =>
  mockmemes.find((meme) => meme.symbol === symbol);
