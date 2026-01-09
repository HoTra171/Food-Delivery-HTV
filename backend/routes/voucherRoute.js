import express from 'express';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
    validateVoucher,
    createVoucher,
    listVouchers,
    getActiveVouchers,
    updateVoucher,
    deleteVoucher
} from '../controllers/voucherController.js';

const voucherRouter = express.Router();

// User routes
voucherRouter.post('/validate', authMiddleware, validateVoucher); // Validate voucher before checkout
voucherRouter.get('/active', getActiveVouchers); // Get all active vouchers (public or auth)

// Admin routes
voucherRouter.post('/create', authMiddleware, adminMiddleware, createVoucher);
voucherRouter.get('/list', authMiddleware, adminMiddleware, listVouchers);
voucherRouter.post('/update', authMiddleware, adminMiddleware, updateVoucher);
voucherRouter.post('/delete', authMiddleware, adminMiddleware, deleteVoucher);

export default voucherRouter;
