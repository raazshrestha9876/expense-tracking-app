import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  query: {
    userId: localStorage.getItem("userId"),
  },
});

export default socket;
