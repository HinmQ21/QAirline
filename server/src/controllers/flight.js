const { Flight, Airport, Airplane, Admin, Seat } = require('../models');
const { Op } = require('sequelize');

exports.getAllFlights = async (req, res) => {
  try {
    const {
      flight_number,
      departure_airport,
      arrival_airport,
      departure_date,
      status
    } = req.query;
    
    const whereCondition = {};
    
    if (flight_number) {
      whereCondition.flight_number = { [Op.like]: `%${flight_number}%` };
    }
    
    if (departure_airport) {
      whereCondition.departure_airport_id = departure_airport;
    }
    
    if (arrival_airport) {
      whereCondition.arrival_airport_id = arrival_airport;
    }
    
    if (departure_date) {
      // Tìm tất cả chuyến bay trong ngày được chọn
      const startDate = new Date(departure_date);
      const endDate = new Date(departure_date);
      endDate.setHours(23, 59, 59, 999);
      
      whereCondition.departure_time = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    if (status) {
      whereCondition.status = status;
    }
    
    const flights = await Flight.findAll({
      where: whereCondition,
      include: [
        {
          model: Airport,
          as: 'departureAirport',
          attributes: ['airport_id', 'code', 'name', 'city', 'country']
        },
        {
          model: Airport,
          as: 'arrivalAirport',
          attributes: ['airport_id', 'code', 'name', 'city', 'country']
        },
        {
          model: Airplane,
          attributes: ['airplane_id', 'code', 'manufacturer', 'model', 'total_seats']
        }
      ],
      order: [['departure_time', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    console.error('Error getting flights:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách chuyến bay',
      error: error.message
    });
  }
};

// Lấy thông tin chi tiết của một chuyến bay
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [
        {
          model: Airport,
          as: 'departureAirport',
          attributes: ['airport_id', 'code', 'name', 'city', 'country']
        },
        {
          model: Airport,
          as: 'arrivalAirport',
          attributes: ['airport_id', 'code', 'name', 'city', 'country']
        },
        {
          model: Airplane,
          attributes: ['airplane_id', 'code', 'manufacturer', 'model', 'total_seats'],
          include: [
            {
              model: Seat,
              attributes: ['seat_id', 'seat_number', 'class', 'is_available']
            }
          ]
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['admin_id', 'username', 'full_name']
        },
        {
          model: Admin,
          as: 'updater',
          attributes: ['admin_id', 'username', 'full_name']
        }
      ]
    });
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay'
      });
    }
    
    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    console.error('Error getting flight:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin chuyến bay',
      error: error.message
    });
  }
};

// Cập nhật thông tin chuyến bay (yêu cầu quyền admin)
exports.updateFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    
    // Kiểm tra chuyến bay tồn tại
    const flight = await Flight.findByPk(flightId);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay'
      });
    }
    
    // Validate dữ liệu đầu vào
    const {
      flight_number,
      airplane_id,
      departure_airport_id,
      arrival_airport_id,
      departure_time,
      arrival_time,
      status
    } = req.body;
    
    // Kiểm tra sân bay đi và đến không được trùng nhau
    if (departure_airport_id && arrival_airport_id && 
        departure_airport_id === arrival_airport_id) {
      return res.status(400).json({
        success: false,
        message: 'Sân bay khởi hành và đến không được trùng nhau'
      });
    }
    
    // Kiểm tra thời gian đến phải sau thời gian đi
    if (departure_time && arrival_time) {
      const departureTimeObj = new Date(departure_time);
      const arrivalTimeObj = new Date(arrival_time);
      
      if (arrivalTimeObj <= departureTimeObj) {
        return res.status(400).json({
          success: false,
          message: 'Thời gian đến phải sau thời gian khởi hành'
        });
      }
    }
    
    // Cập nhật thông tin chuyến bay
    const updatedFlight = await flight.update({
      flight_number: flight_number || flight.flight_number,
      airplane_id: airplane_id || flight.airplane_id,
      departure_airport_id: departure_airport_id || flight.departure_airport_id,
      arrival_airport_id: arrival_airport_id || flight.arrival_airport_id,
      departure_time: departure_time || flight.departure_time,
      arrival_time: arrival_time || flight.arrival_time,
      status: status || flight.status,
      updated_by: req.admin.admin_id,
      updated_at: new Date()
    });
    
    // Trả về thông tin chuyến bay đã cập nhật
    const updatedFlightData = await Flight.findByPk(flightId, {
      include: [
        {
          model: Airport,
          as: 'departureAirport',
          attributes: ['airport_id', 'code', 'name', 'city']
        },
        {
          model: Airport,
          as: 'arrivalAirport',
          attributes: ['airport_id', 'code', 'name', 'city']
        },
        {
          model: Airplane,
          attributes: ['airplane_id', 'code', 'model']
        },
        {
          model: Admin,
          as: 'updater',
          attributes: ['admin_id', 'username', 'full_name']
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật chuyến bay thành công',
      data: updatedFlightData
    });
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật chuyến bay',
      error: error.message
    });
  }
};