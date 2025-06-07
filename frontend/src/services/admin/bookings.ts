import { adminAxios } from "@/lib/axios/admin";

export const bookingApiObject = {
  // Get all bookings for admin with pagination and filters
  getAllBookings: async (params: {
    page?: number;
    limit?: number;
    flight_id?: string;
    status?: string;
    search?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.flight_id) queryParams.append('flight_id', params.flight_id);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const response = await adminAxios.get(`/admin/bookings?${queryParams.toString()}`);
    return response.data;
  },

  // Get booking statistics for admin
  getBookingStats: async (params: {
    flight_id?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.flight_id) queryParams.append('flight_id', params.flight_id);

    const response = await adminAxios.get(`/admin/bookings/stats?${queryParams.toString()}`);
    return response.data;
  },

  // Get booking details by ID for admin
  getBookingById: async (bookingId: number) => {
    const response = await adminAxios.get(`/admin/bookings/${bookingId}`);
    return response.data;
  }
}; 