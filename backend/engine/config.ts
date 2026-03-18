import { readFileSync } from "fs";
import { join } from "path";

function loadJSON<T>(fileName: string): T {
  const filePath = join(__dirname, "..", "config", fileName);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export interface ReelConfig {
  reels: string[][];
  wild: string;
  scatter: string;
}

export interface PaytableConfig {
  [symbol: string]: {
    3: number;
    4: number;
    5: number;
  };
}

export interface JackpotConfig {
  contributionPct: number;
  trigger: {
    scatterCount: number;
    randomChance: number;
  };
}

export const reelConfig = loadJSON<ReelConfig>("reels.json");
export const paytableConfig = loadJSON<PaytableConfig>("paytable.json");
export const jackpotConfig = loadJSON<JackpotConfig>("jackpot.json");
export const paylines = loadJSON<number[][]>("paylines.json");
