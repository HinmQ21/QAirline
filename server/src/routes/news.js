const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Tạo bài viết tin tức mới
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNewsInput'
 *           example:
 *             title: "QAirline mở đường bay mới đến Phú Quốc"
 *             content: "QAirline vừa công bố mở đường bay mới từ Hà Nội đến Phú Quốc từ tháng 6/2024..."
 *             summary: "Đường bay mới từ Hà Nội đến Phú Quốc sẽ hoạt động từ tháng 6/2024"
 *             categoryId: 1
 *             imageUrl: "https://example.com/images/phu-quoc.jpg"
 *             isPublished: true
 *     responses:
 *       201:
 *         description: "Tạo bài viết tin tức thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Admin"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.post('/', authenticateAdmin, newsController.createNews);

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Lấy danh sách bài viết tin tức với phân trang và lọc
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Số trang"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Số lượng bài viết trên mỗi trang"
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: "Lọc theo ID danh mục"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Tìm kiếm theo tiêu đề hoặc nội dung"
 *     responses:
 *       200:
 *         description: "Danh sách bài viết tin tức"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/', newsController.getAllNews);

/**
 * @swagger
 * /api/news/categories:
 *   get:
 *     summary: Lấy tất cả danh mục tin tức
 *     tags: [News]
 *     responses:
 *       200:
 *         description: "Danh sách danh mục tin tức"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewsCategory'
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/categories', newsController.getNewsCategories);

/**
 * @swagger
 * /api/news/{news_id}:
 *   get:
 *     summary: Lấy bài viết tin tức theo ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của bài viết tin tức"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Chi tiết bài viết tin tức"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       404:
 *         description: "Không tìm thấy bài viết tin tức"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.get('/:news_id', newsController.getNewsById);

/**
 * @swagger
 * /api/news/{news_id}:
 *   put:
 *     summary: Cập nhật bài viết tin tức
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của bài viết tin tức cần cập nhật"
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNewsInput'
 *           example:
 *             title: "QAirline mở đường bay mới đến Phú Quốc - Cập nhật"
 *             content: "Nội dung đã được cập nhật..."
 *             isPublished: false
 *     responses:
 *       200:
 *         description: "Cập nhật bài viết tin tức thành công"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       400:
 *         description: "Dữ liệu đầu vào không hợp lệ"
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Admin"
 *       404:
 *         description: "Không tìm thấy bài viết tin tức"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.put('/:news_id', authenticateAdmin, newsController.updateNews);

/**
 * @swagger
 * /api/news/{news_id}:
 *   delete:
 *     summary: Xóa bài viết tin tức
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID của bài viết tin tức cần xóa"
 *         example: 1
 *     responses:
 *       200:
 *         description: "Xóa bài viết tin tức thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bài viết tin tức đã được xóa thành công
 *       401:
 *         description: "Chưa xác thực hoặc token không hợp lệ"
 *       403:
 *         description: "Không có quyền Admin"
 *       404:
 *         description: "Không tìm thấy bài viết tin tức"
 *       500:
 *         description: "Lỗi máy chủ"
 */
router.delete('/:news_id', authenticateAdmin, newsController.deleteNews);

/**
 * @swagger
 * tags:
 *   name: News
 *   description: "Quản lý tin tức và bài viết"
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "QAirline mở đường bay mới đến Phú Quốc"
 *         content:
 *           type: string
 *           example: "QAirline vừa công bố mở đường bay mới từ Hà Nội đến Phú Quốc từ tháng 6/2024..."
 *         summary:
 *           type: string
 *           example: "Đường bay mới từ Hà Nội đến Phú Quốc sẽ hoạt động từ tháng 6/2024"
 *         categoryId:
 *           type: integer
 *           example: 1
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/images/phu-quoc.jpg"
 *         isPublished:
 *           type: boolean
 *           example: true
 *         createdBy:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/NewsCategory'
 *     NewsCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Tin tức công ty"
 *         description:
 *           type: string
 *           example: "Các thông tin về hoạt động của QAirline"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateNewsInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           description: "Tiêu đề bài viết"
 *         content:
 *           type: string
 *           description: "Nội dung đầy đủ của bài viết"
 *         summary:
 *           type: string
 *           description: "Tóm tắt ngắn gọn của bài viết"
 *         categoryId:
 *           type: integer
 *           description: "ID của danh mục tin tức"
 *         imageUrl:
 *           type: string
 *           description: "URL hình ảnh đại diện cho bài viết"
 *         isPublished:
 *           type: boolean
 *           description: "Trạng thái xuất bản (mặc định: false)"
 *           default: false
 *     UpdateNewsInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: "Tiêu đề bài viết"
 *         content:
 *           type: string
 *           description: "Nội dung đầy đủ của bài viết"
 *         summary:
 *           type: string
 *           description: "Tóm tắt ngắn gọn của bài viết"
 *         categoryId:
 *           type: integer
 *           description: "ID của danh mục tin tức"
 *         imageUrl:
 *           type: string
 *           description: "URL hình ảnh đại diện cho bài viết"
 *         isPublished:
 *           type: boolean
 *           description: "Trạng thái xuất bản"
 */

module.exports = router;