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

    const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setBetAmount(Math.min(Math.max(value, 1), maxBet));
    };

    return (
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 border-2 border-yellow-500/50 shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">💰 Bet Panel</h3>

            {/* Bet Amount Input */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                    <label className="block text-yellow-300 font-semibold mb-2 text-sm sm:text-base">
                        Bet Amount
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl text-yellow-400">$</span>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={handleBetChange}
                            max={maxBet}
                            min="1"
                            step="1"
                            className="flex-1 px-4 py-3 bg-white/10 border-2 border-yellow-500/30 rounded-lg text-white text-lg sm:text-xl font-bold focus:outline-none focus:border-yellow-400 transition"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Max: ${maxBet.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 sm:mb-6">
                {quickBets.map((bet) => (
                    <button
                        key={bet}
                        onClick={() => setBetAmount(Math.min(bet, maxBet))}
                        disabled={bet > maxBet || spinning}
                        className={`py-2 px-3 rounded-lg font-semibold transition ${bet <= maxBet && !spinning
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer transform hover:scale-105 active:scale-95"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                            }`}
                    >
                        ${bet}
                    </button>
                ))}
            </div>

            {/* Spin Button */}
            <button
                onClick={onSpin}
                disabled={spinning || betAmount > maxBet}
                className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition transform ${!spinning && betAmount <= maxBet
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
            >
                {spinning ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">🎰</span> SPINNING...
                    </span>
                ) : (
                    "🎰 SPIN"
                )}
            </button>

            {/* Bet Info */}
            <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                    <span>Current Bet:</span>
                    <span className="font-bold text-yellow-300">${betAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                    <span>Available Balance:</span>
                    <span className="font-bold text-green-400">${maxBet.toFixed(2)}</span>
                </div>
                {betAmount > maxBet && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded p-2">
                        <p className="text-red-200 text-xs">⚠️ Insufficient balance!</p>
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="mt-5 sm:mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-xs text-center">
                    💡 Tip: Higher bets could mean bigger payouts!
                </p>
            </div>
        </div>
    );
}
