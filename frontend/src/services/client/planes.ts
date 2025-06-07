import { adminAxios } from "@/lib/axios/admin";
import { PlaneType } from "../schemes/planes";
import { ManufacturerType } from "../schemes/planes";

const getPlaneList = async (params: {
  manufacturer?: ManufacturerType | undefined;
}): Promise<PlaneType[]> => {
  return (await adminAxios.get('/airplanes', { params })).data.data;
};

const getPlane = async (airplane_id: number): Promise<PlaneType> => {
  return (await adminAxios.get(`/airplanes/${airplane_id}`)).data.data;
};

export const planeApiObject = { getPlaneList: getPlaneList, getPlane: getPlane };