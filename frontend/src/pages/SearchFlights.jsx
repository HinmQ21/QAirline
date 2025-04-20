import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Header } from "../components/Header";


const flights = [
  {
    id: "QA41",
    time: "15:30 → 17:30",
    aircraft: "Boeing 737",
    eco: 600000,
    business: 0,
    boss: 0,
    booked: {
      eco: 73,
      business: 50,
      boss: 15
    }
  },
  // Add more flights as needed
];



const FlightSearchPage = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelect = (flightId, price) => {
    setSelectedFlight({ flightId, price });
  };

  const FlightSelector = ({ flights, selectedFlight, handleSelect }) => {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-4 text-center text-sm font-semibold">
          <div></div>
          <div className="bg-green-600 text-white py-2 rounded-t-md">ECO</div>
          <div className="bg-yellow-500 text-white py-2 rounded-t-md">BUSINESS</div>
          <div className="bg-red-600 text-white py-2 rounded-t-md">skyBOSS</div>
        </div>
  
        {/* Flight Cards */}
        {flights.map((flight) => {
          const isSelected = selectedFlight?.flightId === flight.id;
          const getTicketInfo = (classType, totalSeats) => {
            const booked = flight.booked[classType];
            const remaining = totalSeats - booked;
            const price = flight[classType];
            return booked >= totalSeats ? (
              <div className="text-xs text-gray-500 italic">All Tickets Booked</div>
            ) : (
              <>
                <div className="text-base font-bold text-gray-800">
                  {price?.toLocaleString()} <span className="text-sm font-normal">VND</span>
                </div>
                <div className="text-xs text-green-600">
                  {booked}/{totalSeats} Booked
                </div>
              </>
            );
          };
  
          return (
            <div
              key={flight.id}
              className={`grid grid-cols-4 bg-white rounded-lg shadow-md p-4 border cursor-pointer items-center ${
                isSelected ? "border-red-500" : "border-transparent"
              }`}
              onClick={() => handleSelect(flight.id, flight.eco)}
            >
              {/* ECO */}
              <div className="text-center space-y-1">
                {getTicketInfo("eco", 180)}
              </div>
  
              {/* BUSINESS */}
              <div className="text-center space-y-1">
                {getTicketInfo("business", 50)}
              </div>
  
              {/* skyBOSS */}
              <div className="text-center space-y-1">
                {getTicketInfo("boss", 15)}
              </div>
  
              {/* Flight Info */}
              <div className="text-right space-y-1">
                <div className="text-yellow-500 font-semibold text-sm">{flight.id}</div>
                <div className="font-bold text-base text-gray-800">{flight.time}</div>
                <div className="text-xs text-gray-500">{flight.aircraft} - <span className="text-orange-600">Direct flight</span></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-24 bg-black z-30"></div>
      <Header isAtTop={true} className={`fixed top-0 left-0 w-full z-30 `} />

      <div className="flex flex-col h-screen mt-8">
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
              <FlightSelector
                flights={flights}
                selectedFlight={selectedFlight}
                handleSelect={handleSelect}
              />

              {/* Booking Info */}
              <div className="bg-white rounded-xl shadow-lg w-full max-w-sm text-sm">
                {/* Header */}
                <div className="bg-red-600 text-white text-center font-semibold py-2 rounded-t-xl">
                  BOOKING INFORMATION
                </div>

                {/* Customer Info */}
                <div className="bg-gray-100 px-4 py-2 border-b">
                  Customer information
                </div>

                {/* Departure Flight */}
                <div className="bg-blue-100 px-4 py-2 flex justify-between items-center border-b text-blue-600 font-semibold">
                  <span>Departure Flight</span>
                  <span>0 VND ✎</span>
                </div>

                {/* Route */}
                <div className="px-4 py-2 border-b">
                  <div className="font-bold text-gray-800">Ho Chi Minh City <span className="text-yellow-500">➜</span> Hanoi</div>
                  <div className="text-gray-500 text-xs">-- | -- | --</div>
                </div>

                {/* Price Details */}
                <div className="px-4 py-2 border-b">
                  <div className="flex justify-between py-1">
                    <span>Price</span>
                    <span className="text-red-500 font-semibold">-- VND</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax, fare</span>
                    <span className="text-red-500 font-semibold">-- VND</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Services</span>
                    <span className="text-red-500 font-semibold">0 VND</span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-red-100 px-4 py-3 font-bold text-red-600 flex justify-between rounded-b-xl">
                  <span>Total price</span>
                  <span>0 VND</span>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-lg px-6 py-4 sticky bottom-0 border-t border-gray-200">
          <div className="flex justify-center lg:justify-end lg:mr-[150px] md:mr-[100px] items-center gap-4">
            <div className="text-lg font-semibold">
              Total price: {selectedFlight?.price?.toLocaleString() || 0} VND
            </div>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Continue
            </button>
          </div>
        </footer>
      </div>
    </div>
    
  );
};

export default FlightSearchPage;
