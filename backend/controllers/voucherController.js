import voucherModel from "../models/voucherModel.js";

// Validate voucher (for users)
const validateVoucher = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code || !orderAmount) {
            return res.status(400).json({ success: false, message: "Missing voucher code or order amount" });
        }

        const voucher = await voucherModel.findOne({ code: code.toUpperCase() });

        if (!voucher) {
            return res.status(404).json({ success: false, message: "Voucher không tồn tại" });
        }

        // Check if valid
        const validation = voucher.isValid(req.userId, orderAmount);

        if (!validation.valid) {
            return res.status(400).json({ success: false, message: validation.message });
        }

        // Calculate discount
        const discountAmount = voucher.calculateDiscount(orderAmount);

        res.status(200).json({
            success: true,
            voucher: {
                code: voucher.code,
                description: voucher.description,
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
                discountAmount: discountAmount
            }
        });
    } catch (error) {
        console.error("Error validating voucher:", error);
        res.status(500).json({ success: false, message: "Failed to validate voucher" });
    }
};

// Apply voucher (called during order placement)
const applyVoucher = async (code, userId, orderAmount) => {
    try {
        const voucher = await voucherModel.findOne({ code: code.toUpperCase() });

        if (!voucher) {
            throw new Error("Voucher không tồn tại");
        }

        const validation = voucher.isValid(userId, orderAmount);

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        const discountAmount = voucher.calculateDiscount(orderAmount);

        // Mark as used
        voucher.markAsUsed(userId, orderAmount);
        await voucher.save();

        return {
            code: voucher.code,
            discountAmount: discountAmount
        };
    } catch (error) {
        throw error;
    }
};

// Create voucher (admin only)
const createVoucher = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount,
            startDate,
            endDate,
            maxUsage,
            maxUsagePerUser
        } = req.body;

        // Validation
        if (!code || !description || !discountType || !discountValue || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if voucher code already exists
        const existing = await voucherModel.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ success: false, message: "Voucher code already exists" });
        }

        const voucher = new voucherModel({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxUsage,
            maxUsagePerUser
        });

        await voucher.save();

        res.status(201).json({ success: true, message: "Voucher created successfully", data: voucher });
    } catch (error) {
        console.error("Error creating voucher:", error);
        res.status(500).json({ success: false, message: "Failed to create voucher" });
    }
};

// List all vouchers (admin only)
const listVouchers = async (req, res) => {
    try {
        const vouchers = await voucherModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: vouchers });
    } catch (error) {
        console.error("Error listing vouchers:", error);
        res.status(500).json({ success: false, message: "Failed to fetch vouchers" });
    }
};

// Get active vouchers (for users)
const getActiveVouchers = async (req, res) => {
    try {
        const now = new Date();
        const vouchers = await voucherModel.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).select('-usedBy'); // Don't expose usage data

        res.status(200).json({ success: true, data: vouchers });
    } catch (error) {
        console.error("Error fetching active vouchers:", error);
        res.status(500).json({ success: false, message: "Failed to fetch vouchers" });
    }
};

// Update voucher (admin only)
const updateVoucher = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Missing voucher ID" });
        }

        const voucher = await voucherModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!voucher) {
            return res.status(404).json({ success: false, message: "Voucher not found" });
        }

        res.status(200).json({ success: true, message: "Voucher updated", data: voucher });
    } catch (error) {
        console.error("Error updating voucher:", error);
        res.status(500).json({ success: false, message: "Failed to update voucher" });
    }
};

// Delete voucher (admin only)
const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Missing voucher ID" });
        }

        const voucher = await voucherModel.findByIdAndDelete(id);

        if (!voucher) {
            return res.status(404).json({ success: false, message: "Voucher not found" });
        }

        res.status(200).json({ success: true, message: "Voucher deleted" });
    } catch (error) {
        console.error("Error deleting voucher:", error);
        res.status(500).json({ success: false, message: "Failed to delete voucher" });
    }
};

export {
    validateVoucher,
    applyVoucher,
    createVoucher,
    listVouchers,
    getActiveVouchers,
    updateVoucher,
    deleteVoucher
};
