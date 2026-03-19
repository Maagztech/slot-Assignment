import { pool } from "../config/database";

export interface IJackpot {
  id: string;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class JackpotDoc implements IJackpot {
  id: string;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(row: any) {
    this.id = row.id;
    this.value = Number(row.value);
    this.createdAt = row.createdAt;
    this.updatedAt = row.updatedAt;
  }

  async save() {
    await pool.query(`UPDATE jackpot SET value = ? WHERE id = ?`, [
      this.value,
      this.id,
    ]);
  }
}

const Jackpots = {
  async findOne(filter: { id: string }) {
    const [rows] = await pool.query(
      "SELECT * FROM jackpot WHERE id = ? LIMIT 1",
      [filter.id],
    );
    const row = (rows as any[])[0];
    return row ? new JackpotDoc(row) : null;
  },

  async create(data: { id: string; value: number }) {
    await pool.query("INSERT INTO jackpot (id, value) VALUES (?, ?)", [
      data.id,
      data.value,
    ]);

    const jackpot = await this.findOne({ id: data.id });
    if (!jackpot) {
      throw new Error("Failed to create jackpot row");
    }
    return jackpot;
  },
};

export default Jackpots;
