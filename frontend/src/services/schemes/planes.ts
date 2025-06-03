export const manufacturerLabels = {
  Airbus: "Airbus",
  Boeing: "Boeing",
  Embraer: "Embraer",
  ATR: "ATR"
};
export const manufacturerList = ["Airbus", "Boeing", "Embraer", "ATR"] as const;
export type ManufacturerType = (typeof manufacturerList)[number];
export const seatClassList = ["economy", "business", "first"] as const;
export type SeatClassType = (typeof seatClassList)[number];
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
};
export type CreatePlaneRequest = {
  code: string;
  manufacturer: ManufacturerType;
  model: string;
  total_seats: number;
};
