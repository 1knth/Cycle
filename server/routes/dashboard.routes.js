import express from 'express';
import * as metricController from '../controllers/metric.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

//user 
router.get('/overview', verifyToken, metricController.calculateMetrics);
// router.get('/analytics', verifyToken, transactionController.calculateMetricsController);

export default router;
