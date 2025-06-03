import { adminApi } from "@/lib/axios/admin";

export const manufacturerLabels = {
  airbus: "Airbus",
  boeing: "Boeing",
  embraer: "Embraer",
  atr: "ATR"
}

export const manufacturerList = ["airbus", "boeing", "embraer", "atr"] as const;
export type ManufacturerType = typeof manufacturerList[number];

export const seatClassList = ["economy", "business", "first"] as const;
export type SeatClassType = typeof seatClassList[number];

export type SeatConfigurationType = {
  seat_number: number;
  class: SeatClassType;
};

export type PlaneType = {
  airplane_id: string;
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
