import { useState, useEffect, useContext } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NewsManagerPage } from "./dashboard-contents/NewsManagerPage";
import { PlanesManagerPage } from "./dashboard-contents/PlanesManagerPage";
import FlightsManagerPage from "./dashboard-contents/FlightsManagerPage";
import { BookingManagerPage } from "./dashboard-contents/BookingManagerPage";
import { DashboardNavigation } from "@/components/admin/navigation/DashboardNavigation";
import { AdminHeader } from "@/components/admin/navigation/AdminHeader";
import { Card } from "@/components/ui/card";
import { BarChart3, Calendar, Users, TrendingUp, Plane, Ticket, RefreshCw } from "lucide-react";
import { ServiceContext } from "@/context/ServiceContext";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

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
    case 4:
      return <BookingManagerPage />;
    default:
      return <DashboardOverview onTabSelect={onTabSelect} />
  }
}

const DashboardOverview = ({ onTabSelect }) => {
  const { adminApi } = useContext(ServiceContext);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await adminApi.getDashboardStats();
      setDashboardStats(stats);
      toast.success('Đã cập nhật thống kê!');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Không thể tải thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [adminApi]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin!</h1>
              <p className="text-blue-100 text-lg">Đang tải thống kê...</p>
            </div>
            <button
              disabled
              className="bg-white/20 p-3 rounded-xl opacity-50 cursor-not-allowed"
            >
              <RefreshCw className="h-5 w-5 animate-spin" />
            </button>
          </div>
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

  if (!dashboardStats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Không thể tải dữ liệu thống kê</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Tổng khách hàng",
      value: formatNumber(dashboardStats.customers.total),
      subtitle: "Đã đăng ký",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Chuyến bay",
      value: formatNumber(dashboardStats.flights.total),
      subtitle: `${formatNumber(dashboardStats.flights.active)} đang hoạt động`,
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đặt chỗ",
      value: formatNumber(dashboardStats.bookings.total),
      subtitle: `${formatNumber(dashboardStats.bookings.thisMonth)} tháng này`,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Vé máy bay",
      value: formatNumber(dashboardStats.tickets.total),
      subtitle: `${formatNumber(dashboardStats.tickets.today)} hôm nay`,
      icon: Ticket,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const revenueStats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(dashboardStats.revenue.total),
      subtitle: "Tất cả thời gian",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Doanh thu tháng này",
      value: formatCurrency(dashboardStats.revenue.thisMonth),
      subtitle: "Tháng hiện tại",
      icon: BarChart3,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  // Prepare chart data
  const chartData = [
    {
      name: 'Khách hàng',
      value: dashboardStats.customers.total,
      color: '#8b5cf6'
    },
    {
      name: 'Chuyến bay',
      value: dashboardStats.flights.total,
      color: '#3b82f6'
    },
    {
      name: 'Đặt chỗ',
      value: dashboardStats.bookings.total,
      color: '#10b981'
    },
    {
      name: 'Vé bán',
      value: dashboardStats.tickets.total,
      color: '#6366f1'
    }
  ];

  const revenueChartData = [
    {
      name: 'Tháng này',
      revenue: dashboardStats.revenue.thisMonth / 1000000,
      bookings: dashboardStats.bookings.thisMonth,
      tickets: dashboardStats.tickets.today
    },
    {
      name: 'Tổng cộng',
      revenue: dashboardStats.revenue.total / 1000000,
      bookings: dashboardStats.bookings.total,
      tickets: dashboardStats.tickets.total
    }
  ];

  const flightStatusData = [
    {
      name: 'Hoạt động',
      value: dashboardStats.flights.active,
      color: '#10b981'
    },
    {
      name: 'Không hoạt động',
      value: dashboardStats.flights.total - dashboardStats.flights.active,
      color: '#ef4444'
    }
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#6366f1'];

  return (
    <div className="space-y-8">
      {/* Welcome Section with Reload Button */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại, Admin!</h1>
            <p className="text-blue-100 text-lg">Quản lý hệ thống QAirline của bạn</p>
            <div className="mt-4 text-sm text-blue-100">
              Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
            </div>
          </div>
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Làm mới thống kê"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revenueStats.map((stat, index) => (
          <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-4 rounded-xl`}>
                <stat.icon className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart for General Stats */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Thống kê tổng quan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart for Flight Status */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái chuyến bay</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={flightStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {flightStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Xu hướng doanh thu (triệu VND)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [formatNumber(value) + ' triệu VND', 'Doanh thu'];
                return [formatNumber(value), name === 'bookings' ? 'Đặt chỗ' : 'Vé bán'];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1" 
              stroke="#f59e0b" 
              fill="#fbbf24" 
              name="Doanh thu"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Quản lý tin tức", action: () => onTabSelect(1) },
            { label: "Quản lý máy bay", action: () => onTabSelect(2) },
            { label: "Quản lý chuyến bay", action: () => onTabSelect(3) },
            { label: "Quản lý đặt chỗ", action: () => onTabSelect(4) }
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
