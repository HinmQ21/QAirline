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
 * @desc    Configure seats for an airplane by single row or row range
 * @route   POST /api/airplanes/:id/seats
 * @access  Private (Admin only)
 */
exports.configureSeatLayout = async (req, res) => {
  try {
    const { row, start_row, end_row, num_seats_per_row, class: seatClass } = req.body;

    if (!num_seats_per_row || !seatClass) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp num_seats_per_row và class'
      });
    }
    
    const airplane = await Airplane.findByPk(req.params.id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    // Validate input - either single row or row range
    let targetStartRow, targetEndRow;
    
    if (row) {
      targetStartRow = targetEndRow = parseInt(row);
    } else if (start_row && end_row) {
      targetStartRow = parseInt(start_row);
      targetEndRow = parseInt(end_row);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp row (cho một hàng) hoặc start_row và end_row (cho dải hàng)'
      });
    }
    
    if (targetStartRow > targetEndRow) {
      return res.status(400).json({
        success: false,
        message: 'start_row không được lớn hơn end_row'
      });
    }
    
    if (num_seats_per_row <= 0 || num_seats_per_row > 26) {
      return res.status(400).json({
        success: false,
        message: 'num_seats_per_row phải từ 1 đến 26'
      });
    }
    
    if (!['economy', 'business', 'first'].includes(seatClass)) {
      return res.status(400).json({
        success: false,
        message: 'class phải là economy, business hoặc first'
      });
    }
    
    // Delete existing seats in the specified rows
    const existingSeats = await Seat.findAll({
      where: { airplane_id: airplane.airplane_id }
    });
    
    const seatsToDelete = existingSeats.filter(seat => {
      const rowMatch = seat.seat_number.match(/^(\d+)/);
      if (rowMatch) {
        const rowNumber = parseInt(rowMatch[1]);
        return rowNumber >= targetStartRow && rowNumber <= targetEndRow;
      }
      return false;
    });
    
    if (seatsToDelete.length > 0) {
      await Seat.destroy({
        where: {
          airplane_id: airplane.airplane_id,
          seat_id: { [Op.in]: seatsToDelete.map(s => s.seat_id) }
        }
      });
    }
    
    // Generate seats based on row configuration
    const seatsToCreate = [];
    const seatLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let rowNum = targetStartRow; rowNum <= targetEndRow; rowNum++) {
      for (let seatIndex = 0; seatIndex < num_seats_per_row; seatIndex++) {
        const seatLetter = seatLetters[seatIndex];
        const seatNumber = `${rowNum}${seatLetter}`;
        
        seatsToCreate.push({
          airplane_id: airplane.airplane_id,
          seat_number: seatNumber,
          class: seatClass,
          is_available: true
        });
      }
    }
    
    // Create new seats
    await Seat.bulkCreate(seatsToCreate);
    
    // Update total_seats in airplane
    const totalSeats = await Seat.count({ where: { airplane_id: airplane.airplane_id } });
    await airplane.update({ total_seats: totalSeats });
    
    res.status(200).json({
      success: true,
      message: `Cấu hình ghế hàng ${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''} thành công`,
      total_seats_created: seatsToCreate.length,
      configuration: {
        rows: `${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''}`,
        num_seats_per_row: num_seats_per_row,
        class: seatClass,
        total_seats_in_range: seatsToCreate.length
      }
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
 * @desc    Get seats configuration for an airplane by class
 * @route   GET /api/airplanes/:id/seats?row=5 or ?start_row=5&end_row=10
 * @access  Public
 */
exports.getAirplaneSeats = async (req, res) => {
  try {
    const { row, start_row, end_row } = req.query;
    const airplane = await Airplane.findByPk(req.params.id);
    
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    // Get all seats for the airplane
    const seats = await Seat.findAll({
      where: { airplane_id: airplane.airplane_id },
      order: [['seat_number', 'ASC']]
    });
    
    if (seats.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Determine row range for filtering
    let targetStartRow, targetEndRow;
    
    if (row) {
      targetStartRow = targetEndRow = parseInt(row);
    } else if (start_row && end_row) {
      targetStartRow = parseInt(start_row);
      targetEndRow = parseInt(end_row);
    } else if (start_row) {
      targetStartRow = parseInt(start_row);
      targetEndRow = null; // filter from start_row onwards
    }
    
    // Filter seats by row if specified
    let filteredSeats = seats;
    if (targetStartRow) {
      filteredSeats = seats.filter(seat => {
        // Extract row number from seat_number (e.g., "1A" -> 1, "12F" -> 12)
        const rowMatch = seat.seat_number.match(/^(\d+)/);
        const rowNumber = rowMatch ? parseInt(rowMatch[1]) : 0;
        
        if (targetEndRow) {
          return rowNumber >= targetStartRow && rowNumber <= targetEndRow;
        } else {
          return rowNumber >= targetStartRow;
        }
      });
    }
    
    // Group seats by class and calculate row ranges
    const seatsByClass = {};
    
    filteredSeats.forEach(seat => {
      const seatClass = seat.class;
      // Extract row number from seat_number (e.g., "1A" -> 1, "12F" -> 12)
      const rowMatch = seat.seat_number.match(/^(\d+)/);
      const rowNumber = rowMatch ? parseInt(rowMatch[1]) : 0;
      
      if (!seatsByClass[seatClass]) {
        seatsByClass[seatClass] = {
          rows: [],
          seats: []
        };
      }
      
      seatsByClass[seatClass].rows.push(rowNumber);
      seatsByClass[seatClass].seats.push(seat);
    });
    
    // Calculate configuration for each class
    const result = [];
    
    Object.keys(seatsByClass).forEach(seatClass => {
      const classData = seatsByClass[seatClass];
      const rows = [...new Set(classData.rows)].sort((a, b) => a - b);
      
      if (rows.length > 0) {
        // Calculate seats per row by finding the most common number of seats per row
        const seatsPerRowCount = {};
        rows.forEach(row => {
          const seatsInRow = classData.seats.filter(seat => {
            const seatRow = parseInt(seat.seat_number.match(/^(\d+)/)?.[1] || 0);
            return seatRow === row;
          }).length;
          
          seatsPerRowCount[seatsInRow] = (seatsPerRowCount[seatsInRow] || 0) + 1;
        });
        
        // Get the most common seats per row
        const numSeatsPerRow = parseInt(Object.keys(seatsPerRowCount).reduce((a, b) => 
          seatsPerRowCount[a] > seatsPerRowCount[b] ? a : b
        ));
        
        result.push({
          airplane_id: airplane.airplane_id,
          start_row: Math.min(...rows),
          end_row: Math.max(...rows),
          num_seats_per_row: numSeatsPerRow,
          class: seatClass
        });
      }
    });
    
    res.status(200).json({
      success: true,
      // count: result.length,
      data: result
    });
  } catch (error) {
    console.error('Error fetching airplane seats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình ghế của máy bay',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Update seats configuration by row or row range
 * @route   PUT /api/airplanes/:id/seats
 * @access  Private (Admin only)
 */
exports.updateSeatsByRow = async (req, res) => {
  try {
    const { row, start_row, end_row, num_seats_per_row, class: seatClass } = req.body;
    
    const airplane = await Airplane.findByPk(req.params.id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    // Validate input - either single row or row range
    let targetStartRow, targetEndRow;
    
    if (row) {
      targetStartRow = targetEndRow = parseInt(row);
    } else if (start_row && end_row) {
      targetStartRow = parseInt(start_row);
      targetEndRow = parseInt(end_row);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp row (cho một hàng) hoặc start_row và end_row (cho dải hàng)'
      });
    }
    
    if (targetStartRow > targetEndRow) {
      return res.status(400).json({
        success: false,
        message: 'start_row không được lớn hơn end_row'
      });
    }
    
    // Validate other parameters if provided
    if (num_seats_per_row && (num_seats_per_row <= 0 || num_seats_per_row > 26)) {
      return res.status(400).json({
        success: false,
        message: 'num_seats_per_row phải từ 1 đến 26'
      });
    }
    
    if (seatClass && !['economy', 'business', 'first'].includes(seatClass)) {
      return res.status(400).json({
        success: false,
        message: 'class phải là economy, business hoặc first'
      });
    }
    
    // Get existing seats in the target rows
    const existingSeats = await Seat.findAll({
      where: { airplane_id: airplane.airplane_id },
      order: [['seat_number', 'ASC']]
    });
    
    const seatsInTargetRows = existingSeats.filter(seat => {
      const rowMatch = seat.seat_number.match(/^(\d+)/);
      if (rowMatch) {
        const rowNumber = parseInt(rowMatch[1]);
        return rowNumber >= targetStartRow && rowNumber <= targetEndRow;
      }
      return false;
    });
    
    if (seatsInTargetRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy ghế nào trong hàng ${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''}`
      });
    }
    
    let updatedCount = 0;
    let newSeatsCreated = 0;
    
    // If num_seats_per_row is provided, recreate seats for the rows
    if (num_seats_per_row) {
      // Delete existing seats in target rows
      await Seat.destroy({
        where: {
          airplane_id: airplane.airplane_id,
          seat_id: { [Op.in]: seatsInTargetRows.map(s => s.seat_id) }
        }
      });
      
      // Create new seats with new configuration
      const seatsToCreate = [];
      const seatLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      for (let rowNum = targetStartRow; rowNum <= targetEndRow; rowNum++) {
        for (let seatIndex = 0; seatIndex < num_seats_per_row; seatIndex++) {
          const seatLetter = seatLetters[seatIndex];
          const seatNumber = `${rowNum}${seatLetter}`;
          
          seatsToCreate.push({
            airplane_id: airplane.airplane_id,
            seat_number: seatNumber,
            class: seatClass || 'economy',
            is_available: true
          });
        }
      }
      
      await Seat.bulkCreate(seatsToCreate);
      newSeatsCreated = seatsToCreate.length;
      
      // Update total_seats in airplane
      const totalSeats = await Seat.count({ where: { airplane_id: airplane.airplane_id } });
      await airplane.update({ total_seats: totalSeats });
    } else {
      // Just update class if provided
      if (seatClass) {
        const updateResult = await Seat.update(
          { class: seatClass },
          {
            where: {
              airplane_id: airplane.airplane_id,
              seat_id: { [Op.in]: seatsInTargetRows.map(s => s.seat_id) }
            }
          }
        );
        updatedCount = updateResult[0];
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Cập nhật ghế hàng ${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''} thành công`,
      rows_affected: `${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''}`,
      seats_updated: updatedCount,
      new_seats_created: newSeatsCreated,
      configuration: num_seats_per_row ? {
        num_seats_per_row,
        class: seatClass || 'economy'
      } : {
        class: seatClass
      }
    });
    
  } catch (error) {
    console.error('Error updating seats by row:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật ghế theo hàng',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Delete seats by row or row range
 * @route   DELETE /api/airplanes/:id/seats
 * @access  Private (Admin only)
 */
exports.deleteSeatsByRow = async (req, res) => {
  try {
    const { row, start_row, end_row } = req.body;
    
    const airplane = await Airplane.findByPk(req.params.id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay với ID đã cung cấp'
      });
    }
    
    // Validate input - either single row or row range
    let targetStartRow, targetEndRow;
    
    if (row) {
      targetStartRow = targetEndRow = parseInt(row);
    } else if (start_row && end_row) {
      targetStartRow = parseInt(start_row);
      targetEndRow = parseInt(end_row);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp row (cho một hàng) hoặc start_row và end_row (cho dải hàng)'
      });
    }
    
    if (targetStartRow > targetEndRow) {
      return res.status(400).json({
        success: false,
        message: 'start_row không được lớn hơn end_row'
      });
    }
    
    // Get existing seats in the target rows
    const existingSeats = await Seat.findAll({
      where: { airplane_id: airplane.airplane_id },
      order: [['seat_number', 'ASC']]
    });
    
    const seatsInTargetRows = existingSeats.filter(seat => {
      const rowMatch = seat.seat_number.match(/^(\d+)/);
      if (rowMatch) {
        const rowNumber = parseInt(rowMatch[1]);
        return rowNumber >= targetStartRow && rowNumber <= targetEndRow;
      }
      return false;
    });
    
    if (seatsInTargetRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy ghế nào trong hàng ${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''}`
      });
    }
    
    // Check if any seats are booked
    const bookedSeats = seatsInTargetRows.filter(seat => !seat.is_available);
    if (bookedSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa ghế đã được đặt. Các ghế đã đặt: ${bookedSeats.map(s => s.seat_number).join(', ')}`
      });
    }
    
    // Delete seats
    const deletedCount = await Seat.destroy({
      where: {
        airplane_id: airplane.airplane_id,
        seat_id: { [Op.in]: seatsInTargetRows.map(s => s.seat_id) }
      }
    });
    
    // Update total_seats in airplane
    const totalSeats = await Seat.count({ where: { airplane_id: airplane.airplane_id } });
    await airplane.update({ total_seats: totalSeats });
    
    res.status(200).json({
      success: true,
      message: `Xóa ghế hàng ${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''} thành công`,
      rows_deleted: `${targetStartRow}${targetStartRow !== targetEndRow ? `-${targetEndRow}` : ''}`,
      seats_deleted: deletedCount,
      remaining_total_seats: totalSeats
    });
    
  } catch (error) {
    console.error('Error deleting seats by row:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa ghế theo hàng',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};
