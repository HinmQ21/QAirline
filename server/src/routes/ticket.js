const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket');
const { authenticateUser } = require('../middleware/auth');

/**
 * @route   GET /api/tickets/booking/:bookingId
 * @desc    List tickets for a booking
 * @access  Private (Customer only - can only access own booking tickets)
 */
router.get('/booking/:bookingId', authenticateUser, ticketController.getTicketsByBooking);

/**
 * @route   GET /api/tickets/:id/e-ticket
 * @desc    Generate e-ticket for a specific ticket
 * @access  Private (Customer only - can only access own tickets)
 */
router.get('/:id/e-ticket', authenticateUser, ticketController.generateETicket);

module.exports = router;