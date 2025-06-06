// Shared pricing utilities for QAirline booking system
// This ensures consistency between frontend calculations and backend logic

export const BASE_PRICE = 1000000; // 1,000,000 VND

export const PRICE_MULTIPLIERS = {
  'economy': 1.0,
  'business': 2.5,
  'first': 5.0
};

/**
 * Calculate ticket price based on seat class
 * Uses the same logic as backend for consistency
 * @param {string} seatClass - 'economy', 'business', or 'first'
 * @param {number} basePrice - Base price (default: 1,000,000 VND)
 * @returns {number} Final ticket price
 */
export const calculateTicketPrice = (seatClass, basePrice = BASE_PRICE) => {
  const multiplier = PRICE_MULTIPLIERS[seatClass] || PRICE_MULTIPLIERS['economy'];
  return Math.round(basePrice * multiplier);
};

/**
 * Format currency to Vietnamese Dong
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Get display information for seat class
 * @param {string} seatClass - 'economy', 'business', or 'first'
 * @returns {object} Class info with Vietnamese label and price
 */
export const getSeatClassInfo = (seatClass) => {
  const labels = {
    'economy': 'Hạng phổ thông',
    'business': 'Hạng thương gia', 
    'first': 'Hạng nhất'
  };
  
  return {
    class: seatClass,
    label: labels[seatClass] || labels['economy'],
    price: calculateTicketPrice(seatClass),
    multiplier: PRICE_MULTIPLIERS[seatClass] || PRICE_MULTIPLIERS['economy']
  };
}; 