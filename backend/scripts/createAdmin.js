import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Admin credentials
        const adminEmail = 'admin@fooddelivery.com';
        const adminPassword = 'Admin@123456'; // Change this!
        const adminName = 'Administrator';

        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');

            // Update existing user to admin role
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log(`✅ Updated ${adminEmail} to admin role`);
        } else {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            // Create admin user
            const admin = new userModel({
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', adminEmail);
            console.log('🔑 Password:', adminPassword);
            console.log('⚠️  Please change the password after first login!');
        }

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
