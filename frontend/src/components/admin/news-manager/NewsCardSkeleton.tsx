import Skeleton from "react-loading-skeleton";

export const NewsCardSkeleton = () => {
  return (
    <div className="flex flex-row h-18 w-120 bg-white rounded-xl items-center justify-between p-3">
      <div className="flex flex-row h-full items-center">
        {/* Ngày tháng */}
        <div className="flex flex-col items-center justify-center text-gray-900">
          <Skeleton height={16} width={40} />
          <Skeleton height={16} width={50} style={{ marginTop: '4px' }} />
        </div>

        {/* Divider */}
        <div className="w-0.5 h-[60%] bg-gray-400 mx-3" />

        {/* Title & content */}
        <div className="flex flex-col justify-center w-60">
          <Skeleton height={20} width="100%" />
          <Skeleton height={12} width="80%" style={{ marginTop: '4px' }} />
        </div>
      </div>

      <div className="flex flex-row h-full items-center">
        {/* Badge giả */}
        <Skeleton height={24} width={60} borderRadius={12} />

        {/* Divider */}
        <div className="ml-3 w-0.5 h-[60%] bg-gray-400" />

        {/* Delete button giả */}
        <Skeleton height={32} width={32} borderRadius={8} style={{ marginLeft: '12px' }} />
      </div>
    </div>
  );
};