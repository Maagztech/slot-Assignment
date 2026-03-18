"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";
import WalletManager from "./WalletManager";
import BettingPanel from "./BettingPanel";
import ReelsDisplay from "./ReelsDisplay";

export default function SlotMachine() {
    const { user, token, logout, updateWallet } = useAuth();
    const [spinning, setSpinning] = useState(false);
    const [betAmount, setBetAmount] = useState(10);
    const [grid, setGrid] = useState<string[][] | null>(null);
    const [totalWin, setTotalWin] = useState<number | null>(null);
    const [jackpotMeter, setJackpotMeter] = useState<number | null>(null);
    const [jackpotTriggered, setJackpotTriggered] = useState<boolean>(false);
    const [bonusTriggered, setBonusTriggered] = useState<boolean>(false);
    const [scatterCount, setScatterCount] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [showWalletManager, setShowWalletManager] = useState(false);
    const [spinHistory, setSpinHistory] = useState<
        Array<{ bet: number; win: number }>
    >([]);
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [simulationSpins, setSimulationSpins] = useState(50000);
    const [simulationReport, setSimulationReport] = useState<any>(null);
    const [simulationError, setSimulationError] = useState("");

    useEffect(() => {
        // Reset message after 3 seconds
        if (error || totalWin !== null) {
            const timer = setTimeout(() => {
                setError("");
                if (totalWin !== null) {
                    setTotalWin(null);
                    setGrid(null);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, totalWin]);

    const handleSpin = async () => {
        if (!token) {
            setError("Please authenticate first");
            return;
        }

        if (!user) {
            setError("User not found");
            return;
        }

        if (user.wallet_balance < betAmount) {
            setError("Insufficient balance. Add funds to your wallet!");
            return;
        }

        setSpinning(true);
        setError("");
        setTotalWin(null);

        try {
            const result = await api.placeBet(token, betAmount);
            setGrid(result.grid);
            setTotalWin(result.totalWin);
            setJackpotMeter(result.jackpotMeter);
            setJackpotTriggered(result.jackpotTriggered);
            setBonusTriggered(result.bonusTriggered);
            setScatterCount(result.scatterCount);

            // Update wallet with new balance
            updateWallet(user.wallet_balance - betAmount + result.totalWin);

            // Add to history
            setSpinHistory((prev) => [
                { bet: betAmount, win: result.totalWin },
                ...prev.slice(0, 9),
            ]);
        } catch (err: any) {
            setError(err.message || "Spin failed");
        } finally {
            setSpinning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">🎰 SlotMachine</h1>
                        <span className="hidden md:block text-gray-400 text-sm">
                            Try your luck!
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Balance</p>
                            <p className="text-2xl font-bold text-green-400">
                                ${user?.wallet_balance.toFixed(2) || "0.00"}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowWalletManager(!showWalletManager)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            💳 Add Funds
                        </button>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Main Game Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Reels Display */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                            <ReelsDisplay grid={grid} spinning={spinning} />
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                                <p className="text-red-200 font-semibold">⚠️ {error}</p>
                            </div>
                        )}

                        {totalWin !== null && (
                            <div
                                className={`${totalWin > betAmount
                                    ? "bg-green-500/20 border-green-500/50"
                                    : "bg-orange-500/20 border-orange-500/50"
                                    } rounded-xl p-4 border`}
                            >
                                <p
                                    className={`${totalWin > betAmount ? "text-green-200" : "text-orange-200"
                                        } font-semibold text-lg`}
                                >
                                    {totalWin > betAmount
                                        ? `🎉 You won $${totalWin.toFixed(2)}!`
                                        : `💸 You lost $${(betAmount - totalWin).toFixed(2)}`}
                                </p>
                                {totalWin > betAmount && (
                                    <p className="text-green-100 text-sm mt-1">
                                        Net gain: +$
                                        {(totalWin - betAmount).toFixed(2)}
                                    </p>
                                )}
                                {bonusTriggered && (
                                    <p className="text-blue-100 text-sm mt-2">
                                        ✨ Bonus Triggered ({scatterCount} scatters)!
                                    </p>
                                )}
                                {jackpotTriggered && (
                                    <p className="text-yellow-100 text-sm mt-2">
                                        🏆 Jackpot Hit! Payout included in total win.
                                    </p>
                                )}
                            </div>
                        )}

                        {jackpotMeter !== null && jackpotMeter > 0 && (
                            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4">
                                <p className="text-yellow-200 font-bold text-lg">
                                    🏆 Jackpot Meter: ${jackpotMeter.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right - Betting Panel */}
                    <div className="space-y-6">
                        <BettingPanel
                            betAmount={betAmount}
                            setBetAmount={setBetAmount}
                            onSpin={handleSpin}
                            spinning={spinning}
                            maxBet={user?.wallet_balance || 0}
                        />

                        {/* Wallet Manager */}
                        {showWalletManager && token && (
                            <WalletManager
                                token={token}
                                onAddFunds={(newBalance) => updateWallet(newBalance)}
                            />
                        )}

                        {/* Spin History */}
                        {spinHistory.length > 0 && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h3 className="text-white font-bold text-lg mb-4">
                                    ⏱️ Recent Spins
                                </h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {spinHistory.map((spin, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center text-sm bg-white/5 p-2 rounded border border-white/10"
                                        >
                                            <span className="text-gray-300">
                                                Bet: ${spin.bet.toFixed(2)}
                                            </span>
                                            <span
                                                className={
                                                    spin.win > spin.bet
                                                        ? "text-green-400 font-semibold"
                                                        : "text-orange-400 font-semibold"
                                                }
                                            >
                                                {spin.win > spin.bet
                                                    ? `+$${(spin.win - spin.bet).toFixed(2)}`
                                                    : `-$${(spin.bet - spin.win).toFixed(2)}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Simulation Panel */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white font-bold text-lg mb-4">📊 Simulation</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-300">Spins:</label>
                                    <input
                                        type="number"
                                        value={simulationSpins}
                                        onChange={(e) => setSimulationSpins(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded bg-black/20 border border-white/10 text-white"
                                    />
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!token) return;
                                        setSimulationRunning(true);
                                        setSimulationError("");
                                        setSimulationReport(null);
                                        try {
                                            const report = await api.runSimulation(token, betAmount, simulationSpins);
                                            setSimulationReport(report);
                                        } catch (err: any) {
                                            setSimulationError(err.message || "Simulation failed");
                                        } finally {
                                            setSimulationRunning(false);
                                        }
                                    }}
                                    disabled={simulationRunning}
                                    className={`w-full py-3 rounded-lg font-semibold text-white ${simulationRunning ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                                >
                                    {simulationRunning ? "Running..." : "Run Simulation"}
                                </button>

                                {simulationError && (
                                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
                                        <p className="text-red-200 text-sm">{simulationError}</p>
                                    </div>
                                )}

                                {simulationReport && (
                                    <div className="bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-200">
                                        <p className="font-semibold text-white">Simulation Results</p>
                                        <ul className="mt-2 space-y-1">
                                            <li>
                                                Total Wagered: ${simulationReport.totalWagered.toFixed(2)}
                                            </li>
                                            <li>
                                                Total Returned: ${simulationReport.totalReturned.toFixed(2)}
                                            </li>
                                            <li>
                                                RTP: {(simulationReport.rtp * 100).toFixed(2)}%
                                            </li>
                                            <li>
                                                Hit Frequency: {(simulationReport.hitFrequency * 100).toFixed(2)}%
                                            </li>
                                            <li>
                                                Bonus Frequency: {(simulationReport.bonusFrequency * 100).toFixed(2)}%
                                            </li>
                                            <li>
                                                Jackpot Triggers: {simulationReport.jackpotTriggers}
                                            </li>
                                            <li>
                                                Max Win Observed: ${simulationReport.maxWinObserved.toFixed(2)}
                                            </li>
                                            <li>
                                                Starting Jackpot: ${simulationReport.startingJackpot.toFixed(2)}
                                            </li>
                                            <li>
                                                Ending Jackpot: ${simulationReport.endingJackpot.toFixed(2)}
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
