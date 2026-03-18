import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  account: string;
  password: string;
  wallet_balance: number;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    account: {
      type: String,
      required: [true, "Please add email or phone"],
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },

    wallet_balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
