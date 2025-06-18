import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import expenseRoute from "./routes/expense.route.js";
import incomeRoute from "./routes/income.route.js";
import http from "http";
import { Server } from "socket.io";
import Notification from "./models/notification.model.js";
import verifySocketToken from "./middleware/VerifySocketToken.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("uploads", express.static("uploads"));
app.use(cookieParser());

const connectedUser = new Map();

io.use(verifySocketToken);

io.on("connection", (socket) => {
  const userId = socket.userId;

  if (!userId) return;

  connectedUser.set(userId, socket.id);
  socket.join(userId.toString());

  console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User ${userId} disconnected`);
    connectedUser.delete(userId);
  });
});


app.use("/api/user", userRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/income", incomeRoute);

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
