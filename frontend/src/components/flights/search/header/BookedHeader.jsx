
import { FlightRecap } from "../FlightRecap";

import { LuPlaneTakeoff } from "react-icons/lu";

import { useServices } from "@/context/ServiceContext";
import { useEffect } from "react";


export const BookedHeader = ({ }) => {
  const { preBookingContext } = useServices();
  const flight = preBookingContext.getBooking().flight;
  const passenger = preBookingContext.getBooking().passengers;
  const departureAirport = flight.departureAirport;
  const arrivalAirport = flight.arrivalAirport;
  const departure_time = new Date(flight.departure_time);
  const arrival_time = new Date(flight.arrival_time);
  
  useEffect(() => {
    console.log("passenger", passenger);
    console.log("departureAirport", departureAirport);
    console.log("arrivalAirport", arrivalAirport);
    console.log("departure_time", departure_time);
    console.log("arrival_time", arrival_time);

  }, []);

  return (
    <>
      {/* RecapHeader */}
      <div className="h-20 w-full px-10 items-center justify-center flex">
        <div className="w-9/10 h-full flex flex-row justify-between ">
          <div className="w-7/10 h-full py-2 flex">
            {/* Flight Recap */}
            <FlightRecap from={departureAirport} to={arrivalAirport} roundtrip={true} 
            start={departure_time} end={arrival_time} passanger={passenger}/>
            
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
    </>
  );
}