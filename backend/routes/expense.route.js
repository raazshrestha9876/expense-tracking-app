import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { addExpense, deleteExpense, getAllExpense, getExpenseAllDateAnalytics, getExpenseCardStats, getExpenseCategoryAnalytics, getExpenseDailyAnalytics, getExpenseNotification, updateExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/add', verifyToken, addExpense);
router.get('/get', verifyToken, getAllExpense);
router.put('/update/:id', verifyToken, updateExpense);
router.delete('/delete/:id', verifyToken, deleteExpense);
router.get('/get-expense-notification', verifyToken, getExpenseNotification);
router.get('/expense-stats', verifyToken, getExpenseCardStats);
router.get('/expense-daily-analytics', verifyToken, getExpenseDailyAnalytics);
router.get('/expense-category-analytics', verifyToken, getExpenseCategoryAnalytics);
router.get('/expense-all-date-analytics', verifyToken, getExpenseAllDateAnalytics);


export default router;