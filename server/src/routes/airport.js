const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airport');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/airports
 * @desc    Get all airports with optional filtering
 * @access  Public
 */
router.get('/', airportController.getAirports);

/**
 * @route   GET /api/airports/:id
 * @desc    Get single airport by ID
 * @access  Public
 */
router.get('/:id', airportController.getAirportById);

/**
 * @route   POST /api/airports
 * @desc    Create a new airport
 * @access  Private (Admin only)
 */
router.post('/', authenticateAdmin, airportController.createAirport);

/**
 * @route   PUT /api/airports/:id
 * @desc    Update an airport
 * @access  Private (Admin only)
 */
router.put('/:id', authenticateAdmin, airportController.updateAirport);

/**
 * @route   DELETE /api/airports/:id
 * @desc    Delete an airport
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateAdmin, airportController.deleteAirport);

module.exports = router; 