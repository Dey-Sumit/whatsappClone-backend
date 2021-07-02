import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { notFound, errorHandler } from "@middlewares/error.middleware";
import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";
import chatRoutes from "@routes/chat.routes";
import connectDB from "@config/connectDB";
import passport from "@middlewares/passport.middleware";
import sessionMiddleware from "@middlewares/session.middleware";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//   console.log("-------- ");

//   console.log(req.session);
//   console.log(req.sessionID);
//   console.log(req.user);

//   console.log("-------- ");

//   next();
// });
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port ${PORT}`);
});
