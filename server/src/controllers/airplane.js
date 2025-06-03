const { Airplane, Seat } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new airplane
 * @route   POST /api/airplanes
 * @access  Private (Admin only)
 */
exports.createAirplane = async (req, res) => {
  try {
    const { code, manufacturer, model, total_seats, seat_configuration } = req.body;

    // Validate required fields
    if (!code || !total_seats) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã máy bay và tổng số ghế'
      });
    }

    // Check if airplane code already exists
    const existingAirplane = await Airplane.findOne({ where: { code } });
    if (existingAirplane) {
      return res.status(400).json({
        success: false,
        message: 'Mã máy bay đã tồn tại trong hệ thống'
      });
    }

    // Create airplane
    const airplane = await Airplane.create({
      code,
      manufacturer,
      model,
      total_seats
    });

    // If seat configuration is provided, create seats
    if (seat_configuration && Array.isArray(seat_configuration)) {
      const seats = [];
      
      for (const seatConfig of seat_configuration) {
        const { seat_number, class: seatClass } = seatConfig;
        
        if (!seat_number) {
          continue;
        }
        
        seats.push({
          airplane_id: airplane.airplane_id,
          seat_number,
          class: seatClass || 'economy',
          is_available: true
        });
      }
      
      if (seats.length > 0) {
        await Seat.bulkCreate(seats);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo máy bay thành công',
      data: airplane
    });
  } catch (error) {
    console.error('Error creating airplane:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get all airplanes
 * @route   GET /api/airplanes
 * @access  Public
 */
exports.getAirplanes = async (req, res) => {
  try {
    const { code, manufacturer, model } = req.query;
    
    // Build filter object
    const filter = {};
    if (code) filter.code = code;
    if (manufacturer) filter.manufacturer = { [Op.like]: `%${manufacturer}%` };
    if (model) filter.model = { [Op.like]: `%${model}%` };

    const airplanes = await Airplane.findAll({ 
      where: filter,
      order: [['code', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: airplanes.length,
      data: airplanes
    });
  } catch (error) {
    console.error('Error fetching airplanes:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get single airplane by ID
 * @route   GET /api/airplanes/:id
 * @access  Public
 */
exports.getAirplaneById = async (req, res) => {
  try {
    const airplane = await Airplane.findByPk(req.params.id);

    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }

    res.status(200).json({
      success: true,
      data: airplane
    });
  } catch (error) {
    console.error('Error fetching airplane:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};



/**
 * @desc    Update airplane
 * @route   PUT /api/airplanes/:id
 * @access  Private (Admin only)
 */
exports.updateAirplane = async (req, res) => {
  try {
    const { code, manufacturer, model, total_seats } = req.body;
    
    let airplane = await Airplane.findByPk(req.params.id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }

    // If code is being changed, check if new code already exists
    if (code && code !== airplane.code) {
      const existingAirplane = await Airplane.findOne({ where: { code } });
      if (existingAirplane) {
        return res.status(400).json({
          success: false,
          message: 'Mã máy bay đã tồn tại trong hệ thống'
        });
      }
    }

    // Update airplane
    await airplane.update({
      code: code || airplane.code,
      manufacturer: manufacturer !== undefined ? manufacturer : airplane.manufacturer,
      model: model !== undefined ? model : airplane.model,
      total_seats: total_seats || airplane.total_seats
    });

    res.status(200).json({
      success: true,
      message: 'Cập nhật máy bay thành công',
      data: airplane
    });
  } catch (error) {
    console.error('Error updating airplane:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Delete airplane
 * @route   DELETE /api/airplanes/:id
 * @access  Private (Admin only)
 */
exports.deleteAirplane = async (req, res) => {
  try {
    const airplane = await Airplane.findByPk(req.params.id);

    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }

    // Check if airplane is assigned to any flights
    const flightCount = await airplane.countFlights();
    if (flightCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Máy bay hiện đang được sử dụng trong các chuyến bay và không thể xóa'
      });
    }

    // Delete associated seats first
    await Seat.destroy({ where: { airplane_id: airplane.airplane_id } });
    
    // Delete airplane
    await airplane.destroy();

    res.status(200).json({
      success: true,
      message: 'Đã xóa máy bay thành công'
    });
  } catch (error) {
    console.error('Error deleting airplane:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Configure seats for an airplane
 * @route   POST /api/airplanes/:id/seats
 * @access  Private (Admin only)
 */
exports.configureSeatLayout = async (req, res) => {
  try {
    const seats = req.body;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp danh sách ghế hợp lệ'
      });
    }
    
    const airplane = await Airplane.findByPk(req.params.id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    // Delete existing seats
    await Seat.destroy({ where: { airplane_id: airplane.airplane_id } });
    
    // Create new seats
    const seatsToCreate = seats.map(seat => ({
      airplane_id: airplane.airplane_id,
      seat_number: seat.seat_number,
      class: seat.class || 'economy',
      is_available: seat.is_available !== undefined ? seat.is_available : true
    }));
    
    await Seat.bulkCreate(seatsToCreate);
    
    // Update total_seats in airplane
    await airplane.update({ total_seats: seatsToCreate.length });
    
    res.status(200).json({
      success: true,
      message: 'Cấu hình ghế cho máy bay thành công',
      count: seatsToCreate.length
    });
  } catch (error) {
    console.error('Error configuring seats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cấu hình ghế cho máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get all seats for an airplane
 * @route   GET /api/airplanes/:id/seats
 * @access  Public
 */
exports.getAirplaneSeats = async (req, res) => {
  try {
    const airplane = await Airplane.findByPk(req.params.id);
    
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    const seats = await Seat.findAll({
      where: { airplane_id: airplane.airplane_id },
      order: [['seat_number', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: seats.length,
      data: seats
    });
  } catch (error) {
    console.error('Error fetching airplane seats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ghế của máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};
