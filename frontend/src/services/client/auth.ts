import { User } from "../schemes/auth";
import { clientAxios } from "@/lib/axios/client";

const me = async (): Promise<User> => {
  return (await clientAxios.get("/auth/me")).data.data;
}

export const authApiObject = { me: me };
