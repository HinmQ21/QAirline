import React from 'react';
import { Filter, DollarSign, Clock, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export const FlightFilters = ({ 
  filters, 
  onFiltersChange,
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const timeSlots = [
    { value: 'early-morning', label: 'Sáng (6:00 - 9:00)', start: 6, end: 9 },
    { value: 'morning', label: 'Buổi sáng (9:00 - 12:00)', start: 9, end: 12 },
    { value: 'afternoon', label: 'Buổi chiều (12:00 - 18:00)', start: 12, end: 18 },
    { value: 'evening', label: 'Buổi tối (18:00 - 22:00)', start: 18, end: 22 },
    { value: 'night', label: 'Đêm (22:00 - 6:00)', start: 22, end: 6 }
  ];

  const durationOptions = [
    { value: 'any', label: 'Bất kỳ thời gian' },
    { value: 'short', label: 'Dưới 2 giờ' },
    { value: 'medium', label: '2-5 giờ' },
    { value: 'long', label: 'Trên 5 giờ' }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2" />
          Kết quả tìm kiếm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <DollarSign className="h-4 w-4 mr-1" />
            Khoảng giá (VND)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-gray-600">Giá tối thiểu</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-gray-600">Giá tối đa</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10,000,000"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Departure Time */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <Clock className="h-4 w-4 mr-1" />
            Giờ bay
          </Label>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.value} className="flex items-center space-x-2">
                <Checkbox
                  id={slot.value}
                  checked={filters.departureTime?.includes(slot.value) || false}
                  onCheckedChange={(checked) => {
                    const currentTimes = filters.departureTime || [];
                    const newTimes = checked
                      ? [...currentTimes, slot.value]
                      : currentTimes.filter(t => t !== slot.value);
                    handleFilterChange('departureTime', newTimes);
                  }}
                />
                <Label htmlFor={slot.value} className="text-xs text-gray-700">
                  {slot.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Flight Duration */}
        <div className="space-y-3">
          <Label className="flex items-center text-sm font-medium">
            <Plane className="h-4 w-4 mr-1" />
            Thời gian bay
          </Label>
          <Select 
            value={filters.duration || 'any'} 
            onValueChange={(value) => handleFilterChange('duration', value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="pt-4 border-t">
          <button
            onClick={() => onFiltersChange({})}
            className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      </CardContent>
    </Card>
  );
}; 