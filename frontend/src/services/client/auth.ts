import { api } from "@/lib/axios/client";
import { User } from "../schemes/auth";

export const me = async (): Promise<User> => {
  return (await api.get("/auth/me")).data.data;
}
