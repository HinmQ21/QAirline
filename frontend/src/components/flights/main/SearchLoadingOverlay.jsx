import React from 'react';
import { Plane, Loader2 } from 'lucide-react';

export const SearchLoadingOverlay = ({ isVisible, searchParams }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-mx-4 shadow-2xl">
        <div className="text-center">
          {/* Animated Plane */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center">
              <Plane className="h-10 w-10 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          </div>

          {/* Loading Text */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Đang Tìm Chuyến Bay...
          </h3>
          <p className="text-gray-600 mb-6">
            Tìm kiếm các ưu đãi tốt nhất cho hành trình của bạn
          </p>

          {/* Search Details */}
          {searchParams && (
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuyến bay:</span>
                  <span className="font-medium">
                    {searchParams.fromAirport?.code || searchParams.from} → {searchParams.toAirport?.code || searchParams.to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khởi hành:</span>
                  <span className="font-medium">{searchParams.departureDate}</span>
                </div>
                {searchParams.returnDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quay về:</span>
                    <span className="font-medium">{searchParams.returnDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 