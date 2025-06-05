import React from 'react';

const basePrice = 1000000;

// input: flights - array of flight objects, each should have a DepartureTime field
// output: new array with each flight having an added 'price' field
export const addPricesToFlights = (flights) => {
  return flights.map(flight => ({
    ...flight,
    basePrice: FlightPriceHelper(flight.departure_time)
  }));
};

const calculatePrice = (diffHours) => {
  switch (true) {
    case diffHours > 360: // hơn 15 ngày
      return 1; // Giá siêu rẻ nếu đặt trước hơn nửa tháng
    case diffHours > 240: // hơn 10 ngày
      return 1.2; // Giá rất rẻ nếu đặt trước 10-15 ngày
    case diffHours > 120: // hơn 5 ngày
      return 1.5; // Giá rẻ nếu đặt trước 5-10 ngày
    case diffHours > 96: // hơn 4 ngày
      return 2; // Giá ưu đãi nếu đặt trước 4-5 ngày
    case diffHours > 72:
      return 2.5; // Giá rẻ nhất nếu đặt trước 3-4 ngày
    case diffHours > 48:
      return 3; // Giá ưu đãi nếu đặt trước 2-3 ngày
    case diffHours > 24:
      return 3.5; // Giá trung bình nếu đặt trước 1-2 ngày
    case diffHours > 12:
      return 4; // Giá cao nếu đặt trước 12-24 giờ
    case diffHours > 0:
      return 5; // Giá rất cao nếu đặt sát giờ bay
    default:
      return -1; // Chuyến bay đã khởi hành
  }
}

const FlightPriceHelper = (DepartureTime) => {
  const now = new Date();
  const departure = new Date(DepartureTime);
  const diffHours = (departure - now) / (1000 * 60 * 60);

  console.log(`Current time: ${now}`);
  console.log(`Departure time: ${departure}`);
  console.log(`Difference in hours: ${diffHours}`);

  return (calculatePrice(diffHours) * basePrice);
}