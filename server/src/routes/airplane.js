const express = require('express');
const router = express.Router();
const airplaneController = require('../controllers/airplane');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/airplanes
 * @desc    Get all airplanes with optional filtering
 * @access  Public
 */
router.get('/', airplaneController.getAirplanes);

/**
 * @route   GET /api/airplanes/:id
 * @desc    Get single airplane by ID
 * @access  Public
 */
router.get('/:id', airplaneController.getAirplaneById);

/**
 * @route   POST /api/airplanes
 * @desc    Create a new airplane
 * @access  Private (Admin only)
 */
router.post('/', authenticateAdmin, airplaneController.createAirplane);

/**
 * @route   PUT /api/airplanes/:id
 * @desc    Update an airplane
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateAdmin, airplaneController.updateAirplane);

/**
 * @route   DELETE /api/airplanes/:id
 * @desc    Delete an airplane
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateAdmin, airplaneController.deleteAirplane);

/**
 * @route   POST /api/airplanes/:id/seats
 * @desc    Configure seat layout for an airplane
 * @access  Private (Admin only)
 */
router.post('/:id/seats', authenticateAdmin, airplaneController.configureSeatLayout);

/**
 * @route   GET /api/airplanes/:id/seats
 * @desc    Get all seats for an airplane
 * @access  Public
 */
router.get('/:id/seats', airplaneController.getAirplaneSeats);

module.exports = router; 