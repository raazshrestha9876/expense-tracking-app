import express from "express";
import {
  deleteUser,
  forgetPassword,
  getUser,
  login,
  logout,
  registerUser,
  resetPassword,
  updatedUser,
  updateUserPassword,
  verifyOtp,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyResetToken from "../middleware/VerifyResetToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/forget-password/verify-otp", verifyOtp);
router.post("/reset-password", verifyResetToken, resetPassword);

router.get("/get", verifyToken, getUser);
router.post("/update", verifyToken, updatedUser);
router.post("/update-password", verifyToken, updateUserPassword);
router.post("/delete", verifyToken, deleteUser);
router.get("/logout", logout);

export default router;
