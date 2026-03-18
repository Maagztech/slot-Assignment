import { generateGrid } from "./reels";
import { evaluate } from "./evaluator";
import { updateJackpot } from "./jackpot";

export interface SpinResult {
  grid: string[][];
  totalWin: number;
  jackpotMeter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
  bonusTriggered: boolean;
  scatterCount: number;
}

async function spinEngine(bet: number): Promise<SpinResult> {
  const grid = generateGrid();

  const evaluation = evaluate(grid, bet);

  const jackpotUpdate = await updateJackpot(bet, evaluation.scatterCount);

  const rawWin = evaluation.totalWin + jackpotUpdate.jackpotWin;
  const maxWin = bet * 100;
  const totalWin = rawWin > maxWin ? maxWin : rawWin;

  return {
    grid,
    totalWin,
    jackpotMeter: jackpotUpdate.jackpotMeter,
    jackpotWin: jackpotUpdate.jackpotWin,
    jackpotTriggered: jackpotUpdate.jackpotTriggered,
    bonusTriggered: evaluation.bonusTriggered,
    scatterCount: evaluation.scatterCount,
  };
}

export default spinEngine;
