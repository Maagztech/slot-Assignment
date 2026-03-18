import { randomInt } from "./rng";
import { reelConfig } from "./config";

/**
 * Generates a 5x3 grid of symbols using configured reel strips.
 * The grid is returned as [row][col] for easier evaluation.
 */
export function generateGrid(): string[][] {
  const reels = reelConfig.reels;
  const rows = 3;
  const cols = reels.length;

  // Initialize the grid as rows x cols
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(""),
  );

  for (let col = 0; col < cols; col++) {
    const strip = reels[col];
    const stop = randomInt(strip.length);

    for (let row = 0; row < rows; row++) {
      const index = (stop + row) % strip.length;
      grid[row][col] = strip[index];
    }
  }

  return grid;
}
