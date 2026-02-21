import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addIncome,
  deleteIncome,
  getAllIncome,
  getDailyIncomeAnalytics,
  getIncomeCardStats,
  getIncomeCategoryAnalytics,
  getIncomeNotification,
  updateIncome,
} from "../controllers/income.controller.js";

const router = express.Router();

router.get("/get", verifyToken, getAllIncome);
router.get("/income-stats", verifyToken, getIncomeCardStats);
router.get("/income-daily-analytics", verifyToken, getDailyIncomeAnalytics);
router.get("/income-category-analytics", verifyToken, getIncomeCategoryAnalytics
);
router.get("/get-income-notification", verifyToken, getIncomeNotification);

router.post("/add", verifyToken, addIncome);
router.put("/update/:id", verifyToken, updateIncome);
router.delete("/delete/:id", verifyToken, deleteIncome);

export default router;
