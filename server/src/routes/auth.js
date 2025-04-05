const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/auth/admin/login
 * @desc    Đăng nhập với tài khoản admin
 * @access  Public
 */
router.post('/admin/login', authController.adminLogin);

/**
 * @route   GET /api/auth/admin/me
 * @desc    Lấy thông tin admin hiện tại từ token
 * @access  Private (Admin only)
 */
router.get('/admin/me', authenticateAdmin, authController.getCurrentAdmin);

module.exports = router;