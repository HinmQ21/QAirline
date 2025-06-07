import { adminAxios } from "@/lib/axios/admin";

export interface CreateFlightRequest {
  flight_number: string;
  airplane_id: number;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_time: string;
  arrival_time: string;
  status?: 'scheduled' | 'delayed' | 'cancelled';
}

export interface UpdateFlightRequest {
  flight_number?: string;
  airplane_id?: number;
  departure_airport_id?: number;
  arrival_airport_id?: number;
  departure_time?: string;
  arrival_time?: string;
  status?: 'scheduled' | 'delayed' | 'cancelled';
  basePrice?: number;
}

export interface FlightResponse {
  id: number;
  flightNumber: string;
  departureAirportId: number;
  arrivalAirportId: number;
  departureTime: string;
  arrivalTime: string;
  airplaneId: number;
  basePrice: number;
  status: string;
  airline: string;
  createdAt: string;
  updatedAt: string;
}

const createFlight = async (data: CreateFlightRequest): Promise<FlightResponse> => {
  return (await adminAxios.post('/flights', data)).data.data;
};

const updateFlight = async (flight_id: number, data: UpdateFlightRequest): Promise<FlightResponse> => {
  return (await adminAxios.put(`/flights/${flight_id}`, data)).data.data;
};

const deleteFlight = async (flight_id: number) => {
  return await adminAxios.delete(`/flights/${flight_id}`);
};

const getFlights = async (params?: {
  flight_number?: string;
  departure_airport?: number;
  arrival_airport?: number;
  departure_date?: string;
  status?: string;
}) => {
  return (await adminAxios.get('/flights', { params })).data;
};

const getFlightById = async (flight_id: number) => {
  return (await adminAxios.get(`/flights/${flight_id}`)).data.data;
};

const getAllFlights = async () => {
  return (await adminAxios.get('/flights')).data;
};

export const flightApiObject = {
  createFlight,
  updateFlight,
  deleteFlight,
  getFlights,
  getFlightById,
  getAllFlights,
}; 