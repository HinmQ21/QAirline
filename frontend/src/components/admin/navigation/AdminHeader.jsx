import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/context/AdminContext";
import { useState } from "react";

export const AdminHeader = () => {
  const { admin, logout } = useAdmin();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left section - Logo and Breadcrumb */}
          {/* <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
            </div>
          </div> */}
          <h1 className="text-2xl font-bold text-gray-900">QAirline Admin</h1>

          {/* Center section - Search */}
          {/* <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div> */}

          {/* Right section - Actions and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="font-medium">Đặt vé mới</div>
                  <div className="text-sm text-gray-500">Khách hàng vừa đặt vé chuyến bay HN-SGN</div>
                  <div className="text-xs text-gray-400">5 phút trước</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="font-medium">Máy bay cần bảo trì</div>
                  <div className="text-sm text-gray-500">Máy bay VN-A123 cần kiểm tra định kỳ</div>
                  <div className="text-xs text-gray-400">1 giờ trước</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                  <div className="font-medium">Tin tức mới được tạo</div>
                  <div className="text-sm text-gray-500">Bài viết "Khuyến mãi mùa hè" đã được xuất bản</div>
                  <div className="text-xs text-gray-400">2 giờ trước</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {admin?.full_name ? admin.full_name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">
                      {admin?.full_name || admin?.username || 'Admin User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {admin?.email || 'admin@qairline.com'}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Admin Profile Modal */}
      {showProfile && (
        <AdminProfileModal 
          admin={admin} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </>
  );
};

// Admin Profile Modal Component
const AdminProfileModal = ({ admin, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Hồ sơ cá nhân</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/api/placeholder/64/64" alt="Admin" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                {admin?.full_name ? admin.full_name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{admin?.full_name || admin?.username}</h3>
              <p className="text-gray-500">{admin?.role || 'Administrator'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-gray-500">ID Admin</label>
              <p className="text-sm">{admin?.admin_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tên đăng nhập</label>
              <p className="text-sm">{admin?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-sm">{admin?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tên đầy đủ</label>
              <p className="text-sm">{admin?.full_name || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Vai trò</label>
              <p className="text-sm">{admin?.role || 'Administrator'}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 