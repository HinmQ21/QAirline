const express = require('express');
const router = express.Router();
const airplaneController = require('../controllers/airplane');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/airplanes:
 *   get:
 *     summary: Lấy danh sách tất cả máy bay (có thể lọc theo model, số hiệu)
 *     tags: [Airplanes]
 *     parameters:
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: "Lọc theo mẫu máy bay (không phân biệt chữ hoa/thường)"
 *         example: Boeing 787
 *       - in: query
 *         name: registrationNumber
 *         schema:
 *           type: string
 *         description: "Lọc theo số hiệu đăng ký (không phân biệt chữ hoa/thường)"
 *         example: VN-A888
 *     responses:
 *       200:
 *         description: "Danh sách máy bay."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Airplane'
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/', airplaneController.getAirplanes);

/**
 * @swagger
 * /api/airplanes/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một máy bay theo ID
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay."
 *         example: 1
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết máy bay."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airplane'
 *       404:
 *         description: "Không tìm thấy máy bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/:id', airplaneController.getAirplaneById);

/**
 * @swagger
 * /api/airplanes:
 *   post:
 *     summary: Tạo máy bay mới (yêu cầu quyền Admin)
 *     tags: [Airplanes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAirplaneInput'
 *           example:
 *              model: Airbus A321
 *              registrationNumber: VN-A699
 *              totalSeats: 184
 *              economySeats: 168
 *              businessSeats: 16
 *     responses:
 *       201:
 *         description: "Tạo máy bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airplane'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ (vd: thiếu trường, số hiệu đã tồn tại)."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.post('/', authenticateAdmin, airplaneController.createAirplane);

/**
 * @swagger
 * /api/airplanes/{id}:
 *   put:
 *     summary: Cập nhật thông tin máy bay (yêu cầu quyền Admin)
 *     tags: [Airplanes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay cần cập nhật."
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAirplaneInput'
 *           example:
 *              model: Boeing 787-9 Dreamliner
 *              totalSeats: 290
 *              economySeats: 250
 *              businessSeats: 40
 *     responses:
 *       200:
 *         description: "Cập nhật máy bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airplane'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       404:
 *         description: "Không tìm thấy máy bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.put('/:id', authenticateAdmin, airplaneController.updateAirplane);

/**
 * @swagger
 * /api/airplanes/{id}:
 *   delete:
 *     summary: Xóa máy bay (yêu cầu quyền Admin)
 *     tags: [Airplanes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay cần xóa."
 *         example: 3
 *     responses:
 *       200:
 *         description: "Xóa máy bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Máy bay đã được xóa thành công.
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       404:
 *         description: "Không tìm thấy máy bay."
 *       500:
 *         description: "Lỗi máy chủ (vd: không thể xóa do có chuyến bay liên quan)."
 */
router.delete('/:id', authenticateAdmin, airplaneController.deleteAirplane);

/**
 * @swagger
 * /api/airplanes/{id}/seats:
 *   post:
 *     summary: Cấu hình sơ đồ ghế cho máy bay (yêu cầu quyền Admin)
 *     tags: [Airplanes, Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay cần cấu hình ghế."
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: "Mảng các đối tượng ghế cần tạo hoặc cập nhật. Nếu ghế với seatNumber đã tồn tại, nó sẽ được cập nhật."
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/SeatConfigurationInput'
 *           example:
 *             - seatNumber: 1A
 *               seatClass: Business
 *               status: Available
 *             - seatNumber: 1B
 *               seatClass: Business
 *               status: Available
 *             - seatNumber: 10A
 *               seatClass: Economy
 *               status: Available
 *     responses:
 *       200:
 *         description: "Cấu hình ghế thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cấu hình ghế cho máy bay ID 1 thành công."
 *                 seatsCreated:
 *                   type: integer
 *                 seatsUpdated:
 *                   type: integer
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ (vd: thiếu trường, seatClass không hợp lệ)."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền Admin."
 *       404:
 *         description: "Không tìm thấy máy bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.post('/:id/seats', authenticateAdmin, airplaneController.configureSeatLayout);

/**
 * @swagger
 * /api/airplanes/{id}/seats:
 *   get:
 *     summary: Lấy danh sách tất cả ghế của một máy bay
 *     tags: [Airplanes, Seats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay."
 *         example: 1
 *     responses:
 *       200:
 *         description: "Danh sách ghế của máy bay."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seat'
 *       404:
 *         description: "Không tìm thấy máy bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/:id/seats', airplaneController.getAirplaneSeats);

/**
 * @swagger
 * tags:
 *   - name: Airplanes
 *     description: "Quản lý máy bay"
 *   - name: Seats
 *     description: "Quản lý ghế máy bay"
 * components:
 *   schemas:
 *     Airplane:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         model:
 *           type: string
 *           example: Boeing 787
 *         registrationNumber:
 *           type: string
 *           example: VN-A888
 *         totalSeats:
 *           type: integer
 *           example: 283
 *         economySeats:
 *           type: integer
 *           example: 253
 *         businessSeats:
 *           type: integer
 *           example: 30
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAirplaneInput:
 *       type: object
 *       required:
 *         - model
 *         - registrationNumber
 *         - totalSeats
 *         - economySeats
 *         - businessSeats
 *       properties:
 *         model:
 *           type: string
 *         registrationNumber:
 *           type: string
 *           description: "Số hiệu đăng ký duy nhất"
 *         totalSeats:
 *           type: integer
 *           description: "Tổng số ghế"
 *         economySeats:
 *           type: integer
 *           description: "Số ghế hạng phổ thông"
 *         businessSeats:
 *           type: integer
 *           description: "Số ghế hạng thương gia"
 *     UpdateAirplaneInput:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *         totalSeats:
 *           type: integer
 *         economySeats:
 *           type: integer
 *         businessSeats:
 *           type: integer
 *     Seat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         airplaneId:
 *           type: integer
 *           example: 1
 *         seatNumber:
 *           type: string
 *           example: 1A
 *         seatClass:
 *           type: string
 *           enum: [Economy, Business, First]
 *           example: Business
 *         status:
 *           type: string
 *           enum: [Available, Booked, Unavailable]
 *           example: Available
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SeatConfigurationInput:
 *       type: object
 *       required:
 *         - seatNumber
 *         - seatClass
 *       properties:
 *         seatNumber:
 *           type: string
 *           description: "Số hiệu ghế (vd: 1A, 20F)"
 *           example: 2B
 *         seatClass:
 *           type: string
 *           enum: [Economy, Business, First]
 *           description: "Hạng ghế"
 *           example: Business
 *         status:
 *           type: string
 *           enum: [Available, Booked, Unavailable]
 *           description: "Trạng thái ban đầu của ghế (mặc định là Available nếu không cung cấp)"
 *           default: Available
 *           example: Available
 */

module.exports = router; 