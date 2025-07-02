import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isConnected
          ? "bg-green-500/10 text-green-500"
          : "bg-red-500/10 text-red-500"
      }`}
    >
      {isConnected ? (
        <div title="Live" className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span className="md:inline hidden">Live</span>
        </div>
      ) : (
        <div title="Disconnected" className="flex items-center gap-1">
          <WifiOff className="h-3 w-3" />
          <span className="md:inline hidden">Disconnected</span>
        </div>
      )}
    </div>
  );
}
