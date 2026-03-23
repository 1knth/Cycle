import express from 'express';
import * as plaidController from '../controllers/plaid.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/create/token', verifyToken, plaidController.createLinkToken);
router.post('/sync/banks', verifyToken, plaidController.syncPlaidItems);
router.post('/sync/accounts/:plaidItemId', verifyToken, plaidController.syncAccounts);
router.post('/sync/transactions/:accountId', verifyToken, plaidController.syncTransactions);
router.post('/webhook/transactions', plaidController.whTransactions);
export default router;
