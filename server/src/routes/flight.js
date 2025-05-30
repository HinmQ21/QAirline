const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight');
const { authenticateAdmin, checkFlightManagerPermission } = require('../middleware/auth');

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Lấy danh sách tất cả chuyến bay hoặc lọc theo điều kiện
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: flight_number
 *         schema:
 *           type: string
 *         description: "Số hiệu chuyến bay"
 *       - in: query
 *         name: departure_airport
 *         schema:
 *           type: integer
 *         description: "ID của sân bay đi"
 *       - in: query
 *         name: arrival_airport
 *         schema:
 *           type: integer
 *         description: "ID của sân bay đến"
 *       - in: query
 *         name: departure_date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Ngày khởi hành (YYYY-MM-DD)"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, delayed, cancelled]
 *         description: "Trạng thái chuyến bay"
 *     responses:
 *       200:
 *         description: "Danh sách chuyến bay"
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
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: "Đã xảy ra lỗi khi lấy danh sách chuyến bay"
 */
router.get('/', flightController.getAllFlights);

/**
 * @swagger
 * /api/flights/search:
 *   get:
 *     summary: Tìm chuyến bay theo thời gian và sân bay (đi/đến)
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: departureAirportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của sân bay đi."
 *         example: 1
 *       - in: query
 *         name: arrivalAirportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của sân bay đến."
 *         example: 2
 *       - in: query
 *         name: departureDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "Ngày khởi hành (YYYY-MM-DD)."
 *         example: 2024-08-15
 *     responses:
 *       200:
 *         description: "Danh sách chuyến bay phù hợp"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flight'
 *       400:
 *         description: "Thiếu tham số tìm kiếm"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/search', flightController.getFlightsByTimeAndAirport);

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một chuyến bay theo ID
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của chuyến bay"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Thông tin chi tiết chuyến bay."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       404:
 *         description: "Không tìm thấy chuyến bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.get('/:id', flightController.getFlightById);

/**
 * @swagger
 * /api/flights:
 *   post:
 *     summary: Tạo chuyến bay mới (yêu cầu quyền Admin/Flight Manager)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: [] # Requires JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFlightInput'
 *           example:
 *             flight_number: "VN256"
 *             airplane_id: 3
 *             departure_airport_id: 1
 *             arrival_airport_id: 2
 *             departure_time: "2024-08-15T10:00:00Z"
 *             arrival_time: "2024-08-15T12:00:00Z"
 *             status: "scheduled"
 *     responses:
 *       201:
 *         description: "Tạo chuyến bay thành công."
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
 *                   example: "Tạo chuyến bay thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Flight'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ."
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
 *                   examples:
 *                     missing_fields:
 *                       value: "Vui lòng cung cấp đầy đủ thông tin chuyến bay"
 *                     same_airports:
 *                       value: "Sân bay khởi hành và đến không được trùng nhau"
 *                     invalid_time:
 *                       value: "Thời gian đến phải sau thời gian khởi hành"
 *                     duplicate_flight:
 *                       value: "Mã chuyến bay đã tồn tại trong hệ thống"
 *       404:
 *         description: "Không tìm thấy tài nguyên liên quan."
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
 *                   examples:
 *                     airplane_not_found:
 *                       value: "Không tìm thấy máy bay"
 *                     departure_airport_not_found:
 *                       value: "Không tìm thấy sân bay khởi hành"
 *                     arrival_airport_not_found:
 *                       value: "Không tìm thấy sân bay đến"
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.post('/',
  authenticateAdmin,
  checkFlightManagerPermission,
  flightController.createFlight
);

/**
 * @swagger
 * /api/flights/{id}:
 *   put:
 *     summary: Cập nhật thông tin chuyến bay (yêu cầu quyền Admin/Flight Manager)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: [] # Requires JWT token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của chuyến bay cần cập nhật."
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFlightInput' # Assume schema is defined
 *           example:
 *             departureTime: 2024-08-15T10:30:00Z
 *             arrivalTime: 2024-08-15T12:30:00Z
 *             basePrice: 1600000
 *             status: On Time # Example: On Time, Delayed, Cancelled
 *     responses:
 *       200:
 *         description: "Cập nhật chuyến bay thành công."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flight'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền thực hiện hành động này."
 *       404:
 *         description: "Không tìm thấy chuyến bay."
 *       500:
 *         description: "Lỗi máy chủ."
 *     description: |
 *       "Cập nhật thông tin của chuyến bay. 
 *       Khi trạng thái chuyến bay được cập nhật thành "delay" hoặc "cancelled", hệ thống sẽ tự động tạo
 *       thông báo (notifications) cho tất cả khách hàng đã đặt vé chuyến bay này."
 */
router.put('/:id', 
  authenticateAdmin, 
  checkFlightManagerPermission, 
  flightController.updateFlight
);

