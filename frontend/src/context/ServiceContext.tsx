import { createContext, useContext } from "react";
import { UserContext } from "./UserContext";
import { PreBookingContext } from "./BookingContext";
import { adminApi } from "@/services/admin/main";

export const serviceContainer = {
  userContext: new UserContext(),
  preBookingContext: new PreBookingContext(),
  adminApi: adminApi,
  flightApi: {
    getAllFlights: adminApi.getAllFlights,
  }
}

export const ServiceContext = createContext<typeof serviceContainer | undefined>(undefined);

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("ServiceContext not found");
  return ctx;
}