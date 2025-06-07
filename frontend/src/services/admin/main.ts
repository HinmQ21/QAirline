import { AdminApiInterface } from "../interfaces/admin";
import { authApiObject } from "./auth";
import { newsApiObject } from "./news";
import { planeApiObject } from "./planes";
import { flightApiObject } from "./flights";
import { dashboardApiObject } from "./dashboard";

export const adminApi: AdminApiInterface = {
  ...authApiObject,
  ...newsApiObject,
  ...planeApiObject,
  ...flightApiObject,
  ...dashboardApiObject
}
