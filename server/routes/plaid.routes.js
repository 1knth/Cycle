import express from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import * as linkController from '../controllers/link.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/items', verifyToken, transactionController.getPlaidItems);
router.post('/sync-all', verifyToken, transactionController.syncAllTransactions);
router.post('/sync/:plaidItemId', verifyToken, transactionController.syncTransactions);
router.post('/create-link-token', verifyToken, linkController.createLinkToken);
router.post('/exchange-public-token', verifyToken, linkController.exchangePublicToken);

export default router;
