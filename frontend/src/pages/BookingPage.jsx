import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plane, 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Loader2
} from "lucide-react";
import { clientApi } from "@/services/client/main";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { calculateTicketPrice, formatCurrency } from '@/utils/pricing';

export default function BookingPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', dob: '', seat_id: null }]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Get passenger count from navigation state
  const passengerCount = location.state?.passengers || 1;

  // Debug authentication state
  useEffect(() => {
    const token = localStorage.getItem('userAccessToken');
    const user = localStorage.getItem('user');
    console.log('Auth debug - Token exists:', !!token);
    console.log('Auth debug - User data:', user ? JSON.parse(user) : null);
  }, []);

  // Initialize passengers array based on count
  useEffect(() => {
    const initialPassengers = Array.from({ length: passengerCount }, () => ({
      name: '',
      dob: '',
      seat_id: null
    }));
    setPassengers(initialPassengers);
  }, [passengerCount]);

  // Fetch flight details and available seats
  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        setLoading(true);
        
        // Fetch flight details
        const flightResponse = await clientApi.getFlightById(flightId);
        console.log('Flight response:', flightResponse);
        
        if (flightResponse.success && flightResponse.data) {
          setFlight(flightResponse.data);
          
          // Extract seats from flight.Airplane.Seats if available
          if (flightResponse.data.Airplane && flightResponse.data.Airplane.Seats) {
            const seats = flightResponse.data.Airplane.Seats.map(seat => ({
              seat_id: seat.seat_id,
              seat_number: seat.seat_number,
              class: seat.class,
              is_available: seat.is_available
            }));
            setAvailableSeats(seats);
          } else {
            // Fallback to mock data if seats not included
            console.log('No seats data from API, using mock data');
            const mockSeats = [];
            for (let i = 1; i <= 180; i++) {
              let seatClass = 'economy';
              if (i <= 12) seatClass = 'first';
              else if (i <= 36) seatClass = 'business';
              
              mockSeats.push({
                seat_id: i,
                seat_number: `${Math.ceil(i / 6)}${['A', 'B', 'C', 'D', 'E', 'F'][i % 6]}`,
                class: seatClass,
                is_available: Math.random() > 0.3 // 70% availability
              });
            }
            setAvailableSeats(mockSeats);
          }
        } else {
          throw new Error('Invalid response format');
        }
        
      } catch (error) {
        console.error('Error fetching flight data:', error);
        if (error.response?.status === 404) {
          toast.error('Không tìm thấy chuyến bay');
        } else {
          toast.error('Không thể tải thông tin chuyến bay');
        }
      } finally {
        setLoading(false);
      }
    };

    if (flightId) {
      fetchFlightData();
    }
  }, [flightId]);

  // Handle passenger info change
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  // Handle seat selection
  const handleSeatSelect = (passengerIndex, seatId) => {
    const updatedPassengers = [...passengers];
    const previousSeatId = updatedPassengers[passengerIndex].seat_id;
    
    // Remove previous seat from selected seats
    if (previousSeatId) {
      setSelectedSeats(prev => {
        const newSet = new Set(prev);
        newSet.delete(previousSeatId);
        return newSet;
      });
    }
    
    // Add new seat to selected seats
    setSelectedSeats(prev => new Set([...prev, seatId]));
    updatedPassengers[passengerIndex].seat_id = seatId;
    setPassengers(updatedPassengers);
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        errors.push(`Vui lòng nhập tên hành khách ${index + 1}`);
      }
      if (!passenger.seat_id) {
        errors.push(`Vui lòng chọn ghế cho hành khách ${index + 1}`);
      }
      if (passenger.dob && !dayjs(passenger.dob).isValid()) {
        errors.push(`Ngày sinh hành khách ${index + 1} không hợp lệ`);
      }
    });
    
    return errors;
  };

  // Submit booking
  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setSubmitting(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('userAccessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để đặt vé');
        navigate('/'); // Redirect to home page with login form
        return;
      }

      const bookingData = {
        flight_id: parseInt(flightId),
        passengers: passengers.map(p => ({
          name: p.name.trim(),
          dob: p.dob || undefined,
          seat_id: p.seat_id
        }))
      };

      console.log('Booking data being sent:', bookingData);

      const response = await clientApi.createBooking(bookingData);
      
      if (response.success) {
        setBookingResult(response.data);
        toast.success('Đặt vé thành công!');
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        console.log('Error response:', errorData);
        
        if (status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/');
        } else if (status === 400) {
          toast.error(errorData.message || 'Dữ liệu đặt vé không hợp lệ');
        } else if (status === 404) {
          toast.error('Không tìm thấy chuyến bay');
        } else {
          toast.error(errorData.message || 'Đã có lỗi xảy ra khi đặt vé');
        }
      } else if (error.request) {
        // Network error
        toast.error('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Other error
        toast.error(error.message || 'Đã có lỗi xảy ra khi đặt vé');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!flight) return 0;
    
    return passengers.reduce((total, passenger) => {
      if (passenger.seat_id) {
        const seat = availableSeats.find(s => s.seat_id === passenger.seat_id);
        if (seat) {
          const ticketPrice = calculateTicketPrice(seat.class);
          return total + ticketPrice;
        }
      }
      return total;
    }, 0);
  };

  // Render seat map
  const renderSeatMap = (passengerIndex) => {
    const seatsByClass = {
      first: availableSeats.filter(s => s.class === 'first'),
      business: availableSeats.filter(s => s.class === 'business'),
      economy: availableSeats.filter(s => s.class === 'economy')
    };

    return (
      <div className="space-y-6">
        {Object.entries(seatsByClass).map(([className, seats]) => (
          <div key={className} className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold capitalize">
                {className === 'first' ? 'Hạng nhất' : 
                 className === 'business' ? 'Hạng thương gia' : 'Hạng phổ thông'}
              </h4>
              <Badge variant={className === 'first' ? 'default' : className === 'business' ? 'secondary' : 'outline'}>
                {seats.filter(s => s.is_available && !selectedSeats.has(s.seat_id)).length} ghế trống
              </Badge>
            </div>
            
            <div className="grid grid-cols-6 gap-1 max-w-md">
              {seats.map((seat) => {
                const isSelected = passengers[passengerIndex]?.seat_id === seat.seat_id;
                const isOccupied = selectedSeats.has(seat.seat_id) && !isSelected;
                const isAvailable = seat.is_available && !isOccupied;
                
                return (
                  <button
                    key={seat.seat_id}
                    onClick={() => isAvailable && handleSeatSelect(passengerIndex, seat.seat_id)}
                    disabled={!isAvailable}
                    className={`
                      w-8 h-8 text-xs rounded-md border transition-colors
                      ${isSelected 
                        ? 'bg-blue-500 text-white border-blue-600' 
                        : isAvailable
                        ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                        : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show booking result
  if (bookingResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Đặt vé thành công!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Mã đặt vé:</span>
                <span className="font-mono">{bookingResult.booking.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số hiệu chuyến bay:</span>
                <span>{bookingResult.flight_info.flight_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Thời gian khởi hành:</span>
                <span>{dayjs(bookingResult.flight_info.departure_time).format('DD/MM/YYYY HH:mm')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tổng tiền:</span>
                <span className="font-bold text-lg">{formatCurrency(bookingResult.booking.total_price)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Thông tin vé:</h4>
              {bookingResult.tickets.map((ticket, index) => (
                <div key={ticket.ticket_id} className="flex justify-between py-2 border-b">
                  <span>{ticket.passenger_name}</span>
                  <span>{formatCurrency(ticket.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/flights')} 
                variant="outline" 
                className="flex-1"
              >
                Tiếp tục tìm chuyến bay
              </Button>
              <Button 
                onClick={() => navigate('/bookings')} 
                className="flex-1"
              >
                Xem danh sách đặt vé
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy chuyến bay</h2>
        <p className="text-gray-600 mb-4">Chuyến bay bạn đang tìm không tồn tại hoặc đã bị hủy.</p>
        <Button onClick={() => navigate('/flights')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại tìm chuyến bay
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 border-gray-400 hover:bg-gray-700 hover:text-white hover:border-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2"/>
          Quay lại
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Đặt vé chuyến bay
          </h1>
          <p className="text-gray-200 text-lg inter-semibold">
            Vui lòng điền thông tin hành khách và chọn ghế
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Thông tin chuyến bay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{flight.flight_number}</p>
                      <p className="text-gray-600">{flight.airline}</p>
                    </div>
                    <Badge variant="outline">{flight.status === 'scheduled' ? 'Đúng giờ' : flight.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Điểm khởi hành
                      </div>
                      <p className="font-semibold">{flight.departureAirport?.name || 'N/A'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {dayjs(flight.departure_time).format('HH:mm, DD/MM/YYYY')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        Điểm đến
                      </div>
                      <p className="font-semibold">{flight.arrivalAirport?.name || 'N/A'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {dayjs(flight.arrival_time).format('HH:mm, DD/MM/YYYY')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Thông tin hành khách ({passengers.length} người)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold">Hành khách {index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Họ và tên *</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Nhập họ và tên"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`dob-${index}`}>Ngày sinh</Label>
                        <Input
                          id={`dob-${index}`}
                          type="date"
                          value={passenger.dob}
                          onChange={(e) => handlePassengerChange(index, 'dob', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Chọn ghế *</Label>
                        {passenger.seat_id && (
                          <Badge variant="secondary">
                            Đã chọn: {availableSeats.find(s => s.seat_id === passenger.seat_id)?.seat_number}
                          </Badge>
                        )}
                      </div>
                      {renderSeatMap(index)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tóm tắt đặt vé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Chuyến bay:</span>
                    <span className="font-medium">{flight.flight_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Số hành khách:</span>
                    <span className="font-medium">{passengers.length} người</span>
                  </div>
                  
                  <Separator />
                  
                  {passengers.map((passenger, index) => {
                    if (!passenger.seat_id) return null;
                    const seat = availableSeats.find(s => s.seat_id === passenger.seat_id);
                    const ticketPrice = calculateTicketPrice(seat.class);
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Hành khách {index + 1}</span>
                          <span className="font-medium">{formatCurrency(ticketPrice)}</span>
                        </div>
                        <div className="text-xs text-gray-500 pl-4">
                          Ghế {seat?.seat_number} ({seat?.class === 'first' ? 'Hạng nhất' : 
                                                     seat?.class === 'business' ? 'Hạng thương gia' : 'Hạng phổ thông'})
                        </div>
                      </div>
                    );
                  })}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatCurrency(calculateTotalPrice())}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting || passengers.some(p => !p.name.trim() || !p.seat_id)}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Xác nhận đặt vé'
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Bằng cách nhấn "Xác nhận đặt vé", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 