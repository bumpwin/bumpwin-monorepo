// Export all mock data
export * from "./mockMemes";
export * from "./memeIds";
export * from "./memeMetadata";
export * from "./marketData";
export * from "./rounds";
export * from "./utils";

import type { MEME_ID, RoundData } from "@workspace/types";
import { getMemeMetadataById } from "./memeMetadata";
import { getCompletedRounds } from "./rounds";

export const getChampions = () =>
  getCompletedRounds()
    .filter(
      (
        round,
      ): round is RoundData & {
        status: "completed";
        championMemeId: MEME_ID;
      } => round.status === "completed" && "championMemeId" in round,
    )
    .map((round) => ({
      round,
      meme: getMemeMetadataById(round.championMemeId),
    }))
    .filter((champion) => champion.meme !== undefined);
