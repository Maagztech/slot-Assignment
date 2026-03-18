"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";
import { errorMessage } from "@/lib/api";
import type { LineWin, SimulationResponse, SpinResponse } from "@/lib/api";
import BettingPanel from "./BettingPanel";
import ReelsDisplay from "./ReelsDisplay";
import WalletManager from "./WalletManager";

const paylinePreview = [
  "1: Top row",
  "2: Middle row",
  "3: Bottom row",
  "4: V shape",
  "5: Inverted V",
];

export default function SlotMachine() {
  const { user, token, logout, updateWallet } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [grid, setGrid] = useState<string[][] | null>(null);
  const [spinResult, setSpinResult] = useState<SpinResponse | null>(null);
  const [error, setError] = useState("");
  const [showWalletManager, setShowWalletManager] = useState(false);
  const [spinHistory, setSpinHistory] = useState<Array<{ bet: number; win: number }>>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSpins, setSimulationSpins] = useState(50000);
  const [simulationReport, setSimulationReport] = useState<SimulationResponse | null>(null);
  const [simulationError, setSimulationError] = useState("");

  useEffect(() => {
    if (!error && !spinResult) {
      return;
    }

    const timer = setTimeout(() => {
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [error, spinResult]);

  const handleSpin = async () => {
    if (!token) {
      setError("Please authenticate first.");
      return;
    }

    if (!user) {
      setError("User not found.");
      return;
    }

    if (user.wallet_balance < betAmount) {
      setError("Insufficient balance. Add funds to your wallet.");
      return;
    }

    setSpinning(true);
    setError("");

    try {
      const result = await api.placeBet(token, betAmount);
      setGrid(result.grid);
      setSpinResult(result);
      updateWallet(user.wallet_balance - betAmount + result.totalWin);
      setSpinHistory((prev) => [
        { bet: betAmount, win: result.totalWin },
        ...prev.slice(0, 9),
      ]);
    } catch (err: unknown) {
      setError(errorMessage(err) || "Spin failed");
    } finally {
      setSpinning(false);
    }
  };

  const handleSimulation = async () => {
    if (!token) {
      setSimulationError("Authenticate before running the simulator.");
      return;
    }

    setSimulationRunning(true);
    setSimulationError("");
    setSimulationReport(null);

    try {
      const report = await api.runSimulation(token, betAmount, simulationSpins);
      setSimulationReport(report);
    } catch (err: unknown) {
      setSimulationError(errorMessage(err) || "Simulation failed");
    } finally {
      setSimulationRunning(false);
    }
  };

  const renderLineWin = (lineWin: LineWin) => (
    <li
      key={`${lineWin.lineIndex}-${lineWin.symbol}-${lineWin.count}`}
      className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-white">Payline {lineWin.lineIndex + 1}</span>
        <span className="text-emerald-300">${lineWin.win.toFixed(2)}</span>
      </div>
      <p className="mt-1 text-sm text-emerald-100">
        {lineWin.count}x {lineWin.symbol} from left to right.
      </p>
    </li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">🎰 Slot Engine MVP</h1>
            <span className="hidden text-sm text-gray-400 md:block">
              Server-side reel engine with simulation reporting.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-green-400">
                ${user?.wallet_balance.toFixed(2) || "0.00"}
              </p>
            </div>
            <button
              onClick={() => setShowWalletManager((current) => !current)}
              className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
            >
              💳 Add Funds
            </button>
            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
              <ReelsDisplay grid={grid} spinning={spinning} />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4">
                <p className="font-semibold text-red-200">⚠️ {error}</p>
              </div>
            )}

            {spinResult && (
              <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Spin Result</h3>
                    <p className="text-sm text-slate-300">
                      Base game ${spinResult.baseGameWin.toFixed(2)} + jackpot ${spinResult.jackpotWin.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">Total Win</p>
                    <p className="text-3xl font-bold text-emerald-300">
                      ${spinResult.totalWin.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Scatters</p>
                    <p className="mt-1 text-lg font-semibold text-white">{spinResult.scatterCount}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Bonus</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {spinResult.bonusTriggered ? "Triggered" : "No trigger"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Jackpot meter</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      ${spinResult.jackpotMeter.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Cap status</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {spinResult.wasCapped ? `Capped @ $${spinResult.maxWinCap.toFixed(2)}` : "Not capped"}
                    </p>
                  </div>
                </div>

                {spinResult.jackpotTriggered && (
                  <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/20 p-4 text-yellow-100">
                    🏆 Jackpot triggered on this spin.
                  </div>
                )}

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-white">Winning Paylines</h4>
                  {spinResult.lineWins.length > 0 ? (
                    <ul className="space-y-3">{spinResult.lineWins.map(renderLineWin)}</ul>
                  ) : (
                    <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                      No payline wins on this spin.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <BettingPanel
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              onSpin={handleSpin}
              spinning={spinning}
              maxBet={user?.wallet_balance || 0}
            />

            {showWalletManager && token && (
              <WalletManager
                token={token}
                onAddFunds={(newBalance) => updateWallet(newBalance)}
              />
            )}

            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-white">🧭 Paylines</h3>
              <ul className="space-y-2 text-sm text-slate-200">
                {paylinePreview.map((line) => (
                  <li key={line} className="rounded-lg border border-white/10 bg-black/20 p-3">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {spinHistory.length > 0 && (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
                <h3 className="mb-4 text-lg font-bold text-white">⏱️ Recent Spins</h3>
                <div className="max-h-96 space-y-2 overflow-y-auto">
                  {spinHistory.map((spin, idx) => (
                    <div
                      key={`${spin.bet}-${spin.win}-${idx}`}
                      className="flex items-center justify-between rounded border border-white/10 bg-white/5 p-2 text-sm"
                    >
                      <span className="text-gray-300">Bet: ${spin.bet.toFixed(2)}</span>
                      <span className={spin.win > 0 ? "font-semibold text-green-400" : "font-semibold text-orange-400"}>
                        ${spin.win.toFixed(2)} returned
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-bold text-white">📊 Simulation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-gray-300">Spins:</label>
                  <input
                    type="number"
                    min="1"
                    value={simulationSpins}
                    onChange={(e) => setSimulationSpins(Number(e.target.value) || 1)}
                    className="w-full rounded border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                </div>

                <button
                  onClick={handleSimulation}
                  disabled={simulationRunning}
                  className={`w-full rounded-lg py-3 font-semibold text-white ${simulationRunning ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {simulationRunning ? "Running..." : `Run ${simulationSpins.toLocaleString()} Spins`}
                </button>

                {simulationError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-3">
                    <p className="text-sm text-red-200">{simulationError}</p>
                  </div>
                )}

                {simulationReport && (
                  <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-gray-200">
                    <p className="font-semibold text-white">Simulation Results</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <p>Total Wagered: ${simulationReport.totalWagered.toFixed(2)}</p>
                      <p>Total Returned: ${simulationReport.totalReturned.toFixed(2)}</p>
                      <p>RTP: {(simulationReport.rtp * 100).toFixed(2)}%</p>
                      <p>Average Win: ${simulationReport.averageWin.toFixed(4)}</p>
                      <p>Winning Spins: {simulationReport.winningSpins.toLocaleString()}</p>
                      <p>Hit Frequency: {(simulationReport.hitFrequency * 100).toFixed(2)}%</p>
                      <p>Bonus Spins: {simulationReport.bonusSpins.toLocaleString()}</p>
                      <p>Bonus Frequency: {(simulationReport.bonusFrequency * 100).toFixed(2)}%</p>
                      <p>Jackpot Triggers: {simulationReport.jackpotTriggers.toLocaleString()}</p>
                      <p>Max Win Observed: ${simulationReport.maxWinObserved.toFixed(2)}</p>
                      <p>Starting Jackpot: ${simulationReport.startingJackpot.toFixed(2)}</p>
                      <p>Ending Jackpot: ${simulationReport.endingJackpot.toFixed(2)}</p>
                      <p>Jackpot Contribution Growth: ${simulationReport.jackpotContributionGrowth.toFixed(2)}</p>
                      <p>Total Jackpot Contributed: ${simulationReport.totalJackpotContributed.toFixed(2)}</p>
                      <p>Total Jackpot Paid Out: ${simulationReport.totalJackpotPaidOut.toFixed(2)}</p>
                    </div>
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
