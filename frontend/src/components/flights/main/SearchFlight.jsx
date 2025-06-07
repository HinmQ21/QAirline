import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  ArrowRightLeft, 
  Search, 
  TrendingUp,
  Clock,
  Star,
  Users,
  Plane,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { airportApiObject } from '@/services/client/airport';

const popularDestinations = [
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', icon: '🏙️' },
  { code: 'HAN', city: 'Hanoi', country: 'Vietnam', icon: '🏛️' },
  { code: 'DAD', city: 'Da Nang', country: 'Vietnam', icon: '🏖️' },
  { code: 'NHA', city: 'Nha Trang', country: 'Vietnam', icon: '🌴' },
  { code: 'PQC', city: 'Phu Quoc', country: 'Vietnam', icon: '🏝️' },
  { code: 'DLI', city: 'Da Lat', country: 'Vietnam', icon: '🌸' }
];

const quickDateOptions = [
  { label: 'Hôm nay', days: 0 },
  { label: 'Ngày mai', days: 1 },
  { label: 'Cuối tuần này', days: 'weekend' },
  { label: 'Tuần sau', days: 7 },
];

export const SearchFlight = ({ 
  onSearch, 
  startAirport, 
  setStartAirport, 
  endAirport, 
  setEndAirport,
  maxPrice,
  setMaxPrice 
}) => {
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [airports, setAirports] = useState([]);
  const [showDepartureAirports, setShowDepartureAirports] = useState(false);
  const [showArrivalAirports, setShowArrivalAirports] = useState(false);
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [showPopularDestinations, setShowPopularDestinations] = useState(false);

  // Fetch airports on component mount
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setLoadingAirports(true);
        const result = await airportApiObject.getAirportList({
          code: '',
          name: '',
          city: '',
          country: ''
        });
        setAirports(result || []);
      } catch (error) {
        console.error('Error fetching airports:', error);
      } finally {
        setLoadingAirports(false);
      }
    };
    fetchAirports();
  }, []);

  const filteredDepartureAirports = airports.filter(airport =>
    airport.code?.toLowerCase().includes(departureSearch.toLowerCase()) ||
    airport.name?.toLowerCase().includes(departureSearch.toLowerCase()) ||
    airport.city?.toLowerCase().includes(departureSearch.toLowerCase())
  );

  const filteredArrivalAirports = airports.filter(airport =>
    airport.code?.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
    airport.name?.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
    airport.city?.toLowerCase().includes(arrivalSearch.toLowerCase())
  );

  const handleSearch = () => {
    if (!startAirport || !endAirport || !departureDate) {
      alert('Vui lòng chọn đầy đủ thông tin tìm kiếm');
      return;
    }

    const searchParams = {
      departure_airport_id: startAirport.airport_id,
      arrival_airport_id: endAirport.airport_id,
      departure_date: dayjs(departureDate).format('YYYY-MM-DD'),
      return_date: isRoundTrip && returnDate ? dayjs(returnDate).format('YYYY-MM-DD') : undefined
    };

    onSearch?.(searchParams);
  };

  const swapAirports = () => {
    const temp = startAirport;
    setStartAirport(endAirport);
    setEndAirport(temp);
    setDepartureSearch(endAirport?.code || '');
    setArrivalSearch(temp?.code || '');
  };

  const formatDateForDisplay = (date) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const handleQuickDate = (option) => {
    const today = new Date();
    let targetDate;
    
    if (option.days === 'weekend') {
      // Get next Saturday
      const daysToSaturday = (6 - today.getDay()) % 7;
      targetDate = new Date(today.getTime() + (daysToSaturday || 7) * 24 * 60 * 60 * 1000);
    } else {
      targetDate = new Date(today.getTime() + option.days * 24 * 60 * 60 * 1000);
    }
    
    setDepartureDate(targetDate);
  };

  const handlePopularDestination = (destination) => {
    if (!startAirport) {
      // If no departure selected, set as departure
      const airport = airports.find(a => a.code === destination.code);
      if (airport) {
        setStartAirport(airport);
        setDepartureSearch(airport.code);
      }
    } else {
      // Set as arrival
      const airport = airports.find(a => a.code === destination.code);
      if (airport) {
        setEndAirport(airport);
        setArrivalSearch(airport.code);
      }
    }
    setShowPopularDestinations(false);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="border-2 border-gray-100 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Trip Type & Passengers */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Label className="text-sm font-semibold text-gray-700">Loại chuyến bay:</Label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        !isRoundTrip 
                          ? "bg-white text-red-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-800"
                      )}
                      onClick={() => setIsRoundTrip(false)}
                    >
                      Một chiều
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                        isRoundTrip 
                          ? "bg-white text-red-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-800"
                      )}
                      onClick={() => setIsRoundTrip(true)}
                    >
                      Khứ hồi
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium text-gray-700">Hành khách:</Label>
                <div className="flex items-center border rounded-lg">
                  <button
                    type="button"
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-medium">{passengers}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    onClick={() => setPassengers(Math.min(9, passengers + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Main Search Form */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {/* From Airport */}
              <div className="lg:col-span-2 space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-green-600" />
                  Điểm đi
                </Label>
                <Popover open={showDepartureAirports} onOpenChange={setShowDepartureAirports}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-14 border-2 hover:border-red-300 transition-colors"
                      onClick={() => setShowDepartureAirports(true)}
                    >
                      {startAirport ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{startAirport.code}</div>
                            <div className="text-xs text-gray-500">{startAirport.city}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-400">Bạn muốn bay từ đâu?</div>
                            <div className="text-xs text-gray-400">Chọn điểm khởi hành</div>
                          </div>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="start">
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Tìm sân bay, thành phố..."
                            value={departureSearch}
                            onChange={(e) => setDepartureSearch(e.target.value)}
                            className="pl-10 h-10"
                          />
                        </div>
                        {loadingAirports && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>

                      {/* Popular Destinations */}
                      {!departureSearch && (
                        <div className="mb-4">
                          <Label className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Điểm đến phổ biến
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {popularDestinations.slice(0, 4).map((dest) => (
                              <button
                                key={dest.code}
                                className="p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => handlePopularDestination(dest)}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{dest.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm">{dest.code}</div>
                                    <div className="text-xs text-gray-500">{dest.city}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="max-h-60 overflow-y-auto">
                        {filteredDepartureAirports.length > 0 ? (
                          filteredDepartureAirports.map((airport) => (
                            <div
                              key={airport.airport_id}
                              className="p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors"
                              onClick={() => {
                                setStartAirport(airport);
                                setDepartureSearch(airport.code);
                                setShowDepartureAirports(false);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Plane className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold">{airport.code} - {airport.name}</div>
                                  <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Không tìm thấy sân bay nào
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Swap Button */}
              <div className="flex items-end justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapAirports}
                  className="h-14 w-14 rounded-full border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200"
                >
                  <ArrowRightLeft className="h-5 w-5 text-gray-600" />
                </Button>
              </div>

              {/* To Airport */}
              <div className="lg:col-span-2 space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-red-600" />
                  Điểm đến
                </Label>
                <Popover open={showArrivalAirports} onOpenChange={setShowArrivalAirports}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-14 border-2 hover:border-red-300 transition-colors"
                      onClick={() => setShowArrivalAirports(true)}
                    >
                      {endAirport ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{endAirport.code}</div>
                            <div className="text-xs text-gray-500">{endAirport.city}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-400">Bạn muốn bay đến đâu?</div>
                            <div className="text-xs text-gray-400">Chọn điểm đến</div>
                          </div>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="start">
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Tìm sân bay, thành phố..."
                            value={arrivalSearch}
                            onChange={(e) => setArrivalSearch(e.target.value)}
                            className="pl-10 h-10"
                          />
                        </div>
                        {loadingAirports && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>

                      {/* Popular Destinations */}
                      {!arrivalSearch && (
                        <div className="mb-4">
                          <Label className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Điểm đến phổ biến
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {popularDestinations.slice(0, 4).map((dest) => (
                              <button
                                key={dest.code}
                                className="p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => handlePopularDestination(dest)}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{dest.icon}</span>
                                  <div>
                                    <div className="font-medium text-sm">{dest.code}</div>
                                    <div className="text-xs text-gray-500">{dest.city}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="max-h-60 overflow-y-auto">
                        {filteredArrivalAirports.length > 0 ? (
                          filteredArrivalAirports.map((airport) => (
                            <div
                              key={airport.airport_id}
                              className="p-3 hover:bg-red-50 cursor-pointer rounded-lg transition-colors"
                              onClick={() => {
                                setEndAirport(airport);
                                setArrivalSearch(airport.code);
                                setShowArrivalAirports(false);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <Plane className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                  <div className="font-semibold">{airport.code} - {airport.name}</div>
                                  <div className="text-sm text-gray-500">{airport.city}, {airport.country}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Không tìm thấy sân bay nào
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Departure Date */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1 text-blue-600" />
                  Ngày đi
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-2 hover:border-blue-300 transition-colors",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        <div>
                          {departureDate ? (
                            <>
                              <div className="font-semibold">{formatDateForDisplay(departureDate)}</div>
                              <div className="text-xs text-gray-500">{dayjs(departureDate).format('dddd')}</div>
                            </>
                          ) : (
                            <div className="text-gray-500">Chọn ngày</div>
                          )}
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4">
                      {/* Quick Date Options */}
                      <div className="mb-4">
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">Chọn nhanh</Label>
                        <div className="flex flex-wrap gap-2">
                          {quickDateOptions.map((option, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              onClick={() => handleQuickDate(option)}
                            >
                              {option.label === 'Today' ? 'Hôm nay' :
                               option.label === 'Tomorrow' ? 'Ngày mai' :
                               option.label === 'This Weekend' ? 'Cuối tuần này' :
                               option.label === 'Next Week' ? 'Tuần sau' : option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="rounded-lg border"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Return Date */}
              {isRoundTrip && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1 text-green-600" />
                    Ngày về
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 border-2 hover:border-green-300 transition-colors",
                          !returnDate && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <CalendarDays className="h-4 w-4 text-green-600" />
                          <div>
                            {returnDate ? (
                              <>
                                <div className="font-semibold">{formatDateForDisplay(returnDate)}</div>
                                <div className="text-xs text-gray-500">{dayjs(returnDate).format('dddd')}</div>
                              </>
                            ) : (
                              <div className="text-gray-500">Chọn ngày về</div>
                            )}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => date < (departureDate || new Date())}
                        initialFocus
                        className="rounded-lg border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Price Filter */}
              <div className="space-y-3 mt-2">
                <Label className="text-sm font-semibold text-gray-700">Giá tối đa (VND)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Nhập ngân sách tối đa"
                    value={maxPrice}
                    min="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cập nhật nếu value là số dương hoặc chuỗi rỗng
                      if (value === "" || parseInt(value) >= 0) {
                        setMaxPrice(value);
                      }
                    }}
                    className="h-12 pl-10 border-2 hover:border-gray-300 transition-colors"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">₫</div>
                </div>
              </div>
            </div>

            {/* Popular Routes Section */}
            <div className="pt-6 border-t border-gray-200">
              <Label className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Tuyến bay phổ biến
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {popularDestinations.map((dest, index) => (
                  <button
                    key={dest.code}
                    className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 hover:shadow-md group"
                    onClick={() => handlePopularDestination(dest)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                        {dest.icon}
                      </div>
                      <div className="font-bold text-sm text-gray-800">{dest.code}</div>
                      <div className="text-xs text-gray-600">{dest.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};