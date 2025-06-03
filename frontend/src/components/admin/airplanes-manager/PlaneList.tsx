import { PlaneCard } from "./PlaneCard";
import { PlaneType } from "@/services/admin/planes";

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
      <p className="text-center text-2xl text-gray-900">
        Our search engine is superlative, but no result apparently!
      </p>
    );
  }

  return (
    <div className="
      flex flex-row flex-wrap items-center justify-center
      gap-4
    ">{
      planeList.map((e) => (
        <PlaneCard key={e.airplane_id} plane={e}
          updatePlaneStateAction={updatePlaneStateAction}
          deletePlaneStateAction={deletePlaneStateAction}
        />
      ))
    }</div>
  );
}