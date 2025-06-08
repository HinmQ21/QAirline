import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plane,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Loader2
} from "lucide-react";
import { clientApi } from "@/services/client/main";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/pricing';

export default function MyBookingsPage() {
  const navigate = useNavigate();

  // State management
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch customer bookings
  const fetchBookings = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await clientApi.getCustomerBookings();

      if (response.success) {
        setBookings(response.data || []);
        if (showRefreshToast) {
          toast.success('Đã cập nhật danh sách đặt vé');
        }
      }

    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Không thể tải danh sách đặt vé');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Booking is completed if departure time is in the past
  const isBookingCompleted = (booking) => {
    return booking.status === 'booked' && booking.Flight.departure_time < new Date();
  };

  // Cancel is valid if departure time is more than 5 days from now
  const bookingIsCancellable = (booking) => {
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    return booking.status === 'booked' && fiveDaysFromNow < booking.Flight.departure_time;
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  // Get status color and icon
  const getStatusInfo = (booking) => {
    console.log(booking);

    switch (booking.status) {
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
          text: 'Đã hủy'
        };
      case 'booked':
        if (isBookingCompleted(booking)) {
          return {
            color: 'bg-blue-100 text-blue-800',
            icon: Plane,
            text: 'Hoàn thành'
          }
        } else {
          return {
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
            text: 'Đã đặt'
          }
        }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchBookings(true);
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đặt vé này?')) return;

    try {
      const response = await clientApi.cancelBooking(bookingId);
      if (response.success) {
        toast.success('Hủy đặt vé thành công');
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Không thể hủy đặt vé');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Đang tải danh sách đặt vé...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Danh sách đặt vé</h1>
            <p className="text-gray-200">Quản lý các chuyến bay đã đặt của bạn</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đặt vé nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có chuyến bay nào được đặt. Hãy bắt đầu tìm kiếm chuyến bay!</p>
            <Button onClick={() => navigate('/flights')}>
              <Plane className="w-4 h-4 mr-2" />
              Tìm chuyến bay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Danh sách đặt vé</h1>
          <p className="text-gray-200">Quản lý các chuyến bay đã đặt của bạn ({bookings.length} vé)</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.map((booking) => {
          const statusInfo = getStatusInfo(booking);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={booking.booking_id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{booking.Flight?.flight_number}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Mã đặt vé: <span className="font-mono">{booking.booking_id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.text}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      Đặt ngày {dayjs(booking.booking_date).format('DD/MM/YYYY')}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Flight Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Thông tin chuyến bay</h4>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{booking.Flight?.departureAirport?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{booking.Flight?.departureAirport?.city || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {booking.Flight?.departure_time ? dayjs(booking.Flight.departure_time).format('HH:mm, DD/MM/YYYY') : 'N/A'}
                      </div>

                      <div className="w-full h-px bg-gray-200 relative">
                        <Plane className="w-4 h-4 text-gray-400 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{booking.Flight?.arrivalAirport?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{booking.Flight?.arrivalAirport?.city || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {booking.Flight?.arrival_time ? dayjs(booking.Flight.arrival_time).format('HH:mm, DD/MM/YYYY') : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Chi tiết đặt vé</h4>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          {booking.Tickets?.length || 0} hành khách
                        </span>
                      </div>

                      {booking.Tickets && booking.Tickets.length > 0 && (
                        <div className="space-y-2">
                          {booking.Tickets.slice(0, 3).map((ticket, index) => (
                            <div key={ticket.ticket_id} className="flex justify-between text-sm">
                              <span className="text-gray-600">{ticket.passenger_name}</span>
                              <span className="font-medium">
                                Ghế {ticket.Seat?.seat_number || 'N/A'}
                              </span>
                            </div>
                          ))}
                          {booking.Tickets.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{booking.Tickets.length - 3} hành khách khác
                            </p>
                          )}
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Tổng tiền:</span>
                        <span className="font-bold text-lg text-blue-600">
                          {formatCurrency(booking.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {booking.status === 'booked' && (
                    <button
                      onClick={() => handleCancelBooking(booking.booking_id)}
                      disabled={!bookingIsCancellable(booking)}
                      className={`relative group px-4 py-2 rounded-md text-sm font-medium
                        ${bookingIsCancellable(booking) 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      Hủy vé
                      {!bookingIsCancellable(booking) && (
                        <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                          Bạn không thể hủy vé trong vòng 5 ngày trước khi cất cánh
                          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 text-center">
        <Button
          className="reddit-medium dark"
          onClick={() => navigate('/flights')}
          size="lg"
        >
          <Plane className="w-4 h-4 mr-2" />
          Đặt thêm chuyến bay
        </Button>
      </div>
    </div>
  );
} 