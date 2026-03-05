import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/user/', verifyToken, userController.getUser);

export default router;