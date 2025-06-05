import React from 'react';

const basePrice = 1000000;

// input: flights - array of flight objects, each should have a DepartureTime field
// output: new array with each flight having an added 'price' field
export const addPricetoFlights = (flights) => {
  return flights
    .map(flight => ({
      ...flight,
      basePrice: FlightPriceHelper(flight.departure_time)
    }))
    .filter(flight => flight.basePrice >= 0);
};

const calculatePrice = (diffHours) => {
  switch (true) {
    case diffHours > 14600: // hơn 20 tháng (~ 20*30*24)
      return 1;
    case diffHours > 12240: // hơn 17 tháng
      return 1.2;
    case diffHours > 10512: // hơn 14 tháng
      return 1.4;
    case diffHours > 8760: // hơn 12 tháng
      return 1.6;
    case diffHours > 7300: // hơn 10 tháng
      return 1.8;
    case diffHours > 5256: // hơn 7 tháng
      return 2;
    case diffHours > 4380: // hơn 6 tháng
      return 2.2;
    case diffHours > 2920: // hơn 4 tháng
      return 2.5;
    case diffHours > 2160: // hơn 3 tháng
      return 2.8;
    case diffHours > 1440: // hơn 2 tháng
      return 3;
    case diffHours > 720: // hơn 1 tháng
      return 3.2;
    case diffHours > 360: // hơn 15 ngày
      return 3.5;
    case diffHours > 240: // hơn 10 ngày
      return 3.8;
    case diffHours > 120: // hơn 5 ngày
      return 4;
    case diffHours > 72: // hơn 3 ngày
      return 4.5;
    case diffHours > 24: // hơn 1 ngày
      return 4.8;
    case diffHours > 0:
      return 5;
    default:
      return 1;
  }
}

const FlightPriceHelper = (DepartureTime) => {
  const now = new Date();
  now.setFullYear(now.getFullYear() - 1); // Lùi ngày hiện tại đi 1 năm
  const departure = new Date(DepartureTime);
  const diffHours = (departure - now) / (1000 * 60 * 60);


  return (calculatePrice(diffHours) * basePrice);
}