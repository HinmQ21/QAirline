const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateAdmin, authenticateUser } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Đăng nhập với tài khoản admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginInput'
 *     responses:
 *       200:
 *         description: "Đăng nhập admin thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: "Thiếu username hoặc password / Sai username hoặc password"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/admin/login', authController.adminLogin);

/**
 * @swagger
 * /api/auth/admin/me:
 *   get:
 *     summary: Lấy thông tin admin hiện tại từ token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Thông tin admin hiện tại"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       404:
 *         description: "Không tìm thấy thông tin admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/admin/me', authenticateAdmin, authController.getCurrentAdmin);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: "Đăng ký thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng ký thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: "Dữ liệu không hợp lệ (vd: thiếu field, email đã tồn tại)"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập với tài khoản người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerLoginInput'
 *     responses:
 *       200:
 *         description: "Đăng nhập thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: "Thiếu username hoặc password / Sai username hoặc password"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Làm mới access token bằng refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: "Refresh token nhận được khi đăng nhập."
 *     responses:
 *       200:
 *         description: "Cấp access token mới thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: "Thiếu refresh token"
 *       401:
 *         description: "Refresh token không hợp lệ, đã hết hạn hoặc người dùng/admin không tồn tại"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/refresh-token', authController.refreshAccessToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất (vô hiệu hóa refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: "Refresh token cần vô hiệu hóa."
 *     responses:
 *       200:
 *         description: "Đăng xuất thành công"
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Đăng xuất thành công.
 *       400:
 *         description: "Thiếu refresh token"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/revoke-all-tokens:
 *   post:
 *     summary: Đăng xuất khỏi tất cả các thiết bị (vô hiệu hóa tất cả refresh token của user/admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] # Requires user or admin token
 *     responses:
 *       200:
 *         description: "Vô hiệu hóa tất cả token thành công"
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Đã đăng xuất khỏi tất cả thiết bị.
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/revoke-all-tokens', 
  (req, res, next) => {
    // Try both authentication middlewares
    authenticateUser(req, res, (err) => {
      if (err) {
        // If user auth fails, try admin auth
        authenticateAdmin(req, res, next);
      } else {
        // If user auth succeeds, proceed
        next();
      }
    });
  }, 
  authController.revokeAllTokens
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại từ token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] # Requires user token
 *     responses:
 *       200:
 *         description: "Thông tin người dùng hiện tại"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: "Không tìm thấy thông tin người dùng"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/me', authenticateUser, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân của người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] # Requires user token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: "Cập nhật thông tin thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật thông tin thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: "Dữ liệu không hợp lệ"
 *       404:
 *         description: "Không tìm thấy thông tin người dùng"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.put('/profile', authenticateUser, authController.updateCustomerProfile);

/**
 * @swagger
 * /api/auth/account:
 *   delete:
 *     summary: Xóa tài khoản người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: [] # Requires user token
 *     responses:
 *       200:
 *         description: "Xóa tài khoản thành công"
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          success:
 *                              type: boolean
 *                              example: true
 *                          message:
 *                              type: string
 *                              example: Xóa tài khoản thành công
 *       400:
 *         description: "Không thể xóa tài khoản khi còn đơn đặt vé đang hoạt động"
 *       404:
 *         description: "Không tìm thấy thông tin người dùng"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.delete('/account', authenticateUser, authController.deleteCustomerAccount);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: "Xác thực và quản lý tài khoản người dùng/admin"
 * components:
 *   schemas:
 *     AdminLoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: admin
 *         password:
 *           type: string
 *           format: password
 *           example: Admin123!
 *     CustomerLoginInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: newuser
 *         password:
 *           type: string
 *           format: password
 *           example: Password123
 *     RegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - fullName
 *         - phoneNumber
 *         - address
 *       properties:
 *         username:
 *           type: string
 *           description: "Tên đăng nhập duy nhất"
 *           example: newuser
 *         email:
 *           type: string
 *           format: email
 *           description: "Email duy nhất"
 *           example: newuser@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: "Mật khẩu (sẽ được hash)"
 *           example: Password123
 *         fullName:
 *           type: string
 *           example: John Doe
 *         phoneNumber:
 *           type: string
 *           example: "0987654321"
 *         address:
 *           type: string
 *           example: 123 Example St, City
 *     UpdateProfileInput:
 *        type: object
 *        properties:
 *          fullName:
 *            type: string
 *            example: Johnathan Doe
 *          phoneNumber:
 *            type: string
 *            example: "0123456789"
 *          address:
 *            type: string
 *            example: 456 Updated Ave, Town
 *          # Add other updatable fields like avatarUrl, etc.
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           example: johndoe@example.com
 *         fullName:
 *           type: string
 *           example: John Doe
 *         phoneNumber:
 *           type: string
 *           example: "0987654321"
 *         address:
 *           type: string
 *           example: 123 Example St, City
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Admin:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            example: 1
 *          username:
 *            type: string
 *            example: adminuser
 *          role:
 *             type: string
 *             enum: [super_admin, flight_manager, booking_manager] # Example roles
 *             example: flight_manager
 *          createdAt:
 *            type: string
 *            format: date-time
 *          updatedAt:
 *            type: string
 *            format: date-time
 *     ErrorResponse: # You might want to move this to swagger.js for global use
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: "Thông báo lỗi"
 *         error:
 *           type: object
 *           description: "Chi tiết lỗi (tùy chọn)"
 *       required:
 *         - message
 *
 */

module.exports = router;