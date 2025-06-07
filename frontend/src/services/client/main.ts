import { ClientApiInterface } from "../interfaces/client";
import { airportApiObject } from "./airport";
import { airportApiObject } from "./airport";
import { authApiObject } from "./auth";
import { flightApiObject } from "./flight";
import { newsApiObject } from "./news";
import { planeApiObject } from "./planes";
import { bookingApiObject } from "./booking";

export const clientApi: ClientApiInterface = {
  ...authApiObject,
  ...flightApiObject,
  ...newsApiObject,
  ...planeApiObject,
  ...airportApiObject,
  ...bookingApiObject,
}
