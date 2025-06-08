import { clientAxios } from '@/lib/axios/client';

const getFlight = async (
  flightNumber: string, 
  departure_airport: string, 
  arrival_airport: string,
  departure_date: string,
  status: string,
) => {
  
  const res = await clientAxios.get("/flights", {
      params: {
        flightNumber,
        departure_airport,
        arrival_airport,
        departure_date,
        status,
      }
    });
  return res.data;
}

const getFlightPaged = async (pageSize: number, pageNumber: number) => {
  const res = await clientAxios.get("flights/paged", {
    params: {
      pageSize,
      pageNumber,
    }
  });

  return res.data;
}

const searchFlights = async (
  departure_airport_id: string,
  arrival_airport_id: string,
  departure_date: string,
) => {
  const res = await clientAxios.get("flights/search", {
    params: {
      departure_airport_id,
      arrival_airport_id,
      departure_date,
      return_date: null,
    }
  });

  return res.data;
}

const getFlightById = async (id: string) => {
  const res = await clientAxios.get(`flights/${id}`);
  return res.data;
}

export const flightApiObject = { 
  getFlight: getFlight,
  getFlightPaged: getFlightPaged,
  searchFlights: searchFlights,
  getFlightById: getFlightById,
};
