import { adminApi } from "@/lib/axios/admin";
import { PlaneType } from "../schemes/planes";
import { ManufacturerType } from "../schemes/planes";

export const getPlaneList = async (params: {
  manufacturer?: ManufacturerType | undefined;
}): Promise<PlaneType[]> => {
  return (await adminApi.get('/airplanes', { params })).data.data;
};
