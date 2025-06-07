import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { 
  Plane, 
  Calendar,
  AlertCircle,
  Clock,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { adminApi } from '@/services/admin/main';
import { clientApi } from '@/services/client/main';
import { CreateFlightRequest, UpdateFlightRequest } from '@/services/admin/flights';
import { FlightList } from '@/components/admin/flights-manager/FlightList';
import { FlightsManagerPageTitle } from '@/components/admin/flights-manager/PageTitle';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

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

const FlightsManagerPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9); // 3x3 grid

  const [formData, setFormData] = useState<CreateFlightRequest>({
    flight_number: '',
    airplane_id: 0,
    departure_airport_id: 0,
    arrival_airport_id: 0,
    departure_time: '',
    arrival_time: '',
    status: 'scheduled'
  });

  // Load data on component mount
  useEffect(() => {
    loadFlights(currentPage, statusFilter);
    loadAirports();
    loadAirplanes();
  }, [currentPage, statusFilter]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [statusFilter]);

  const loadFlights = async (page: number = 1, selectedStatus: string = "all") => {
    try {
      setLoading(true);
      const response = await adminApi.getFlights();
      let filteredFlights = response.data || [];
      
      // Apply status filter
      if (selectedStatus !== "all") {
        filteredFlights = filteredFlights.filter(flight => flight.status === selectedStatus);
      }
      
      // Simulate pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedFlights = filteredFlights.slice(startIndex, endIndex);
      
      setFlights(paginatedFlights);
      setTotalItems(filteredFlights.length);
      setTotalPages(Math.ceil(filteredFlights.length / itemsPerPage));
      setLoading(false);
    } catch (error: any) {
      toast.error('Không thể tải danh sách chuyến bay: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  const loadAirports = async () => {
    try {
      const response = await clientApi.getAirportList({
        code: '',
        name: '',
        city: '',
        country: ''
      });
      setAirports(response || []);
    } catch (error: any) {
      console.error('Error loading airports:', error);
    }
  };

  const loadAirplanes = async () => {
    try {
      const response = await clientApi.getPlaneList({});
      setAirplanes(response || []);
    } catch (error: any) {
      console.error('Error loading airplanes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.flight_number || !formData.airplane_id || !formData.departure_airport_id || 
        !formData.arrival_airport_id || !formData.departure_time || !formData.arrival_time) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.departure_airport_id === formData.arrival_airport_id) {
      toast.error('Sân bay đi và đến không được trùng nhau');
      return;
    }

    if (new Date(formData.departure_time) >= new Date(formData.arrival_time)) {
      toast.error('Thời gian đến phải sau thời gian khởi hành');
      return;
    }

    try {
      setLoading(true);
      if (editingFlight) {
        await adminApi.updateFlight(editingFlight.flight_id, formData as UpdateFlightRequest);
        toast.success('Cập nhật chuyến bay thành công');
      } else {
        await adminApi.createFlight(formData);
        toast.success('Tạo chuyến bay thành công');
      }
      
      resetForm();
      setDialogOpen(false);
      loadFlights(currentPage, statusFilter);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu chuyến bay');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      airplane_id: flight.airplane_id,
      departure_airport_id: flight.departure_airport_id,
      arrival_airport_id: flight.arrival_airport_id,
      departure_time: dayjs(flight.departure_time).format('YYYY-MM-DDTHH:mm'),
      arrival_time: dayjs(flight.arrival_time).format('YYYY-MM-DDTHH:mm'),
      status: flight.status as any
    });
    setDialogOpen(true);
  };

  const handleDelete = async (flightId: number) => {
    try {
      await adminApi.deleteFlight(flightId);
      toast.success('Xóa chuyến bay thành công');
      loadFlights(currentPage, statusFilter);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa chuyến bay');
    }
  };

  const resetForm = () => {
    setFormData({
      flight_number: '',
      airplane_id: 0,
      departure_airport_id: 0,
      arrival_airport_id: 0,
      departure_time: '',
      arrival_time: '',
      status: 'scheduled'
    });
    setEditingFlight(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateFlight = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Calculate statistics (using all flights, not just current page)
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  
  useEffect(() => {
    const loadAllFlights = async () => {
      try {
        const response = await adminApi.getFlights();
        setAllFlights(response.data || []);
      } catch (error) {
        console.error('Error loading all flights for stats:', error);
      }
    };
    loadAllFlights();
  }, []);

  const scheduledFlights = allFlights.filter(f => f.status === 'scheduled').length;
  const delayedFlights = allFlights.filter(f => f.status === 'delayed').length;
  const todayFlights = allFlights.filter(f => 
    dayjs(f.departure_time).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  ).length;

  const stats = [
    {
      title: "Tổng chuyến bay",
      value: allFlights.length.toString(),
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đã lên lịch",
      value: scheduledFlights.toString(),
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Chuyến bay hôm nay",
      value: todayFlights.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Trễ chuyến",
      value: delayedFlights.toString(),
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Quản lý Chuyến bay</h1>
        <p className="text-indigo-100">Tạo, chỉnh sửa và quản lý tất cả chuyến bay của QAirline</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Controls Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <FlightsManagerPageTitle
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreateFlight={handleCreateFlight}
        />
      </Card>

      {/* Pagination Info */}
      {!loading && totalItems > 0 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <div className="flex items-center justify-between">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
            <div className="text-sm text-gray-500">
              {itemsPerPage} chuyến bay mỗi trang
            </div>
          </div>
        </Card>
      )}

      {/* Flights List Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <FlightList 
          isLoading={loading}
          flightList={flights}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="justify-center"
          />
        </Card>
      )}

      {/* Create/Edit Flight Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plane size={20} />
              {editingFlight ? 'Cập nhật chuyến bay' : 'Tạo chuyến bay mới'}
            </DialogTitle>
            <DialogDescription>
              Nhập đầy đủ thông tin về chuyến bay. Tất cả các trường đều bắt buộc.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flight_number">Số hiệu chuyến bay</Label>
                <Input
                  id="flight_number"
                  placeholder="VN256"
                  value={formData.flight_number}
                  onChange={(e) => setFormData({...formData, flight_number: e.target.value.toUpperCase()})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="airplane">Máy bay</Label>
                <Select 
                  value={formData.airplane_id > 0 ? formData.airplane_id.toString() : ""} 
                  onValueChange={(value) => setFormData({...formData, airplane_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn máy bay" />
                  </SelectTrigger>
                  <SelectContent>
                    {airplanes.map((airplane) => (
                      <SelectItem key={airplane.airplane_id} value={airplane.airplane_id.toString()}>
                        {airplane.code} - {airplane.manufacturer} {airplane.model} ({airplane.total_seats} ghế)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_airport">Sân bay đi</Label>
                <Select 
                  value={formData.departure_airport_id > 0 ? formData.departure_airport_id.toString() : ""} 
                  onValueChange={(value) => setFormData({...formData, departure_airport_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sân bay đi" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airport_id} value={airport.airport_id.toString()}>
                        {airport.code} - {airport.city} ({airport.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival_airport">Sân bay đến</Label>
                <Select 
                  value={formData.arrival_airport_id > 0 ? formData.arrival_airport_id.toString() : ""} 
                  onValueChange={(value) => setFormData({...formData, arrival_airport_id: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sân bay đến" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((airport) => (
                      <SelectItem key={airport.airport_id} value={airport.airport_id.toString()}>
                        {airport.code} - {airport.city} ({airport.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_time">Thời gian khởi hành</Label>
                <Input
                  id="departure_time"
                  type="datetime-local"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrival_time">Thời gian đến</Label>
                <Input
                  id="arrival_time"
                  type="datetime-local"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                  <SelectItem value="delayed">Trễ chuyến</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : (editingFlight ? 'Cập nhật' : 'Tạo chuyến bay')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlightsManagerPage; 