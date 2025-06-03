import { adminApi } from "@/lib/axios/admin";

export const manufacturerLabels = {
  Airbus: "Airbus",
  Boeing: "Boeing",
  Embraer: "Embraer",
  ATR: "ATR"
}

export const manufacturerList = ["Airbus", "Boeing", "Embraer", "ATR"] as const;
export type ManufacturerType = typeof manufacturerList[number];

export const seatClassList = ["economy", "business", "first"] as const;
export type SeatClassType = typeof seatClassList[number];

export type SeatConfigurationType = {
  seat_number: number;
  class: SeatClassType;
};

export type PlaneType = {
  airplane_id: number;
  code: string;
  manufacturer: ManufacturerType;
  model: string;
  total_seats: number;
  seat_configuration?: SeatConfigurationType | undefined;
}

export type CreatePlaneRequest = {
  code: string;
  manufacturer: ManufacturerType;
  model: string;
  total_seats: number;
}

export const createPlane = async (
  data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminApi.post('/airplanes', data)).data.data;
}

export const getPlaneList = async (params: {
  manufacturer?: ManufacturerType | undefined
}): Promise<PlaneType[]> => {
  return (await adminApi.get('/airplanes', {params})).data.data;
}

export const deletePlane = async (plane_id: number) => {
  return await adminApi.delete(`/airplanes/${plane_id}`);
}

export const updatePlane = async (
  plane_id: number, data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminApi.put(`/airplanes/${plane_id}`, data)).data.data;
}