import { Card } from "@/components/ui/card";

export const FlightCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Flight Route */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center">
              <div className="w-10 h-6 bg-gray-200 rounded animate-pulse mb-1 mx-auto"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            
            <div className="flex-1 flex items-center justify-center px-3">
              <div className="w-full h-px bg-gray-200 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-6 bg-gray-200 rounded animate-pulse mb-1 mx-auto"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Aircraft Information */}
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-2">
          <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 