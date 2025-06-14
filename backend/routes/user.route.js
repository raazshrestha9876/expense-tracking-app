import express from "express";
import {
  deleteUser,
  getUser,
  login,
  logout,
  registerUser,
  updatedUser,
  updateUserPassword,
} from "../controllers/user.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/get", verifyToken, getUser);
router.post("/update", verifyToken, updatedUser);
router.post("/update-password", verifyToken, updateUserPassword);
router.post("/delete", verifyToken, deleteUser);
router.get("/logout", logout);

export default router;
