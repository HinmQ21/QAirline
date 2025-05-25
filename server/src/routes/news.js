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
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Tiêu đề tin tức"
 *               content:
 *                 type: string
 *                 description: "Nội dung tin tức"
 *               category:
 *                 type: string
 *                 enum: [introduction, promotion, announcement, news]
 *                 description: "Danh mục tin tức"
 *     responses:
 *       201:
 *         description: "Đã tạo tin tức thành công"
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
 *                   example: "Đã tạo tin tức thành công"
 *                 data:
 *                   type: object
 *       400:
 *         description: "Vui lòng cung cấp tiêu đề và nội dung tin tức / Danh mục không hợp lệ"
 *       500:
 *         description: "Đã xảy ra lỗi khi tạo tin tức"
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
 *         name: category
 *         schema:
 *           type: string
 *           enum: [introduction, promotion, announcement, news]
 *         description: "Lọc theo danh mục"
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     news:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: "Đã xảy ra lỗi khi lấy danh sách tin tức"
 */
router.get('/', newsController.getAllNews);

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
 *     responses:
 *       200:
 *         description: "Chi tiết bài viết tin tức"
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
 *       404:
 *         description: "Không tìm thấy tin tức"
 *       500:
 *         description: "Đã xảy ra lỗi khi lấy thông tin tin tức"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Tiêu đề tin tức"
 *               content:
 *                 type: string
 *                 description: "Nội dung tin tức"
 *               category:
 *                 type: string
 *                 enum: [introduction, promotion, announcement, news]
 *                 description: "Danh mục tin tức"
 *     responses:
 *       200:
 *         description: "Đã cập nhật tin tức thành công"
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
 *                   example: "Đã cập nhật tin tức thành công"
 *                 data:
 *                   type: object
 *       400:
 *         description: "Danh mục không hợp lệ"
 *       404:
 *         description: "Không tìm thấy tin tức"
 *       500:
 *         description: "Đã xảy ra lỗi khi cập nhật tin tức"
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
 *     responses:
 *       200:
 *         description: "Đã xóa tin tức thành công"
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
 *                   example: "Đã xóa tin tức thành công"
 *       404:
 *         description: "Không tìm thấy tin tức"
 *       500:
 *         description: "Đã xảy ra lỗi khi xóa tin tức"
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