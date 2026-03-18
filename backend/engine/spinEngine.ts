import { evaluate, LineWin } from "./evaluator";
import { updateJackpot } from "./jackpot";
import { generateGrid } from "./reels";

export interface SpinResult {
  grid: string[][];
  totalWin: number;
  baseGameWin: number;
  jackpotMeter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
  bonusTriggered: boolean;
  scatterCount: number;
  lineWins: LineWin[];
  maxWinCap: number;
  wasCapped: boolean;
}

async function spinEngine(bet: number): Promise<SpinResult> {
  const grid = generateGrid();
  const evaluation = evaluate(grid, bet);
  const jackpotUpdate = await updateJackpot(bet, evaluation.scatterCount);

  const maxWinCap = bet * 100;
  const rawWin = evaluation.totalWin + jackpotUpdate.jackpotWin;
  const totalWin = Math.min(rawWin, maxWinCap);

  return {
    grid,
    totalWin,
    baseGameWin: evaluation.totalWin,
    jackpotMeter: jackpotUpdate.jackpotMeter,
    jackpotWin: jackpotUpdate.jackpotWin,
    jackpotTriggered: jackpotUpdate.jackpotTriggered,
    bonusTriggered: evaluation.bonusTriggered,
    scatterCount: evaluation.scatterCount,
    lineWins: evaluation.lineWins,
    maxWinCap,
    wasCapped: rawWin > maxWinCap,
  };
}

export default spinEngine;
