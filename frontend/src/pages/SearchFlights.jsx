import React, { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { LuPlaneTakeoff } from "react-icons/lu";
import { Header } from "../components/Header";
import { FlightRecap } from "../components/flights/search/FlightRecap";
import { SortFlight } from "../components/flights/search/SortFlight"
import { FlightCard } from "../components/flights/search/FlightCard";

import { Footer } from "../components/Footer";


const flights = [
  {
    id: "QA41",
    depatureTime: "15:30",
    arrivalTime: "17:30",
    aircraft: "Boeing 737",
    price: {
      eco: 4000000,
      business: 6000000,
    },
    slot: {
      eco: 100,
      business: 100,
    },
    booked: {
      eco: 93,
      business: 90,
    }

  },  
  {
    id: "QA42",
    depatureTime: "15:30",
    arrivalTime: "17:30",
    aircraft: "Boeing 734",
    price: {
      eco: 4000000,
      business: 6000000,
    },
    slot: {
      eco: 100,
      business: 50,
    },
    booked: {
      eco: 53,
      business: 42,
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

  const testStart = new Date(2025, 3, 22);
  const testEnd = new Date(2025, 4, 7);
  const passanger = 1;
  const destImage = "/home/hanoi.jpg";

  return (
    <>
      <div className="flex-1 w-full h-full mt-14">
        {/* RecapHeader */}
        <div className="h-20 w-full bg-black px-10 items-center justify-center flex">
          <div className="w-9/10 h-full flex flex-row justify-between ">
            <div className="w-3/5 h-full py-2 flex">
              {/* Flight Recap */}
              <FlightRecap from="CGK" to="DPS" roundtrip={true} start={testStart} end={testEnd} passanger={passanger}/>
            </div>
            <div className="w-1/5 h-full flex justify-center items-center">
              <button className="w-3/5 h-full flex flex-col justify-center items-center 
                                bg-red-600 hover:bg-red-700 cursor-pointer
                                transition duration-300 ease-in-out
                                ">
                <LuPlaneTakeoff className="w-6 h-6 text-white"/>
                <p className="text-white">Dat cho</p>
              </button>
            </div>
          </div>
        </div>
        {/* Destination */}
        <div className="w-full h-50">
          <img
            src={destImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Main  */}
        <div className="w-full h-screen flex justify-center bg-white">
            <div className="w-8/10 h-fit flex flex-col mt-4 gap-4">
              <SortFlight />
              {(flights.length > 0) ? (
                flights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight} 
                  />
                ))
              ) : (
                <>
                  <p>No flight available</p>
                </>
              )}
            </div>              
        </div>
          
        {/* Footer */}
           
          <Footer />
        
      </div>
    </>
  );
};

export default FlightSearchPage;
