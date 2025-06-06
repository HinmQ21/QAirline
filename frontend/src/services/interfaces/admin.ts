import { CreateNewsRequest, NewsType } from "../schemes/news";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";
import { CreateFlightRequest, UpdateFlightRequest, FlightResponse } from "../admin/flights";
import { DashboardStats } from "../admin/dashboard";

export interface AdminApiInterface {
  // Auth
  me: () => Promise<any>;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;

  // Dashboard
  getDashboardStats: () => Promise<DashboardStats>;

  // News
  createNews: (data: CreateNewsRequest) => Promise<NewsType>;
  deleteNews: (news_id: number) => Promise<void>;
  updateNews: (news_id: number, data: CreateNewsRequest) => Promise<NewsType>;

  // Planes
  createPlane: (data: CreatePlaneRequest) => Promise<PlaneType>;
  deletePlane: (plane_id: number) => Promise<any>;
  updatePlane: (plane_id: number, data: CreatePlaneRequest) => Promise<PlaneType>;
  
  // Seat configuration
  getAirplaneSeats: (plane_id: number) => Promise<any>;
  configureSeatLayout: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
    num_seats_per_row: number;
    class: 'economy' | 'business' | 'first';
  }) => Promise<any>;
  updateSeatsByRow: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
    num_seats_per_row?: number;
    class?: 'economy' | 'business' | 'first';
  }) => Promise<any>;
  deleteSeatsByRow: (plane_id: number, data: {
    row?: number;
    start_row?: number;
    end_row?: number;
  }) => Promise<any>;

  // Flights
  createFlight: (data: CreateFlightRequest) => Promise<FlightResponse>;
  updateFlight: (flight_id: number, data: UpdateFlightRequest) => Promise<FlightResponse>;
  deleteFlight: (flight_id: number) => Promise<any>;
  getFlights: (params?: {
    flight_number?: string;
    departure_airport?: number;
    arrival_airport?: number;
    departure_date?: string;
    status?: string;
  }) => Promise<any>;
  getFlightById: (flight_id: number) => Promise<any>;
  getAllFlights: () => Promise<any>;

  // Bookings
  getAllBookings: (params?: {
    page?: number;
    limit?: number;
    flight_id?: string;
    status?: string;
    search?: string;
  }) => Promise<any>;
  getBookingStats: (params?: {
    flight_id?: string;
  }) => Promise<any>;
  getBookingById: (bookingId: number) => Promise<any>;
}
