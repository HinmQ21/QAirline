const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { authenticateUser } = require('../middleware/auth');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Tạo đặt vé mới với thông tin hành khách
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flight_id
 *               - passengers
 *             properties:
 *               flight_id:
 *                 type: integer
 *                 description: "ID của chuyến bay"
 *                 example: 1
 *               passengers:
 *                 type: array
 *                 description: "Thông tin hành khách (tối đa 9 người)"
 *                 maxItems: 9
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - seat_id
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: "Tên hành khách (tối đa 100 ký tự)"
 *                       maxLength: 100
 *                       example: "Nguyễn Văn A"
 *                     dob:
 *                       type: string
 *                       format: date
 *                       description: "Ngày sinh (YYYY-MM-DD, tùy chọn)"
 *                       example: "1990-01-15"
 *                     seat_id:
 *                       type: integer
 *                       description: "ID của ghế đã chọn"
 *                       example: 25
 *     responses:
 *       201:
 *         description: "Đặt vé thành công"
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
 *                   example: "Đặt vé thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       type: object
 *                       properties:
 *                         booking_id:
 *                           type: integer
 *                           example: 123
 *                         total_price:
 *                           type: number
 *                           example: 2500000
 *                         status:
 *                           type: string
 *                           example: "booked"
 *                     tickets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ticket_id:
 *                             type: integer
 *                             example: 456
 *                           passenger_name:
 *                             type: string
 *                             example: "Nguyễn Văn A"
 *                           price:
 *                             type: number
 *                             example: 2500000
 *                     flight_info:
 *                       type: object
 *                       properties:
 *                         flight_number:
 *                           type: string
 *                           example: "VN123"
 *                         departure_time:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: "ID chuyến bay không hợp lệ / Vui lòng cung cấp thông tin hành khách / Không thể đặt quá 9 vé trong một lần đặt / Tên hành khách không hợp lệ / Ngày sinh không hợp lệ / Không thể đặt vé cho chuyến bay đã khởi hành / Không thể đặt vé cho chuyến bay đã bị hủy / Không thể đặt vé trong vòng 2 giờ trước giờ khởi hành / Không thể chọn trùng ghế / Ghế không có sẵn / Ghế đã được đặt"
 *       404:
 *         description: "Không tìm thấy chuyến bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi tạo đặt vé"
 */
router.post('/', authenticateUser, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Lấy tất cả đặt vé của khách hàng hiện tại
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: "Lỗi khi lấy danh sách đặt vé"
 */
router.get('/', authenticateUser, bookingController.getCustomerBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết đặt vé theo ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt vé"
 *     responses:
 *       200:
 *         description: "Chi tiết đặt vé"
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
 *       403:
 *         description: "Bạn không có quyền xem đặt vé này"
 *       404:
 *         description: "Không tìm thấy đặt vé với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi lấy thông tin đặt vé"
 */
router.get('/:id', authenticateUser, bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Hủy đặt vé
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt vé cần hủy"
 *     responses:
 *       200:
 *         description: "Hủy đặt vé thành công"
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
 *                   example: "Đã hủy đặt vé thành công"
 *                 data:
 *                   type: object
 *       400:
 *         description: "Không thể hủy đặt vé đã hoàn thành / Không thể hủy đặt vé đã bị hủy trước đó / Không thể hủy đặt vé cho chuyến bay đã khởi hành"
 *       403:
 *         description: "Bạn không có quyền hủy đặt vé này"
 *       404:
 *         description: "Không tìm thấy đặt vé với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi hủy đặt vé"
 */
router.put('/:id/cancel', authenticateUser, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/confirmation:
 *   get:
 *     summary: Lấy xác nhận đặt vé
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt vé"
 *     responses:
 *       200:
 *         description: "Xác nhận đặt vé"
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
 *       403:
 *         description: "Bạn không có quyền xem xác nhận đặt vé này"
 *       404:
 *         description: "Không tìm thấy đặt vé với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi tạo xác nhận đặt vé"
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