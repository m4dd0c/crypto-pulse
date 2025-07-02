import { useState, useEffect, useRef } from "react";
import { CryptoCoin, WebSocketMessage } from "@/types/crypto";

const CRYPTO_SYMBOLS = [
  { symbol: "BTCUSDT", name: "Bitcoin", shortName: "BTC" },
  { symbol: "ETHUSDT", name: "Ethereum", shortName: "ETH" },
  { symbol: "SOLUSDT", name: "Solana", shortName: "SOL" },
  { symbol: "DOGEUSDT", name: "Dogecoin", shortName: "DOGE" },
  { symbol: "ADAUSDT", name: "Cardano", shortName: "ADA" },
  { symbol: "DOTUSDT", name: "Polkadot", shortName: "DOT" },
];

export function useCryptoWebSocket() {
  const [coins, setCoins] = useState<Record<string, CryptoCoin>>({});
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeCoins = () => {
    const initialCoins: Record<string, CryptoCoin> = {};
    CRYPTO_SYMBOLS.forEach(({ symbol, name, shortName }) => {
      initialCoins[symbol] = {
        symbol: shortName,
        name,
        price: 0,
        change24h: 0,
        volume24h: 0,
        lastUpdate: new Date(),
      };
    });
    setCoins(initialCoins);
  };

  const connectWebSocket = () => {
    try {
      const streams = CRYPTO_SYMBOLS.map(
        ({ symbol }) => `${symbol.toLowerCase()}@trade`,
      ).join("/");
      const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;

      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.e === "trade") {
            const price = parseFloat(data.p);
            const symbol = data.s;

            setCoins((prev) => {
              if (prev[symbol]) {
                return {
                  ...prev,
                  [symbol]: {
                    ...prev[symbol],
                    price,
                    lastUpdate: new Date(data.E),
                  },
                };
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");

        // reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    initializeCoins();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return {
    coins: Object.values(coins),
    isConnected,
  };
}

