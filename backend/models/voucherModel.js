import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    // Discount type: 'percentage' or 'fixed'
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },

    // Discount value (percentage or VND)
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },

    // Maximum discount amount (for percentage type)
    maxDiscount: {
        type: Number,
        default: null
    },

    // Minimum order amount required
    minOrderAmount: {
        type: Number,
        default: 0
    },

    // Validity period
    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    // Usage limits
    maxUsage: {
        type: Number,
        default: null // null = unlimited
    },

    usedCount: {
        type: Number,
        default: 0
    },

    // Per-user limit
    maxUsagePerUser: {
        type: Number,
        default: 1
    },

    // Track which users used this voucher
    usedBy: [{
        userId: { type: String },
        usedAt: { type: Date, default: Date.now },
        orderAmount: { type: Number }
    }],

    // Active status
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for faster queries
voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1, endDate: 1 });

// Method to check if voucher is valid
voucherSchema.methods.isValid = function(userId, orderAmount) {
    const now = new Date();

    // Check if active
    if (!this.isActive) {
        return { valid: false, message: 'Voucher không còn hiệu lực' };
    }

    // Check date validity
    if (now < this.startDate) {
        return { valid: false, message: 'Voucher chưa có hiệu lực' };
    }

    if (now > this.endDate) {
        return { valid: false, message: 'Voucher đã hết hạn' };
    }

    // Check total usage limit
    if (this.maxUsage && this.usedCount >= this.maxUsage) {
        return { valid: false, message: 'Voucher đã hết lượt sử dụng' };
    }

    // Check minimum order amount
    if (orderAmount < this.minOrderAmount) {
        return { valid: false, message: `Đơn hàng tối thiểu ${this.minOrderAmount} VNĐ` };
    }

    // Check per-user usage limit
    const userUsage = this.usedBy.filter(u => u.userId === userId).length;
    if (userUsage >= this.maxUsagePerUser) {
        return { valid: false, message: 'Bạn đã sử dụng voucher này rồi' };
    }

    return { valid: true };
};

// Method to calculate discount
voucherSchema.methods.calculateDiscount = function(orderAmount) {
    if (this.discountType === 'percentage') {
        let discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscount) {
            discount = Math.min(discount, this.maxDiscount);
        }
        return Math.floor(discount);
    } else {
        // Fixed amount
        return Math.min(this.discountValue, orderAmount);
    }
};

// Method to mark as used
voucherSchema.methods.markAsUsed = function(userId, orderAmount) {
    this.usedCount += 1;
    this.usedBy.push({
        userId: userId,
        usedAt: new Date(),
        orderAmount: orderAmount
    });
};

export const voucherModel = mongoose.models.voucher || mongoose.model("voucher", voucherSchema);
export default voucherModel;
