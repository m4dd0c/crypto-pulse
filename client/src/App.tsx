import { useState } from "react";
import { Download, Activity } from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CoinCard } from "@/components/CoinCard";
import { PriceChart } from "@/components/PriceChart";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { useCryptoWebSocket } from "@/hooks/useCryptoWebSocket";
import { useFavorites } from "@/hooks/useFavorites";
import { downloadReportURL } from "./lib/api";

function App() {
  const { coins, isConnected } = useCryptoWebSocket();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(downloadReportURL);
      if (response.ok) {
        const csvData = await response.text();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cryptopulse-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const selectedCoinData = coins.find((coin) => coin.symbol === selectedCoin);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-3">
              <div className="size-8 rounded-lg bg-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-black text-bold" />
              </div>
              <h1 className="md:text-2xl font-bold text-xl">CryptoPulse</h1>
              <ConnectionStatus isConnected={isConnected} />
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <Button
                onClick={handleDownloadReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download Report</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Live Crypto Prices</h2>
            <p className="text-muted-foreground">
              Real-time cryptocurrency prices via Binance WebSocket API
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coins Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coins.map((coin) => (
                  <CoinCard
                    key={coin.symbol}
                    coin={coin}
                    isFavorite={isFavorite(coin.symbol)}
                    onToggleFavorite={() => toggleFavorite(coin.symbol)}
                    onSelect={() => setSelectedCoin(coin.symbol)}
                    isSelected={selectedCoin === coin.symbol}
                  />
                ))}
              </div>

              {/* Favorites Section */}
              {favorites.size > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Your Favorites</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coins
                      .filter((coin) => isFavorite(coin.symbol))
                      .map((coin) => (
                        <CoinCard
                          key={`fav-${coin.symbol}`}
                          coin={coin}
                          isFavorite={true}
                          onToggleFavorite={() => toggleFavorite(coin.symbol)}
                          onSelect={() => setSelectedCoin(coin.symbol)}
                          isSelected={selectedCoin === coin.symbol}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chart Section */}
            <div className="lg:col-span-1">
              {selectedCoinData && (
                <PriceChart
                  symbol={selectedCoin}
                  name={selectedCoinData.name}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
