import express from 'express';
import { deleteUser, login, logout, registerUser, updatedUser } from '../controllers/user.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/update', verifyToken,  updatedUser);
router.post('/delete', verifyToken, deleteUser);
router.delete('/logout', logout);

export default router;