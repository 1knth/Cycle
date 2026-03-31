import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getUser);
router.get('/me/accounts', verifyToken, userController.getAccounts);
router.get('/me/transactions', verifyToken, userController.getTransactions);
export default router;
