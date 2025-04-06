const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight');
const { authenticateAdmin, checkFlightManagerPermission } = require('../middleware/auth');

/**
 * @route   GET /api/flights
 * @desc    Lấy danh sách chuyến bay (có thể lọc theo điều kiện)
 * @access  Public
 */
router.get('/', flightController.getAllFlights);

/**
 * @route   GET /api/flights/:id
 * @desc    Lấy thông tin chi tiết của một chuyến bay
 * @access  Public
 */
router.get('/:id', flightController.getFlightById);

/**
 * @route   PUT /api/flights/:id
 * @desc    Cập nhật thông tin chuyến bay
 * @access  Private (Admin - flight_manager hoặc super_admin)
 */
router.put('/:id', 
  authenticateAdmin, 
  checkFlightManagerPermission, 
  flightController.updateFlight
);

module.exports = router;