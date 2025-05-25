const { News, Admin } = require('../models');
const { Op } = require('sequelize');

// Create news article
exports.createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tiêu đề và nội dung tin tức'
      });
    }
    
    // Check if category is valid
    const validCategories = ['introduction', 'promotion', 'announcement', 'news'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không hợp lệ'
      });
    }
    
    // Create news article
    const news = await News.create({
      title,
      content,
      category: category || 'news',
      created_by: req.admin.admin_id
    });
    
    res.status(201).json({
      success: true,
      message: 'Đã tạo tin tức thành công',
      data: news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo tin tức',
      error: error.message
    });
  }
};

// Get all news articles with pagination and filtering
exports.getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;
    
    // Build where clause
    const whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get news with pagination
    const { count, rows: news } = await News.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Admin,
          as: 'admin',
          attributes: ['username', 'full_name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.status(200).json({
      success: true,
      data: {
        news,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách tin tức',
      error: error.message
    });
  }
};

// Get news article by ID
exports.getNewsById = async (req, res) => {
  try {
    const { news_id } = req.params;
    
    const news = await News.findByPk(news_id, {
      include: [
        {
          model: Admin,
          as: 'admin',
          attributes: ['username', 'full_name']
        }
      ]
    });
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức'
      });
    }
    
    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin tin tức',
      error: error.message
    });
  }
};

// Update news article
exports.updateNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    const { title, content, category } = req.body;
    
    // Find news article
    const news = await News.findByPk(news_id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức'
      });
    }
    
    // Check if category is valid
    if (category) {
      const validCategories = ['introduction', 'promotion', 'announcement', 'news'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục không hợp lệ'
        });
      }
    }
    
    // Update news article
    await news.update({
      title: title || news.title,
      content: content || news.content,
      category: category || news.category
    });
    
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật tin tức thành công',
      data: news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật tin tức',
      error: error.message
    });
  }
};

// Delete news article
exports.deleteNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    
    // Find news article
    const news = await News.findByPk(news_id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tức'
      });
    }
    
    // Delete news article
    await news.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa tin tức thành công'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa tin tức',
      error: error.message
    });
  }
};
