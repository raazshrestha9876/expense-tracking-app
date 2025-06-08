import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { addExpense, deleteExpense, getAllExpense, updateExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/add', verifyToken, addExpense);
router.get('/get', verifyToken, getAllExpense);
router.put('/update/:id', verifyToken, updateExpense);
router.delete('/delete/:id', verifyToken, deleteExpense);

export default router;