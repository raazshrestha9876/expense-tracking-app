
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { addIncome, deleteIncome, getAllIncome, getDailyIncomeAnalytics, getIncomeCategoryAnalytics, updateIncome } from '../controllers/income.controller.js';


const router = express.Router();

router.post('/add', verifyToken, addIncome);
router.get('/get', verifyToken, getAllIncome);
router.put('/update/:id', verifyToken, updateIncome);
router.delete('/delete/:id', verifyToken, deleteIncome);
router.get('/ncome-daily-analytics', verifyToken, getDailyIncomeAnalytics);
router.get('/income-category-analytics', verifyToken, getIncomeCategoryAnalytics);


export default router;