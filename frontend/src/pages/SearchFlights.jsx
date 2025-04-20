import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

const flights = [
  {
    id: "QA41",
    time: "15:30 to 17:30",
    aircraft: "Boeing 737",
    eco: 600000,
    business: null,
    skyboss: null,
    booked: {
      eco: 73,
      business: 50,
      skyboss: 15,
    },
  },
  {
    id: "QA84",
    time: "07:30 to 11:30",
    aircraft: "Boeing 787",
    eco: 600000,
    business: 1500000,
    skyboss: 4000000,
    booked: {
      eco: 114,
      business: 36,
      skyboss: 5,
    },
  },
  {
    id: "QA85",
    time: "12:00 to 15:00",
    aircraft: "Airbus A320",
    eco: 400000,
    business: 2000000,
    skyboss: 5000000,
    booked: {
      eco: 73,
      business: 17,
      skyboss: 6,
    },
  },
  // Add more flights as needed
];

const FlightSearchPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelect = (flightId, price) => {
    setSelectedFlight({ flightId, price });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-red-600">QAirline</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div className="bg-yellow-400 p-4 rounded-lg text-black font-semibold mb-4">
            One-way flight | 1 adults, 2 children, 1 infants ✈️ Ho Chi Minh City ➝ Hanoi
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-4">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className={`bg-white rounded-lg shadow p-4 flex justify-between items-center cursor-pointer border ${
                    selectedFlight?.flightId === flight.id ? "border-red-500" : "border-transparent"
                  }`}
                  onClick={() => handleSelect(flight.id, flight.eco)}
                >
                  <div>
                    <div className="text-lg font-semibold">{flight.id}</div>
                    <div className="text-sm text-gray-500">{flight.time}</div>
                    <div className="text-xs text-orange-600">{flight.aircraft} - Direct flight</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-700">
                      {flight.eco?.toLocaleString()} VND
                    </div>
                    <div className="text-sm text-gray-400">
                      {flight.booked.eco}/180 Booked
                    </div>
                  </div>
                  <div>
                    {selectedFlight?.flightId === flight.id ? (
                      <CheckCircle className="text-red-500" />
                    ) : (
                      <Circle className="text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Info */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-red-600 mb-2">BOOKING INFORMATION</h2>
              <div className="text-sm mb-2">Customer information</div>
              <div className="text-sm mb-2">
                Departure Flight: <span className="font-semibold text-blue-500">Ho Chi Minh City ➝ Hanoi</span>
              </div>
              <div className="text-sm mb-2">Price: {selectedFlight?.price?.toLocaleString() || "--"} VND</div>
              <div className="text-sm mb-2">Tax, fare: -- VND</div>
              <div className="text-sm mb-2">Services: 0 VND</div>
              <div className="text-lg font-bold text-red-600 mt-4">
                Total price: {selectedFlight?.price?.toLocaleString() || 0} VND
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow px-6 py-4 sticky bottom-0">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Total price: {selectedFlight?.price?.toLocaleString() || 0} VND
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
};

export default FlightSearchPage;
