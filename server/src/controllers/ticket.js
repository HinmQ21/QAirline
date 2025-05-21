const { Ticket, Booking, Seat, Flight, Airport, Airplane } = require('../models');

/**
 * @desc    List tickets for a booking
 * @route   GET /api/tickets/booking/:bookingId
 * @access  Private (Customer only - can only access own booking tickets)
 */
exports.getTicketsByBooking = async (req, res) => {
  try {
    const booking_id = req.params.bookingId;
    const customer_id = req.user.customer_id;

    // Check if booking belongs to the customer
    const booking = await Booking.findOne({
      where: { booking_id, customer_id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đặt vé hoặc bạn không có quyền truy cập'
      });
    }

    // Get tickets
    const tickets = await Ticket.findAll({
      where: { booking_id },
      include: [
        { model: Seat },
        { 
          model: Booking,
          include: [{ 
            model: Flight,
            include: [
              { model: Airport, as: 'departureAirport' },
              { model: Airport, as: 'arrivalAirport' },
              { model: Airplane }
            ]
          }]
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * @desc    Generate e-ticket for a specific ticket
 * @route   GET /api/tickets/:id/e-ticket
 * @access  Private (Customer only - can only access own tickets)
 */
exports.generateETicket = async (req, res) => {
  try {
    const ticket_id = req.params.id;
    const customer_id = req.user.customer_id;

    const ticket = await Ticket.findOne({
      where: { ticket_id },
      include: [
        { model: Seat },
        { 
          model: Booking,
          where: { 
            customer_id,
            status: 'booked' 
          },
          include: [{ 
            model: Flight,
            include: [
              { model: Airport, as: 'departureAirport' },
              { model: Airport, as: 'arrivalAirport' },
              { model: Airplane }
            ]
          }]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vé hoặc bạn không có quyền truy cập'
      });
    }

    // Format e-ticket data
    const eTicket = {
      ticket_number: `QAT-${ticket.ticket_id.toString().padStart(8, '0')}`,
      passenger: {
        name: ticket.passenger_name,
        dob: ticket.passenger_dob
      },
      seat: {
        number: ticket.Seat.seat_number,
        class: ticket.Seat.class
      },
      flight: {
        flight_number: ticket.Booking.Flight.flight_number,
        departure: {
          airport: ticket.Booking.Flight.departureAirport.name,
          code: ticket.Booking.Flight.departureAirport.code,
          city: ticket.Booking.Flight.departureAirport.city,
          country: ticket.Booking.Flight.departureAirport.country,
          time: ticket.Booking.Flight.departure_time
        },
        arrival: {
          airport: ticket.Booking.Flight.arrivalAirport.name,
          code: ticket.Booking.Flight.arrivalAirport.code,
          city: ticket.Booking.Flight.arrivalAirport.city,
          country: ticket.Booking.Flight.arrivalAirport.country,
          time: ticket.Booking.Flight.arrival_time
        },
        airplane: {
          code: ticket.Booking.Flight.Airplane.code,
          model: ticket.Booking.Flight.Airplane.model
        }
      },
      booking: {
        id: ticket.Booking.booking_id,
        date: ticket.Booking.booking_date,
        status: ticket.Booking.status
      },
      price: ticket.price,
      qr_code: `QA-${ticket.Booking.booking_id}-${ticket.ticket_id}` // Would generate a real QR code URL in production
    };

    res.status(200).json({
      success: true,
      data: eTicket
    });
  } catch (error) {
    console.error('Error generating e-ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo vé điện tử',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: Seat },
        { 
          model: Booking,
          include: [{ 
            model: Flight,
            attributes: ["flight_id", "departure_time"],
            include: [
              { model: Airport, 
                as: 'departureAirport', 
                attributes: ["city"]},
              { model: Airport, 
                as: 'arrivalAirport', 
                attributes: ["city"]},
              { model: Airplane, 
                attributes: ["code"]
               }
            ]
          }]
        }
      ]
    });
    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách vé',
      error: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
}