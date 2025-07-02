export interface CryptoCoin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdate: Date;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export interface WebSocketMessage {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price
  q: string; // Quantity
  t: number; // Trade time
}

export interface BinanceKlineData {
  openTime: number;
  closeTime: number;
  symbol: string;
  interval: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  trades: number;
}

