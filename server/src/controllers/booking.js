const { Booking, Flight, Ticket, Seat, Customer, Airport, Airplane } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Create a new booking with tickets
 * @route   POST /api/bookings
 * @access  Private (Customer only)
 */
exports.createBooking = async (req, res) => {
  // Start a transaction
  const transaction = await Booking.sequelize.transaction();
  
  try {
    const { flight_id, passengers, total_price } = req.body;
    const customer_id = req.user.customer_id;

    // Validate required fields
    if (!flight_id || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID chuyến bay và thông tin hành khách'
      });
    }

    // Check if flight exists
    const flight = await Flight.findByPk(flight_id, { transaction });
    if (!flight) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay với ID đã cung cấp'
      });
    }

    // Check if flight is already departed
    if (new Date(flight.departure_time) < new Date()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt vé cho chuyến bay đã khởi hành'
      });
    }

    // Check if flight is cancelled
    if (flight.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt vé cho chuyến bay đã bị hủy'
      });
    }

    // Validate seat selection
    const seatIds = passengers.map(p => p.seat_id);
    if (seatIds.length !== new Set(seatIds).size) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể chọn trùng ghế cho các hành khách'
      });
    }

    // Check if selected seats exist and are available
    const seats = await Seat.findAll({
      where: {
        seat_id: { [Op.in]: seatIds },
        airplane_id: flight.airplane_id,
        is_available: true // Check is_available flag explicitly
      },
      transaction
    });

    if (seats.length !== seatIds.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Một hoặc nhiều ghế không tồn tại, không có sẵn, hoặc không thuộc máy bay của chuyến bay này'
      });
    }

    // Check if seats are already booked for this flight
    const bookedTickets = await Ticket.findAll({
      include: [{
        model: Booking,
        where: {
          flight_id,
          status: 'booked'
        }
      }],
      where: {
        seat_id: { [Op.in]: seatIds }
      },
      transaction
    });

    if (bookedTickets.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Một hoặc nhiều ghế đã được đặt, vui lòng chọn ghế khác',
        booked_seats: bookedTickets.map(ticket => ticket.seat_id)
      });
    }

    // Create booking transaction
    const booking = await Booking.create({
      customer_id,
      flight_id,
      booking_date: new Date(),
      status: 'booked',
      total_price: total_price || 0 // You might calculate this server-side in a real app
    }, { transaction });

    // Create tickets for each passenger and update seat availability
    const tickets = [];
    for (const passenger of passengers) {
      const ticket = await Ticket.create({
        booking_id: booking.booking_id,
        seat_id: passenger.seat_id,
        passenger_name: passenger.name,
        passenger_dob: passenger.dob || null,
        price: passenger.price || 0 // You might calculate this server-side in a real app
      }, { transaction });
      
      // Update seat availability
      await Seat.update(
        { is_available: false },
        { 
          where: { seat_id: passenger.seat_id },
          transaction
        }
      );
      
      tickets.push(ticket);
    }

    // Commit the transaction
    await transaction.commit();

    // Return success with booking and tickets
    res.status(201).json({
      success: true,
      message: 'Đặt vé thành công',
      data: {
        booking,
        tickets
      }
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get all bookings for current customer
 * @route   GET /api/bookings
 * @access  Private (Customer only)
 */
exports.getCustomerBookings = async (req, res) => {
  try {
    const customer_id = req.user.customer_id;
    
    const bookings = await Booking.findAll({
      where: { customer_id },
      include: [
        {
          model: Flight,
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
            { model: Airplane }
          ]
        },
        {
          model: Ticket,
          include: [{ model: Seat }]
        }
      ],
      order: [['booking_date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @access  Private (Customer only - can only access own bookings)
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const customer_id = req.user.customer_id;

    const booking = await Booking.findOne({
      where: { 
        booking_id,
        customer_id // Ensure customer can only access their own bookings
      },
      include: [
        {
          model: Flight,
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
            { model: Airplane }
          ]
        },
        {
          model: Ticket,
          include: [{ model: Seat }]
        },
        {
          model: Customer,
          attributes: ['customer_id', 'username', 'email', 'full_name', 'phone', 'address']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đặt vé với ID đã cung cấp hoặc bạn không có quyền truy cập'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private (Customer only - can only cancel own bookings)
 */
exports.cancelBooking = async (req, res) => {
  // Start a transaction
  const transaction = await Booking.sequelize.transaction();
  
  try {
    const booking_id = req.params.id;
    const customer_id = req.user.customer_id;

    // Find booking with tickets and seats
    const booking = await Booking.findOne({
      where: { 
        booking_id,
        customer_id // Ensure customer can only cancel their own bookings
      },
      include: [
        { model: Flight },
        { 
          model: Ticket,
          include: [{ model: Seat }]
        }
      ],
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đặt vé với ID đã cung cấp hoặc bạn không có quyền truy cập'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Đặt vé này đã bị hủy trước đó'
      });
    }

    // Check if flight has already departed
    if (new Date(booking.Flight.departure_time) < new Date()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đặt vé cho chuyến bay đã khởi hành'
      });
    }

    // Cancel the booking
    await booking.update({ status: 'cancelled' }, { transaction });

    // Set seats back to available
    const seatIds = booking.Tickets.map(ticket => ticket.seat_id);
    
    await Seat.update(
      { is_available: true },
      { 
        where: { seat_id: { [Op.in]: seatIds } },
        transaction
      }
    );
    
    // Commit transaction
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Hủy đặt vé thành công',
      data: booking
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Generate booking confirmation
 * @route   GET /api/bookings/:id/confirmation
 * @access  Private (Customer only - can only access own bookings)
 */
exports.generateBookingConfirmation = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const customer_id = req.user.customer_id;

    const booking = await Booking.findOne({
      where: { 
        booking_id,
        customer_id,
        status: 'booked' // Only for active bookings
      },
      include: [
        {
          model: Flight,
          include: [
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
            { model: Airplane }
          ]
        },
        {
          model: Ticket,
          include: [{ model: Seat }]
        },
        {
          model: Customer,
          attributes: ['customer_id', 'email', 'full_name', 'phone', 'address']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đặt vé hợp lệ với ID đã cung cấp'
      });
    }

    // Format booking confirmation data
    const confirmationData = {
      confirmation_number: `QA-${booking.booking_id.toString().padStart(6, '0')}`,
      booking_date: booking.booking_date,
      customer: {
        name: booking.Customer.full_name,
        email: booking.Customer.email,
        phone: booking.Customer.phone
      },
      flight: {
        flight_number: booking.Flight.flight_number,
        departure: {
          airport: booking.Flight.departureAirport.name,
          code: booking.Flight.departureAirport.code,
          time: booking.Flight.departure_time
        },
        arrival: {
          airport: booking.Flight.arrivalAirport.name,
          code: booking.Flight.arrivalAirport.code,
          time: booking.Flight.arrival_time
        },
        airplane: {
          code: booking.Flight.Airplane.code,
          model: booking.Flight.Airplane.model
        }
      },
      passengers: booking.Tickets.map(ticket => ({
        name: ticket.passenger_name,
        seat: ticket.Seat.seat_number,
        class: ticket.Seat.class,
        price: ticket.price
      })),
      total_price: booking.total_price,
      status: booking.status
    };

    res.status(200).json({
      success: true,
      data: confirmationData
    });
  } catch (error) {
    console.error('Error generating booking confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo xác nhận đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};