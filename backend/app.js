import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import expenseRoute from "./routes/expense.route.js";
import incomeRoute from "./routes/income.route.js";
import http from "http";
import { Server } from "socket.io";
import Notification from "./models/notification.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("uploads", express.static("uploads"));
app.use(cookieParser());

connectDB();

export const io = new Server(server);

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    connectedUsers.set(userId, socket.id);
  }

  socket.on("mark_as_read", async (notificationId) => {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    io.to(userId).emit("notification_updated", {
      id: notificationId,
      isRead: true,
    });
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
    });
  });
});

app.use(userRoute);
app.use(expenseRoute);
app.use(incomeRoute);

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
