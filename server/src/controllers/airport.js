const { Airport } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new airport
 * @route   POST /api/airports
 * @access  Private (Admin only)
 */
exports.createAirport = async (req, res) => {
  try {
    const { code, name, city, country } = req.body;

    // Simple validation
    if (!code || !name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã sân bay và tên sân bay'
      });
    }

    // Check if airport code already exists
    const existingAirport = await Airport.findOne({ where: { code } });
    if (existingAirport) {
      return res.status(400).json({
        success: false,
        message: 'Mã sân bay đã tồn tại trong hệ thống'
      });
    }

    const airport = await Airport.create({
      code,
      name,
      city,
      country
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sân bay thành công',
      data: airport
    });
  } catch (error) {
    console.error('Error creating airport:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sân bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get all airports with optional filters
 * @route   GET /api/airports
 * @access  Public
 */
exports.getAirports = async (req, res) => {
  try {
    const { code, name, city, country } = req.query;
    
    // Build filter object
    const filter = {};
    if (code) filter.code = code;
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (city) filter.city = { [Op.like]: `%${city}%` };
    if (country) filter.country = { [Op.like]: `%${country}%` };

    const airports = await Airport.findAll({ 
      where: filter,
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: airports.length,
      data: airports
    });
  } catch (error) {
    console.error('Error fetching airports:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sân bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get single airport by ID
 * @route   GET /api/airports/:id
 * @access  Public
 */
exports.getAirportById = async (req, res) => {
  try {
    const airport = await Airport.findByPk(req.params.id);

    if (!airport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay với ID đã cung cấp'
      });
    }

    res.status(200).json({
      success: true,
      data: airport
    });
  } catch (error) {
    console.error('Error fetching airport:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sân bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Update airport
 * @route   PUT /api/airports/:id
 * @access  Private (Admin only)
 */
exports.updateAirport = async (req, res) => {
  try {
    const { code, name, city, country } = req.body;
    
    // Check if airport exists
    let airport = await Airport.findByPk(req.params.id);
    if (!airport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay với ID đã cung cấp'
      });
    }

    // If code is being changed, check if new code already exists
    if (code && code !== airport.code) {
      const existingAirport = await Airport.findOne({ where: { code } });
      if (existingAirport) {
        return res.status(400).json({
          success: false,
          message: 'Mã sân bay đã tồn tại trong hệ thống'
        });
      }
    }

    // Update airport
    await airport.update({
      code: code || airport.code,
      name: name || airport.name,
      city: city !== undefined ? city : airport.city,
      country: country !== undefined ? country : airport.country
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật sân bay thành công',
      data: airport
    });
  } catch (error) {
    console.error('Error updating airport:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sân bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Delete airport
 * @route   DELETE /api/airports/:id
 * @access  Private (Admin only)
 */
exports.deleteAirport = async (req, res) => {
  try {
    const airport = await Airport.findByPk(req.params.id);

    if (!airport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay với ID đã cung cấp'
      });
    }

    await airport.destroy();

    res.status(200).json({
      success: true,
      message: 'Đã xóa sân bay thành công'
    });
  } catch (error) {
    console.error('Error deleting airport:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sân bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};
