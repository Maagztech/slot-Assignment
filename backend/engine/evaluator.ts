import { paytableConfig, reelConfig, paylines } from "./config";

export interface LineWin {
  lineIndex: number;
  symbol: string;
  count: number;
  win: number;
}

export interface EvaluationResult {
  totalWin: number;
  lineWins: LineWin[];
  scatterCount: number;
  bonusTriggered: boolean;
}

export function evaluate(grid: string[][], bet: number): EvaluationResult {
  const wild = reelConfig.wild;
  const scatter = reelConfig.scatter;

  // Count scatter symbols anywhere on grid
  const scatterCount = grid.flat().filter((s) => s === scatter).length;
  const bonusTriggered = scatterCount >= 3; // Bonus triggers on 3+ scatters

  const lineWins: LineWin[] = [];
  let totalWin = 0;

  for (let lineIndex = 0; lineIndex < paylines.length; lineIndex++) {
    const line = paylines[lineIndex];

    // Collect symbols for this payline (left-to-right)
    const symbols = line.map((row, col) => grid[row][col]);

    // Determine base symbol for this line (first non-wild, non-scatter)
    const firstNonWild = symbols.find((s) => s !== wild && s !== scatter);
    const baseSymbol = firstNonWild || symbols[0];

    let count = 0;
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      if (symbol === scatter) {
        break; // Scatter does not participate in paylines
      }

      if (symbol === baseSymbol || symbol === wild) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      const payouts = paytableConfig[baseSymbol];
      const multiplier = payouts?.[count as 3 | 4 | 5] ?? 0;
      const win = bet * multiplier;
      if (win > 0) {
        totalWin += win;
        lineWins.push({ lineIndex, symbol: baseSymbol, count, win });
      }
    }
  }

  return {
    totalWin,
    lineWins,
    scatterCount,
    bonusTriggered,
  };
}
