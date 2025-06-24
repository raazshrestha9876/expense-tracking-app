import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

const verifyResetToken = (req, res, next) => {
  try {
    const token = req.cookies.reset_token;
    if (!token)
      return next(errorHandler(401, "Unauthorized - No reset token found"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyResetToken;
