import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "@middlewares/error.middleware";
import morgan from "morgan";
import authRoutes from "@routes/auth.routes";
import connectDB from "config/connetDB";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${PORT}`);
});
