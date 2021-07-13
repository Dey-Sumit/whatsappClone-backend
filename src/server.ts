import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import { createServer } from "http";

import socket from "./socket";

import { notFound, errorHandler } from "@middlewares/error.middleware";
import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";
import chatRoutes from "@routes/chat.routes";
import connectDB from "@utils/connectDB";
import passport from "@middlewares/passport.middleware";
import sessionMiddleware from "@middlewares/session.middleware";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

// app.use(morgan("dev"));
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.set("trust proxy", 1); // trust first proxy
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  connectDB(); // asyncly connected to db
  console.log(`-> Server is Running on ${PORT}`);
  socket({ io });
});
