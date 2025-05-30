const { Flight, Airport, Airplane, Admin, Seat, Notification, Booking, Customer } = require('../models');
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

exports.getFlightPaged = async (req, res) => {
  const { pageSize = 10, pageNumber = 1 } = req.query;

  try {
    // Convert to integers
    const pageSizeInt = parseInt(pageSize);
    const pageNumberInt = parseInt(pageNumber);
    
    // Validate parameters
    if (pageSizeInt <= 0 || pageNumberInt <= 0) {
      return res.status(400).json({
        success: false,
        message: 'pageSize và pageNumber phải là số dương'
      });
    }
    
    // Get total count for pagination
    const totalCount = await Flight.count();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSizeInt);
    
    // Get flights with pagination
    const flights = await Flight.findAll({
      offset: (pageNumberInt - 1) * pageSizeInt,
      limit: pageSizeInt,
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
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        currentPage: pageNumberInt,
        pageSize: pageSizeInt
      },
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
}

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
    
    // Kiểm tra nếu status được cập nhật thành delay hoặc cancelled
    const statusChanged = status && flight.status !== status && (status === 'delay' || status === 'cancelled');
    
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
    
    // Nếu trạng thái chuyến bay được cập nhật thành delay hoặc cancelled, tạo thông báo
    if (statusChanged) {
      try {
        // Lấy tất cả bookings liên quan đến chuyến bay này
        const bookings = await Booking.findAll({
          where: { flight_id: flightId },
          include: [{
            model: Customer,
            attributes: ['customer_id']
          }]
        });
        
        // Lấy thông tin chi tiết chuyến bay để đưa vào thông báo
        const flightDetails = await Flight.findByPk(flightId, {
          include: [
            {
              model: Airport,
              as: 'departureAirport',
              attributes: ['code', 'name', 'city']
            },
            {
              model: Airport,
              as: 'arrivalAirport',
              attributes: ['code', 'name', 'city']
            }
          ]
        });
        
        // Tạo nội dung thông báo dựa trên trạng thái
        let title, message, notificationType;
        
        if (status === 'delay') {
          title = `Chuyến bay ${flightDetails.flight_number} bị trì hoãn`;
          message = `Chuyến bay ${flightDetails.flight_number} từ ${flightDetails.departureAirport.name} (${flightDetails.departureAirport.city}) đến ${flightDetails.arrivalAirport.name} (${flightDetails.arrivalAirport.city}) đã bị trì hoãn. Vui lòng kiểm tra lại thời gian khởi hành.`;
          notificationType = 'delay';
        } else if (status === 'cancelled') {
          title = `Chuyến bay ${flightDetails.flight_number} đã bị hủy`;
          message = `Chuyến bay ${flightDetails.flight_number} từ ${flightDetails.departureAirport.name} (${flightDetails.departureAirport.city}) đến ${flightDetails.arrivalAirport.name} (${flightDetails.arrivalAirport.city}) đã bị hủy. Vui lòng liên hệ với chúng tôi để được hỗ trợ.`;
          notificationType = 'cancellation';
        }
        
        // Tạo thông báo cho mỗi khách hàng có đặt chỗ
        for (const booking of bookings) {
          if (booking.Customer && booking.Customer.customer_id) {
            await Notification.create({
              customer_id: booking.Customer.customer_id,
              flight_id: flightId,
              title,
              message,
              type: notificationType,
              created_at: new Date()
            });
          }
        }
        
        console.log(`Đã tạo ${bookings.length} thông báo cho trạng thái ${status}`);
      } catch (notificationError) {
        console.error('Error creating notifications:', notificationError);
        // Không trả về lỗi, tiếp tục xử lý để trả về kết quả cập nhật chuyến bay
      }
    }
    
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

// Tìm chuyến bay theo thời gian và sân bay
exports.getFlightsByTimeAndAirport = async (req, res) => {
  try {
    const {
      departure_airport_id,
      arrival_airport_id,
      departure_date,
      return_date
    } = req.query;
    
    // Validate input
    if (!departure_airport_id || !arrival_airport_id || !departure_date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: sân bay đi, sân bay đến và ngày khởi hành'
      });
    }
    
    // Validate sân bay đi và đến không được trùng nhau
    if (departure_airport_id === arrival_airport_id) {
      return res.status(400).json({
        success: false,
        message: 'Sân bay khởi hành và đến không được trùng nhau'
      });
    }
    
    // Tạo điều kiện tìm kiếm cho chuyến đi
    const departureStartDate = new Date(departure_date);
    const departureEndDate = new Date(departure_date);
    departureEndDate.setHours(23, 59, 59, 999);
    
    const departureFlightCondition = {
      departure_airport_id,
      arrival_airport_id,
      departure_time: {
        [Op.between]: [departureStartDate, departureEndDate]
      },
      status: {
        [Op.ne]: 'cancelled'
      }
    };
    
    // Tìm các chuyến bay khởi hành
    const departureFlights = await Flight.findAll({
      where: departureFlightCondition,
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
    
    // Nếu có ngày về, tìm cả chuyến về
    let returnFlights = [];
    if (return_date) {
      const returnStartDate = new Date(return_date);
      const returnEndDate = new Date(return_date);
      returnEndDate.setHours(23, 59, 59, 999);
      
      const returnFlightCondition = {
        departure_airport_id: arrival_airport_id, // Đảo ngược sân bay đi và đến
        arrival_airport_id: departure_airport_id,
        departure_time: {
          [Op.between]: [returnStartDate, returnEndDate]
        },
        status: {
          [Op.ne]: 'cancelled'
        }
      };
      
      returnFlights = await Flight.findAll({
        where: returnFlightCondition,
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
    }
    
    res.status(200).json({
      success: true,
      data: {
        departureFlights: {
          count: departureFlights.length,
          flights: departureFlights
        },
        returnFlights: {
          count: returnFlights.length,
          flights: returnFlights
        }
      }
    });
  } catch (error) {
    console.error('Error getting flights by time and airport:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tìm kiếm chuyến bay',
      error: error.message
    });
  }
};

// Tạo chuyến bay mới (yêu cầu quyền admin)
exports.createFlight = async (req, res) => {
  try {
    const {
      flight_number,
      airplane_id,
      departure_airport_id,
      arrival_airport_id,
      departure_time,
      arrival_time,
      status
    } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!flight_number || !airplane_id || !departure_airport_id || 
        !arrival_airport_id || !departure_time || !arrival_time) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin chuyến bay'
      });
    }
    
    // Kiểm tra sân bay đi và đến không được trùng nhau
    if (departure_airport_id === arrival_airport_id) {
      return res.status(400).json({
        success: false,
        message: 'Sân bay khởi hành và đến không được trùng nhau'
      });
    }
    
    // Kiểm tra thời gian đến phải sau thời gian đi
    const departureTimeObj = new Date(departure_time);
    const arrivalTimeObj = new Date(arrival_time);
    
    if (arrivalTimeObj <= departureTimeObj) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian đến phải sau thời gian khởi hành'
      });
    }
    
    // Kiểm tra mã chuyến bay đã tồn tại chưa
    const existingFlight = await Flight.findOne({
      where: { flight_number }
    });
    
    if (existingFlight) {
      return res.status(400).json({
        success: false,
        message: 'Mã chuyến bay đã tồn tại trong hệ thống'
      });
    }
    
    // Kiểm tra máy bay tồn tại
    const airplane = await Airplane.findByPk(airplane_id);
    if (!airplane) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy máy bay'
      });
    }
    
    // Kiểm tra sân bay đi tồn tại
    const departureAirport = await Airport.findByPk(departure_airport_id);
    if (!departureAirport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay khởi hành'
      });
    }
    
    // Kiểm tra sân bay đến tồn tại
    const arrivalAirport = await Airport.findByPk(arrival_airport_id);
    if (!arrivalAirport) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sân bay đến'
      });
    }
    
    // Tạo chuyến bay mới
    const newFlight = await Flight.create({
      flight_number,
      airplane_id,
      departure_airport_id,
      arrival_airport_id,
      departure_time,
      arrival_time,
      status: status || 'scheduled',
      created_by: req.admin.admin_id,
      created_at: new Date()
    });
    
    // Lấy thông tin đầy đủ của chuyến bay mới tạo
    const createdFlight = await Flight.findByPk(newFlight.flight_id, {
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
        },
        {
          model: Admin,
          as: 'creator',
          attributes: ['admin_id', 'username', 'full_name']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Tạo chuyến bay thành công',
      data: createdFlight
    });
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo chuyến bay',
      error: error.message
    });
  }
};

// Xóa chuyến bay (yêu cầu quyền admin)
exports.deleteFlight = async (req, res) => {
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
    
    // Kiểm tra xem chuyến bay đã có booking nào chưa
    // Nếu có thì không cho xóa mà chỉ cập nhật trạng thái thành "cancelled"
    const bookingsExist = await flight.countBookings();
    
    if (bookingsExist > 0) {
      // Cập nhật trạng thái thành cancelled thay vì xóa
      await flight.update({
        status: 'cancelled',
        updated_by: req.admin.admin_id,
        updated_at: new Date()
      });
      
      return res.status(200).json({
        success: true,
        message: 'Chuyến bay đã được hủy thay vì xóa do đã có đặt chỗ',
        data: { flight_id: flightId, status: 'cancelled' }
      });
    }
    
    // Nếu chưa có booking nào thì xóa chuyến bay
    await flight.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Xóa chuyến bay thành công',
      data: { flight_id: flightId }
    });
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa chuyến bay',
      error: error.message
    });
  }
};