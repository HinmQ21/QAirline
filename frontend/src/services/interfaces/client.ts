import { User } from "../schemes/auth";
import { NewsCategoryType, NewsListResponse } from "../schemes/news";
import { ManufacturerType, PlaneType } from "../schemes/planes";
import { BookingRequest, BookingResponse } from "../client/booking";

export interface ClientApiInterface {
  // Auth
  me: () => Promise<User>;
  logout: () => void;
  login: (username: string, password: string) => Promise<User>;

  // Flight
  // TODO: change `any` to a more specific type
  getFlight: (
    flightNumber: string, 
    departure_airport: string, 
    arrival_airport: string,
    departure_date: string,
    status: string,
  ) => Promise<any>;
  
  getFlightPaged: (pageSize: number, pageNumber: number) => Promise<any>;
  getFlightById: (id: string) => Promise<any>;

  // Booking
  createBooking: (bookingData: BookingRequest) => Promise<BookingResponse>;
  getCustomerBookings: () => Promise<any>;
  getBookingById: (bookingId: number) => Promise<any>;
  cancelBooking: (bookingId: number) => Promise<any>;

  // News
  getNewsList: (params: {
    page: number;
    limit: number;
    category?: NewsCategoryType;
    search?: string;
  }) => Promise<NewsListResponse>;

  // Planes
  getPlaneList: (params: {
    manufacturer?: ManufacturerType;
  }) => Promise<PlaneType[]>;

  // Airports
  getAirportList: (params: {
    code: string,
    name: string,
    city: string,
    country: string,
  }) => Promise<any>;
}