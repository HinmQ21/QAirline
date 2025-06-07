import React, { useEffect, useState } from "react";

import { clientApi } from "@/services/client/main";
import { SortFlight } from "@/components/flights/search/SortFlight"
import { FlightCard } from "@/components/flights/search/FlightCard";
import { BookedHeader } from "@/components/flights/search/header/BookedHeader";




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
    depatureTime: "16:30",
    arrivalTime: "18:30",
    aircraft: "Boeing 734",
    price: {
      eco: 2000000,
      business: 4000000,
    },
    slot: {
      eco: 100,
      business: 100,
    },
    booked: {
      eco: 53,
      business: 98,
    }

  },
  {
    id: "QA43",
    depatureTime: "07:30",
    arrivalTime: "10:30",
    aircraft: "Boeing 777",
    price: {
      eco: 3000000,
      business: 5000000,
    },
    slot: {
      eco: 100,
      business: 100,
    },
    booked: {
      eco: 24,
      business: 14,
    }

  },
  {
    id: "QA45",
    depatureTime: "01:30",
    arrivalTime: "04:30",
    aircraft: "Boeing 345",
    price: {
      eco: 8000000,
      business: 9000000,
    },
    slot: {
      eco: 100,
      business: 100,
    },
    booked: {
      eco: 35,
      business: 46,
    }

  },        
  // Add more flights as needed
];



export const BookAvailability = () => {
  
  const [expandCard, setExpandedCard] = useState(false);
  const [sortOption, setSortOption] = useState("Mặc Định");
  const [flights, setFlights] = useState([]);

  const getFlightList = async () => {
    try {
      const res = await clientApi.getFlight();
      if (res) {
        console.log("Flight list fetched successfully:", res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Error fetching flight list:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchFlights = async () => {
      console.log("attempting to fetch flights");
      const flights = await getFlightList();
      setFlights(flights);
    };
    try {
      fetchFlights();
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  }, []);

  useEffect(() => {
    
  }, [flights]);

  const handleExpandCard = (flightId) => {
    setExpandedCard((prev) => (prev === flightId ? null : flightId));  
  }

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // const sortedFlights = [...flights].sort((a, b) => {
  //   if (sortOption === "Giá tốt nhất") {
  //     return a.price.eco - b.price.eco;
  //   } else if (sortOption === "Khởi hành sớm nhất") {
  //     return 0;
  //     // 
  //     //new Date(`2025-05-03T${a.depatureTime}:00`) - new Date(`2025-05-03T${b.depatureTime}:00`); 
  //     //
  //   } else {
  //     return 0; // Default sorting
  //   }
  // });

  

  return (
    <>
      <div className="flex-1 w-full h-full">
        <BookedHeader />
        {/* Main  */}
        <div className="w-full min-h-screen mb-12 flex justify-center">
            <div className="w-8/10 h-fit flex flex-col mt-4 gap-12 items-center">
              <SortFlight sortOption={sortOption} onSortChange={handleSortChange} />
              {(flights.length > 0) ? (
                flights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    OnToggle={() => handleExpandCard(flight.id)}
                  />
                ))
              ) : (
                <>
                  <p>Không có chuyến bay nào</p>
                </>
              )}
            </div>              
        </div>
      </div>
    </>
  );
};

