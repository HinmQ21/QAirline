import Skeleton from "react-loading-skeleton";

export const PlaneCardSkeleton = () => {
  return (
    <div className="
      flex flex-row items-center justify-between pl-3
      bg-white rounded-2xl h-14 w-130
    ">
      <div className="flex flex-row h-full items-center">
        <div className="w-35 flex flex-col items-center justify-center">
          <Skeleton circle height={40} width={40} />
        </div>
        <div className="w-0.5 h-[60%] bg-gray-600 mx-3" />
        <div className="flex flex-col justify-center w-45">
          <Skeleton height={20} width={80} />
          <Skeleton height={14} width={100} className="mt-1" />
        </div>
      </div>
      <div className="flex flex-row h-full items-center justify-end pr-3">
        <Skeleton height={28} width={80} borderRadius={999} />
        <div className="ml-3 w-0.5 h-[60%] bg-gray-600" />
        <Skeleton height={28} width={28} borderRadius={999} className="ml-3" />
      </div>
    </div>
  );
};