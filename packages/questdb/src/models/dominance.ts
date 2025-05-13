export interface Dominance {
  timestamp: Date;
  coin_id: string;
  dominance: number;
  volume: number;
}

export const DOMINANCE_TABLE = `
  CREATE TABLE IF NOT EXISTS dominance (
    ts        TIMESTAMP,   -- 計測時刻
    coin_id   SYMBOL CACHE,-- コインID（辞書＋キャッシュで高速化）
    dominance DOUBLE,      -- 0.0〜1.0
    volume    DOUBLE       -- 取引量
  ) TIMESTAMP(ts)
    PARTITION BY HOUR      -- パーティション粒度
    WAL;                   -- Write-Ahead Log を有効化
`;
