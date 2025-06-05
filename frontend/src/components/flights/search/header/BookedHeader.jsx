
import { FlightRecap } from "../FlightRecap";

import { LuPlaneTakeoff } from "react-icons/lu";

import { useServices } from "@/context/ServiceContext";


export const BookedHeader = ({ }) => {

  const testStart = new Date(2025, 3, 22);
  const testEnd = new Date(2025, 4, 7);
  const passanger = 1;

  const { preBookingContext } = useServices();

  return (
    <>
      {/* RecapHeader */}
      <div className="h-20 w-full px-10 items-center justify-center flex">
        <div className="w-9/10 h-full flex flex-row justify-between ">
          <div className="w-3/5 h-full py-2 flex">
            {/* Flight Recap */}
            <FlightRecap from="CGK" to="DPS" roundtrip={true} start={testStart} end={testEnd} passanger={passanger}/>
            
              <p className="text-white">{preBookingContext.getBooking().flight.basePrice}</p>
            
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