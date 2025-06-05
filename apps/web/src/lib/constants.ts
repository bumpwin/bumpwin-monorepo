/**
 * Application-wide constants
 */

// Transaction constants
export const GAS_BUDGET = 50000000; // 0.05 SUI

// Chart constants
export const DEFAULT_COLOR_PALETTE = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#c300ff",
  "#00c3ff",
];

// UI constants
export const DEFAULT_ICON = "/images/mockmemes/RACC.webp";

// Animation constants
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Format constants
export const CURRENCY_THRESHOLDS = {
  million: 1_000_000,
  thousand: 1_000,
} as const;

// Time constants
export const TIME_ZONES = {
  utc: "UTC",
} as const;

// Chart display limits
export const CHART_LIMITS = {
  defaultCoinsToDisplay: 4,
  maxDataPoints: 100,
} as const;

// Chat constants
export const CHAT_LIMITS = {
  defaultMessageLimit: 10,
  maxMessageLength: 280,
} as const;

// Emoji list for chat/UI
export const emojiList = [
  // 顔
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  // 動物
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🦄",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  // 食べ物
  "🍏",
  "🍎",
  "🍐",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍈",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  // 記号・ハート
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "💯",
  // その他
  "🚀",
  "🎉",
  "🎊",
  "✨",
  "🌟",
  "⭐",
  "🔥",
  "💎",
  "🏆",
  "🎯",
] as const;

// API endpoints
export const API_ENDPOINTS = {
  chat: "/api/chat",
  coins: "/api/coins",
  transactions: "/api/transactions",
} as const;

// Route paths
export const ROUTES = {
  home: "/",
  battle: "/battle",
  champions: "/champions",
  rounds: "/rounds",
  about: "/about",
} as const;
