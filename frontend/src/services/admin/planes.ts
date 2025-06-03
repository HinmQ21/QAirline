import { adminApi } from "@/lib/axios/admin";
import { CreatePlaneRequest, PlaneType } from "../schemes/planes";

export const createPlane = async (
  data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminApi.post('/airplanes', data)).data.data;
}

export const deletePlane = async (plane_id: number) => {
  return await adminApi.delete(`/airplanes/${plane_id}`);
}

export const updatePlane = async (
  plane_id: number, data: CreatePlaneRequest
): Promise<PlaneType> => {
  return (await adminApi.put(`/airplanes/${plane_id}`, data)).data.data;
}