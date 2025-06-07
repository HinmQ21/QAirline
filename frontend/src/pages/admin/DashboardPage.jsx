import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NewsManagerPage } from "./dashboard-contents/NewsManagerPage";
import { PlanesManagerPage } from "./dashboard-contents/PlanesManagerPage";
import FlightsManagerPage from "./dashboard-contents/FlightsManagerPage";
import { DashboardNavigation } from "@/components/admin/navigation/DashboardNavigation";
import { AdminHeader } from "@/components/admin/navigation/AdminHeader";
import { Card } from "@/components/ui/card";
import { BarChart3, Calendar, Users, TrendingUp } from "lucide-react";

export const AdminDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const onTabSelect = (idx) => {
    setSelectedTab(idx);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 z-30 h-full">
          <DashboardNavigation selectedTab={selectedTab} onTabSelect={onTabSelect} />
        </div>
        
        {/* Main Content */}
        <div className="ml-20 flex flex-col">
          {/* Header */}
          <AdminHeader />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 pt-4">
            <AdminDashboardContent index={selectedTab} />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

const AdminDashboardContent = ({ index }) => {
  switch (index) {
    case 0:
      return <DashboardOverview />;
    case 1:
      return <NewsManagerPage />;
    case 2:
      return <PlanesManagerPage />;
    case 3:
      return <FlightsManagerPage />;
    default:
      return <DashboardOverview />
  }
}

const DashboardOverview = () => {
  const stats = [
    {
      title: "Tổng chuyến bay",
      value: "1,234",
      change: "+12%",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đặt vé hôm nay",
      value: "567",
      change: "+8%",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Khách hàng",
      value: "8,912",
      change: "+24%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Doanh thu",
      value: "2.4B",
      change: "+15%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin!</h1>
        <p className="text-blue-100 text-lg">Quản lý hệ thống QAirline của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 font-medium">{stat.change} từ tháng trước</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Thêm tin tức", action: () => onTabSelect(1) },
            { label: "Quản lý máy bay", action: () => onTabSelect(2) },
            { label: "Xem báo cáo", action: () => {} },
            { label: "Cài đặt hệ thống", action: () => {} }
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 border border-blue-100 hover:border-blue-200"
            >
              <p className="font-medium text-gray-900">{item.label}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
