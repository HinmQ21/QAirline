import { adminAxios } from "@/lib/axios/admin";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";

const createPlane = async (
  data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminAxios.post('/airplanes', data)).data.data;
}

const deletePlane = async (plane_id: number) => {
  return await adminAxios.delete(`/airplanes/${plane_id}`);
}

const updatePlane = async (
  plane_id: number, data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminAxios.put(`/airplanes/${plane_id}`, data)).data.data;
}

// Seat configuration methods
const getAirplaneSeats = async (plane_id: number) => {
  return (await adminAxios.get(`/airplanes/${plane_id}/seats`)).data.data;
}

const configureSeatLayout = async (plane_id: number, data: {
  row?: number;
  start_row?: number;
  end_row?: number;
  num_seats_per_row: number;
  class: 'economy' | 'business' | 'first';
}) => {
  return (await adminAxios.post(`/airplanes/${plane_id}/seats`, data)).data;
}

const updateSeatsByRow = async (plane_id: number, data: {
  row?: number;
  start_row?: number;
  end_row?: number;
  num_seats_per_row?: number;
  class?: 'economy' | 'business' | 'first';
}) => {
  return (await adminAxios.put(`/airplanes/${plane_id}/seats`, data)).data;
}

const deleteSeatsByRow = async (plane_id: number, data: {
  row?: number;
  start_row?: number;
  end_row?: number;
}) => {
  return await adminAxios.delete(`/airplanes/${plane_id}/seats`, { data });
}

export const planeApiObject = {
  createPlane: createPlane,
  deletePlane: deletePlane,
  updatePlane: updatePlane,
  getAirplaneSeats: getAirplaneSeats,
  configureSeatLayout: configureSeatLayout,
  updateSeatsByRow: updateSeatsByRow,
  deleteSeatsByRow: deleteSeatsByRow
};
