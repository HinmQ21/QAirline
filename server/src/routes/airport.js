const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/airports:
 *   get:
 *     summary: Lấy danh sách tất cả sân bay (có thể lọc theo tên, thành phố, quốc gia)
 *     tags: [Airports]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Lọc theo tên sân bay (không phân biệt chữ hoa/thường)"
 *         example: Tan Son Nhat
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: "Lọc theo thành phố (không phân biệt chữ hoa/thường)"
 *         example: Ho Chi Minh City
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: "Lọc theo quốc gia (không phân biệt chữ hoa/thường)"
 *         example: Vietnam
 *     responses:
 *       200:
 *         description: "Danh sách sân bay."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Airport'
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/', airportController.getAirports);

/**
 * @swagger
 * /api/airports/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một sân bay theo ID
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của sân bay."
 *         example: 1
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết sân bay."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       404:
 *         description: "Không tìm thấy sân bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/:id', airportController.getAirportById);

/**
 * @swagger
 * /api/airports:
 *   post:
 *     summary: Tạo sân bay mới (yêu cầu quyền Admin)
 *     tags: [Airports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAirportInput'
 *           example:
 *              name: Noi Bai International Airport
 *              iataCode: HAN
 *              city: Hanoi
 *              country: Vietnam
 *     responses:
 *       201:
 *         description: "Tạo sân bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ (vd: thiếu trường, IATA code đã tồn tại)."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.post('/', authenticateAdmin, airportController.createAirport);

/**
 * @swagger
 * /api/airports/{id}:
 *   put:
 *     summary: Cập nhật thông tin sân bay (yêu cầu quyền Admin)
 *     tags: [Airports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của sân bay cần cập nhật."
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAirportInput'
 *           example:
 *              name: Da Nang International Airport - Updated
 *              city: Da Nang
 *     responses:
 *       200:
 *         description: "Cập nhật sân bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       404:
 *         description: "Không tìm thấy sân bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.put('/:id', authenticateAdmin, airportController.updateAirport);

/**
 * @swagger
 * /api/airports/{id}:
 *   delete:
 *     summary: Xóa sân bay (yêu cầu quyền Admin)
 *     tags: [Airports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của sân bay cần xóa."
 *         example: 3
 *     responses:
 *       200:
 *         description: "Xóa sân bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sân bay đã được xóa thành công.
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       404:
 *         description: "Không tìm thấy sân bay."
 *       500:
 *         description: "Lỗi máy chủ (vd: không thể xóa do có chuyến bay liên quan)."
 */
router.delete('/:id', authenticateAdmin, airportController.deleteAirport);

/**
 * @swagger
 * tags:
 *   name: Airports
 *   description: "Quản lý sân bay"
 * components:
 *   schemas:
 *     Airport:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Tan Son Nhat International Airport
 *         iataCode:
 *           type: string
 *           example: SGN
 *         city:
 *           type: string
 *           example: Ho Chi Minh City
 *         country:
 *           type: string
 *           example: Vietnam
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAirportInput:
 *       type: object
 *       required:
 *         - name
 *         - iataCode
 *         - city
 *         - country
 *       properties:
 *         name:
 *           type: string
 *         iataCode:
 *           type: string
 *           maxLength: 3
 *           minLength: 3
 *         city:
 *           type: string
 *         country:
 *           type: string
 *     UpdateAirportInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         city:
 *           type: string
 *         country:
 *           type: string
 *
 */

module.exports = router; 