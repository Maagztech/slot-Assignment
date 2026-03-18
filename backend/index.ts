import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/database";
import routes from "./routes/routes";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

void connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use("/api", routes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
