const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { authenticateUser } = require('../middleware/auth');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo đặt chỗ mới với vé
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingInput'
 *           example:
 *             flightId: 1
 *             contactEmail: customer@example.com
 *             contactPhone: "0912345678"
 *             passengers: [
 *               {
 *                 fullName: "Nguyễn Văn A",
 *                 dateOfBirth: "1990-01-01",
 *                 passportNumber: "P12345678",
 *                 seatNumber: "12A"
 *               },
 *               {
 *                 fullName: "Trần Thị B",
 *                 dateOfBirth: "1992-05-15",
 *                 passportNumber: "P87654321",
 *                 seatNumber: "12B"
 *               }
 *             ]
 *             paymentMethod: "CREDIT_CARD"
 *     responses:
 *       201:
 *         description: "Đặt chỗ thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ hoặc ghế đã được đặt"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       404:
 *         description: "Không tìm thấy chuyến bay"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/', authenticateUser, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Lấy tất cả đặt chỗ của khách hàng hiện tại
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *         description: "Lọc theo trạng thái đặt chỗ"
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Lọc từ ngày (YYYY-MM-DD)"
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: "Lọc đến ngày (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: "Danh sách đặt chỗ"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookingSummary'
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/', authenticateUser, bookingController.getCustomerBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết đặt chỗ theo ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt chỗ"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Chi tiết đặt chỗ"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền truy cập đặt chỗ này"
 *       404:
 *         description: "Không tìm thấy đặt chỗ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/:id', authenticateUser, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Hủy đặt chỗ
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt chỗ cần hủy"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Hủy đặt chỗ thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đặt chỗ đã được hủy thành công
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: "Không thể hủy đặt chỗ (đã quá thời hạn hoặc đã hoàn thành)"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền hủy đặt chỗ này"
 *       404:
 *         description: "Không tìm thấy đặt chỗ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.put('/:id/cancel', authenticateUser, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/confirmation:
 *   get:
 *     summary: Tạo xác nhận đặt chỗ
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt chỗ"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Xác nhận đặt chỗ"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingReference:
 *                   type: string
 *                   example: "QA12345"
 *                 bookingDetails:
 *                   $ref: '#/components/schemas/Booking'
 *                 confirmationHtml:
 *                   type: string
 *                   description: "HTML của xác nhận đặt chỗ để hiển thị hoặc in"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền truy cập đặt chỗ này"
 *       404:
 *         description: "Không tìm thấy đặt chỗ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/:id/confirmation', authenticateUser, bookingController.generateBookingConfirmation);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: "Quản lý đặt chỗ và vé"
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         bookingReference:
 *           type: string
 *           example: "QA12345"
 *         customerId:
 *           type: integer
 *           example: 5
 *         flightId:
 *           type: integer
 *           example: 2
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *           example: confirmed
 *         totalAmount:
 *           type: number
 *           format: float
 *           example: 3500000
 *         contactEmail:
 *           type: string
 *           format: email
 *           example: customer@example.com
 *         contactPhone:
 *           type: string
 *           example: "0912345678"
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, BANK_TRANSFER, PAYPAL]
 *           example: CREDIT_CARD
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, refunded, failed]
 *           example: completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         flight:
 *           $ref: '#/components/schemas/Flight'
 *         tickets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ticket'
 *     BookingSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         bookingReference:
 *           type: string
 *           example: "QA12345"
 *         flightNumber:
 *           type: string
 *           example: "VN123"
 *         departureAirport:
 *           type: string
 *           example: "SGN"
 *         arrivalAirport:
 *           type: string
 *           example: "HAN"
 *         departureTime:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *           example: confirmed
 *         totalAmount:
 *           type: number
 *           format: float
 *           example: 3500000
 *         passengerCount:
 *           type: integer
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateBookingInput:
 *       type: object
 *       required:
 *         - flightId
 *         - contactEmail
 *         - contactPhone
 *         - passengers
 *         - paymentMethod
 *       properties:
 *         flightId:
 *           type: integer
 *           description: "ID của chuyến bay"
 *         contactEmail:
 *           type: string
 *           format: email
 *           description: "Email liên hệ"
 *         contactPhone:
 *           type: string
 *           description: "Số điện thoại liên hệ"
 *         passengers:
 *           type: array
 *           description: "Danh sách hành khách"
 *           items:
 *             type: object
 *             required:
 *               - fullName
 *               - dateOfBirth
 *               - seatNumber
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: "Họ tên đầy đủ của hành khách"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: "Ngày sinh (YYYY-MM-DD)"
 *               passportNumber:
 *                 type: string
 *                 description: "Số hộ chiếu (nếu có)"
 *               seatNumber:
 *                 type: string
 *                 description: "Số ghế (vd: 12A)"
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, BANK_TRANSFER, PAYPAL]
 *           description: "Phương thức thanh toán"
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         bookingId:
 *           type: integer
 *           example: 1
 *         passengerName:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         passengerDateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         passengerPassportNumber:
 *           type: string
 *           example: "P12345678"
 *         seatNumber:
 *           type: string
 *           example: "12A"
 *         seatClass:
 *           type: string
 *           enum: [Economy, Business, First]
 *           example: Economy
 *         ticketPrice:
 *           type: number
 *           format: float
 *           example: 1750000
 *         status:
 *           type: string
 *           enum: [active, cancelled, used]
 *           example: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;