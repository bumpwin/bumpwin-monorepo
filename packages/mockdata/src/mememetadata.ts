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
    symbol: "LAG",
    name: "Lag Girl",
    description: "lagging since 2020",
    iconUrl: "/images/mockmemes/LAG.jpg",
  },
  {
    id: generateSimpleId("MOCAT"),
    symbol: "MOCAT",
    name: "Mocaccino Cat",
    description: "just knocked over $3B in TVL. still no regrets.",
    iconUrl: "/images/mockmemes/MOCAT.jpg",
  },
  {
    id: generateSimpleId("BUN"),
    symbol: "BUN",
    name: "Bun Protocol",
    description: "🥟 one bite = full degen enlightenment",
    iconUrl: "/images/mockmemes/BUN.webp",
  },
  {
    id: generateSimpleId("DITT"),
    symbol: "DITT",
    name: "DittoDAO",
    description: "._.",
    iconUrl: "/images/mockmemes/DITT.png",
  },
  {
    id: generateSimpleId("DOOD"),
    symbol: "DOOD",
    name: "DOODLORD",
    description: "tfw you lose $8k and become the couch",
    iconUrl: "/images/mockmemes/DOOD.png",
  },
  {
    id: generateSimpleId("JELL"),
    symbol: "JELL",
    name: "Jelloo Protocol",
    description: "jiggle economics.\njiggle governance.\njiggle forever.",
    iconUrl: "/images/mockmemes/JELL.png",
  },
  {
    id: generateSimpleId("ANTS"),
    symbol: "ANTS",
    name: "Anticipation Whale",
    description: "*blinks*\nprice goes up.\n*blinks*\nprice goes down.",
    iconUrl: "/images/mockmemes/ANTS.webp",
  },
  {
    id: generateSimpleId("CHILLKITYY"),
    symbol: "CHILLKITYY",
    name: "Chill Kityy DAO",
    description: "sunset.\nno roadmap.\njust vibes.",
    iconUrl: "/images/mockmemes/CHILLKITYY.webp",
  },
  {
    id: generateSimpleId("HAHA"),
    symbol: "HAHA",
    name: "HAHAverse",
    description: "⛓️haha\n📉haha\n🪙haha\n👹HAHAHAHAHA—",
    iconUrl: "/images/mockmemes/HAHA.webp",
  },
  {
    id: generateSimpleId("RACC"),
    symbol: "RACC",
    name: "Raccoon Moon",
    description: "broadcasting from the moon\non 0.0001$ equipment",
    iconUrl: "/images/mockmemes/RACC.webp",
  },
  {
    id: generateSimpleId("RUGT"),
    symbol: "RUGT",
    name: "Rugtopus",
    description: "🪼 rugged 8 times and still printing\n#multithreadedexit",
    iconUrl: "/images/mockmemes/RUGT.png",
  },
  {
    id: generateSimpleId("SAT"),
    symbol: "SAT",
    name: "Saturdance",
    description: "💃 saturday only\n📉 sunday panic",
    iconUrl: "/images/mockmemes/SAT.webp",
  },
  {
    id: generateSimpleId("LOSER"),
    symbol: "LOSER",
    name: "Party Loser",
    description: "Losers of BUMP.WIN",
    iconUrl: "/images/mockmemes/LOSER.png",
  },
  {
    id: generateSimpleId("GLOSER"),
    symbol: "GLOSER",
    name: "Golden Loser",
    description: "same energy, shinier bags",
    iconUrl: "/images/mockmemes/GLOSER.png",
  },
  {
    id: generateSimpleId("CHEDER"),
    symbol: "CHEDER",
    name: "Cheder King",
    description: "🧀👑 aged 36 months in bear market cellar",
    iconUrl: "/images/mockmemes/CHEDER.png",
  },
  {
    id: generateSimpleId("WAGMI"),
    symbol: "WAGMI",
    name: "Wagmi Whale",
    description: "✋ this whale has zero liquidity but infinite belief",
    iconUrl: "/images/mockmemes/WAGMI.png",
  },
  {
    id: generateSimpleId("YAKIU"),
    symbol: "YAKIU",
    name: "Yakiumin",
    description:
      "why he shaped like that\n\nalso: devs are asleep, deploy sushi llama",
    iconUrl: "/images/mockmemes/YAKIU.png",
  },
  {
    id: generateSimpleId("YELL"),
    symbol: "YELL",
    name: "Yellcoin",
    description: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 😭📉📢📈😭",
    iconUrl: "/images/mockmemes/YELL.png",
  },
  {
    id: generateSimpleId("SMUG"),
    symbol: "SMUG",
    name: "Smug Inu",
    description: "smirk so powerful it front-ran the block",
    iconUrl: "/images/mockmemes/SMUG.webp",
  },
  {
    id: generateSimpleId("TREX"),
    symbol: "TREX",
    name: "T-Rex Chain",
    description:
      "Sir, our tech is outdated.\n– SO IS THE T-REX AND IT ATE PEOPLE",
    iconUrl: "/images/mockmemes/TREX.png",
  },
  {
    id: generateSimpleId("COONYE"),
    symbol: "COONYE",
    name: "Coonye Coin",
    description: "they said raccoons can't drop albums. they were wrong.",
    iconUrl: "/images/mockmemes/COONYE.jpg",
  },
  {
    id: generateSimpleId("HIGHER"),
    symbol: "HIGHER",
    name: "HigherFace",
    description: 'bears: "it\'ll retrace"\nme: *internal static intensifies*',
    iconUrl: "/images/mockmemes/HIGHER.webp",
  },
  {
    id: generateSimpleId("COLA"),
    symbol: "COLA",
    name: "Cola Llama",
    description: "c̶o̶c̶a̶  cola + alpaca = beverage-based ponzinomics",
    iconUrl: "/images/mockmemes/COLA.png",
  },
  {
    id: generateSimpleId("HOGGY"),
    symbol: "HOGGY",
    name: "Hoggy Forest",
    description: "forest-coded. emotionally tanky. cute armor. 🌲🦔",
    iconUrl: "/images/mockmemes/HOGGY.webp",
  },
  {
    id: generateSimpleId("LILCUTE"),
    symbol: "LILCUTE",
    name: "LilCute",
    description: "✿◕ ‿ ◕✿ hodl me senpai ✿◕ ‿ ◕✿",
    iconUrl: "/images/mockmemes/LILCUTE.gif",
  },
  {
    id: generateSimpleId("MONKE"),
    symbol: "MONKE",
    name: "Monke Vibe",
    description: "refuses to elaborate. eats banana. up 420%.",
    iconUrl: "/images/mockmemes/MONKE.jpeg",
  },
] as const;
