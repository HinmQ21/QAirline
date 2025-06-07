import { PlaneCard } from "./PlaneCard";
import { PlaneType } from "@/services/schemes/planes";
import { PlaneCardSkeleton } from "./PlaneCardSkeleton";
import { Plane, Search } from "lucide-react";

type PlaneListProps = {
  isLoading: boolean;
  planeList: PlaneType[];
  updatePlaneStateAction: (plane: PlaneType) => void;
  deletePlaneStateAction: (plane_id: number) => void;
}

export const PlaneList = ({
  isLoading, planeList,
  updatePlaneStateAction, deletePlaneStateAction
}: PlaneListProps) => {
  if (isLoading === false && planeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy máy bay</h3>
        <p className="text-gray-500 max-w-md">
          Không có máy bay nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi điều kiện tìm kiếm hoặc thêm máy bay mới.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      {!isLoading && planeList.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {planeList.length} máy bay trên trang này
            </span>
          </div>
        </div>
      )}

      {/* Grid Layout - 4x3 for pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Show 12 skeletons for 4x3 grid
          Array(12).fill(0).map((_, i) => <PlaneCardSkeleton key={i} />)
        ) : (
          planeList.map((plane) => (
            <PlaneCard 
              key={plane.airplane_id} 
              plane={plane}
              updatePlaneStateAction={updatePlaneStateAction}
              deletePlaneStateAction={deletePlaneStateAction}
            />
          ))
        )}
      </div>
    </div>
  );
}