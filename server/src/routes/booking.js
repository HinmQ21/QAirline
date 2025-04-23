const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const { authenticateUser } = require('../middleware/auth');

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking with tickets
 * @access  Private (Customer only)
 */
router.post('/', authenticateUser, bookingController.createBooking);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for current customer
 * @access  Private (Customer only)
 */
router.get('/', authenticateUser, bookingController.getCustomerBookings);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking details by ID
 * @access  Private (Customer only - can only access own bookings)
 */
router.get('/:id', authenticateUser, bookingController.getBookingById);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private (Customer only - can only cancel own bookings)
 */
router.put('/:id/cancel', authenticateUser, bookingController.cancelBooking);

/**
 * @route   GET /api/bookings/:id/confirmation
 * @desc    Generate booking confirmation
 * @access  Private (Customer only - can only access own bookings)
 */
router.get('/:id/confirmation', authenticateUser, bookingController.generateBookingConfirmation);

module.exports = router;