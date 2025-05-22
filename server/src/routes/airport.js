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
 *         name: code
 *         schema:
 *           type: string
 *         description: "Lọc theo mã sân bay"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: "Lọc theo tên sân bay (không phân biệt chữ hoa/thường)"
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: "Lọc theo thành phố (không phân biệt chữ hoa/thường)"
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: "Lọc theo quốc gia (không phân biệt chữ hoa/thường)"
 *     responses:
 *       200:
 *         description: "Danh sách sân bay"
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
 *                     $ref: '#/components/schemas/Airport'
 *       500:
 *         description: "Lỗi khi lấy danh sách sân bay"
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
 *         description: "ID của sân bay"
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết sân bay"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Airport'
 *       404:
 *         description: "Không tìm thấy sân bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi lấy thông tin sân bay"
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
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Mã sân bay (unique)"
 *               name:
 *                 type: string
 *                 description: "Tên sân bay"
 *               city:
 *                 type: string
 *                 description: "Thành phố"
 *               country:
 *                 type: string
 *                 description: "Quốc gia"
 *     responses:
 *       201:
 *         description: "Tạo sân bay thành công"
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
 *                   example: Tạo sân bay thành công
 *                 data:
 *                   $ref: '#/components/schemas/Airport'
 *       400:
 *         description: "Vui lòng cung cấp mã sân bay và tên sân bay / Mã sân bay đã tồn tại trong hệ thống"
 *       500:
 *         description: "Lỗi khi tạo sân bay"
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
 *         description: "ID của sân bay cần cập nhật"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Mã sân bay"
 *               name:
 *                 type: string
 *                 description: "Tên sân bay"
 *               city:
 *                 type: string
 *                 description: "Thành phố"
 *               country:
 *                 type: string
 *                 description: "Quốc gia"
 *     responses:
 *       200:
 *         description: "Cập nhật sân bay thành công"
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
 *                   example: Cập nhật sân bay thành công
 *                 data:
 *                   $ref: '#/components/schemas/Airport'
 *       400:
 *         description: "Mã sân bay đã tồn tại trong hệ thống"
 *       404:
 *         description: "Không tìm thấy sân bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi cập nhật sân bay"
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
 *         description: "ID của sân bay cần xóa"
 *     responses:
 *       200:
 *         description: "Xóa sân bay thành công"
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
 *                   example: Đã xóa sân bay thành công
 *       404:
 *         description: "Không tìm thấy sân bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi xóa sân bay"
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