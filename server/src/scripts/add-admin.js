/**
 * Script to add admin user to the database
 * 
 * Usage: 
 * node scripts/add-admin.js
 * 
 * This script requires the following environment variables:
 * - ADMIN_USERNAME: username for the new admin
 * - ADMIN_PASSWORD: password for the new admin
 * - ADMIN_EMAIL: email for the new admin
 * - ADMIN_FULLNAME: full name for the new admin (optional)
 * - ADMIN_ROLE: role for the new admin (super_admin, flight_manager, or news_manager)
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('../models');

// Get admin data from environment variables or use defaults for testing
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@qaairline.com';
const adminFullName = process.env.ADMIN_FULLNAME || 'Admin User';
const adminRole = process.env.ADMIN_ROLE || 'super_admin';

async function addAdmin() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // Check if admin username already exists
    const existingAdmin = await Admin.findOne({ where: { username: adminUsername } });
    if (existingAdmin) {
      console.error(`Error: Admin with username '${adminUsername}' already exists.`);
      process.exit(1);
    }

    // Check if admin email already exists
    const existingEmail = await Admin.findOne({ where: { email: adminEmail } });
    if (existingEmail) {
      console.error(`Error: Admin with email '${adminEmail}' already exists.`);
      process.exit(1);
    }

    // Validate role
    const validRoles = ['flight_manager', 'news_manager', 'super_admin'];
    if (!validRoles.includes(adminRole)) {
      console.error(`Error: Role '${adminRole}' is not valid. Valid roles are: ${validRoles.join(', ')}`);
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    console.log('Creating admin account...');
    const newAdmin = await Admin.create({
      username: adminUsername,
      password: hashedPassword,
      email: adminEmail,
      full_name: adminFullName,
      role: adminRole
    });

    console.log('Admin account created successfully:');
    console.log(`- ID: ${newAdmin.admin_id}`);
    console.log(`- Username: ${newAdmin.username}`);
    console.log(`- Email: ${newAdmin.email}`);
    console.log(`- Full Name: ${newAdmin.full_name}`);
    console.log(`- Role: ${newAdmin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

// Run the script
addAdmin(); 