import { useState } from "react";
import flightsMock from "../data/flights.json";
import { Header } from "../components/Header";


export default function FlightsPage() {
  const [query, setQuery] = useState({ from: "", to: "" });
  const [results, setResults] = useState([
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
    {
      flightCode: "VN123",
      from: "Hà Nội",
      to: "TP.HCM",
      departureTime: "2023-10-01 10:00",
      type: "Eco",
      price: "1,500,000",
    },
  ]);

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
        <div className="flex items-center border border-gray-300 rounded p-2 bg-white">
          {Icon && <Icon className="w-5 h-5 text-gray-500 mr-2" />}
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
    </div>
      </div>
    );
  };
  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-24 bg-black z-40"></div>
      <Header isAtTop={true} className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />
      <div className="pt-24 mx-[100px] lg:mx-[200px] xl:mx-[250px]">
        <h2 className="flex justify-center items-center m-4 text-2xl font-bold">Flights with cost-effective prices to popular destination</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4 mb-8">
          {flightsearchInput(
            "Start Destination",
            query.from,
            (e) => setQuery({ ...query, from: e.target.value }),
             // Pass the icon component
          )}
          {flightsearchInput(
            "End Destination",
            query.to,
            (e) => setQuery({ ...query, to: e.target.value }),
             // Pass the icon component
          )}
          {flightsearchInput(
            "Maximum Price",
            query.to,
            (e) => setQuery({ ...query, to: e.target.value }),
            
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
                <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3">
                  Book Now
                </button>
              </div>

            ))
          ) : (
            <div>Không có chuyến bay phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
}
