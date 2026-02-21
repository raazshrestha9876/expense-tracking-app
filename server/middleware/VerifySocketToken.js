import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";
import cookie from "cookie";

const verifySocketToken = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(errorHandler(401, "No cookies found"));

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.access_token;


    if (!token) return next(errorHandler(401, "No token found"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    socket.userId = decoded._id;

    next();
  } catch (error) {
    next(errorHandler(401, "Invalid or expired token"));
  }
};

export default verifySocketToken;
