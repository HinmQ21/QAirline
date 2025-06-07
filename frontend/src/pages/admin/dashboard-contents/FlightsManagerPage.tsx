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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { 
  Plus, 
  Plane, 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Eye,
  BarChart3
} from 'lucide-react';
import { adminApi } from '@/services/admin/main';
import { clientApi } from '@/services/client/main';
import { CreateFlightRequest, UpdateFlightRequest } from '@/services/admin/flights';
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
    loadFlights();
    loadAirports();
    loadAirplanes();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getFlights();
      setFlights(response.data || []);
    } catch (error: any) {
      toast.error('Không thể tải danh sách chuyến bay: ' + (error.response?.data?.message || error.message));
    } finally {
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
      loadFlights();
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
    if (!confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) return;

    try {
      await adminApi.deleteFlight(flightId);
      toast.success('Xóa chuyến bay thành công');
      loadFlights();
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Đã lên lịch' },
      delayed: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Trễ chuyến' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Đã hủy' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  // Calculate statistics
  const scheduledFlights = flights.filter(f => f.status === 'scheduled').length;
  const delayedFlights = flights.filter(f => f.status === 'delayed').length;
  const todayFlights = flights.filter(f => 
    dayjs(f.departure_time).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  ).length;

  const stats = [
    {
      title: "Tổng chuyến bay",
      value: flights.length.toString(),
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Danh sách chuyến bay</h2>
            <p className="text-gray-600 text-sm">Quản lý và theo dõi tất cả chuyến bay trong hệ thống</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus size={16} />
                Thêm chuyến bay
              </Button>
            </DialogTrigger>
            
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
      </Card>

      {/* Flights List Section */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số hiệu</TableHead>
                <TableHead>Tuyến bay</TableHead>
                <TableHead>Máy bay</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight.flight_id}>
                  <TableCell className="font-mono font-semibold">
                    {flight.flight_number}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">
                        <div className="font-medium">
                          {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
                        </div>
                        <div className="text-gray-500">
                          {flight.departureAirport?.city} - {flight.arrivalAirport?.city}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{flight.Airplane?.code}</div>
                      <div className="text-gray-500">
                        {flight.Airplane?.manufacturer} {flight.Airplane?.model}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {dayjs(flight.departure_time).format('DD/MM/YYYY')}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        {dayjs(flight.departure_time).format('HH:mm')} - {dayjs(flight.arrival_time).format('HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(flight.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(flight)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(flight.flight_id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {flights.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Chưa có chuyến bay nào được tạo
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default FlightsManagerPage; 