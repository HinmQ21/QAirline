import { useState } from "react";
import { PlanesManagerpageTitle } from "@/components/admin/airplanes-manager/PageTitle";
import { PlaneType } from "@/services/admin/planes";

export const PlanesManagerPage = () => {
  const [manufacturer, setManufacturer] = useState("all");
  const [planeList, setPlaneList] = useState<PlaneType[]>([]);

  const createPlaneStateAction = (plane: PlaneType) => {
    setPlaneList([plane, ...planeList]);
  }
  
  return (
    <div className="w-full">
      <PlanesManagerpageTitle
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
        createPlaneStateAction={createPlaneStateAction}
        // sortBy={sortBy} setSortBy={setSortBy}
        // category={category} setCategory={setCategory}
        // createNewsStateAction={createNewsStateAction}
      />
      <div className="h-10" />
      {/* <NewsList isLoading={isLoading} newsList={newsList}
        updateNewsStateAction={updateNewsStateAction}
        deleteNewsStateAction={deleteNewsStateAction} /> */}
    </div>
  );
}