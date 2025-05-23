import { DashboardNavigation } from "@/components/admin/DashboardNavigation";
import { useState } from "react";

export const AdminDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const onTabSelect = (idx) => {
    console.log(idx);
    setSelectedTab(idx);
  }
  
  return (
    <div className="flex flex-row min-h-screen min-w-screen bg-gray-300">
      <DashboardNavigation selectedTab={selectedTab} onTabSelect={onTabSelect}/>
    </div>
  );
}
