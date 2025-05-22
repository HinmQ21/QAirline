import { useState } from "react";
import flightsMock from "../data/flights.json";
import { Header } from "../components/Header";
import { LuPlaneTakeoff } from "react-icons/lu";
import { LuPlaneLanding } from "react-icons/lu";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MiniPage } from "@/components/MiniPage";



export default function FlightsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({ from: "", to: "" });
  const [results, setResults] = useState(flightsMock);
  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

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

  const inputStyle = "border border-gray-300 rounded p-2 w-full";
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
  return <>
    <MiniPage>
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
              <div key={idx} className="w-80 rounded-xl overflow-hidden shadow-xl bg-white">
                {/* Flight Image */}
                <img
                  src="/home/tokyo.jpg" // Replace with your flight image
                  alt="Flight"
                  className="w-full h-40 object-cover"
                />

                {/* Flight Info */}
                <div className="p-4">
                  {/* Route */}
                  <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                    ✈️ {f.from}
                  </div>
                  <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                    ✈️ {f.to}
                  </div>

                  {/* Date */}
                  <p className="text-sm text-gray-500 mt-1">Departure Date: {f.departureTime}</p>

                  {/* Price */}
                  <div className="mt-2">
                    <p className="text-red-600 text-xl font-bold">{f.price} VNĐ</p>
                    <p className="text-xs text-gray-500">{f.type}</p>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3"
                  onClick={() => setIsOpen(true)}
                >
                  Book Now
                </button>
              </div>

            ))
          ) : (
            <div>Không có chuyến bay phù hợp.</div>
          )}
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
