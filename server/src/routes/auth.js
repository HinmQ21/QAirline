const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateAdmin, authenticateUser } = require('../middleware/auth');

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

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập với tài khoản người dùng
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng hiện tại từ token
 * @access  Private (User only)
 */
router.get('/me', authenticateUser, authController.getCurrentUser);

module.exports = router;