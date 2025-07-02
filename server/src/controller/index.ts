import { Request, Response } from "express";
import { getSymbolName } from "../utils/index";
import { currencySymbols } from "../types/types";

export const health = (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
};

// Proxy Binance API for price history
export const priceHistory = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const interval = req.query.interval || "1h";
    const limit = req.query.limit || "24";

    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(binanceUrl);

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`);
    }

    const data: (string | number)[][] = await response.json();

    // Transform Binance kline data to our format
    const priceHistory = data.map((kline) => ({
      timestamp: <number>kline[6],
      price: parseFloat(<string>kline[4]),
    }));

    res.status(200).json(priceHistory);
  } catch (error: any) {
    console.error("Error fetching price history:", error);
    res.status(500).json({
      error: "Failed to fetch price history",
      message: error?.message,
    });
  }
};

export const downloadReport = async (_req: Request, res: Response) => {
  try {
    // Fetch current prices from Binance
    const symbols = [
      "BTCUSDT",
      "ETHUSDT",
      "SOLUSDT",
      "DOGEUSDT",
      "ADAUSDT",
      "DOTUSDT",
    ];
    const prices = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
          );
          const data: Record<string, string | number> = await response.json();
          console.log(data, "adsasdfas");
          return {
            symbol: symbol.replace("USDT", ""),
            name: getSymbolName(symbol.replace("USDT", "") as currencySymbols),
            price: parseFloat(<string>data.lastPrice),
            change24h: parseFloat(<string>data.priceChangePercent),
            volume24h: parseFloat(<string>data.volume),
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return null;
        }
      }),
    );

    const validPrices = prices.filter((price) => price !== null);

    // Generate CSV
    const headers = [
      "Symbol",
      "Name",
      "Price (USD)",
      "Change 24h (%)",
      "Volume 24h",
      "Timestamp",
    ];
    const csvRows = [
      headers.join(","),
      ...validPrices.map((coin) =>
        [
          coin.symbol,
          `"${coin.name}"`,
          coin.price.toFixed(6),
          coin.change24h.toFixed(2),
          coin.volume24h.toFixed(2),
          `"${coin.timestamp}"`,
        ].join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="cryptopulse-report-${new Date().toISOString().split("T")[0]}.csv"`,
    );
    res.send(csvContent);
  } catch (error: any) {
    console.error("Error generating CSV report:", error);
    res.status(500).json({
      error: "Failed to generate report",
      message: error.message,
    });
  }
};
