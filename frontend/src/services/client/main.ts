import { ClientApiInterface } from "../interfaces/client";
import { authApiObject } from "./auth";
import { flightApiObject } from "./flight";
import { newsApiObject } from "./news";
import { planeApiObject } from "./planes";

export const clientApi: ClientApiInterface = {
  ...authApiObject,
  ...flightApiObject,
  ...newsApiObject,
  ...planeApiObject
}
