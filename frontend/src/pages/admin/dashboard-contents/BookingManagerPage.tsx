import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Eye,
  Download,
  Plane,
  DollarSign,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { ServiceContext } from '@/context/ServiceContext';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const BookingManagerPage = () => {
  const { adminApi, flightApi } = useContext(ServiceContext);
  
  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlightId, setSelectedFlightId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  // Fetch flights for filter dropdown
  const fetchFlights = async () => {
    try {
      const response = await flightApi.getAllFlights();
      if (response.success) {
        setFlights(response.data);
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  // Fetch booking statistics
  const fetchBookingStats = async (flightId = '') => {
    try {
      setStatsLoading(true);
      const params = flightId && flightId !== 'all' ? { flight_id: flightId } : {};
      const stats = await adminApi.getBookingStats(params);
      setBookingStats(stats.data);
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      toast.error('Không thể tải thống kê đặt vé');
      // Set empty stats to prevent UI crash
      setBookingStats({
        totalBookings: 0,
        bookingsByStatus: [],
        revenue: { total: 0, average: 0 },
        monthlyTrends: [],
        topRoutes: []
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch bookings with filters
  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedFlightId && selectedFlightId !== 'all' && { flight_id: selectedFlightId }),
        ...(selectedStatus && selectedStatus !== 'all' && { status: selectedStatus })
      };
      
      const response = await adminApi.getAllBookings(params);
      if (response.success) {
        setBookings(response.data);
        setCurrentPage(response.pagination.page);
        setTotalPages(response.pagination.totalPages);
        setTotalBookings(response.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải danh sách đặt vé');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFlights();
    fetchBookingStats();
    fetchBookings();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings(1);
      fetchBookingStats(selectedFlightId);
    }, 100); // Small delay to avoid rapid successive calls

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedFlightId, selectedStatus]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'booked':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã đặt</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get current flight info for display
  const getCurrentFlightInfo = () => {
    if (selectedFlightId === 'all') {
      return {
        display: 'Tất cả chuyến bay',
        icon: '✈️'
      };
    }
    
    const currentFlight = flights.find(f => f.flight_id.toString() === selectedFlightId);
    if (currentFlight) {
      return {
        display: `${currentFlight.flight_number} (${currentFlight.departureAirport?.code} → ${currentFlight.arrivalAirport?.code})`,
        icon: '🛩️'
      };
    }
    
    return {
      display: 'Chưa chọn chuyến bay',
      icon: '❓'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý đặt vé</h1>
            <p className="text-indigo-100">Xem thống kê và quản lý đặt vé của khách hàng</p>
          </div>
          <Button 
            onClick={() => {
              fetchBookings(currentPage);
              fetchBookingStats(selectedFlightId);
            }}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Flight Statistics Indicator - Inline */}
      {!statsLoading && bookingStats && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <div className="flex items-center justify-center space-x-3 text-gray-700">
            <span className="text-lg font-semibold">📊 Thống kê đặt vé:</span>
            <span className="text-xl">{getCurrentFlightInfo().icon}</span>
            <span className="font-medium text-lg text-indigo-700">
              {getCurrentFlightInfo().display}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              • Dữ liệu được cập nhật theo bộ lọc
            </span>
          </div>
        </Card>
      )}

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : bookingStats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng số đặt vé</p>
                  <p className="text-2xl font-bold text-gray-900">{bookingStats.totalBookings.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">vé đã được đặt</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(bookingStats.revenue.total)}</p>
                  <p className="text-xs text-gray-500">từ tất cả đặt vé</p>
                </div>
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Giá trị trung bình</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(bookingStats.revenue.average)}</p>
                  <p className="text-xs text-gray-500">mỗi đặt vé</p>
                </div>
                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Trạng thái đặt vé</p>
                  <div className="space-y-1">
                    {bookingStats.bookingsByStatus && bookingStats.bookingsByStatus.length > 0 ? (
                      bookingStats.bookingsByStatus.map((item) => (
                        <div key={item.status} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {item.status === 'booked' ? '✅ Đã đặt' : '❌ Đã hủy'}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Không có dữ liệu</span>
                        <span className="text-sm font-bold text-gray-900">0</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Status Chart */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <div>Phân bố trạng thái đặt vé</div>
                    <div className="text-sm font-normal text-gray-600">
                      {getCurrentFlightInfo().icon} {getCurrentFlightInfo().display}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingStats.bookingsByStatus && bookingStats.bookingsByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bookingStats.bookingsByStatus.map((item, index) => ({
                          name: item.status === 'booked' ? 'Đã đặt' : 'Đã hủy',
                          value: item.count,
                          fill: COLORS[index % COLORS.length]
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bookingStats.bookingsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Không có dữ liệu để hiển thị</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Booking Count Trends Chart */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  <div>
                    <div>Số lượng đặt vé theo tháng</div>
                    <div className="text-sm font-normal text-gray-600">
                      {getCurrentFlightInfo().icon} {getCurrentFlightInfo().display}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingStats.monthlyTrends && bookingStats.monthlyTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingStats.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip 
                        formatter={(value) => [value, 'Số đặt vé']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10b981" 
                        name="Số đặt vé"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Không có dữ liệu để hiển thị</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                  <div>
                    <div>Doanh thu theo tháng</div>
                    <div className="text-sm font-normal text-gray-600">
                      {getCurrentFlightInfo().icon} {getCurrentFlightInfo().display}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingStats.monthlyTrends && bookingStats.monthlyTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingStats.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8b5cf6" 
                        name="Doanh thu"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Không có dữ liệu để hiển thị</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {/* Filters */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={selectedFlightId} onValueChange={setSelectedFlightId}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Lọc theo chuyến bay" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={5}
                align="start"
                className="max-h-60 overflow-y-auto z-[9999] bg-white border shadow-lg"
                avoidCollisions={true}
              >
                <SelectItem value="all">Tất cả chuyến bay</SelectItem>
                {flights.map((flight) => (
                  <SelectItem key={flight.flight_id} value={flight.flight_id.toString()}>
                    {flight.flight_number} - {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={5}
                align="start"
                className="max-h-60 overflow-y-auto z-[9999] bg-white border shadow-lg"
                avoidCollisions={true}
              >
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="booked">Đã đặt</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedFlightId('all');
                setSelectedStatus('all');
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-600" />
            Danh sách đặt vé ({totalBookings.toLocaleString()} kết quả)
          </CardTitle>
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Khách hàng</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Chuyến bay</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Ngày đặt</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Hành khách</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Tổng tiền</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Trạng thái</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.booking_id} className="border-b hover:bg-blue-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">#{booking.booking_id}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{booking.Customer.full_name}</div>
                            <div className="text-sm text-gray-500">{booking.Customer.email}</div>
                            <div className="text-sm text-gray-500">{booking.Customer.phone}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium flex items-center text-gray-900">
                              <Plane className="h-4 w-4 mr-1 text-blue-600" />
                              {booking.Flight.flight_number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.Flight.departureAirport.code} → {booking.Flight.arrivalAirport.code}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(booking.Flight.departure_time)}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {formatDate(booking.booking_date)}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{booking.Tickets.length} hành khách</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {booking.Tickets.slice(0, 2).map(ticket => ticket.passenger_name).join(', ')}
                              {booking.Tickets.length > 2 && '...'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" className="hover:bg-blue-50">
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6 pt-6 border-t bg-gray-50 rounded-b-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchBookings(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="hover:bg-white"
                  >
                    Trước
                  </Button>
                  
                  <span className="text-sm text-gray-600 font-medium px-4">
                    Trang {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchBookings(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="hover:bg-white"
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 