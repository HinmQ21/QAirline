import { createContext, useContext } from "react";
import { UserContext } from "./UserContext";
import { PreBookingContext } from "./BookingContext";

export const serviceContainer = {
  userContext: new UserContext(),
  preBookingContext: new PreBookingContext(),
}

export const ServiceContext = createContext<typeof serviceContainer | undefined>(undefined);

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("ServiceContext not found");
  return ctx;
}