import { User } from "../schemes/auth";
import { clientAxios } from "@/lib/axios/client";

const me = async (): Promise<User> => {
  return (await clientAxios.get("/auth/me")).data.data;
}

const login = async (username: string, password: string): Promise<User> => {
  const res = await clientAxios.post("/auth/login", { username, password });

  const { accessToken, refreshToken, data } = res.data;

  console.log(`client access token: ${accessToken}`);
  localStorage.setItem("userAccessToken", accessToken);
  localStorage.setItem("userRefreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(data));

  return data;
}

const logout = () => {
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
}

export const authApiObject = { me: me, login: login, logout: logout };
