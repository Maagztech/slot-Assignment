import { evaluate } from "./evaluator";
import { getCurrentJackpotMeter, simulateJackpot } from "./jackpot";
import { generateGrid } from "./reels";

export interface SimulationReport {
  spins: number;
  bet: number;
  totalWagered: number;
  totalReturned: number;
  rtp: number;
  averageWin: number;
  winningSpins: number;
  hitFrequency: number;
  bonusSpins: number;
  bonusFrequency: number;
  jackpotTriggers: number;
  maxWinObserved: number;
  startingJackpot: number;
  endingJackpot: number;
  jackpotContributionGrowth: number;
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

  for (let index = 0; index < spins; index++) {
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

  return {
    spins,
    bet,
    totalWagered,
    totalReturned,
    rtp: totalWagered > 0 ? totalReturned / totalWagered : 0,
    averageWin: spins > 0 ? totalReturned / spins : 0,
    winningSpins,
    hitFrequency: spins > 0 ? winningSpins / spins : 0,
    bonusSpins,
    bonusFrequency: spins > 0 ? bonusSpins / spins : 0,
    jackpotTriggers,
    maxWinObserved,
    startingJackpot,
    endingJackpot: currentJackpot,
    jackpotContributionGrowth: currentJackpot - startingJackpot,
    totalJackpotContributed,
    totalJackpotPaidOut,
  };
}
