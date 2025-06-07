import { adminAxios } from "@/lib/axios/admin";

export interface DashboardStats {
  customers: {
    total: number;
  };
  flights: {
    total: number;
    active: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
  };
  tickets: {
    total: number;
    today: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await adminAxios.get<DashboardResponse>("/admin/dashboard");
  return res.data.data;
};

export const dashboardApiObject = {
  getDashboardStats: getDashboardStats
}; 