import React from 'react';
import { X, Plane, Clock, Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const formatVND = (price) => price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

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
    weekday: 'long',
    day: '2-digit',
    month: 'long',
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

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'delayed': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'on time': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const FlightDetailsModal = ({ flight, isOpen, onClose, onBook }) => {
  if (!flight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Plane className="h-6 w-6 text-blue-600" />
              <span className="text-2xl font-bold">Flight {flight.flight_number}</span>
              <Badge className={`${getStatusColor(flight.status)} border-0 ml-2`}>
                {flight.status || 'Scheduled'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Route and Time Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Flight Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Departure */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {flight.departureAirport?.code}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {flight.departureAirport?.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {flight.departureAirport?.city}, {flight.departureAirport?.country}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(flight.departure_time)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(flight.departure_time)}
                  </div>
                </div>

                {/* Flight Duration */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-500 mb-2">Flight Duration</div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-px bg-gray-300"></div>
                    <Plane className="h-5 w-5 text-gray-400" />
                    <div className="w-8 h-px bg-gray-300"></div>
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    {calculateDuration(flight.departure_time, flight.arrival_time)}
                  </div>
                  <div className="text-sm text-gray-500">Direct Flight</div>
                </div>

                {/* Arrival */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {flight.arrivalAirport?.code}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {flight.arrivalAirport?.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {flight.arrivalAirport?.city}, {flight.arrivalAirport?.country}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime(flight.arrival_time)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(flight.arrival_time)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aircraft Information */}
          {flight.Airplane && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Thông tin máy bay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Mẫu máy bay</div>
                    <div className="font-semibold">
                      {flight.Airplane.manufacturer} {flight.Airplane.model}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Mã máy bay</div>
                    <div className="font-semibold">{flight.Airplane.code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tổng số ghế</div>
                    <div className="font-semibold flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {flight.Airplane.total_seats}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Base Price</div>
                  <div className="text-3xl font-bold text-red-600">
                    {formatVND(flight.basePrice)}
                  </div>
                  <div className="text-sm text-gray-500">per passenger</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">
                    • Taxes and fees included
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    • Free cabin baggage (7kg)
                  </div>
                  <div className="text-sm text-gray-600">
                    • Free seat selection
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={onBook}
            >
              Book This Flight
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 