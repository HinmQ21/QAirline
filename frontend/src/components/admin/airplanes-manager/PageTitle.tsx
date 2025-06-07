import { Dispatch, SetStateAction } from "react";
import { CreatePlaneButton } from "./CreatePlaneButton";
import { DropdownSelect } from "@/components/misc/DropdownSelect";
import { PlaneType } from "@/services/schemes/planes";
import { manufacturerLabels } from "@/services/schemes/planes";
import { Filter, Plane } from "lucide-react";

const allManufacturerLabels = {
  all: "Tất cả",
  ...manufacturerLabels
}

type PlanesManagerpageTitleProps = {
  manufacturer: string;
  setManufacturer: Dispatch<SetStateAction<string>>;
  createPlaneStateAction: (plane: PlaneType) => void;
}

export const PlanesManagerpageTitle = ({
  manufacturer, setManufacturer,
  createPlaneStateAction
}: PlanesManagerpageTitleProps) => {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Danh sách máy bay</h2>
        <CreatePlaneButton createPlaneStateAction={createPlaneStateAction} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <DropdownSelect 
            title="Nhà sản xuất"
            labelMap={allManufacturerLabels} 
            value={manufacturer} 
            setValue={setManufacturer} 
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Plane className="h-4 w-4" />
          <span>Lọc theo nhà sản xuất máy bay</span>
        </div>
      </div>
    </div>
  );
}