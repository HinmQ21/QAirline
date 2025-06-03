import { useEffect, useState } from "react";
import { PlaneList } from "@/components/admin/airplanes-manager/PlaneList";
import { getPlaneList, ManufacturerType, PlaneType } from "@/services/admin/planes";
import { PlanesManagerpageTitle } from "@/components/admin/airplanes-manager/PageTitle";

export const PlanesManagerPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [manufacturer, setManufacturer] = useState("all");
  const [planeList, setPlaneList] = useState<PlaneType[]>([]);

  const createPlaneStateAction = (plane: PlaneType) => {
    setPlaneList([plane, ...planeList]);
  }
  const updatePlaneStateAction = (plane: PlaneType) => {
    setPlaneList(planeList.map((x) => (x.airplane_id === plane.airplane_id) ? plane : x));
  }
  const deletePlaneStateAction = (plane_id: number) => {
    setPlaneList(planeList.filter(p => p.airplane_id !== plane_id));
  }
  
  useEffect(() => { setIsLoading(true); }, [manufacturer]);
  useEffect(() => {
    if (isLoading === false) return;
    let _manufacturer = manufacturer === "all" ? undefined : manufacturer as ManufacturerType;
    getPlaneList({manufacturer: _manufacturer}).then(
      (response) => {
        console.log(response);
        setPlaneList(response);
        setIsLoading(false);
      }
    )
    .catch(
      (err) => {
        let errMsg;
        try { errMsg = err.response.data.message; }
        catch { errMsg = err.toString(); }
        console.error(errMsg);
        setIsLoading(false);
      }
    );
  }, [isLoading]);

  return (
    <div className="w-full">
      <PlanesManagerpageTitle
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
        createPlaneStateAction={createPlaneStateAction}
      // sortBy={sortBy} setSortBy={setSortBy}
      // category={category} setCategory={setCategory}
      />
      <div className="h-10" />

      <PlaneList isLoading={isLoading} planeList={planeList}
        updatePlaneStateAction={updatePlaneStateAction}
        deletePlaneStateAction={deletePlaneStateAction} />

      <div className="h-4" />
    </div>
  );
}