/**
 * @swagger
 * /api/flights/{id}:
 *   delete:
 *     summary: Xóa chuyến bay (yêu cầu quyền Admin/Flight Manager)
 *     tags: [Flights]
 *     security:
 *       - bearerAuth: [] # Requires JWT token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của chuyến bay cần xóa."
 *         example: 1
 *     responses:
 *       200:
 *         description: "Xóa chuyến bay thành công."
 *         content:
 *           application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "Chuyến bay đã được xóa thành công."
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ."
 *       403:
 *         description: "Không có quyền thực hiện hành động này."
 *       404:
 *         description: "Không tìm thấy chuyến bay."
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.delete('/:id',
  authenticateAdmin,
  checkFlightManagerPermission,
  flightController.deleteFlight
);

/**
 * @swagger
 * /api/flights/paged:
 *   post:
 *     summary: Lấy danh sách chuyến bay theo phân trang
 *     tags: [Flights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageSize:
 *                 type: integer
 *                 description: "Số lượng bản ghi mỗi trang"
 *                 default: 10
 *                 example: 10
 *               pageNumber:
 *                 type: integer
 *                 description: "Số trang hiện tại"
 *                 default: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: "Danh sách chuyến bay phân trang."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flight'
 *       500:
 *         description: "Lỗi máy chủ."
 */
router.post('/paged', flightController.getFlightPaged);

/**
 * @swagger
 * tags:
 *   name: Flights
 *   description: "Quản lý các chuyến bay"
 * components:
 *   schemas:
 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID của chuyến bay"
 *           example: 1
 *         flightNumber:
 *           type: string
 *           description: "Số hiệu chuyến bay"
 *           example: VN256
 *         departureAirportId:
 *           type: integer
 *           description: "ID sân bay đi"
 *           example: 1
 *         arrivalAirportId:
 *           type: integer
 *           description: "ID sân bay đến"
 *           example: 2
 *         departureTime:
 *           type: string
 *           format: date-time
 *           description: "Thời gian khởi hành dự kiến"
 *           example: 2024-08-15T10:00:00Z
 *         arrivalTime:
 *           type: string
 *           format: date-time
 *           description: "Thời gian đến dự kiến"
 *           example: 2024-08-15T12:00:00Z
 *         airplaneId:
 *           type: integer
 *           description: "ID máy bay thực hiện chuyến bay"
 *           example: 3
 *         basePrice:
 *           type: number
 *           format: float
 *           description: "Giá vé cơ bản"
 *           example: 1500000
 *         status:
 *           type: string
 *           description: "Trạng thái chuyến bay"
 *           example: On Time
 *         airline:
 *           type: string
 *           description: "Hãng hàng không"
 *           example: Vietnam Airlines
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         # You might want to add populated airport/airplane details here if returned by the API
 *         # departureAirport: 
 *         #   $ref: '#/components/schemas/Airport' 
 *         # arrivalAirport:
 *         #   $ref: '#/components/schemas/Airport'
 *         # airplane:
 *         #   $ref: '#/components/schemas/Airplane'
 *     CreateFlightInput:
 *       type: object
 *       required:
 *         - flight_number
 *         - airplane_id
 *         - departure_airport_id
 *         - arrival_airport_id
 *         - departure_time
 *         - arrival_time
 *       properties:
 *         flight_number:
 *           type: string
 *           description: "Số hiệu chuyến bay (phải duy nhất)"
 *           example: "VN256"
 *         airplane_id:
 *           type: integer
 *           description: "ID của máy bay (phải tồn tại trong hệ thống)"
 *           example: 3
 *         departure_airport_id:
 *           type: integer
 *           description: "ID của sân bay khởi hành (phải tồn tại và khác sân bay đến)"
 *           example: 1
 *         arrival_airport_id:
 *           type: integer
 *           description: "ID của sân bay đến (phải tồn tại và khác sân bay khởi hành)"
 *           example: 2
 *         departure_time:
 *           type: string
 *           format: date-time
 *           description: "Thời gian khởi hành dự kiến (phải trước thời gian đến)"
 *           example: "2024-08-15T10:00:00Z"
 *         arrival_time:
 *           type: string
 *           format: date-time
 *           description: "Thời gian đến dự kiến (phải sau thời gian khởi hành)"
 *           example: "2024-08-15T12:00:00Z"
 *         status:
 *           type: string
 *           enum: [scheduled, delayed, cancelled]
 *           description: "Trạng thái chuyến bay (mặc định: scheduled)"
 *           example: "scheduled"
 *           default: "scheduled"
 *     UpdateFlightInput:
 *        type: object
 *        properties:
 *          departureTime:
 *             type: string
 *             format: date-time
 *          arrivalTime:
 *              type: string
 *              format: date-time
 *          basePrice:
 *              type: number
 *              format: float
 *          status:
 *              type: string
 *              enum: [scheduled, delayed, cancelled]
 *              description: |
 *                "Trạng thái chuyến bay. Khi được cập nhật thành "delay" hoặc "cancelled",
 *                hệ thống sẽ tự động tạo thông báo cho tất cả khách hàng đã đặt vé."
 *          flight_number:
 *              type: string
 *          airplane_id:
 *              type: integer
 *          departure_airport_id:
 *              type: integer
 *          arrival_airport_id:
 *              type: integer
 * 
 */

module.exports = router;