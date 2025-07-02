import { useEffect, useState, useTransition } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PriceHistory } from "@/types/crypto";
import { priceHistoryURL } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface PriceChartProps {
  symbol: string;
  name: string;
}

interface ChartData {
  time: string;
  price: number;
  timestamp: number;
}

export function PriceChart({ symbol, name }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchPriceHistory = async () => {
    const run = async () => {
      try {
        const response = await fetch(
          `${priceHistoryURL}/${symbol.toUpperCase()}USDT`,
        );

        if (response.ok) {
          const data: PriceHistory[] = await response.json();
          const formattedData = data.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price: item.price,
            timestamp: item.timestamp,
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };
    startTransition(() => {
      run();
    });
  };

  useEffect(() => {
    if (symbol) {
      fetchPriceHistory();
    }
  }, [symbol]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{name} Price Chart</CardTitle>
            <CardDescription>24-hour price history</CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchPriceHistory}
            disabled={isPending}
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  // domain holding lowerbound and upperbound values (price)
                  domain={["dataMin - 100", "dataMax + 100"]}
                  tickFormatter={formatPrice}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Price"]}
                  labelStyle={{ color: "var(--foreground)" }}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "var(--primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Loading chart data...
                </div>
              ) : (
                "No chart data available"
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
