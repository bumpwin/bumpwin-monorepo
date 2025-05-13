export interface Coin {
  id: string;
  name: string;
}

export const COINS_TABLE = `
  CREATE TABLE IF NOT EXISTS coins (
    id   SYMBOL,   -- 例: 'doge', 'pepe', 'wif'
    name STRING    -- 例: 'Dogecoin', 'Pepe'
  );
`;

