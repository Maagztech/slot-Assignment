import { paytableConfig, reelConfig, paylines } from "./config";

export interface LineWin {
  lineIndex: number;
  symbol: string;
  count: number;
  win: number;
  positions: Array<{ row: number; col: number }>;
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

  const scatterCount = grid.flat().filter((symbol) => symbol === scatter).length;
  const bonusTriggered = scatterCount >= 3;

  const lineWins: LineWin[] = [];
  let totalWin = 0;

  for (let lineIndex = 0; lineIndex < paylines.length; lineIndex++) {
    const line = paylines[lineIndex];
    const symbols = line.map((row, col) => grid[row][col]);
    const positions = line.map((row, col) => ({ row, col }));

    const firstPayingSymbol = symbols.find(
      (symbol) => symbol !== wild && symbol !== scatter,
    );
    const baseSymbol = firstPayingSymbol ?? symbols[0];

    if (!baseSymbol || baseSymbol === scatter) {
      continue;
    }

    let count = 0;
    for (let col = 0; col < symbols.length; col++) {
      const currentSymbol = symbols[col];
      if (currentSymbol === scatter) {
        break;
      }

      if (currentSymbol === baseSymbol || currentSymbol === wild) {
        count += 1;
        continue;
      }

      break;
    }

    if (count < 3) {
      continue;
    }

    const multiplier = paytableConfig[baseSymbol]?.[count as 3 | 4 | 5] ?? 0;
    const win = bet * multiplier;
    if (win <= 0) {
      continue;
    }

    totalWin += win;
    lineWins.push({
      lineIndex,
      symbol: baseSymbol,
      count,
      win,
      positions: positions.slice(0, count),
    });
  }

  return {
    totalWin,
    lineWins,
    scatterCount,
    bonusTriggered,
  };
}
