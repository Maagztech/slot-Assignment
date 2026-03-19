import { pool } from "../config/database";

export interface IUser {
  _id: number;
  account: string;
  password: string;
  wallet_balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

function mapRow(row: any): IUser {
  return {
    _id: row.userID,
    account: row.account,
    password: row.password,
    wallet_balance: Number(row.wallet_balance),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const Users = {
  async findOne(filter: { account?: string; _id?: number | string }) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (filter.account) {
      conditions.push("account = ?");
      params.push(filter.account);
    }

    if (filter._id !== undefined) {
      conditions.push("userID = ?");
      params.push(Number(filter._id));
    }

    if (conditions.length === 0) return null;

    const [rows] = await pool.query(
      `SELECT * FROM users WHERE ${conditions.join(" AND ")} LIMIT 1`,
      params,
    );
    const row = (rows as any[])[0];
    return row ? mapRow(row) : null;
  },

  async findById(id: number | string) {
    return this.findOne({ _id: id });
  },

  async create(data: {
    account: string;
    password: string;
    wallet_balance: number;
  }) {
    const [result] = await pool.query(
      "INSERT INTO users (account, password, wallet_balance) VALUES (?, ?, ?)",
      [data.account, data.password, data.wallet_balance],
    );

    const insertId = (result as any).insertId;
    const user = await this.findById(insertId);
    if (!user) {
      throw new Error("Failed to fetch created user");
    }
    return user;
  },

  async findByIdAndUpdate(
    id: number | string,
    update: any,
    options?: { new?: boolean },
  ) {
    if (update.$inc) {
      const incFields = Object.entries(update.$inc)
        .map(([key]) => `${key} = ${key} + ?`)
        .join(", ");
      const incValues = Object.values(update.$inc);
      await pool.query(`UPDATE users SET ${incFields} WHERE userID = ?`, [
        ...incValues,
        Number(id),
      ]);
    } else {
      const setFields = Object.keys(update)
        .map((key) => `${key} = ?`)
        .join(", ");
      const setValues = Object.values(update);
      await pool.query(`UPDATE users SET ${setFields} WHERE userID = ?`, [
        ...setValues,
        Number(id),
      ]);
    }

    if (options?.new) {
      return this.findById(id);
    }
    return this.findById(id);
  },

  async updateOne(filter: any, update: any) {
    const user = await this.findOne(filter);
    if (!user) return null;
    return this.findByIdAndUpdate(user._id, update, { new: true });
  },
};

export default Users;
