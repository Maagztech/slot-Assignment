import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IJackpot extends Document {
  _id: Types.ObjectId;
  value: number;
  id: string;
}

const jackpotSchema: Schema<IJackpot> = new mongoose.Schema(
  {
    value: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: "main",
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Jackpot: Model<IJackpot> = mongoose.model<IJackpot>(
  "Jackpot",
  jackpotSchema,
);

export default Jackpot;
