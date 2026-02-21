import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import expenseRoute from "./routes/expense.route.js";
import incomeRoute from "./routes/income.route.js";
import analyticsRoute from "./routes/analytics.route.js";
import http from "http";
import { Server } from "socket.io";
import verifySocketToken from "./middleware/VerifySocketToken.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

const corsOptions = {
  origin: "https://expense-tracking-app-delta.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS first
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests manually (avoids path-to-regexp wildcard issue)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "https://expense-tracking-app-delta.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// ✅ Socket.IO setup
export const io = new Server(server, {
  cors: corsOptions,
});

const connectedUser = new Map();

io.use(verifySocketToken);

io.on("connection", (socket) => {
  const userId = socket.userId;

  if (!userId) return;

  connectedUser.set(userId, socket.id);
  socket.join(userId.toString());

  console.log(`User ${userId} connected`);

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    connectedUser.delete(userId);
  });
});

// ✅ Routes
app.use("/api/user", userRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/income", incomeRoute);
app.use("/api/analytics", analyticsRoute);

// ✅ Error middleware (always last)
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});