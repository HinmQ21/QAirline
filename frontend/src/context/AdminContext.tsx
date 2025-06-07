import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminApi } from '@/services/admin/main';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  admin_id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;  
  logout: () => void;
  fetchAdminProfile: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminAccessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await adminApi.me();
      setAdmin(response.data.data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      // If token is invalid, clear it
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const adminData = await adminApi.login(username, password);
      setAdmin(adminData);
      toast.success('Đăng nhập thành công!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
      setAdmin(null);
      toast.success('Đăng xuất thành công!');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server request fails
      setAdmin(null);
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const value = {
    admin,
    loading,
    login,
    logout,
    fetchAdminProfile
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 