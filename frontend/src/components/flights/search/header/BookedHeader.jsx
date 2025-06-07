
import { FlightRecap } from "./FlightRecap";

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
      
        <div className="h-fit w-full xl:w-9/10 flex flex-row justify-between items-center">
          <div className="xl:ml-12 w-7/10 h-full flex">
            {/* Flight Recap */}
            <FlightRecap from={departureAirport} to={arrivalAirport} roundtrip={true} 
            start={departure_time} end={arrival_time} passanger={passenger}/>
            
          </div>
          
            <button className="w-[100px] lg:w-[150px] h-20 flex flex-col justify-center items-center     
                              bg-red-600 hover:bg-red-700 cursor-pointer
                              transition duration-300 ease-in-out
                              ">
              <LuPlaneTakeoff className="w-6 h-6 text-white"/>
              <p className="text-white">Dat cho</p>
            </button>
          
        </div>
         
    </>
  );
}