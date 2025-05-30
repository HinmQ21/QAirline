const { Booking, Flight, Ticket, Seat, Customer, Airport, Airplane } = require('../models');
const { Op } = require('sequelize');

// Helper function to calculate ticket price based on seat class and flight distance
const calculateTicketPrice = (seatClass, basePrice = 1000000) => {
  const priceMultipliers = {
    'economy': 1.0,
    'business': 2.5,
    'first': 5.0
  };

  return Math.round(basePrice * (priceMultipliers[seatClass] || priceMultipliers['economy']));
};

// Helper function to validate passenger data
const validatePassengerData = (passenger, index) => {
  const errors = [];

  // Check required fields
  if (!passenger.name || typeof passenger.name !== 'string' || passenger.name.trim().length === 0) {
    errors.push(`Tên hành khách thứ ${index + 1} không hợp lệ`);
  }

  if (!passenger.seat_id || !Number.isInteger(passenger.seat_id) || passenger.seat_id <= 0) {
    errors.push(`ID ghế của hành khách thứ ${index + 1} không hợp lệ`);
  }

  // Validate passenger name length and format
  if (passenger.name && passenger.name.trim().length > 100) {
    errors.push(`Tên hành khách thứ ${index + 1} quá dài (tối đa 100 ký tự)`);
  }

  // Validate date of birth if provided
  if (passenger.dob) {
    const dobDate = new Date(passenger.dob);
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());

    if (isNaN(dobDate.getTime()) || dobDate > today || dobDate < minAge) {
      errors.push(`Ngày sinh của hành khách thứ ${index + 1} không hợp lệ`);
    }
  }

  return errors;
};

// Helper function to check booking time constraints
const validateBookingTime = (departureTime) => {
  const currentTime = new Date();
  const minBookingTime = new Date(departureTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before

  if (currentTime >= departureTime) {
    return { valid: false, message: 'Không thể đặt vé cho chuyến bay đã khởi hành' };
  }

  if (currentTime >= minBookingTime) {
    return { valid: false, message: 'Không thể đặt vé trong vòng 2 giờ trước giờ khởi hành' };
  }

  return { valid: true };
};

/**
 * @desc    Create a new booking with tickets
 * @route   POST /api/bookings
 * @access  Private (Customer only)
 */
exports.createBooking = async (req, res) => {
  // Start a transaction
  const transaction = await Booking.sequelize.transaction();

  try {
    const { flight_id, passengers } = req.body;
    const customer_id = req.user.customer_id;

    // Enhanced validation for required fields
    if (!flight_id || !Number.isInteger(flight_id) || flight_id <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'ID chuyến bay không hợp lệ'
      });
    }

    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp thông tin hành khách'
      });
    }

    // Validate passenger limit (business rule: max 9 passengers per booking)
    if (passengers.length > 9) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt quá 9 vé trong một lần đặt'
      });
    }

    // Validate each passenger data using helper function
    const allValidationErrors = [];
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      const validationErrors = validatePassengerData(passenger, i);
      allValidationErrors.push(...validationErrors);

      // Normalize passenger name if valid
      if (passenger.name && typeof passenger.name === 'string') {
        passengers[i].name = passenger.name.trim().replace(/\s+/g, ' ');
      }
    }

    // If there are validation errors, return them
    if (allValidationErrors.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: allValidationErrors[0] // Return first error for simplicity
      });
    }

    // Check for duplicate seat selections
    const seatIds = passengers.map(p => p.seat_id);
    if (seatIds.length !== new Set(seatIds).size) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể chọn trùng ghế cho các hành khách'
      });
    }

    // Get flight with related data
    const flight = await Flight.findByPk(flight_id, {
      include: [
        { model: Airplane, attributes: ['airplane_id', 'total_seats'] }
      ],
      transaction
    });

    if (!flight) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay với ID đã cung cấp'
      });
    }

    // Enhanced flight status validation
    if (flight.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Không thể đặt vé cho chuyến bay đã bị hủy'
      });
    }

    // Check booking time constraints using helper function
    const departureTime = new Date(flight.departure_time);
    const timeValidation = validateBookingTime(departureTime);

    if (!timeValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: timeValidation.message
      });
    }

    // Check if selected seats exist and are available
    const seats = await Seat.findAll({
      where: {
        seat_id: { [Op.in]: seatIds },
        airplane_id: flight.airplane_id,
        is_available: true
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

    // Check if seats are already booked for this flight (double-check for race conditions)
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

    // Calculate prices server-side using helper function (more secure)
    let totalPrice = 0;
    const ticketData = [];

    for (const passenger of passengers) {
      const seat = seats.find(s => s.seat_id === passenger.seat_id);
      const ticketPrice = calculateTicketPrice(seat.class);
      totalPrice += ticketPrice;

      ticketData.push({
        seat_id: passenger.seat_id,
        passenger_name: passenger.name,
        passenger_dob: passenger.dob || null,
        price: ticketPrice,
        seat_class: seat.class
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer_id,
      flight_id,
      booking_date: new Date(),
      status: 'booked',
      total_price: totalPrice
    }, { transaction });

    console.log(`[BOOKING] New booking created - ID: ${booking.booking_id}, Customer: ${customer_id}, Flight: ${flight_id}, Total: ${totalPrice}`);

    // Create tickets and update seat availability in bulk operations
    const tickets = [];
    for (const ticketInfo of ticketData) {
      const ticket = await Ticket.create({
        booking_id: booking.booking_id,
        seat_id: ticketInfo.seat_id,
        passenger_name: ticketInfo.passenger_name,
        passenger_dob: ticketInfo.passenger_dob,
        price: ticketInfo.price
      }, { transaction });

      tickets.push(ticket);
    }

    // Update seat availability in bulk
    await Seat.update(
      { is_available: false },
      {
        where: { seat_id: { [Op.in]: seatIds } },
        transaction
      }
    );

    // Commit the transaction
    await transaction.commit();

    console.log(`[BOOKING] Booking completed successfully - ID: ${booking.booking_id}, Tickets: ${tickets.length}`);

    // Return success with booking and tickets
    res.status(201).json({
      success: true,
      message: 'Đặt vé thành công',
      data: {
        booking: {
          booking_id: booking.booking_id,
          customer_id: booking.customer_id,
          flight_id: booking.flight_id,
          booking_date: booking.booking_date,
          status: booking.status,
          total_price: booking.total_price
        },
        tickets: tickets.map(ticket => ({
          ticket_id: ticket.ticket_id,
          seat_id: ticket.seat_id,
          passenger_name: ticket.passenger_name,
          passenger_dob: ticket.passenger_dob,
          price: ticket.price
        })),
        flight_info: {
          flight_number: flight.flight_number,
          departure_time: flight.departure_time,
          arrival_time: flight.arrival_time
        }
      }
    });
  } catch (error) {
    // Rollback transaction in case of error
    await transaction.rollback();
    console.error('[BOOKING ERROR] Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đặt vé',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
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