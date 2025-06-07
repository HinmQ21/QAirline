import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plane, Calendar, Users, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useServices } from "@/context/ServiceContext";
import { FlightDetailsModal } from './FlightDetailsModal';

const formatVND = (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'delayed': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'on time': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const calculateDuration = (departure, arrival) => {
  const depTime = new Date(departure);
  const arrTime = new Date(arrival);
  const duration = Math.abs(arrTime - depTime);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const MainFlightCard = ({ flight, formatTime: legacyFormatTime, setIsOpen }) => {
  const navigate = useNavigate();
  const { preBookingContext } = useServices();
  const [showDetails, setShowDetails] = useState(false);

  const handleBookFlight = () => {
    // Save flight info to context
    preBookingContext.setFlight(flight);
    
    // Open passenger selection modal
    setIsOpen(true);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  // Check if flight can be booked
  const canBook = flight.status !== 'cancelled' && new Date(flight.departure_time) > new Date();

  return (
    <>
      <Card className="w-96 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-0">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Plane className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-lg text-gray-900">
                {flight.flight_number}
              </span>
            </div>
            <Badge className={`${getStatusColor(flight.status)} border-0`}>
              {flight.status || 'Đã đặt'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Route Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {flight.departureAirport?.code}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.departureAirport?.city}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatTime(flight.departure_time)}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-1 flex-1 mx-4">
                <div className="text-xs text-gray-500">
                  {calculateDuration(flight.departure_time, flight.arrival_time)}
                </div>
                <div className="w-full h-px bg-gray-300 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Plane className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Direct
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {flight.arrivalAirport?.code}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.arrivalAirport?.city}
                </div>
                <div className="text-lg font-semibold text-gray-800">
                  {formatTime(flight.arrival_time)}
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {formatDate(flight.departure_time)}
              </span>
            </div>
            
            {flight.Airplane && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {flight.Airplane.total_seats} ghế
                </span>
              </div>
            )}
          </div>

          {/* Aircraft Information */}
          {flight.Airplane && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Máy bay:</span> {flight.Airplane.manufacturer} {flight.Airplane.model}
            </div>
          )}

          {/* Price and Buttons */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-500">Chỉ từ</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatVND(flight.basePrice)}
                </div>
                <div className="text-xs text-gray-500">Một người</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1 h-auto py-2"
                onClick={handleViewDetails}
              >
                <Eye className="h-4 w-4 mr-2" />
                Chi tiết hành trình
              </Button>
              <Button
                className={`flex-1 h-auto py-2 ${
                  canBook 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                onClick={handleBookFlight}
                disabled={!canBook}
              >
                {canBook ? 'Đặt ngay' : 'Không khả dụng'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Details Modal */}
      <FlightDetailsModal
        flight={flight}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onBook={handleBookFlight}
      />
    </>
  );
};