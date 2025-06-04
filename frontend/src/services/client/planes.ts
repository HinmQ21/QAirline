import { adminAxios } from "@/lib/axios/admin";
import { PlaneType } from "../schemes/planes";
import { ManufacturerType } from "../schemes/planes";

const getPlaneList = async (params: {
  manufacturer?: ManufacturerType | undefined;
}): Promise<PlaneType[]> => {
  return (await adminAxios.get('/airplanes', { params })).data.data;
};

export const planeApiObject = { getPlaneList: getPlaneList };