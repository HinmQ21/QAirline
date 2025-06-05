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
 *   get:
 *     summary: Lấy cấu hình ghế của máy bay theo hạng ghế
 *     tags: [Airplanes, Seats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay"
 *         example: 1
 *       - in: query
 *         name: row
 *         schema:
 *           type: integer
 *         description: "Lọc theo một hàng cụ thể (tùy chọn)"
 *         example: 5
 *       - in: query
 *         name: start_row
 *         schema:
 *           type: integer
 *         description: "Lọc từ hàng số (tùy chọn, có thể dùng riêng hoặc kết hợp với end_row)"
 *         example: 5
 *       - in: query
 *         name: end_row
 *         schema:
 *           type: integer
 *         description: "Lọc đến hàng số (tùy chọn, cần kết hợp với start_row)"
 *         example: 10
 *     responses:
 *       200:
 *         description: "Cấu hình ghế của máy bay theo hạng ghế"
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
 *                     $ref: '#/components/schemas/SeatConfiguration'
 *             example:
 *               success: true
 *               data:
 *                 - airplane_id: 1
 *                   start_row: 1
 *                   end_row: 4
 *                   num_seats_per_row: 6
 *                   class: "first"
 *                 - airplane_id: 1
 *                   start_row: 5
 *                   end_row: 10
 *                   num_seats_per_row: 4
 *                   class: "business"
 *       404:
 *         description: "Không tìm thấy máy bay"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/:id/seats', airplaneController.getAirplaneSeats);

/**
 * @swagger
 * /api/airplanes/{id}/seats:
 *   post:
 *     summary: Cấu hình sơ đồ ghế cho máy bay theo hàng đơn hoặc dải hàng (yêu cầu quyền Admin)
 *     tags: [Airplanes, Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay cần cấu hình ghế"
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: "Cấu hình ghế cho một hàng hoặc dải hàng. Sẽ thay thế ghế hiện có trong hàng được chỉ định."
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/ConfigureSingleRowInput'
 *               - $ref: '#/components/schemas/ConfigureRowRangeInput'
 *           examples:
 *             configure_single_row:
 *               summary: "Cấu hình hàng 5"
 *               value:
 *                 row: 5
 *                 num_seats_per_row: 6
 *                 class: "first"
 *             configure_row_range:
 *               summary: "Cấu hình dải hàng 10-15"
 *               value:
 *                 start_row: 10
 *                 end_row: 15
 *                 num_seats_per_row: 4
 *                 class: "business"
 *     responses:
 *       200:
 *         description: "Cấu hình ghế thành công"
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
 *                   example: "Cấu hình ghế hàng 5 thành công"
 *                 total_seats_created:
 *                   type: integer
 *                   example: 6
 *                 configuration:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: string
 *                       example: "5"
 *                     num_seats_per_row:
 *                       type: integer
 *                       example: 6
 *                     class:
 *                       type: string
 *                       example: "first"
 *                     total_seats_in_range:
 *                       type: integer
 *                       example: 6
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ"
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
 *                     missing_required:
 *                       value: "Vui lòng cung cấp num_seats_per_row và class"
 *                     missing_row_info:
 *                       value: "Vui lòng cung cấp row (cho một hàng) hoặc start_row và end_row (cho dải hàng)"
 *                     invalid_row_range:
 *                       value: "start_row không được lớn hơn end_row"
 *                     invalid_seats_per_row:
 *                       value: "num_seats_per_row phải từ 1 đến 26"
 *                     invalid_class:
 *                       value: "class phải là economy, business hoặc first"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Admin"
 *       404:
 *         description: "Không tìm thấy máy bay"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/:id/seats', authenticateAdmin, airplaneController.configureSeatLayout);

/**
 * @swagger
 * /api/airplanes/{id}/seats:
 *   put:
 *     summary: Cập nhật cấu hình ghế theo hàng (yêu cầu quyền Admin)
 *     tags: [Airplanes, Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay"
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: "Cấu hình cập nhật ghế cho một hàng hoặc dải hàng. Có thể chỉ cập nhật class hoặc cả num_seats_per_row."
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/UpdateSingleRowInput'
 *               - $ref: '#/components/schemas/UpdateRowRangeInput'
 *           examples:
 *             update_single_row_class:
 *               summary: "Cập nhật hạng ghế cho hàng 5"
 *               value:
 *                 row: 5
 *                 class: "business"
 *             update_single_row_full:
 *               summary: "Cập nhật hoàn toàn hàng 3"
 *               value:
 *                 row: 3
 *                 num_seats_per_row: 4
 *                 class: "first"
 *             update_row_range:
 *               summary: "Cập nhật dải hàng 10-15"
 *               value:
 *                 start_row: 10
 *                 end_row: 15
 *                 num_seats_per_row: 6
 *                 class: "economy"
 *     responses:
 *       200:
 *         description: "Cập nhật ghế thành công"
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
 *                   example: "Cập nhật ghế hàng 5 thành công"
 *                 rows_affected:
 *                   type: string
 *                   example: "5"
 *                 seats_updated:
 *                   type: integer
 *                   example: 6
 *                 new_seats_created:
 *                   type: integer
 *                   example: 0
 *                 configuration:
 *                   type: object
 *                   properties:
 *                     num_seats_per_row:
 *                       type: integer
 *                       example: 4
 *                     class:
 *                       type: string
 *                       example: "business"
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ"
 *       404:
 *         description: "Không tìm thấy máy bay hoặc ghế trong hàng được chỉ định"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.put('/:id/seats', authenticateAdmin, airplaneController.updateSeatsByRow);

/**
 * @swagger
 * /api/airplanes/{id}/seats:
 *   delete:
 *     summary: Xóa ghế theo hàng (yêu cầu quyền Admin)
 *     tags: [Airplanes, Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của máy bay"
 *         example: 1
 *     requestBody:
 *       required: true
 *       description: "Xóa ghế của một hàng hoặc dải hàng. Chỉ có thể xóa ghế chưa được đặt."
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/DeleteSingleRowInput'
 *               - $ref: '#/components/schemas/DeleteRowRangeInput'
 *           examples:
 *             delete_single_row:
 *               summary: "Xóa hàng 5"
 *               value:
 *                 row: 5
 *             delete_row_range:
 *               summary: "Xóa dải hàng 10-15"
 *               value:
 *                 start_row: 10
 *                 end_row: 15
 *     responses:
 *       200:
 *         description: "Xóa ghế thành công"
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
 *                   example: "Xóa ghế hàng 5 thành công"
 *                 rows_deleted:
 *                   type: string
 *                   example: "5"
 *                 seats_deleted:
 *                   type: integer
 *                   example: 6
 *                 remaining_total_seats:
 *                   type: integer
 *                   example: 142
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ hoặc ghế đã được đặt"
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
 *                     missing_input:
 *                       value: "Vui lòng cung cấp row (cho một hàng) hoặc start_row và end_row (cho dải hàng)"
 *                     invalid_range:
 *                       value: "start_row không được lớn hơn end_row"
 *                     seats_booked:
 *                       value: "Không thể xóa ghế đã được đặt. Các ghế đã đặt: 5A, 5B"
 *       404:
 *         description: "Không tìm thấy máy bay hoặc ghế trong hàng được chỉ định"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.delete('/:id/seats', authenticateAdmin, airplaneController.deleteSeatsByRow);

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
 *     CreateAirplaneInput:
 *       type: object
 *       required:
 *         - model
 *         - registrationNumber
 *         - totalSeats
 *       properties:
 *         model:
 *           type: string
 *         registrationNumber:
 *           type: string
 *           description: "Số hiệu đăng ký duy nhất"
 *         totalSeats:
 *           type: integer
 *           description: "Tổng số ghế"
 *     UpdateAirplaneInput:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *         totalSeats:
 *           type: integer
 *     SeatConfiguration:
 *       type: object
 *       properties:
 *         airplane_id:
 *           type: integer
 *           description: "ID của máy bay"
 *           example: 1
 *         start_row:
 *           type: integer
 *           description: "Hàng bắt đầu của hạng ghế"
 *           example: 1
 *         end_row:
 *           type: integer
 *           description: "Hàng kết thúc của hạng ghế"
 *           example: 20
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng"
 *           example: 6
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế"
 *           example: "economy"
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
 *     RowConfigurationInput:
 *       type: object
 *       required:
 *         - start_row
 *         - end_row
 *         - num_seats_per_row
 *         - class
 *       properties:
 *         start_row:
 *           type: integer
 *           description: "Hàng bắt đầu (từ 1 trở lên)"
 *           example: 1
 *           minimum: 1
 *         end_row:
 *           type: integer
 *           description: "Hàng kết thúc (phải >= start_row)"
 *           example: 20
 *           minimum: 1
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng (từ 1 đến 26, tương ứng A-Z)"
 *           example: 6
 *           minimum: 1
 *           maximum: 26
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế"
 *           example: "economy"
 *     UpdateSingleRowInput:
 *       type: object
 *       required:
 *         - row
 *       properties:
 *         row:
 *           type: integer
 *           description: "Số hàng cần cập nhật"
 *           example: 5
 *           minimum: 1
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng (tùy chọn, từ 1 đến 26)"
 *           example: 4
 *           minimum: 1
 *           maximum: 26
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế (tùy chọn)"
 *           example: "business"
 *     UpdateRowRangeInput:
 *       type: object
 *       required:
 *         - start_row
 *         - end_row
 *       properties:
 *         start_row:
 *           type: integer
 *           description: "Hàng bắt đầu"
 *           example: 10
 *           minimum: 1
 *         end_row:
 *           type: integer
 *           description: "Hàng kết thúc"
 *           example: 15
 *           minimum: 1
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng (tùy chọn, từ 1 đến 26)"
 *           example: 6
 *           minimum: 1
 *           maximum: 26
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế (tùy chọn)"
 *           example: "economy"
 *     DeleteSingleRowInput:
 *       type: object
 *       required:
 *         - row
 *       properties:
 *         row:
 *           type: integer
 *           description: "Số hàng cần xóa"
 *           example: 5
 *           minimum: 1
 *     DeleteRowRangeInput:
 *       type: object
 *       required:
 *         - start_row
 *         - end_row
 *       properties:
 *         start_row:
 *           type: integer
 *           description: "Hàng bắt đầu xóa"
 *           example: 10
 *           minimum: 1
 *         end_row:
 *           type: integer
 *           description: "Hàng kết thúc xóa"
 *           example: 15
 *           minimum: 1
 *     ConfigureSingleRowInput:
 *       type: object
 *       required:
 *         - row
 *         - num_seats_per_row
 *         - class
 *       properties:
 *         row:
 *           type: integer
 *           description: "Số hàng cần cấu hình"
 *           example: 5
 *           minimum: 1
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng (từ 1 đến 26, tương ứng A-Z)"
 *           example: 6
 *           minimum: 1
 *           maximum: 26
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế"
 *           example: "first"
 *     ConfigureRowRangeInput:
 *       type: object
 *       required:
 *         - start_row
 *         - end_row
 *         - num_seats_per_row
 *         - class
 *       properties:
 *         start_row:
 *           type: integer
 *           description: "Hàng bắt đầu cấu hình"
 *           example: 10
 *           minimum: 1
 *         end_row:
 *           type: integer
 *           description: "Hàng kết thúc cấu hình"
 *           example: 15
 *           minimum: 1
 *         num_seats_per_row:
 *           type: integer
 *           description: "Số ghế mỗi hàng (từ 1 đến 26, tương ứng A-Z)"
 *           example: 4
 *           minimum: 1
 *           maximum: 26
 *         class:
 *           type: string
 *           enum: [economy, business, first]
 *           description: "Hạng ghế"
 *           example: "business"
 */

module.exports = router; 