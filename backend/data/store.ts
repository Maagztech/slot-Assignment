import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface StoredUser {
  _id: string;
  account: string;
  password: string;
  wallet_balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoredJackpot {
  id: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

interface DataShape {
  users: StoredUser[];
  jackpots: StoredJackpot[];
}

const dataFile = join(__dirname, "..", "data.json");

function getInitialData(): DataShape {
  return {
    users: [],
    jackpots: [],
  };
}

export function readStore(): DataShape {
  if (!existsSync(dataFile)) {
    const initialData = getInitialData();
    writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const raw = readFileSync(dataFile, "utf-8");
  const parsed = JSON.parse(raw) as Partial<DataShape>;

  return {
    users: parsed.users ?? [],
    jackpots: parsed.jackpots ?? [],
  };
}

export function writeStore(data: DataShape): void {
  writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
