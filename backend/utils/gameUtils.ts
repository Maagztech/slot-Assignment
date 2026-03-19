import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../models/userModel";
import { generateAccessToken } from "../config/generateTokens";
import spinEngine from "../engine/spinEngine";
import { runSimulation } from "../engine/simulator";

const gameController = {
  SignupOrLogin: async (req: Request, res: Response) => {
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

      if (!newUser) {
        return res.status(500).json({ message: "Server error" });
      }

      const accessToken = generateAccessToken({ id: newUser._id });

      res.json({
        user: newUser,
        accessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
  Get_wallet: async (req: Request, res: Response) => {
    try {
      const user = await Users.findById(req.user._id);
      res.json({
        wallet: user?.wallet_balance,
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  },
  Add_to_wallet: async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;

      const user = await Users.findByIdAndUpdate(
        req.user._id,
        { $inc: { wallet_balance: amount } },
        { new: true },
      );

      res.json({
        wallet: user?.wallet_balance,
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  },

  Bet_spin: async (req: Request, res: Response) => {
    try {
      const { bet } = req.body;

      const user = await Users.findById(req.user._id);

      if (!user || user.wallet_balance < bet) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const result = await spinEngine(bet);

      await Users.updateOne(
        { _id: user._id },
        { $inc: { wallet_balance: result.totalWin - bet } },
      );

      res.json(result);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  },

  Simulate: async (req: Request, res: Response) => {
    try {
      const { bet, spins } = req.body;
      const simulation = await runSimulation(bet, spins || 50000);
      res.json(simulation);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default gameController;
