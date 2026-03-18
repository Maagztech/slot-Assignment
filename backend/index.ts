import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes/routes";
import { connectDB } from "./config/database";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Connect to the database
connectDB();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
// Routes
app.use("/api", routes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
