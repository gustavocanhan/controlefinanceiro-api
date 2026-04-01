import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timeStamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/{*path}", (req: Request, res: Response) => {
  res.status(404).json({ message: `Rota ${req.originalUrl} não encontrada` });
});

app.use(errorHandler);

export default app;
