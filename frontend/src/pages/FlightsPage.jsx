import { 
  useState, 
  useEffect,
  useRef 
} from "react";

import { css } from "@/css/styles";

import { useServices } from "@/context/ServiceContext";
import { clientApi } from "@/services/client/main";
import { addPricetoFlights } from "@/util/FlightPriceHelper";
import { MainFlightCard } from "@/components/flights/main/FlightCard";
import { SearchFlight } from "@/components/flights/main/SearchFlight";
import { PeopleSelectModal } from "@/components/flights/main/PeopleSelectModal";

import { useNavigate } from "react-router-dom";



const itemsPerPage = 10; // Number of items to display per page

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}-${month}-${year}`;
}

export default function FlightsPage() {
  const navigate = useNavigate();
  // const [query, setQuery] = useState({ from: "", to: "" });
  const [results, setResults] = useState([]);

  const [startAirport, setStartAirport] = useState("");
  const [endAirport, setEndAirport] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [openPassengerModal, setOpenPassengerModal] = useState(false);
  const [people, setPeople] = useState(0);
  
  //booking context
  const { preBookingContext } = useServices();
  
  

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  //fetch flight data from API
  const getFlights = async () => {
    try {
      const res = await clientApi.getFlightPaged(itemsPerPage, page);
      if (res) {
        //set up for pagination
        const totalPages = res.pagination.totalPages;
        setTotalPages(totalPages);
        //set up the data for render
        if (res.data && res.data.length > 0) {
          // Add prices to flights
          const flightsWithPrices = addPricetoFlights(res.data);
          setResults(flightsWithPrices);
        }
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  }

  // fetch flight
  useEffect(() => {
    getFlights();
  }, [page]);

  const advancedFilter = (flights) => {
    //filter out the flights in the past

    // //filter Money
    if (maxPrice > 0) {
      flights = flights.filter(flight => flight.basePrice <= Number(maxPrice));
    }
    //filter the des and end
    if (startAirport) {
      flights = flights.filter(flight => {
        return startAirport.toLowerCase()
          .includes(flight.departureAirport.code.toLowerCase());
      })
    }
    if (endAirport) {
      flights = flights.filter(flight => {
        return endAirport.toLowerCase()
          .includes(flight.arrivalAirport.code.toLowerCase());
      })
    }
    return flights;
  }

  const navigatePageButton = (text, boundPageNumb, currentPage, isLowBound) => {
    const handleUpBoundClick = (p) => {
      setPage((p) => Math.min(boundPageNumb, p + 1));
    }
    const handleLowBoundClick = (p) => {
      setPage((p) => Math.max(1, p - 1));
    }
    return (
      <>
        <button
          className="px-3 py-1 rounded bg-gray-200 mb-4"
          disabled={currentPage == boundPageNumb}
          onClick={() => {
            if (isLowBound) {
              handleLowBoundClick();
            } else {c
              handleUpBoundClick();
            }
          }}
        >
          {text}
        </button>
      </>
    );
  }

  useEffect(() => {
    if (people > 0) {
      // //save tp context
      // preBookingContext.setBooking({
      //   flights: {
      //     departureAirport: startAirport,
      //     arrivalAirport: endAirport,
      //     departureTime: new Date({})
      //   },
      //   passengers: people
      // })
      navigate('/book/availability');
    }
  }, [people]);

  return (
    <>
      <div className={`${css.minipage.xl} ${css.minipagemx}`}>
        <div className="mx-100px lg:mx-200px xl:mx-250px my-10">
          <h2 className="flex justify-center items-center p-4 text-2xl font-bold">Flights with cost-effective prices to popular destination</h2>

          <SearchFlight 
            startAirport={startAirport}
            setStartAirport={setStartAirport}
            endAirport={endAirport}
            setEndAirport={setEndAirport}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />

          <div className="flex flex-wrap justify-center items-center gap-6 pb-8">
            {results.length > 0 ? (
              advancedFilter(results).map((f, idx) => (
                <div key={idx}>
                  <MainFlightCard flight={f} formatTime={formatDateTime} setIsOpen={setOpenPassengerModal} />
                </div>
              ))
            ) : (
              <div>Không có chuyến bay phù hợp.</div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {navigatePageButton("Previous", 1, page, true)}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded mb-4 ${page === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {navigatePageButton("Next", totalPages, page, false)}
          </div>
        </div>
      </div> 

      {openPassengerModal && (
        <PeopleSelectModal 
          isOpen={openPassengerModal}
          setIsOpen={setOpenPassengerModal}
          setTotal={setPeople}          
        />
      )}
    </>
  );
}
