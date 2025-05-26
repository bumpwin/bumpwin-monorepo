export interface PerformancePoint {
  /** UNIX time (ms) */
  t: number;
  /** 任意の数値。価格・勝率などグラフ化したい値 */
  v: number;
}

export interface CoinCardProps {
  address: string;
  symbol: string;
  name: string;
  createdAt?: Date;
  isFavorite: boolean;
  logoUrl: string;
  description: string;
  marketCap: number; // 49750 → $49.75K 表示
  onToggleFavorite?: (id: string) => void;

  /* 追加フィールド */
  /** 何ラウンド目か */
  round?: number;
  /** パフォーマンスタグ (例: "ACE", "SURGE" など) */
  performanceTag?: string;
  /** 勝率（例: 0.54 → 54 %） */
  winRate?: number;
  /** 折れ線グラフ用の系列データ */
  priceHistory?: PerformancePoint[];
  /** チャンピオンの役割 */
  role?: string;
  /** ハイライト表示するかどうか */
  isHighlighted?: boolean;
  /** 価格 */
  price?: number;
  /** Telegramリンク */
  telegramLink?: string;
  /** ウェブサイトリンク */
  websiteLink?: string;
  /** Twitterリンク */
  twitterLink?: string;
}
