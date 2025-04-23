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
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public (with refresh token)
 */
router.post('/refresh-token', authController.refreshAccessToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất (vô hiệu hóa refresh token)
 * @access  Public (với refresh token)
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/auth/revoke-all-tokens
 * @desc    Đăng xuất khỏi tất cả các thiết bị
 * @access  Private (User or Admin)
 */
router.post('/revoke-all-tokens', 
  (req, res, next) => {
    // Try both authentication middlewares
    authenticateUser(req, res, (err) => {
      if (err) {
        authenticateAdmin(req, res, next);
      } else {
        next();
      }
    });
  }, 
  authController.revokeAllTokens
);

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng hiện tại từ token
 * @access  Private (User only)
 */
router.get('/me', authenticateUser, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin cá nhân của người dùng
 * @access  Private (User only)
 */
router.put('/profile', authenticateUser, authController.updateCustomerProfile);

/**
 * @route   DELETE /api/auth/account
 * @desc    Xóa tài khoản người dùng
 * @access  Private (User only)
 */
router.delete('/account', authenticateUser, authController.deleteCustomerAccount);

module.exports = router;