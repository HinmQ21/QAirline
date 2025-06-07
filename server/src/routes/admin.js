const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { authenticateAdmin } = require('../middleware/auth');
const bookingController = require('../controllers/booking');

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
 *       500:
 *         description: "Đã xảy ra lỗi khi lấy thống kê tổng quan"
 */
router.get('/dashboard', authenticateAdmin, adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng admin (yêu cầu quyền Super Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Danh sách người dùng admin"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *       403:
 *         description: "Bạn không có quyền xem danh sách quản trị viên"
 *       500:
 *         description: "Đã xảy ra lỗi khi lấy danh sách quản trị viên"
 */
router.get('/users', authenticateAdmin, adminController.getAllAdmins);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Tạo người dùng admin mới (yêu cầu quyền Super Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Tên đăng nhập"
 *               password:
 *                 type: string
 *                 description: "Mật khẩu"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Email"
 *               full_name:
 *                 type: string
 *                 description: "Họ và tên"
 *               role:
 *                 type: string
 *                 enum: [flight_manager, news_manager, super_admin]
 *                 description: "Loại tài khoản"
 *     responses:
 *       201:
 *         description: "Tạo người dùng admin thành công"
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
 *                   example: "Tạo quản trị viên thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: "Vui lòng cung cấp đầy đủ thông tin / Loại tài khoản không hợp lệ / Tên đăng nhập đã tồn tại / Email đã được sử dụng"
 *       403:
 *         description: "Bạn không có quyền tạo quản trị viên mới"
 *       500:
 *         description: "Đã xảy ra lỗi khi tạo quản trị viên mới"
 */
router.post('/users', authenticateAdmin, adminController.createAdmin);

/**
 * @swagger
 * /api/admin/users/{admin_id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng admin (yêu cầu quyền Super Admin)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Email"
 *               full_name:
 *                 type: string
 *                 description: "Họ và tên"
 *               role:
 *                 type: string
 *                 enum: [flight_manager, news_manager, super_admin]
 *                 description: "Loại tài khoản"
 *               password:
 *                 type: string
 *                 description: "Mật khẩu mới (nếu muốn thay đổi)"
 *     responses:
 *       200:
 *         description: "Cập nhật người dùng admin thành công"
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
 *                   example: "Cập nhật thông tin quản trị viên thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: "Loại tài khoản không hợp lệ / Email đã được sử dụng bởi tài khoản khác"
 *       403:
 *         description: "Bạn không có quyền cập nhật quản trị viên"
 *       404:
 *         description: "Không tìm thấy quản trị viên"
 *       500:
 *         description: "Đã xảy ra lỗi khi cập nhật thông tin quản trị viên"
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
 *                   example: "Người dùng admin đã được xóa thành công"
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

// Booking management routes

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Lấy danh sách tất cả đặt vé cho admin
 *     tags: [Admin Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Số trang"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: "Số lượng kết quả mỗi trang"
 *       - in: query
 *         name: flight_id
 *         schema:
 *           type: integer
 *         description: "Lọc theo ID chuyến bay"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [booked, cancelled]
 *         description: "Lọc theo trạng thái đặt vé"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Tìm kiếm theo tên, email hoặc số điện thoại khách hàng"
 *     responses:
 *       200:
 *         description: "Danh sách đặt vé"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: "Chưa xác thực"
 *       403:
 *         description: "Không có quyền truy cập"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/bookings', authenticateAdmin, bookingController.getAllBookingsForAdmin);

/**
 * @swagger
 * /api/admin/bookings/stats:
 *   get:
 *     summary: Lấy thống kê đặt vé cho admin
 *     tags: [Admin Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: flight_id
 *         schema:
 *           type: integer
 *         description: "Lọc thống kê theo ID chuyến bay"
 *     responses:
 *       200:
 *         description: "Thống kê đặt vé"
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
 *                     totalBookings:
 *                       type: integer
 *                     bookingsByStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     revenue:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         average:
 *                           type: number
 *                     monthlyTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           revenue:
 *                             type: number
 *                     topRoutes:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: "Chưa xác thực"
 *       403:
 *         description: "Không có quyền truy cập"
 *       500:
 *         description: "Lỗi server"
 */
router.get('/bookings/stats', authenticateAdmin, bookingController.getBookingStats);

/**
 * @swagger
 * tags:
 *   name: Admin Bookings
 *   description: "Quản lý đặt vé cho admin"
 */

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