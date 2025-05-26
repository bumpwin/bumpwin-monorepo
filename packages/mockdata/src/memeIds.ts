import type { MEME_ID } from "@workspace/types";
import { generateMemeId } from "./utils";

// Generate MEME_IDs for all memes
export const MEME_IDS = {
  LAG: generateMemeId("LAG"),
  MOCAT: generateMemeId("MOCAT"),
  BUN: generateMemeId("BUN"),
  DITT: generateMemeId("DITT"),
  DOOD: generateMemeId("DOOD"),
  JELL: generateMemeId("JELL"),
  ANTS: generateMemeId("ANTS"),
  CHILLKITYY: generateMemeId("CHILLKITYY"),
  HAHA: generateMemeId("HAHA"),
  RACC: generateMemeId("RACC"),
  RUGT: generateMemeId("RUGT"),
  SAT: generateMemeId("SAT"),
  LOSER: generateMemeId("LOSER"),
  GLOSER: generateMemeId("GLOSER"),
  CHEDER: generateMemeId("CHEDER"),
  WAGMI: generateMemeId("WAGMI"),
  YAKIU: generateMemeId("YAKIU"),
  YELL: generateMemeId("YELL"),
  SMUG: generateMemeId("SMUG"),
  TREX: generateMemeId("TREX"),
  COONYE: generateMemeId("COONYE"),
  HIGHER: generateMemeId("HIGHER"),
  COLA: generateMemeId("COLA"),
  HOGGY: generateMemeId("HOGGY"),
  LILCUTE: generateMemeId("LILCUTE"),
  MONKE: generateMemeId("MONKE"),
} as const satisfies Record<string, MEME_ID>;
