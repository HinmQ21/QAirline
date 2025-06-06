import { clientAxios } from '@/lib/axios/client';

// Booking API interface
export interface BookingRequest {
  flight_id: number;
  passengers: {
    name: string;
    dob?: string;
    seat_id: number;
  }[];
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    booking: {
      booking_id: number;
      total_price: number;
      status: string;
    };
    tickets: {
      ticket_id: number;
      passenger_name: string;
      price: number;
    }[];
    flight_info: {
      flight_number: string;
      departure_time: string;
    };
  };
}

// Create booking
const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const res = await clientAxios.post("/bookings", bookingData);
  return res.data;
};

// Get customer bookings
const getCustomerBookings = async () => {
  const res = await clientAxios.get("/bookings");
  return res.data;
};

// Get booking by ID
const getBookingById = async (bookingId: number) => {
  const res = await clientAxios.get(`/bookings/${bookingId}`);
  return res.data;
};

// Cancel booking
const cancelBooking = async (bookingId: number) => {
  const res = await clientAxios.put(`/bookings/${bookingId}/cancel`);
  return res.data;
};

export const bookingApiObject = {
  createBooking,
  getCustomerBookings,
  getBookingById,
  cancelBooking,
}; 