const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Lấy thống kê cho bảng điều khiển admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Thống kê bảng điều khiển thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     customers:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 1250
 *                     flights:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 320
 *                         active:
 *                           type: integer
 *                           example: 42
 *                     bookings:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 4500
 *                         thisMonth:
 *                           type: integer
 *                           example: 120
 *                     tickets:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 5200
 *                         today:
 *                           type: integer
 *                           example: 35
 *                     revenue:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           example: 1250000000
 *                         thisMonth:
 *                           type: number
 *                           example: 75000000
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Admin"
 *       500:
 *         description: "Lỗi máy chủ"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi lấy thống kê tổng quan"
 *                 error:
 *                   type: string
 */
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Danh sách người dùng admin"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Super Admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/users', authenticateAdmin, adminController.getAllAdmins);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Tạo người dùng admin mới
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminInput'
 *           example:
 *             username: newadmin
 *             password: Admin@123
 *             full_name: Nguyễn Văn Admin
 *             email: admin@qairline.com
 *             role: flight_manager
 *     responses:
 *       201:
 *         description: "Tạo người dùng admin thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ hoặc username/email đã tồn tại"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Super Admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/users', authenticateAdmin, adminController.createAdmin);

/**
 * @swagger
 * /api/admin/users/{admin_id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admin_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của người dùng admin cần cập nhật"
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdminInput'
 *           example:
 *             full_name: Nguyễn Văn Admin Mới
 *             email: newadmin@example.com
 *             role: SUPER_ADMIN
 *     responses:
 *       200:
 *         description: "Cập nhật người dùng admin thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ hoặc email đã tồn tại"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Super Admin"
 *       404:
 *         description: "Không tìm thấy người dùng admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.put('/users/:admin_id', authenticateAdmin, adminController.updateAdmin);

/**
 * @swagger
 * /api/admin/users/{admin_id}:
 *   delete:
 *     summary: Xóa người dùng admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: admin_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của người dùng admin cần xóa"
 *         example: 3
 *     responses:
 *       200:
 *         description: "Xóa người dùng admin thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Người dùng admin đã được xóa thành công
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Super Admin hoặc không thể xóa chính mình"
 *       404:
 *         description: "Không tìm thấy người dùng admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.delete('/users/:admin_id', authenticateAdmin, adminController.deleteAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: "Quản lý người dùng admin và thống kê hệ thống"
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         admin_id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: admin
 *         full_name:
 *           type: string
 *           example: Nguyễn Văn Admin
 *         email:
 *           type: string
 *           format: email
 *           example: admin@qairline.com
 *         role:
 *           type: string
 *           enum: [super_admin, flight_manager, customer_support]
 *           example: flight_manager
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CreateAdminInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - full_name
 *         - email
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: "Tên đăng nhập duy nhất"
 *         password:
 *           type: string
 *           format: password
 *           description: "Mật khẩu"
 *         full_name:
 *           type: string
 *           description: "Họ tên đầy đủ"
 *         email:
 *           type: string
 *           format: email
 *           description: "Email duy nhất"
 *         role:
 *           type: string
 *           enum: [super_admin, flight_manager, customer_support]
 *           description: "Vai trò của admin"
 *     UpdateAdminInput:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *           description: "Họ tên đầy đủ"
 *         email:
 *           type: string
 *           format: email
 *           description: "Email duy nhất"
 *         role:
 *           type: string
 *           enum: [super_admin, flight_manager, customer_support]
 *           description: "Vai trò của admin"
 *         password:
 *           type: string
 *           format: password
 *           description: "Mật khẩu mới (nếu muốn thay đổi)"
 */

module.exports = router;