import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database.js';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    const adminEmail = 'admin123@gmail.com';
    const adminPassword = 'admin12345';
    const adminName = 'Admin User';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { user_email: adminEmail } });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminEmail);
      process.exit(0);
    }
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(adminPassword, saltRounds);
    
    // Create admin user
    const adminUser = await User.create({
      user_name: adminName,
      user_email: adminEmail,
      password_hash,
      role: 'admin',
      is_active: true,
      wallet: 999999,
      subscription_plan: 'Premium',
      subscription_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Name:', adminName);
    console.log('💳 Account:', 'Premium (1 year)');
    console.log('💰 Wallet:', 999999);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
