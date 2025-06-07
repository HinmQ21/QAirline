import React, { useEffect, useState } from "react";

import { clientApi } from "@/services/client/main";
import { FlightRecap } from "@/components/flights/search/FlightRecap";
import { SortFlight } from "@/components/flights/search/SortFlight"
import { FlightCard } from "@/components/flights/search/FlightCard";

import { LuPlaneTakeoff } from "react-icons/lu";


// const flights = [
//   {  
//     id: "QA41",
//     depatureTime: "15:30",
//     arrivalTime: "17:30",
//     aircraft: "Boeing 737",
//     price: {
//       eco: 4000000,
//       business: 6000000,
//     },
//     slot: {
//       eco: 100,
//       business: 100,
//     },
//     booked: {
//       eco: 93,
//       business: 90,
//     }

//   },  
//   {
//     id: "QA42",
//     depatureTime: "16:30",
//     arrivalTime: "18:30",
//     aircraft: "Boeing 734",
//     price: {
//       eco: 2000000,
//       business: 4000000,
//     },
//     slot: {
//       eco: 100,
//       business: 100,
//     },
//     booked: {
//       eco: 53,
//       business: 98,
//     }

//   },
//   {
//     id: "QA43",
//     depatureTime: "07:30",
//     arrivalTime: "10:30",
//     aircraft: "Boeing 777",
//     price: {
//       eco: 3000000,
//       business: 5000000,
//     },
//     slot: {
//       eco: 100,
//       business: 100,
//     },
//     booked: {
//       eco: 24,
//       business: 14,
//     }

//   },
//   {
//     id: "QA45",
//     depatureTime: "01:30",
//     arrivalTime: "04:30",
//     aircraft: "Boeing 345",
//     price: {
//       eco: 8000000,
//       business: 9000000,
//     },
//     slot: {
//       eco: 100,
//       business: 100,
//     },
//     booked: {
//       eco: 35,
//       business: 46,
//     }

//   },        
//   // Add more flights as needed
// ];



const FlightSearchPage = () => {
  
  const [expandCard, setExpandedCard] = useState(false);
  const [sortOption, setSortOption] = useState("Mac Dinh");
  const [flights, setFlights] = useState([]);

  const getFlightList = async () => {
    try {
      const res = await clientApi.getPlaneList();
      if (res) {
        console.log("Flight list fetched successfully:", res);
        return res;
      }
    } catch (error) {
      console.error("Error fetching flight list:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchFlights = async () => {
      console.log("attempting to fetch flights");
      const flights = getFlightList();
      setFlights(flights);
    };
    try {
      fetchFlights();
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  }, []);

  useEffect(() => {
    console.log("flight: ", flights);
  }, [flights]);

  const handleExpandCard = (flightId) => {
    setExpandedCard((prev) => (prev === flightId ? null : flightId));  
  }

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortOption === "Gia tot nhat") {
      return a.price.eco - b.price.eco;
    } else if (sortOption === "Khoi hanh som nhat") {
      return new Date(`2025-05-03T${a.depatureTime}:00`) - new Date(`2025-05-03T${b.depatureTime}:00`); 
    } else {
      return 0; // Default sorting
    }
  });

  const testStart = new Date(2025, 3, 22);
  const testEnd = new Date(2025, 4, 7);
  const passanger = 1;
  const destImage = "/home/hanoi.jpg";

  return (
    <>
      <div className="flex-1 w-full h-full">
        {/* RecapHeader */}
        <div className="h-20 w-full px-10 items-center justify-center flex">
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
        {/* TODO: nên uncomment chỗ này ko Thành ơi */}
        {/* Để em xem cách làm nó đẹp hơn */}
        {/* Comment lại đẹp hơn thật */}
        {/* <div className="w-full h-50">
          <img
            src={destImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div> */}

        {/* Main  */}
        <div className="w-full min-h-screen mb-12 flex justify-center">
            <div className="w-8/10 h-fit flex flex-col mt-4 gap-12 items-center">
              <SortFlight sortOption={sortOption} onSortChange={handleSortChange} />
              {(sortedFlights.length > 0) ? (
                sortedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    OnToggle={() => handleExpandCard(flight.id)}
                  />
                ))
              ) : (
                <>
                  <p>No flight available</p>
                </>
              )}
            </div>              
        </div>
      </div>
    </>
  );
};

export default FlightSearchPage;
