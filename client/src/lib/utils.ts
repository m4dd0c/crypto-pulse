import { clsx, type ClassValue } from "clsx";
import {
  SiBitcoinsv,
  SiSolana,
  SiEthereum,
  SiDogecoin,
  SiPolkadot,
  SiCardano,
} from "react-icons/si";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyIconMap = {
  BTC: SiBitcoinsv,
  SOL: SiSolana,
  ETH: SiEthereum,
  DOGE: SiDogecoin,
  DOT: SiPolkadot,
  ADA: SiCardano,
};

// converting number to currency format
export function formatPrice(p: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(p);
}
