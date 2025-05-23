import { DashboardNavigation } from "@/components/admin/DashboardNavigation";
import { useState, useEffect } from "react";

export const AdminDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [navY, setNavY] = useState(0);

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
    <div className="relative min-h-screen bg-gray-300">
      <div
        className="absolute left-0 transition-transform duration-400 ease-out"
        style={{ transform: `translateY(${navY}px)` }}
      >
        <DashboardNavigation selectedTab={selectedTab} onTabSelect={onTabSelect} />
      </div>

      <div className="ml-30">
        <div className="h-screen">page 1</div>
        <div className="h-screen">page 2</div>
      </div>
    </div>
  );
};
