const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const { authenticateUser, authenticateAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/tickets/booking/{bookingId}:
 *   get:
 *     summary: Lấy danh sách vé cho một đặt vé
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của đặt vé"
 *     responses:
 *       200:
 *         description: "Danh sách vé"
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: "Không tìm thấy đặt vé hoặc bạn không có quyền truy cập"
 *       500:
 *         description: "Lỗi khi lấy danh sách vé"
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
 *     responses:
 *       200:
 *         description: "Vé điện tử"
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
 *                     ticket_number:
 *                       type: string
 *                       example: "QAT-00000123"
 *                     passenger:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         dob:
 *                           type: string
 *                           format: date
 *                     seat:
 *                       type: object
 *                       properties:
 *                         number:
 *                           type: string
 *                         class:
 *                           type: string
 *                     flight:
 *                       type: object
 *                     booking:
 *                       type: object
 *                     price:
 *                       type: number
 *                     qr_code:
 *                       type: string
 *       404:
 *         description: "Không tìm thấy vé hoặc bạn không có quyền truy cập"
 *       500:
 *         description: "Lỗi khi tạo vé điện tử"
 */
router.get('/:id/e-ticket', authenticateUser, ticketController.generateETicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Lấy danh sách tất cả các vé trong hệ thống (yêu cầu quyền Admin)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Danh sách tất cả các vé"
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
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: "Lỗi khi lấy danh sách vé"
 */
router.get('/', authenticateAdmin, ticketController.getAllTickets);

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