import mongoose from 'mongoose';
import dotenv from 'dotenv';
import voucherModel from '../models/voucherModel.js';

// Load environment variables
dotenv.config();

const sampleVouchers = [
    {
        code: 'WELCOME10',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 50000,
        minOrderAmount: 100000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        maxUsagePerUser: 1,
        isActive: true
    },
    {
        code: 'FREESHIP',
        description: 'Miễn phí ship cho đơn từ 200k',
        discountType: 'fixed',
        discountValue: 15000,
        minOrderAmount: 200000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        maxUsage: 100,
        maxUsagePerUser: 3,
        isActive: true
    },
    {
        code: 'SAVE50K',
        description: 'Giảm 50k cho đơn hàng từ 500k',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderAmount: 500000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        maxUsage: 50,
        maxUsagePerUser: 1,
        isActive: true
    },
    {
        code: 'FLASH20',
        description: 'Flash sale - Giảm 20% tối đa 100k',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 100000,
        minOrderAmount: 150000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        maxUsage: 200,
        maxUsagePerUser: 2,
        isActive: true
    }
];

const createSampleVouchers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing vouchers (optional)
        // await voucherModel.deleteMany({});
        // console.log('🗑️  Cleared existing vouchers');

        // Create sample vouchers
        for (const voucherData of sampleVouchers) {
            const existing = await voucherModel.findOne({ code: voucherData.code });

            if (existing) {
                console.log(`⚠️  Voucher ${voucherData.code} already exists, skipping...`);
            } else {
                const voucher = new voucherModel(voucherData);
                await voucher.save();
                console.log(`✅ Created voucher: ${voucherData.code} - ${voucherData.description}`);
            }
        }

        console.log('\n📊 Sample vouchers summary:');
        console.log('==================================');
        const vouchers = await voucherModel.find({});
        vouchers.forEach(v => {
            console.log(`${v.code}: ${v.description}`);
            if (v.discountType === 'percentage') {
                console.log(`  └─ ${v.discountValue}% off (max ${v.maxDiscount} VNĐ)`);
            } else {
                console.log(`  └─ ${v.discountValue} VNĐ off`);
            }
            console.log(`  └─ Min order: ${v.minOrderAmount} VNĐ`);
            console.log(`  └─ Valid until: ${v.endDate.toLocaleDateString()}`);
            console.log('');
        });

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating sample vouchers:', error);
        process.exit(1);
    }
};

createSampleVouchers();
