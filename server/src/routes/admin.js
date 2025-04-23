const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all admin users
 * @access  Private (Super Admin only)
 */
router.get('/users', authenticateAdmin, adminController.getAllAdmins);

/**
 * @route   POST /api/admin/users
 * @desc    Create a new admin user
 * @access  Private (Super Admin only)
 */
router.post('/users', authenticateAdmin, adminController.createAdmin);

/**
 * @route   PUT /api/admin/users/:admin_id
 * @desc    Update an admin user
 * @access  Private (Super Admin only)
 */
router.put('/users/:admin_id', authenticateAdmin, adminController.updateAdmin);

/**
 * @route   DELETE /api/admin/users/:admin_id
 * @desc    Delete an admin user
 * @access  Private (Super Admin only)
 */
router.delete('/users/:admin_id', authenticateAdmin, adminController.deleteAdmin);

module.exports = router; 