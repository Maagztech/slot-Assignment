import { generateGrid } from "./reels";
import { evaluate } from "./evaluator";
import { getCurrentJackpotMeter, simulateJackpot } from "./jackpot";

export interface SimulationReport {
  spins: number;
  bet: number;
  totalWagered: number;
  totalReturned: number;
  rtp: number; // return to player
  hitFrequency: number; // winning spin frequency
  bonusFrequency: number; // bonus trigger frequency
  jackpotTriggers: number;
  maxWinObserved: number;
  startingJackpot: number;
  endingJackpot: number;
  totalJackpotContributed: number;
  totalJackpotPaidOut: number;
}

export async function runSimulation(
  bet: number,
  spins: number,
): Promise<SimulationReport> {
  const startingJackpot = await getCurrentJackpotMeter();
  let currentJackpot = startingJackpot;

  let totalReturned = 0;
  let winningSpins = 0;
  let bonusSpins = 0;
  let jackpotTriggers = 0;
  let maxWinObserved = 0;
  let totalJackpotContributed = 0;
  let totalJackpotPaidOut = 0;

  for (let i = 0; i < spins; i++) {
    const grid = generateGrid();
    const evaluation = evaluate(grid, bet);

    const jackpotResult = simulateJackpot(
      bet,
      evaluation.scatterCount,
      currentJackpot,
    );
    currentJackpot = jackpotResult.meter;

    totalJackpotContributed += jackpotResult.contribution;

    const rawWin = evaluation.totalWin + jackpotResult.jackpotWin;
    const cappedWin = Math.min(rawWin, bet * 100);

    totalReturned += cappedWin;
    if (cappedWin > 0) {
      winningSpins += 1;
    }
    if (evaluation.bonusTriggered) {
      bonusSpins += 1;
    }
    if (jackpotResult.jackpotTriggered) {
      jackpotTriggers += 1;
      totalJackpotPaidOut += jackpotResult.jackpotWin;
    }

    if (cappedWin > maxWinObserved) {
      maxWinObserved = cappedWin;
    }
  }

  const totalWagered = bet * spins;
  const rtp = totalWagered > 0 ? totalReturned / totalWagered : 0;

  return {
    spins,
    bet,
    totalWagered,
    totalReturned,
    rtp,
    hitFrequency: spins > 0 ? winningSpins / spins : 0,
    bonusFrequency: spins > 0 ? bonusSpins / spins : 0,
    jackpotTriggers,
    maxWinObserved,
    startingJackpot,
    endingJackpot: currentJackpot,
    totalJackpotContributed,
    totalJackpotPaidOut,
  };
}
