import {
  useState,
  useEffect,
  useRef
} from "react";

import { css } from "@/css/styles";

import { useServices } from "@/context/ServiceContext";
import { flightApiObject } from "@/services/client/flight";
import { addPricetoFlights } from "@/util/FlightPriceHelper";
import { MainFlightCard } from "@/components/flights/main/FlightCard";
import { SearchFlight } from "@/components/flights/main/SearchFlight";
import { PeopleSelectModal } from "@/components/flights/main/PeopleSelectModal";
import { FlightFilters } from "@/components/flights/main/FlightFilters";
import { SearchLoadingOverlay } from "@/components/flights/main/SearchLoadingOverlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Plane, RefreshCw, TrendingUp, Filter,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';

const itemsPerPage = 12;

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
  const [results, setResults] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentSearchParams, setCurrentSearchParams] = useState(null);

  const [startAirport, setStartAirport] = useState(null);
  const [endAirport, setEndAirport] = useState(null);
  const [maxPrice, setMaxPrice] = useState("");
  const [openPassengerModal, setOpenPassengerModal] = useState(false);
  const [people, setPeople] = useState(0);
  const [filters, setFilters] = useState({});

  // Booking context
  const { preBookingContext } = useServices();

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  // Fetch flight data from API (default view)
  const getFlights = async () => {
    try {
      setLoading(true);
      const res = await flightApiObject.getFlightPaged(itemsPerPage, page);
      if (res) {
        const totalPages = res.pagination.totalPages;
        setTotalPages(totalPages);
        if (res.data && res.data.length > 0) {
          const flightsWithPrices = addPricetoFlights(res.data);
          setResults(flightsWithPrices);
        }
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search flights using the search API
  const handleSearch = async (searchParams) => {
    try {
      setSearchLoading(true);
      setSearchMode(true);

      // Set current search params for the loading overlay
      setCurrentSearchParams({
        fromAirport: startAirport,
        toAirport: endAirport,
        departureDate: dayjs(searchParams.departure_date).format('MMM DD, YYYY'),
      });

      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(searchParams);
      const res = await flightApiObject.searchFlights(
        searchParams.departure_airport_id,
        searchParams.arrival_airport_id,
        searchParams.departure_date,
      );
      console.log(res);

      if (res && res.data) {
        setSearchResults(res.data);
        setShowFilters(true);
      }
    } catch (error) {
      console.error("Error searching flights:", error);
      // Show user-friendly error message
      alert("Không thể tìm kiếm chuyến bay. Vui lòng thử lại sau.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search and return to browse mode
  const clearSearch = () => {
    setSearchMode(false);
    setSearchResults(null);
    setStartAirport(null);
    setEndAirport(null);
    setMaxPrice("");
    setFilters({});
    setShowFilters(false);
    setCurrentSearchParams(null);
    getFlights();
  };

  // Refresh current search
  const refreshSearch = () => {
    if (currentSearchParams && startAirport && endAirport) {
      handleSearch({
        departure_airport_id: startAirport.airport_id,
        arrival_airport_id: endAirport.airport_id,
        departure_date: currentSearchParams.departureDate,
      });
    }
  };

  // Fetch flights on component mount and page change
  useEffect(() => {
    if (!searchMode) {
      getFlights();
    }
  }, [page, searchMode]);

  const applyAdvancedFilters = (flights) => {
    let filteredFlights = [...flights];

    // Filter by basic max price
    if (maxPrice && Number(maxPrice) > 0) {
      filteredFlights = filteredFlights.filter(flight =>
        flight.basePrice <= Number(maxPrice)
      );
    }

    // Filter by advanced price range
    if (filters.minPrice && Number(filters.minPrice) > 0) {
      filteredFlights = filteredFlights.filter(flight =>
        flight.basePrice >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice && Number(filters.maxPrice) > 0) {
      filteredFlights = filteredFlights.filter(flight =>
        flight.basePrice <= Number(filters.maxPrice)
      );
    }

    // Filter by departure time
    if (filters.departureTime && filters.departureTime.length > 0) {
      filteredFlights = filteredFlights.filter(flight => {
        const departureHour = new Date(flight.departure_time).getHours();
        return filters.departureTime.some(timeSlot => {
          switch (timeSlot) {
            case 'early-morning': return departureHour >= 6 && departureHour < 9;
            case 'morning': return departureHour >= 9 && departureHour < 12;
            case 'afternoon': return departureHour >= 12 && departureHour < 18;
            case 'evening': return departureHour >= 18 && departureHour < 22;
            case 'night': return departureHour >= 22 || departureHour < 6;
            default: return false;
          }
        });
      });
    }

    // Filter by flight duration
    if (filters.duration && filters.duration !== 'any') {
      filteredFlights = filteredFlights.filter(flight => {
        const duration = Math.abs(new Date(flight.arrival_time) - new Date(flight.departure_time));
        const hours = duration / (1000 * 60 * 60);

        switch (filters.duration) {
          case 'short': return hours < 2;
          case 'medium': return hours >= 2 && hours <= 5;
          case 'long': return hours > 5;
          default: return true;
        }
      });
    }

    // TODO: remove this or no?
    // Legacy airport code filters (for backward compatibility)
    // if (startAirport && typeof startAirport === 'string') {
    //   filteredFlights = filteredFlights.filter(flight => {
    //     return startAirport.toLowerCase()
    //       .includes(flight.departureAirport.code.toLowerCase());
    //   });
    // }

    // if (endAirport && typeof endAirport === 'string') {
    //   filteredFlights = filteredFlights.filter(flight => {
    //     return endAirport.toLowerCase()
    //       .includes(flight.arrivalAirport.code.toLowerCase());
    //   });
    // }

    return filteredFlights;
  };

  const navigatePageButton = (text, boundPageNumb, currentPage, isLowBound) => {
    const handleUpBoundClick = () => {
      if (currentPage < boundPageNumb) setPage(currentPage + 1);
    };
    const handleLowBoundClick = () => {
      if (currentPage > boundPageNumb) setPage(currentPage - 1);
    };

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={isLowBound ? handleLowBoundClick : handleUpBoundClick}
        disabled={
          isLowBound ? currentPage <= boundPageNumb : currentPage >= boundPageNumb
        }
        className="hover:bg-gray-50"
      >
        {text}
      </Button>
    );
  };

  useEffect(() => {
    if (people > 0) {
      // Navigate to booking page with passenger count
      const flight = preBookingContext.getBooking()?.flight;
      if (flight) {
        navigate(`/booking/${flight.flight_id}`, {
          state: {
            passengers: people
          }
        });
      }
    }
  }, [people, navigate, preBookingContext]);

  // Prepare flights to display
  const getFlightsToDisplay = () => {
    if (searchMode && searchResults) {
      // Combine departure and return flights
      const allFlights = [
        ...(searchResults.departureFlights?.flights || []),
        ...(searchResults.returnFlights?.flights || [])
      ];
      return addPricetoFlights(allFlights);
    }
    return results;
  };

  const flightsToDisplay = applyAdvancedFilters(getFlightsToDisplay());
  const totalFlights = (searchResults?.departureFlights?.count || 0) + (searchResults?.returnFlights?.count || 0);

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Header */}
        <div className="relative overflow-x-clip">
          <div className="relative z-10 px-4 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Tìm Chuyến Bay <span className="text-pink-300">Hoàn Hảo</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
                Khám phá các chuyến bay với giá cả hợp lý đến các điểm đến phổ biến trên toàn thế giới
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">200+</div>
                  <div className="text-gray-200 text-sm">Hãng Bay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-gray-200 text-sm">Tuyến Bay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-gray-200 text-sm">Hỗ Trợ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Tốt Nhất</div>
                  <div className="text-gray-200 text-sm">Giá Cả</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative z-20">
          {/* Search Component with enhanced styling */}
          <div className={`${css.minipagemx} p-8`}>
            <SearchFlight
              onSearch={handleSearch}
              startAirport={startAirport}
              setStartAirport={setStartAirport}
              endAirport={endAirport}
              setEndAirport={setEndAirport}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          {/* Search Results Header */}
          {searchMode && (
            <div className={`${css.minipagemx} mb-8 p-6`}>
              <div className="flex flex-wrap items-center justify-end gap-4">
                {searchResults && (
                  <Button
                    variant="outline"
                    size="sm"
                    className=""
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {totalFlights} chuyến bay được tìm thấy
                  </Button>
                )}
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  Xem Tất Cả Chuyến Bay
                </Button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`${css.minipagemx} grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8`}>
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="lg:col-span-1">
                <div className="rounded-xl shadow-lg sticky top-8">
                  <FlightFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              </div>
            )}

            {/* Flight Results */}
            <div className={`${showFilters ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {/* Loading State */}
              {loading && !searchLoading && (
                <div className="flex flex-col justify-center items-center mb-8">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-300" />
                    <div className="absolute inset-0 animate-ping">
                      <Loader2 className="h-12 w-12 text-gray-200" />
                    </div>
                  </div>
                  <span className="mt-4 text-lg text-white font-medium">
                    Đang tải các chuyến bay tuyệt vời cho bạn! 🛩
                  </span>
                </div>
              )}

              {/* Flight Results Grid */}
              {!loading && !searchLoading && (
                <>
                  <div className="mb-12">
                    {flightsToDisplay.length > 0 ? (
                      <div className="flex flex-wrap gap-6 justify-center mx-18">
                        {flightsToDisplay.map((flight, idx) => (
                          <div
                            key={`${flight.flight_id}-${idx}`}
                            className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                          >
                            <MainFlightCard
                              flight={flight}
                              formatTime={formatDateTime}
                              setIsOpen={setOpenPassengerModal}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-20 ${css.minipage.xl} ${css.minipagemx}`}>
                        <div className="max-w-md mx-auto">
                          <div className="relative mb-8">
                            <Plane className="h-20 w-20 text-gray-300 mx-auto" />
                            <div className="absolute inset-0 animate-pulse">
                              <Plane className="h-20 w-20 text-gray-200 mx-auto" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Không tìm thấy chuyến bay
                          </h3>
                          <p className="text-gray-600 mb-8 leading-relaxed">
                            {searchMode
                              ? "Chúng tôi không tìm thấy chuyến bay nào phù hợp với tiêu chí của bạn. Hãy thử điều chỉnh tham số tìm kiếm hoặc xem tất cả các chuyến bay hiện có."
                              : "Hiện không có chuyến bay nào. Vui lòng quay lại sau hoặc liên hệ đội ngũ hỗ trợ của chúng tôi."
                            }
                          </p>
                          <div className="flex flex-wrap justify-center gap-3">
                            {searchMode && (
                              <>
                                <Button
                                  onClick={clearSearch}
                                  className="text-white shadow-lg"
                                >
                                  <Plane className="w-4 h-4 mr-2" />
                                  Xem Tất Cả Chuyến Bay
                                </Button>
                                {Object.keys(filters).length > 0 && (
                                  <Button
                                    onClick={() => setFilters({})}
                                    variant="outline"
                                    className="border-gray-300"
                                  >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Xóa Bộ Lọc
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Enhanced Pagination */}
              {!searchMode && !loading && results.length > 0 && (
                <div className="flex justify-center items-center gap-2 p-6">
                  {navigatePageButton("Trước", 1, page, true)}
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (page <= 4) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = page - 3 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          className={
                            page === pageNum
                              ? "text-white shadow-lg"
                              : ""
                          }
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  {navigatePageButton("Sau", totalPages, page, false)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Loading Overlay */}
      <SearchLoadingOverlay
        isVisible={searchLoading}
        searchParams={currentSearchParams}
      />

      {/* Passenger Selection Modal */}
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
