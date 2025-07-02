import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoCoin } from "@/types/crypto";
import { currencyIconMap, formatPrice } from "@/lib/utils";

interface CoinCardProps {
  coin: CryptoCoin;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
  isSelected: boolean;
}

export function CoinCard({
  coin,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isSelected,
}: CoinCardProps) {
  const Icon =
    currencyIconMap[coin.symbol as keyof typeof currencyIconMap] ||
    currencyIconMap["BTC"];
  return (
    <Card
      className={`
       cursor-pointer transition-all duration-300 hover:shadow-lg border-2
       ${isSelected ? "border-primary" : "border-border"}
      `}
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Icon className="h-6 w-6" />
          {coin.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="h-8 w-8"
        >
          <Heart
            className={`
              h-4 w-4 transition-colors
              ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }
            `}
          />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{formatPrice(coin.price)}</h3>
          <div className="text-sm text-muted-foreground">
            Last updated: {coin.lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
