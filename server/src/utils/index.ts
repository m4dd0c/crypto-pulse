import { currencySymbols } from "../types/types";

// Helper function to get symbol names
const names = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  DOGE: "Dogecoin",
  ADA: "Cardano",
  DOT: "Polkadot",
};

export function getSymbolName(symbol: currencySymbols) {
  return names[symbol] || symbol;
}
