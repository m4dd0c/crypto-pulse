export interface iPriceHistory {
  timestamp: number;
  price: number;
}

export type currencySymbols = "BTC" | "ETH" | "SOL" | "DOGE" | "ADA" | "DOT";
export type tPriceHistory = iPriceHistory[];
