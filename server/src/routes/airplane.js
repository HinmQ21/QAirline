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
 *         name: code
 *         schema:
 *           type: string
 *         description: "Lọc theo mã máy bay"
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: "Lọc theo nhà sản xuất (không phân biệt chữ hoa/thường)"
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: "Lọc theo mẫu máy bay (không phân biệt chữ hoa/thường)"
 *     responses:
 *       200:
 *         description: "Danh sách máy bay"
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
 *                     $ref: '#/components/schemas/Airplane'
 *       500:
 *         description: "Lỗi máy chủ"
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
 *         description: "ID của máy bay"
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết máy bay"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Airplane'
 *       404:
 *         description: "Không tìm thấy máy bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi lấy thông tin máy bay"
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
 *             type: object
 *             required:
 *               - code
 *               - total_seats
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Mã máy bay (unique)"
 *               manufacturer:
 *                 type: string
 *                 description: "Nhà sản xuất"
 *               model:
 *                 type: string
 *                 description: "Mẫu máy bay"
 *               total_seats:
 *                 type: integer
 *                 description: "Tổng số ghế"
 *               seat_configuration:
 *                 type: array
 *                 description: "Cấu hình ghế"
 *                 items:
 *                   type: object
 *                   properties:
 *                     seat_number:
 *                       type: string
 *                     class:
 *                       type: string
 *                       enum: [economy, business, first]
 *     responses:
 *       201:
 *         description: "Tạo máy bay thành công"
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
 *                   example: Tạo máy bay thành công
 *                 data:
 *                   $ref: '#/components/schemas/Airplane'
 *       400:
 *         description: "Vui lòng cung cấp mã máy bay và tổng số ghế / Mã máy bay đã tồn tại trong hệ thống"
 *       500:
 *         description: "Lỗi khi tạo máy bay"
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
 *         description: "ID của máy bay cần cập nhật"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: "Mã máy bay"
 *               manufacturer:
 *                 type: string
 *                 description: "Nhà sản xuất"
 *               model:
 *                 type: string
 *                 description: "Mẫu máy bay"
 *               total_seats:
 *                 type: integer
 *                 description: "Tổng số ghế"
 *     responses:
 *       200:
 *         description: "Cập nhật máy bay thành công"
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
 *                   example: Cập nhật máy bay thành công
 *                 data:
 *                   $ref: '#/components/schemas/Airplane'
 *       400:
 *         description: "Mã máy bay đã tồn tại trong hệ thống"
 *       404:
 *         description: "Không tìm thấy máy bay với ID đã cung cấp"
 *       500:
 *         description: "Lỗi khi cập nhật máy bay"
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
 *         description: "ID của máy bay cần xóa"
 *     responses:
 *       200:
 *         description: "Xóa máy bay thành công"
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
 *                   example: Xóa máy bay thành công
 *       404:
 *         description: "Không tìm thấy máy bay với ID đã cung cấp"
 *       409:
 *         description: "Không thể xóa máy bay đang được sử dụng trong chuyến bay"
 *       500:
 *         description: "Lỗi khi xóa máy bay"
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