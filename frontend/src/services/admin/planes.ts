import { adminAxios } from "@/lib/axios/admin";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";

const createPlane = async (
  data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminAxios.post('/airplanes', data)).data.data;
}

const deletePlane = async (plane_id: number) => {
  return await adminAxios.delete(`/airplanes/${plane_id}`);
}

const updatePlane = async (
  plane_id: number, data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminAxios.put(`/airplanes/${plane_id}`, data)).data.data;
}

export const planeApiObject = {
  createPlane: createPlane,
  deletePlane: deletePlane,
  updatePlane: updatePlane
};
