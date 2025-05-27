<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
import type { MemeMetadata } from "@workspace/types";
import { MEME_IDS } from "./memeIds";

export const mockmemes: MemeMetadata[] = [
  {
    id: MEME_IDS.LAG,
========
import { poseidonHash } from "@mysten/sui/zklogin";
import { type MEME_ID, type MemeMetadata, memeMetadata } from "./types";

const generateSimpleId = (input: string): MEME_ID => {
  const inputs = Array.from(input).map((c) => c.charCodeAt(0));
  const hash = poseidonHash(inputs);
  return `0x${hash.toString(16).padStart(64, "0")}` as MEME_ID;
};

export const mockMemeMetadata: MemeMetadata[] = [
  {
    id: generateSimpleId("LAG"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "LAG",
    name: "Lag Girl",
    description: "lagging since 2020",
    iconUrl: "/images/mockmemes/LAG.jpg",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.MOCAT,
========
    id: generateSimpleId("MOCAT"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "MOCAT",
    name: "Mocaccino Cat",
    description: "just knocked over $3B in TVL. still no regrets.",
    iconUrl: "/images/mockmemes/MOCAT.jpg",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.BUN,
========
    id: generateSimpleId("BUN"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "BUN",
    name: "Bun Protocol",
    description: "🥟 one bite = full degen enlightenment",
    iconUrl: "/images/mockmemes/BUN.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.DITT,
========
    id: generateSimpleId("DITT"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "DITT",
    name: "DittoDAO",
    description: "._.",
    iconUrl: "/images/mockmemes/DITT.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.DOOD,
========
    id: generateSimpleId("DOOD"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "DOOD",
    name: "DOODLORD",
    description: "tfw you lose $8k and become the couch",
    iconUrl: "/images/mockmemes/DOOD.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.JELL,
========
    id: generateSimpleId("JELL"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "JELL",
    name: "Jelloo Protocol",
    description: "jiggle economics.\njiggle governance.\njiggle forever.",
    iconUrl: "/images/mockmemes/JELL.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.ANTS,
========
    id: generateSimpleId("ANTS"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "ANTS",
    name: "Anticipation Whale",
    description: "*blinks*\nprice goes up.\n*blinks*\nprice goes down.",
    iconUrl: "/images/mockmemes/ANTS.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.CHILLKITYY,
========
    id: generateSimpleId("CHILLKITYY"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "CHILLKITYY",
    name: "Chill Kityy DAO",
    description: "sunset.\nno roadmap.\njust vibes.",
    iconUrl: "/images/mockmemes/CHILLKITYY.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.HAHA,
========
    id: generateSimpleId("HAHA"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "HAHA",
    name: "HAHAverse",
    description: "⛓️haha\n📉haha\n🪙haha\n👹HAHAHAHAHA—",
    iconUrl: "/images/mockmemes/HAHA.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.RACC,
========
    id: generateSimpleId("RACC"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "RACC",
    name: "Raccoon Moon",
    description: "broadcasting from the moon\non 0.0001$ equipment",
    iconUrl: "/images/mockmemes/RACC.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.RUGT,
========
    id: generateSimpleId("RUGT"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "RUGT",
    name: "Rugtopus",
    description: "🪼 rugged 8 times and still printing\n#multithreadedexit",
    iconUrl: "/images/mockmemes/RUGT.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.SAT,
========
    id: generateSimpleId("SAT"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "SAT",
    name: "Saturdance",
    description: "💃 saturday only\n📉 sunday panic",
    iconUrl: "/images/mockmemes/SAT.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.LOSER,
========
    id: generateSimpleId("LOSER"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "LOSER",
    name: "Party Loser",
    description: "Losers of BUMP.WIN",
    iconUrl: "/images/mockmemes/LOSER.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.GLOSER,
========
    id: generateSimpleId("GLOSER"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "GLOSER",
    name: "Golden Loser",
    description: "same energy, shinier bags",
    iconUrl: "/images/mockmemes/GLOSER.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.CHEDER,
========
    id: generateSimpleId("CHEDER"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "CHEDER",
    name: "Cheder King",
    description: "🧀👑 aged 36 months in bear market cellar",
    iconUrl: "/images/mockmemes/CHEDER.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.WAGMI,
========
    id: generateSimpleId("WAGMI"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "WAGMI",
    name: "Wagmi Whale",
    description: "✋ this whale has zero liquidity but infinite belief",
    iconUrl: "/images/mockmemes/WAGMI.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.YAKIU,
========
    id: generateSimpleId("YAKIU"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "YAKIU",
    name: "Yakiumin",
    description:
      "why he shaped like that\n\nalso: devs are asleep, deploy sushi llama",
    iconUrl: "/images/mockmemes/YAKIU.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.YELL,
========
    id: generateSimpleId("YELL"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "YELL",
    name: "Yellcoin",
    description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 😭📉📢📈😭",
    iconUrl: "/images/mockmemes/YELL.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.SMUG,
========
    id: generateSimpleId("SMUG"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "SMUG",
    name: "Smug Inu",
    description: "smirk so powerful it front-ran the block",
    iconUrl: "/images/mockmemes/SMUG.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.TREX,
========
    id: generateSimpleId("TREX"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "TREX",
    name: "T-Rex Chain",
    description:
      "Sir, our tech is outdated.\n– SO IS THE T-REX AND IT ATE PEOPLE",
    iconUrl: "/images/mockmemes/TREX.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.COONYE,
========
    id: generateSimpleId("COONYE"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "COONYE",
    name: "Coonye Coin",
    description: "they said raccoons can't drop albums. they were wrong.",
    iconUrl: "/images/mockmemes/COONYE.jpg",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.HIGHER,
========
    id: generateSimpleId("HIGHER"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "HIGHER",
    name: "HigherFace",
    description: 'bears: "it\'ll retrace"\nme: *internal static intensifies*',
    iconUrl: "/images/mockmemes/HIGHER.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.COLA,
========
    id: generateSimpleId("COLA"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "COLA",
    name: "Cola Llama",
    description: "c̶o̶c̶a̶  cola + alpaca = beverage-based ponzinomics",
    iconUrl: "/images/mockmemes/COLA.png",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.HOGGY,
========
    id: generateSimpleId("HOGGY"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "HOGGY",
    name: "Hoggy Forest",
    description: "forest-coded. emotionally tanky. cute armor. 🌲🦔",
    iconUrl: "/images/mockmemes/HOGGY.webp",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.LILCUTE,
========
    id: generateSimpleId("LILCUTE"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "LILCUTE",
    name: "LilCute",
    description: "✿◕ ‿ ◕✿ hodl me senpai ✿◕ ‿ ◕✿",
    iconUrl: "/images/mockmemes/LILCUTE.gif",
  },
  {
<<<<<<<< HEAD:packages/mockdata/src/mockMemes.ts
    id: MEME_IDS.MONKE,
========
    id: generateSimpleId("MONKE"),
>>>>>>>> origin/main:packages/mockdata/src/mememetadata.ts
    symbol: "MONKE",
    name: "Monke Vibe",
    description: "refuses to elaborate. eats banana. up 420%.",
    iconUrl: "/images/mockmemes/MONKE.jpeg",
  },
] as const;
