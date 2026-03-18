import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateTokens";
import { runSimulation } from "../engine/simulator";
import spinEngine from "../engine/spinEngine";
import Users from "../models/userModel";

function parsePositiveNumber(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

const gameController = {
  SignupOrLogin: async (req: Request, res: Response) => {
    console.log("Received login/signup request with body:", req.body);
    try {
      const { account, password } = req.body;

      if (!account || !password) {
        return res
          .status(400)
          .json({ message: "Account and password required" });
      }

      const existingUser = await Users.findOne({ account });

      if (existingUser) {
        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }

        const accessToken: any = generateAccessToken({ id: existingUser._id });
        void generateRefreshToken({ id: existingUser._id });

        return res.json({
          user: existingUser,
          accessToken,
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const newUser = await Users.create({
        account,
        password: hashed,
        wallet_balance: 0,
      });

      const accessToken = generateAccessToken({ id: newUser._id });
      void generateRefreshToken({ id: newUser._id });

      return res.json({
        user: newUser,
        accessToken,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  Get_wallet: async (req: Request, res: Response) => {
    try {
      const user = await Users.findById(req.user._id);
      return res.json({
        wallet: user?.wallet_balance,
      });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  },

  Add_to_wallet: async (req: Request, res: Response) => {
    try {
      const amount = parsePositiveNumber(req.body.amount);
      if (amount === null) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
      }

      const user = await Users.findByIdAndUpdate(
        req.user._id,
        { $inc: { wallet_balance: amount } },
        { new: true },
      );

      return res.json({
        wallet: user?.wallet_balance,
      });
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  },

  Bet_spin: async (req: Request, res: Response) => {
    try {
      const bet = parsePositiveNumber(req.body.bet);
      if (bet === null) {
        return res.status(400).json({ message: "Bet must be greater than 0" });
      }

      const user = await Users.findById(req.user._id);

      if (!user || user.wallet_balance < bet) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const result = await spinEngine(bet);

      await Users.updateOne(
        { _id: user._id },
        { $inc: { wallet_balance: result.totalWin - bet } },
      );

      return res.json(result);
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  },

  Simulate: async (req: Request, res: Response) => {
    try {
      const bet = parsePositiveNumber(req.body.bet);
      const spins = parsePositiveNumber(req.body.spins) ?? 50000;

      if (bet === null) {
        return res.status(400).json({ message: "Bet must be greater than 0" });
      }

      const simulation = await runSimulation(bet, Math.floor(spins));
      return res.json(simulation);
    } catch {
      return res.status(500).json({ message: "Server error" });
    }
  },
};

export default gameController;
