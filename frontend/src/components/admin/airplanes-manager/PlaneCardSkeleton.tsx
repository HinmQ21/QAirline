import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export const PlaneCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md">
      {/* Compact Image Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-5 border-b border-gray-100">
        <div className="flex flex-col items-center space-y-3">
          {/* Optimized Logo Skeleton */}
          <div className="w-16 h-12 flex items-center justify-center">
            <Skeleton height={48} width={64} />
          </div>
          
          {/* Compact Manufacturer Badge Skeleton */}
          <Skeleton height={20} width={60} borderRadius={10} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header with ID */}
        <div className="flex items-center justify-between mb-3">
          <Skeleton height={12} width={30} />
        </div>

        <div className="mb-3">
          {/* Plane Code */}
          <Skeleton height={20} width="70%" className="mb-2" />
          
          {/* Model */}
          <Skeleton height={14} width="85%" className="mb-2" />

          {/* Seat Information */}
          <div className="flex items-center space-x-2 mb-2">
            <Skeleton height={16} width={16} />
            <Skeleton height={14} width={80} />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Skeleton height={16} width={16} />
            <Skeleton height={14} width={60} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Skeleton height={32} width={80} borderRadius={8} />
          <Skeleton height={32} width={32} borderRadius={8} />
        </div>
      </div>
    </Card>
  );
};