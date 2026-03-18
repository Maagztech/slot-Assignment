"use client";

interface ReelsDisplayProps {
  grid: string[][] | null;
  spinning: boolean;
}

const symbolMap: Record<string, string> = {
  A: "🍒",
  K: "🔔",
  Q: "💎",
  J: "🍋",
  W: "⭐",
  S: "🪙",
};

function toDisplayColumns(grid: string[][] | null): string[][] {
  if (!grid) {
    return Array.from({ length: 5 }, () => ["", "", ""]);
  }

  return Array.from({ length: 5 }, (_, colIndex) => [
    grid[0]?.[colIndex] ?? "",
    grid[1]?.[colIndex] ?? "",
    grid[2]?.[colIndex] ?? "",
  ]);
}

export default function ReelsDisplay({ grid, spinning }: ReelsDisplayProps) {
  const displayGrid = toDisplayColumns(grid);

  const renderSymbol = (symbol: string, index: number) => (
    <div
      key={`${symbol}-${index}`}
      className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/15 bg-black/25 text-center shadow-inner"
    >
      <span className="text-2xl">{symbolMap[symbol] ?? "🎲"}</span>
      <span className="text-xs font-semibold text-slate-100">{symbol || "-"}</span>
    </div>
  );

  const renderReel = (symbols: string[], index: number) => {
    return (
      <div
        key={index}
        className={`flex h-56 flex-1 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-yellow-400/60 bg-gradient-to-b from-slate-800 to-slate-950 px-3 py-4 shadow-xl ${spinning ? "animate-pulse" : ""}`}
      >
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-300">
          Reel {index + 1}
        </div>
        {spinning ? (
          <div className="flex h-full items-center justify-center text-4xl animate-bounce">
            🎰
          </div>
        ) : (
          <div className="flex flex-col gap-3">{symbols.map(renderSymbol)}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-white">🎰 5x3 Slot Grid</h2>
        <p className="text-sm text-slate-300">
          {spinning
            ? "Spinning reels with config-driven strips..."
            : grid
              ? "Latest server-side result."
              : "Authenticate, fund the wallet, then press SPIN."}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {displayGrid.map((reel, idx) => renderReel(reel, idx))}
      </div>

      <div className="grid gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100 md:grid-cols-3">
        <div>
          <p className="font-semibold text-white">Wild</p>
          <p>⭐ substitutes on paylines.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Scatter</p>
          <p>🪙 counts anywhere; 3+ triggers bonus flag.</p>
        </div>
        <div>
          <p className="font-semibold text-white">Exposure cap</p>
          <p>Maximum payout returned = bet × 100.</p>
        </div>
      </div>
    </div>
  );
}
