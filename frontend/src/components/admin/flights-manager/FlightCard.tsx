import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plane
} from "lucide-react";
import dayjs from "dayjs";

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

type FlightCardProps = {
  flight: Flight;
  onEdit: (flight: Flight) => void;
  onDelete: (flightId: number) => void;
}

export const FlightCard = ({ flight, onEdit, onDelete }: FlightCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: Clock, 
        label: 'Đã lên lịch',
        gradient: 'from-blue-50 to-blue-100'
      },
      delayed: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: AlertCircle, 
        label: 'Trễ chuyến',
        gradient: 'from-yellow-50 to-yellow-100'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle, 
        label: 'Đã hủy',
        gradient: 'from-red-50 to-red-100'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;
    
    return { config, Icon };
  };

  const { config: statusConfig, Icon: StatusIcon } = getStatusBadge(flight.status);

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa chuyến bay này?')) {
      onDelete(flight.flight_id);
    }
  };

  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      {/* Header Section with Status */}
      <div className={`bg-gradient-to-br ${statusConfig.gradient} px-4 py-3 border-b border-gray-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-gray-600" />
            <span className="font-mono font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {flight.flight_number}
            </span>
          </div>
          <Badge className={`${statusConfig.color} border flex items-center gap-1 font-medium`}>
            <StatusIcon size={12} />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Flight Route */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {flight.departureAirport?.code || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {flight.departureAirport?.city}
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center px-3">
              <div className="w-full h-px bg-gray-300 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {flight.arrivalAirport?.code || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {flight.arrivalAirport?.city}
              </div>
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {dayjs(flight.departure_time).format('DD/MM/YYYY')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {dayjs(flight.departure_time).format('HH:mm')} - {dayjs(flight.arrival_time).format('HH:mm')}
            </span>
          </div>
        </div>

        {/* Aircraft Information */}
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Máy bay</div>
          <div className="text-sm font-medium text-gray-900">
            {flight.Airplane?.code || 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            {flight.Airplane?.manufacturer} {flight.Airplane?.model}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-2">
          <div className="text-xs text-gray-400">
            ID: {flight.flight_id}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(flight)}
              className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300"
            >
              <Edit size={12} className="mr-1" />
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300"
            >
              <Trash2 size={12} className="mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}; 