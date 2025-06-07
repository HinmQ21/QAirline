import Skeleton from "react-loading-skeleton";
import { Card } from "@/components/ui/card";

export const NewsCardSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-white border-0 shadow-md">
      {/* Header with Date and Category */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton height={16} width={16} />
            <Skeleton height={14} width={80} />
          </div>
          <Skeleton height={20} width={60} borderRadius={10} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          {/* Title */}
          <Skeleton height={20} width="90%" className="mb-2" />
          <Skeleton height={20} width="75%" className="mb-2" />
          
          {/* Content */}
          <Skeleton height={14} width="100%" className="mb-1" />
          <Skeleton height={14} width="85%" className="mb-1" />
          <Skeleton height={14} width="70%" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Skeleton height={12} width={12} />
              <Skeleton height={12} width={60} />
            </div>
            <Skeleton height={12} width={40} />
          </div>
          <Skeleton height={12} width={35} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Skeleton height={36} width={100} borderRadius={8} />
          <Skeleton height={36} width={36} borderRadius={8} />
        </div>
      </div>
    </Card>
  );
};