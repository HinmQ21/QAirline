import React from 'react';
import {
  UseState,
} from 'react';

const formatVND 
= (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export const MainFlightCard = ({flight, formatTime, pressBooking }) => {

  return (
    <>
      <div className="w-80 rounded-xl overflow-hidden shadow-xl bg-white">
          {/* Flight Image */}
          <img
            src="/home/tokyo.jpg" // Replace with your flight image
            alt="Flight"
            className="w-full h-40 object-cover"
          />

          {/* Flight Info */}
          <div className="p-4">
            {/* Route */}
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
              ✈️ {flight.departureAirport.city} - {flight.departureAirport.country}
            </div>
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
              ✈️ {flight.arrivalAirport.city} - {flight.arrivalAirport.country}
            </div>  

            {/* Date */}
            <p className="text-sm text-gray-500 mt-1">
              Departure Date: {formatTime(flight.departure_time)}
            </p>

            {/* Price */}
            <div className="mt-2">
              <p className="text-red-600 text-xl font-bold"> {formatVND(flight.basePrice)}</p>
              <p className="text-xs text-gray-500">
                
              </p>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3"
            onClick={() => setIsOpen(true)}
          >
            Book Now
          </button>
        </div>
    </>
  );
}