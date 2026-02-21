import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getDashboardCardStats, getExpenseAndIncomeAnalytics, getRecentTransactions } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/get-daily-income-and-expense', verifyToken, getExpenseAndIncomeAnalytics);
router.get('/get-recent-transactions', verifyToken, getRecentTransactions);
router.get('/get-dashboard-card-stats', verifyToken, getDashboardCardStats);

export default router;