import { useState, useEffect } from "react";
import { NewsManagerPage } from "./dashboard-contents/NewsManagerPage";
import { DashboardNavigation } from "@/components/admin/navigation/DashboardNavigation";

export const AdminDashboardPage = () => {
  const [navY, setNavY] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);

  const onTabSelect = (idx) => {
    setSelectedTab(idx);
  };

  useEffect(() => {
    let animationFrame;

    const updatePosition = () => {
      setNavY(window.scrollY);

      setTimeout(() => {
        animationFrame = requestAnimationFrame(updatePosition);
      }, 100);
    };

    animationFrame = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-200">
      <div
        className="absolute left-0 transition-transform duration-400 ease-out"
        style={{ transform: `translateY(${navY}px)` }}
      >
        <DashboardNavigation selectedTab={selectedTab} onTabSelect={onTabSelect} />
      </div>
      <div className="ml-30 pt-16">
        <AdminDashboardContent index={selectedTab} />
      </div>
    </div>
  );
};

const AdminDashboardContent = ({ index }) => {
  switch (index) {
    case 1:
      return <NewsManagerPage />;
    default:
      return <div>Page {index}</div>
  }
}
