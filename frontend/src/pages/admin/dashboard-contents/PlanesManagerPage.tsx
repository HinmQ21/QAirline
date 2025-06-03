import { useState } from "react";
import { PlanesManagerpageTitle } from "@/components/admin/airplanes-manager/PageTitle";

export const PlanesManagerPage = () => {
  const [manufacturer, setManufacturer] = useState("all");
  
  return (
    <div className="w-full">
      <PlanesManagerpageTitle
        manufacturer={manufacturer}
        setManufacturer={setManufacturer}
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