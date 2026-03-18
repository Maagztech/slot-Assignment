import jwt, { JwtPayload } from "jsonwebtoken";
import Users from "../models/userModel";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, RequestHandler, Response } from "express";
const auth: RequestHandler = asyncHandler(
  async (req: Request, res: Response,next: NextFunction) => {
    try {
      const token = req.header("Authorization");
      if (!token) {
        res.status(400).json({ msg: "Invalid Authentication." });
        return;
      }

      const decoded = jwt.verify(
        token,
        `${process.env.ACCESS_TOKEN_SECRET}`
      ) as JwtPayload;
      if (!decoded) {
        res.status(400).json({ msg: "Invalid Authentication." });
        return;
      }

      const user = await Users.findOne({ _id: decoded.id });
      if (!user) {
        res.status(400).json({ msg: "User does not exist." });
        return;
      }
      req.user = user;
      next();
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  }
);

export default auth;
