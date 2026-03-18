import Jackpots from "../models/jackPotsModel";
import { jackpotConfig } from "./config";

export interface JackpotUpdateResult {
  jackpotMeter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
}

async function getOrCreateJackpot() {
  const existing = await Jackpots.findOne({ id: "main" });
  if (existing) return existing;

  return await Jackpots.create({ id: "main", value: 0 });
}

export async function getCurrentJackpotMeter(): Promise<number> {
  const jackpot = await Jackpots.findOne({ id: "main" });
  return jackpot?.value || 0;
}

export async function updateJackpot(
  bet: number,
  scatterCount: number,
): Promise<JackpotUpdateResult> {
  const jackpotDoc = await getOrCreateJackpot();

  const contribution = bet * jackpotConfig.contributionPct;
  jackpotDoc.value += contribution;

  const hitByScatter = scatterCount >= jackpotConfig.trigger.scatterCount;
  const hitByRandom = Math.random() < jackpotConfig.trigger.randomChance;
  const jackpotTriggered = hitByScatter || hitByRandom;

  let jackpotWin = 0;
  if (jackpotTriggered) {
    jackpotWin = jackpotDoc.value;
    jackpotDoc.value = 0;
  }

  await jackpotDoc.save();

  return {
    jackpotMeter: jackpotDoc.value,
    jackpotWin,
    jackpotTriggered,
  };
}

export function simulateJackpot(
  bet: number,
  scatterCount: number,
  currentMeter: number,
): {
  meter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
  contribution: number;
} {
  const contribution = bet * jackpotConfig.contributionPct;
  let meter = currentMeter + contribution;

  const hitByScatter = scatterCount >= jackpotConfig.trigger.scatterCount;
  const hitByRandom = Math.random() < jackpotConfig.trigger.randomChance;
  const jackpotTriggered = hitByScatter || hitByRandom;

  let jackpotWin = 0;
  if (jackpotTriggered) {
    jackpotWin = meter;
    meter = 0;
  }

  return { meter, jackpotWin, jackpotTriggered, contribution };
}
