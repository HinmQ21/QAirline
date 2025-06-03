import { Dispatch, SetStateAction } from "react";
import { CreatePlaneButton } from "./CreatePlaneButton";
import { manufacturerLabels, PlaneType } from "@/services/admin/planes";
import { DropdownSelect } from "@/components/misc/DropdownSelect";

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
    <div className="flex flex-row flex-wrap gap-4 justify-around">
      <div className="flex flex-row flex-wrap gap-4">
        <DropdownSelect title="Nhà sản xuất"
          labelMap={allManufacturerLabels} value={manufacturer} setValue={setManufacturer} />
      </div>
      {/* <CreateNewsButton createNewsStateAction={createNewsStateAction} /> */}
      <CreatePlaneButton createPlaneStateAction={createPlaneStateAction} />
    </div>
  );
}