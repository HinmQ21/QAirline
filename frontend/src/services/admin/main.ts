import { AdminApiInterface } from "../interfaces/admin";
import { authApiObject } from "./auth";
import { newsApiObject } from "./news";
import { planeApiObject } from "./planes";

export const adminApi: AdminApiInterface = {
  ...authApiObject,
  ...newsApiObject,
  ...planeApiObject
}
