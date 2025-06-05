import { useState } from "react";
import { User } from "lucide-react";


export const FlightBooking = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState("");

  return (
    <div className="text-white mt-10 mx-10 lg:mx-20 w-fit md:w-[60%] xl:w-[40%]">
      <h1 className="inter-semibold text-3xl sm:text-5xl font-bold mb-4">
        EXPERIENCE THE FUTURE OF AIR TRAVEL
      </h1>
      <p className="text-gray-300 text-base lg:text-lg mb-10">
        Book your premium flights with speed, safety, and style.
      </p>

      <div className="bg-white p-5 rounded-lg shadow border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            placeholder="From"
            value={from}  
            onChange={(e) => setFrom(e.target.value)}
            className="bg-gray-100 text-black p-3 rounded border-3"
          />
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-gray-100 text-black p-3 rounded border-3  "
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 items-center">
          <div className="flex items-center gap-2 bg-gray-100 p-3 rounded border-3">
            <User className="w-5 h-5 text-gray-600" />
            <input
              type="number"
              min="1"
              placeholder="Passengers"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="bg-transparent w-full outline-none text-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <button className="bg-black hover:bg-gray-800 text-white p-3 rounded transition">
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
};