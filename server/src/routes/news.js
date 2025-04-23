const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/news
 * @desc    Create a new news article
 * @access  Private (Admin only)
 */
router.post('/', authenticateAdmin, newsController.createNews);

/**
 * @route   GET /api/news
 * @desc    Get all news articles with pagination and filtering
 * @access  Public
 */
router.get('/', newsController.getAllNews);

/**
 * @route   GET /api/news/categories
 * @desc    Get all news categories
 * @access  Public
 */
router.get('/categories', newsController.getNewsCategories);

/**
 * @route   GET /api/news/:news_id
 * @desc    Get news article by ID
 * @access  Public
 */
router.get('/:news_id', newsController.getNewsById);

/**
 * @route   PUT /api/news/:news_id
 * @desc    Update a news article
 * @access  Private (Admin only)
 */
router.put('/:news_id', authenticateAdmin, newsController.updateNews);

/**
 * @route   DELETE /api/news/:news_id
 * @desc    Delete a news article
 * @access  Private (Admin only)
 */
router.delete('/:news_id', authenticateAdmin, newsController.deleteNews);

module.exports = router; 