const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const { authenticateUser } = require('../middleware/auth');

/**
 * @swagger
 * /api/tickets/booking/{bookingId}:
 *   get:
 *     summary: Lấy danh sách vé cho một đặt chỗ
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt chỗ"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Danh sách vé"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền truy cập đặt chỗ này"
 *       404:
 *         description: "Không tìm thấy đặt chỗ"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/booking/:bookingId', authenticateUser, ticketController.getTicketsByBooking);

/**
 * @swagger
 * /api/tickets/{id}/e-ticket:
 *   get:
 *     summary: Tạo vé điện tử cho một vé cụ thể
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của vé"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Vé điện tử"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketNumber:
 *                   type: string
 *                   example: "QA-T12345"
 *                 ticketDetails:
 *                   $ref: '#/components/schemas/Ticket'
 *                 flightDetails:
 *                   $ref: '#/components/schemas/Flight'
 *                 passengerDetails:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                     passportNumber:
 *                       type: string
 *                       example: "P12345678"
 *                 eTicketHtml:
 *                   type: string
 *                   description: "HTML của vé điện tử để hiển thị hoặc in"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền truy cập vé này"
 *       404:
 *         description: "Không tìm thấy vé"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/:id/e-ticket', authenticateUser, ticketController.generateETicket);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: "Quản lý vé máy bay"
 * components:
 *   schemas:
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