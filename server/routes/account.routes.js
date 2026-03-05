import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', verifyToken, transactionController.getAccounts);
router.post('/sync', verifyToken, transactionController.syncAccounts);

export default router;
