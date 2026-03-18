import { readStore, StoredJackpot, writeStore } from "../data/store";

export interface IJackpot extends StoredJackpot {}

const Jackpots = {
  async findOne(query: Partial<Pick<IJackpot, "id">>): Promise<IJackpot | null> {
    const data = readStore();
    return data.jackpots.find((jackpot) => jackpot.id === query.id) ?? null;
  },

  async create(payload: Pick<IJackpot, "id" | "value">): Promise<IJackpot> {
    const data = readStore();
    const now = new Date().toISOString();
    const jackpot: IJackpot = {
      id: payload.id,
      value: payload.value,
      createdAt: now,
      updatedAt: now,
    };

    data.jackpots.push(jackpot);
    writeStore(data);
    return jackpot;
  },

  async save(jackpot: IJackpot): Promise<IJackpot> {
    const data = readStore();
    const existing = data.jackpots.find((candidate) => candidate.id === jackpot.id);
    if (existing) {
      existing.value = jackpot.value;
      existing.updatedAt = new Date().toISOString();
    } else {
      data.jackpots.push({
        ...jackpot,
        createdAt: jackpot.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    writeStore(data);
    return jackpot;
  },
};

export default Jackpots;
