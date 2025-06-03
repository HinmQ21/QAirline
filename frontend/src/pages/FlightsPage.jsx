import { 
  useState,
  useEffect,
} from "react"; 

// import flightsMock from "../data/flights.json";
import { getFlightPaged } from "../services/client/flight";
import { MainFlightCard } from "@/components/flights/main/FlightCard";

import { useNavigate } from "react-router-dom";
import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { MiniPage } from "@/components/misc/MiniPage";
import { FaFilterCircleDollar } from "react-icons/fa6";

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
  const [query, setQuery] = useState({ from: "", to: "" });
  const [results, setResults] = useState([]);
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(3);


  const updateCount = (type, delta) => {
    setPassengers((prev) => {
      const newCount = Math.max(0, (prev[type] || 0) + delta);
      return { ...prev, [type]: newCount };
    });
  };


  const handleSearch = () => {
    const matched = flightsMock.filter(
      f => f.from.includes(query.from) && f.to.includes(query.to)
    );
    setResults(matched);
  };

  const getFlights = async () => {
    try {
      const res = await getFlightPaged(itemsPerPage, page);
      if (res) {
        //set up for pagination
        const totalPages = res.pagination.totalPages;
        setTotalPages(totalPages);
        //set up the data for render
        if (res.data && res.data.length > 0) {
          setResults(res.data);
          console.log("Flight data fetched successfully:", res.data);
        } else {
          setResults([]);
        }
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  }

  useEffect(() => {
    // Fetch flights when the component mounts or when the page changes
    getFlights();
  }, [page]);

  // const inputStyle = "border border-gray-300 rounded p-2 w-full";
  const flightsearchInput = (placeholder, value, onChange, Icon) => {
    return (
      <div >
        <div className="flex flex-row border border-gray-300 rounded p-2 m-2 bg-white w-80">
          {Icon && <Icon className="w-5 h-5 text-gray-500 mr-2" />}
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent outline-none text-gray-700 w-full"
          />
        </div>
      </div>
    );
  };

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
            } else {
              handleUpBoundClick();
            }
          }}
        >
          {text}
        </button>
      </>
    );
  }
  return <>
    <MiniPage className="mx-30">
      <div className="mx-100px lg:mx-200px xl:mx-250px my-10">
        <h2 className="flex justify-center items-center p-4 text-2xl font-bold">Flights with cost-effective prices to popular destination</h2>

        <div className="m-4 mb-8 flex flex-wrap justify-center items-center w-full">
          {flightsearchInput(
            "Start Destination",
            query.from,
            (e) => setQuery({ ...query, from: e.target.value }),
            LuPlaneTakeoff // Pass the icon component
          )}
          {flightsearchInput(
            "End Destination",
            query.to,
            (e) => setQuery({ ...query, to: e.target.value }),
            LuPlaneLanding // Pass the icon component
          )}
          {flightsearchInput(
            "Maximum Price",
            query.to,
            (e) => setQuery({ ...query, to: e.target.value }),
            FaFilterCircleDollar
          )}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 pb-8">
          {results.length > 0 ? (
            results.map((f, idx) => (
              <div key={idx}>
                <MainFlightCard flight={f} formatTime={formatDateTime} />
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
    </MiniPage>

    {/* Modal */}
    {isOpen && (
      <>
        <div className="fixed inset-0 flex z-50 items-center justify-center overflow-hidden overscroll-contain bg-slate-700/30 transition-all duration-200 ">

          <div className="bg-white z-60 rounded-xl max-h-[calc(100vh-5em)] max-w-lg scale-90 overflow-y-auto overscroll-contain w-full p-6 transition-transform">
            <h2 className="text-center font-bold text-lg mb-4">Select Passengers</h2>

            {/* Passenger Types */}
            {["adult", "child", "infant"].map((type) => (
              <div key={type} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium capitalize">{type}</p>
                  <p className="text-sm text-gray-500">
                    {type === "adult" && "More than 12 years old"}
                    {type === "child" && "2-11 years old"}
                    {type === "infant" && "Less than 2 years old"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                    onClick={() => updateCount(type, -1)}
                  >
                    −
                  </button>
                  <span>{passengers[type]}</span>
                  <button
                    className="bg-red-500 text-white w-8 h-8 rounded-full"
                    onClick={() => updateCount(type, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              {/* Close Button */}
              <button
                className="w-[48%] bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>

              {/* Continue Button */}
              <button
                className="w-[48%] bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                onClick={() => {
                  // Add your logic for "Continue" here
                  setIsOpen(false);
                  navigate("/searchflights");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </>
    )}
  </>;
}
