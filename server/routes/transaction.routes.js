import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', verifyToken, transactionController.readTransactions);
router.get('/overview', verifyToken, transactionController.calculateMetricsController);
router.get('/analytics', verifyToken, transactionController.calculateMetricsController);

export default router;