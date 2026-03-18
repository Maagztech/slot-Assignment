import { createId, readStore, StoredUser, writeStore } from "../data/store";

export interface IUser extends StoredUser {}

const Users = {
  async findOne(query: Partial<Pick<IUser, "account" | "_id">>): Promise<IUser | null> {
    const data = readStore();

    const user = data.users.find((candidate) => {
      if (query.account !== undefined && candidate.account !== query.account) {
        return false;
      }
      if (query._id !== undefined && candidate._id !== query._id) {
        return false;
      }
      return true;
    });

    return user ?? null;
  },

  async findById(id: string): Promise<IUser | null> {
    const data = readStore();
    return data.users.find((user) => user._id === id) ?? null;
  },

  async create(payload: Pick<IUser, "account" | "password" | "wallet_balance">): Promise<IUser> {
    const data = readStore();
    const now = new Date().toISOString();

    const user: IUser = {
      _id: createId("user"),
      account: payload.account,
      password: payload.password,
      wallet_balance: payload.wallet_balance ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    data.users.push(user);
    writeStore(data);

    return user;
  },

  async findByIdAndUpdate(
    id: string,
    update: { $inc?: { wallet_balance?: number } },
    options?: { new?: boolean },
  ): Promise<IUser | null> {
    const data = readStore();
    const user = data.users.find((candidate) => candidate._id === id);

    if (!user) {
      return null;
    }

    user.wallet_balance += update.$inc?.wallet_balance ?? 0;
    user.updatedAt = new Date().toISOString();
    writeStore(data);

    return options?.new ? user : null;
  },

  async updateOne(
    query: Partial<Pick<IUser, "_id">>,
    update: { $inc?: { wallet_balance?: number } },
  ): Promise<void> {
    if (!query._id) {
      return;
    }

    const data = readStore();
    const user = data.users.find((candidate) => candidate._id === query._id);
    if (!user) {
      return;
    }

    user.wallet_balance += update.$inc?.wallet_balance ?? 0;
    user.updatedAt = new Date().toISOString();
    writeStore(data);
  },
};

export default Users;
