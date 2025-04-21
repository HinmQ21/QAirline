import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { LuPlaneTakeoff } from "react-icons/lu";
import { Header } from "../components/Header";
import { RoundTrip } from "../components/flights/search/RoundTrip";


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

  const TicketColumn = ({ label, price = 0, booked, total, color }) => {
    const allBooked = booked >= total;
  
    return (
      <div className="flex-1 px-2 text-center">
        {allBooked ? (
          <div className="text-gray-400 italic">
            <div className="flex justify-center mb-1">
              <Circle className="w-5 h-5" />
            </div>
            <div>All Tickets Booked</div>
          </div>
        ) : (
          <>
            <div className={`text-xl font-semibold text-${color}-700`}>
              {price.toLocaleString()}<span className="text-sm">.000</span>
            </div>
            <div className="text-xs text-green-600">{booked}/{total} Booked</div>
          </>
        )}
      </div>
    );
  };

  const FlightSelector = ({ flights, selectedFlight, handleSelect }) => {
    return (
      <div className="w-200 col-span-1 space-y-4 ">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-0  ">
          <div className="col-span-1 w-32 "></div>  
          <div className=" col-span-1 bg-green-600 text-white text-center py-2 rounded-tl-xl font-bold">ECO</div>
          <div className=" col-span-1 bg-yellow-400 text-white text-center py-2 font-bold">BUSINESS</div>
          <div className=" col-span-1 bg-red-600 text-white text-center py-2 font-bold rounded-tr-xl">skyBOSS</div>
        </div>

        {/* Flight Options */}
        {flights.map((flight) => (
          <div
            key={flight.id}
            className={`bg-white rounded-lg shadow-md p-2 flex items-center border ${
              selectedFlight?.flightId === flight.id ? "border-red-500" : "border-transparent"
            }`}
            onClick={() => handleSelect(flight.id, flight.eco)}
          >
            {/* 3 Columns for Ticket Types */}
            <div className="flex flex-1 divide-x divide-dashed divide-gray-300">
              {/* Flight Info */}
              <div className="flex flex-col text-right ml-6 w-60">
                <div className="text-yellow-500 font-semibold text-sm">{flight.id}</div>
                <div className="text-black font-bold text-lg">{flight.time.split(" - ")[0]}</div>
                <div className="text-black font-bold text-lg">→ {flight.time.split(" - ")[1]}</div>
                <div className="text-xs text-gray-600">{flight.aircraft}</div>
                <div className="text-xs text-orange-600">Direct flight</div>
              </div>

              <TicketColumn
                label="ECO"
                price={flight.eco}
                booked={flight.booked.eco}
                total={180}
                color="green"
              />
              <TicketColumn
                label="BUSINESS"
                price={flight.business}
                booked={flight.booked.business}
                total={50}
                color="yellow"
              />
              <TicketColumn
                label="skyBOSS"
                price={flight.skyboss}
                booked={flight.booked.skyboss}
                total={15}
                color="red"
              />
            </div>

            
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex-1 w-full h-full mt-14">
        <div className="h-25 w-full bg-black px-10 items-center justify-center flex">
          <div className="w-9/10 h-full flex flex-row justify-between ">
            <div className="w-1/2 h-full py-2">
              {/* RoundTrip */}
              <RoundTrip />

              
            </div>
            <div className="w-1/5 h-full bg-white">

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlightSearchPage;
