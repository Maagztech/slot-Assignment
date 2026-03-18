"use client";

interface BettingPanelProps {
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onSpin: () => void;
  spinning: boolean;
  maxBet: number;
}

export default function BettingPanel({
  betAmount,
  setBetAmount,
  onSpin,
  spinning,
  maxBet,
}: BettingPanelProps) {
  const quickBets = [5, 10, 25, 50, 100];
  const safeMaxBet = Math.max(maxBet, 1);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isFinite(value)) {
      setBetAmount(1);
      return;
    }

    setBetAmount(Math.min(Math.max(value, 1), safeMaxBet));
  };

  return (
    <div className="rounded-2xl border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 shadow-2xl backdrop-blur-md">
      <h3 className="mb-6 text-center text-2xl font-bold text-white">💰 Bet Panel</h3>

      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-2 block font-semibold text-yellow-300">
            Bet Amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl text-yellow-400">$</span>
            <input
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              max={safeMaxBet}
              min="1"
              step="1"
              className="flex-1 rounded-lg border-2 border-yellow-500/30 bg-white/10 px-4 py-3 text-xl font-bold text-white transition focus:border-yellow-400 focus:outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Wallet available: ${maxBet.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2">
        {quickBets.map((bet) => (
          <button
            key={bet}
            onClick={() => setBetAmount(Math.min(bet, safeMaxBet))}
            disabled={bet > maxBet || spinning}
            className={`rounded-lg px-3 py-2 font-semibold transition ${bet <= maxBet && !spinning
              ? "cursor-pointer bg-yellow-600 text-white hover:bg-yellow-700 hover:scale-105 active:scale-95"
              : "cursor-not-allowed bg-gray-600 text-gray-400 opacity-50"}`}
          >
            ${bet}
          </button>
        ))}
      </div>

      <button
        onClick={onSpin}
        disabled={spinning || betAmount > maxBet || maxBet <= 0}
        className={`w-full rounded-lg px-4 py-4 text-lg font-bold transition ${!spinning && betAmount <= maxBet && maxBet > 0
          ? "cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 hover:scale-105 active:scale-95"
          : "cursor-not-allowed bg-gray-600 text-gray-400 opacity-50"}`}
      >
        {spinning ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">🎰</span> SPINNING...
          </span>
        ) : (
          "🎰 SPIN"
        )}
      </button>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Current Bet:</span>
          <span className="font-bold text-yellow-300">${betAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Max Win Cap:</span>
          <span className="font-bold text-green-400">${(betAmount * 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Jackpot Contribution:</span>
          <span className="font-bold text-cyan-300">${(betAmount * 0.02).toFixed(2)}</span>
        </div>
        {betAmount > maxBet && (
          <div className="rounded border border-red-500/50 bg-red-500/20 p-2">
            <p className="text-xs text-red-200">⚠️ Insufficient balance.</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
        <p className="text-center text-xs text-blue-200">
          5 reels, 3 rows, 5 paylines, scatter bonus trigger, and jackpot accrual.
        </p>
      </div>
    </div>
  );
}
