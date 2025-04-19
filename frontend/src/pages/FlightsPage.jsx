import { useState } from "react";
import flightsMock from "../data/flights.json";

export default function FlightsPage() {
  const [query, setQuery] = useState({ from: "", to: "" });
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const matched = flightsMock.filter(
      f => f.from.includes(query.from) && f.to.includes(query.to)
    );
    setResults(matched);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tìm chuyến bay</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Điểm đi"
          value={query.from}
          onChange={(e) => setQuery({ ...query, from: e.target.value })}
          className="input"
        />
        <input
          type="text"
          placeholder="Điểm đến"
          value={query.to}
          onChange={(e) => setQuery({ ...query, to: e.target.value })}
          className="input"
        />
        <button onClick={handleSearch} className="btn">
          Tìm
        </button>
      </div>

      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((f, idx) => (
            <div key={idx} className="p-4 border rounded shadow">
              <div><b>{f.flightCode}</b> – {f.from} → {f.to}</div>
              <div>Giờ khởi hành: {f.departureTime}</div>
              <div>Máy bay: {f.aircraft}</div>
            </div>
          ))
        ) : (
          <div>Không có chuyến bay phù hợp.</div>
        )}
      </div>
    </div>
  );
}
