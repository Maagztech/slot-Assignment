import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("Token secrets are not defined in environment variables");
}
interface Ipayload {
  id: string | number;
}
export const generateAccessToken = (payload: Ipayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "59m" });
};

export const generateRefreshToken = (payload: Ipayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};
