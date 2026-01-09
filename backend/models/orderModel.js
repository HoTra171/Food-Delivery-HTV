import mongoose from 'mongoose';

// Item snapshot schema - stores item details at time of purchase
const itemSnapshotSchema = new mongoose.Schema({
    foodId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },

    // Items with snapshot (price/name at time of order)
    items: [itemSnapshotSchema],

    // Pricing breakdown
    subtotal: { type: Number, required: true }, // Total before fees
    deliveryFee: { type: Number, default: 15000 },
    discount: { type: Number, default: 0 }, // Voucher discount
    amount: { type: Number, required: true }, // Final total

    // Voucher info (if used)
    voucher: {
        code: { type: String },
        discountAmount: { type: Number, default: 0 }
    },

    // Delivery address
    address: { type: Object, required: true },

    // Order status flow: PendingPayment → Paid → Preparing → Delivering → Delivered
    status: {
        type: String,
        enum: [
            'PendingPayment',  // Waiting for payment
            'Paid',            // Payment confirmed
            'Preparing',       // Restaurant preparing food
            'Delivering',      // Out for delivery
            'Delivered',       // Successfully delivered
            'Cancelled'        // Order cancelled
        ],
        default: 'PendingPayment'
    },

    // Status history for tracking
    statusHistory: [{
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
    }],

    // Payment info
    payment: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'VNPAY' },
    vnpayTransactionId: { type: String }, // VNPAY transaction reference

    // Timestamps
    date: { type: Date, default: Date.now },
    paidAt: { type: Date },
    deliveredAt: { type: Date }
}, { minimize: false, timestamps: true });

// Add index for faster queries
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1 });

// Method to update status with history tracking
orderSchema.methods.updateStatus = function(newStatus, note = '') {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        note: note
    });

    // Update special timestamps
    if (newStatus === 'Paid') {
        this.paidAt = new Date();
    } else if (newStatus === 'Delivered') {
        this.deliveredAt = new Date();
    }
};

export const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel