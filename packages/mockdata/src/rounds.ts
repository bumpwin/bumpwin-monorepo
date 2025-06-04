import type { RoundData } from "@workspace/types";
import { MEME_IDS } from "./memeIds";

// Mock round data
export const mockRoundData: Record<string, RoundData> = {
  "round-1": {
    id: "round-1",
    round: 1,
    memeIds: [],
    championMemeId: MEME_IDS.SMUG,
    startTime: 1737936000000, // 2025-01-27 00:00:00 UTC
    endTime: 1738022400000, // 2025-01-28 00:00:00 UTC
    status: "completed",
  },
  "round-2": {
    id: "round-2",
    round: 2,
    memeIds: [],
    championMemeId: MEME_IDS.YAKIU,
    startTime: 1738022400000, // 2025-01-28 00:00:00 UTC
    endTime: 1738108800000, // 2025-01-29 00:00:00 UTC
    status: "completed",
  },
  "round-3": {
    id: "round-3",
    round: 3,
    memeIds: [],
    championMemeId: MEME_IDS.JELL,
    startTime: 1738108800000, // 2025-01-29 00:00:00 UTC
    endTime: 1738195200000, // 2025-01-30 00:00:00 UTC
    status: "completed",
  },
  "round-4": {
    id: "round-4",
    round: 4,
    memeIds: [
      MEME_IDS.LAG,
      MEME_IDS.MOCAT,
      MEME_IDS.BUN,
      MEME_IDS.DITT,
      MEME_IDS.DOOD,
      MEME_IDS.ANTS,
      MEME_IDS.CHILLKITYY,
      MEME_IDS.HAHA,
      MEME_IDS.RACC,
      MEME_IDS.RUGT,
      MEME_IDS.SAT,
      MEME_IDS.GLOSER,
      MEME_IDS.CHEDER,
      MEME_IDS.WAGMI,
      MEME_IDS.YELL,
      MEME_IDS.TREX,
      MEME_IDS.COONYE,
      MEME_IDS.HIGHER,
      MEME_IDS.COLA,
      MEME_IDS.HOGGY,
    ],
    startTime: 1738195200000, // 2025-01-30 00:00:00 UTC
    endTime: 1738281600000, // 2025-01-31 00:00:00 UTC
    status: "active",
  },
  "round-5": {
    id: "round-5",
    round: 5,
    memeIds: [],
    startTime: 1738281600000, // 2025-01-31 00:00:00 UTC
    endTime: 1738368000000, // 2025-02-01 00:00:00 UTC
    status: "upcoming",
  },
};

export const getCurrentRound = (): RoundData | undefined =>
  Object.values(mockRoundData).find((round) => round.status === "active");

export const getCompletedRounds = (): RoundData[] =>
  Object.values(mockRoundData).filter(
    (round): round is RoundData & { status: "completed" } =>
      round.status === "completed",
  );

export const getUpcomingRounds = (): RoundData[] =>
  Object.values(mockRoundData).filter((round) => round.status === "upcoming");

export const getRoundById = (roundId: string): RoundData | undefined =>
  mockRoundData[roundId];

export const getRoundByNumber = (roundNumber: number): RoundData | undefined =>
  Object.values(mockRoundData).find((round) => round.round === roundNumber);
