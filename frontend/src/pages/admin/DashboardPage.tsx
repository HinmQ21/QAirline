import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NewsManagerPage } from "./dashboard-contents/NewsManagerPage";
import { PlanesManagerPage } from "./dashboard-contents/PlanesManagerPage";
import FlightsManagerPage from "./dashboard-contents/FlightsManagerPage";
import { DashboardNavigation } from "@/components/admin/navigation/DashboardNavigation";
import { AdminHeader } from "@/components/admin/navigation/AdminHeader";
import { Card } from "@/components/ui/card";
import { BarChart3, Calendar, Users, TrendingUp, Plane, CreditCard } from "lucide-react";
import { adminApi } from "@/services/admin/main";
import { DashboardStats } from "@/services/schemes/dashboard";

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
            <AdminDashboardContent index={selectedTab} onTabSelect={onTabSelect} />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

const AdminDashboardContent = ({ index, onTabSelect }) => {
  switch (index) {
    case 0:
      return <DashboardOverview onTabSelect={onTabSelect} />;
    case 1:
      return <NewsManagerPage />;
    case 2:
      return <PlanesManagerPage />;
    case 3:
      return <FlightsManagerPage />;
    default:
      return <DashboardOverview onTabSelect={onTabSelect} />
  }
}

const DashboardOverview = ({ onTabSelect }) => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboardStats();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Đang tải dữ liệu...</h1>
          <p className="text-blue-100 text-lg">Vui lòng đợi trong giây lát</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Có lỗi xảy ra</h1>
          <p className="text-red-100 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const stats = [
    {
      title: "Tổng khách hàng",
      value: formatNumber(dashboardData.customers.total),
      subtitle: "Đã đăng ký",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Chuyến bay",
      value: formatNumber(dashboardData.flights.total),
      subtitle: `${formatNumber(dashboardData.flights.active)} đang hoạt động`,
      icon: Plane,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Đặt vé",
      value: formatNumber(dashboardData.bookings.total),
      subtitle: `${formatNumber(dashboardData.bookings.thisMonth)} tháng này`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Vé đã bán",
      value: formatNumber(dashboardData.tickets.total),
      subtitle: `${formatNumber(dashboardData.tickets.today)} hôm nay`,
      icon: CreditCard,
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
                <p className="text-sm text-gray-500 font-medium">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Doanh thu tổng
          </h2>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatCurrency(dashboardData.revenue.total)}
          </div>
          <p className="text-sm text-gray-600">Tổng doanh thu từ khi bắt đầu</p>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Doanh thu tháng này
          </h2>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatCurrency(dashboardData.revenue.thisMonth)}
          </div>
          <p className="text-sm text-gray-600">Doanh thu trong tháng hiện tại</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Thêm tin tức", action: () => onTabSelect(1) },
            { label: "Quản lý máy bay", action: () => onTabSelect(2) },
            { label: "Quản lý chuyến bay", action: () => onTabSelect(3) },
            { label: "Tải lại thống kê", action: () => window.location.reload() }
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
