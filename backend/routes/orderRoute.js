import express from 'express';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, reportsRevenue } from '../controllers/orderController.js';

const orderRouter = express.Router();

// User routes
orderRouter.post('/placeOrder', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userOrders', authMiddleware, userOrders);

// Admin routes
orderRouter.get('/list', authMiddleware, adminMiddleware, listOrders);
orderRouter.post('/status', authMiddleware, adminMiddleware, updateStatus);
orderRouter.get('/reports', authMiddleware, adminMiddleware, reportsRevenue);

export default orderRouter;