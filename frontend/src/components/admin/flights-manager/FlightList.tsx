import { FlightCard } from "./FlightCard";
import { FlightCardSkeleton } from "./FlightCardSkeleton";
import { Plane, Search } from "lucide-react";

interface Airport {
  airport_id: number;
  code: string;
  name: string;
  city: string;
  country: string;
}

interface Airplane {
  airplane_id: number;
  code: string;
  manufacturer: string;
  model: string;
  total_seats: number;
}

interface Flight {
  flight_id: number;
  flight_number: string;
  airplane_id: number;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  departureAirport?: Airport;
  arrivalAirport?: Airport;
  Airplane?: Airplane;
  created_at: string;
  updated_at: string;
}

type FlightListProps = {
  isLoading: boolean;
  flightList: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (flightId: number) => void;
}

export const FlightList = ({
  isLoading, 
  flightList,
  onEdit,
  onDelete
}: FlightListProps) => {
  if (isLoading === false && flightList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy chuyến bay</h3>
        <p className="text-gray-500 max-w-md">
          Không có chuyến bay nào trong hệ thống. Hãy thêm chuyến bay mới để bắt đầu quản lý.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      {!isLoading && flightList.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {flightList.length} chuyến bay trên trang này
            </span>
          </div>
        </div>
      )}

      {/* Grid Layout - 3 columns for flights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show 9 skeletons for 3x3 grid
          Array(9).fill(0).map((_, i) => <FlightCardSkeleton key={i} />)
        ) : (
          flightList.map((flight) => (
            <FlightCard 
              key={flight.flight_id} 
              flight={flight}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}; 