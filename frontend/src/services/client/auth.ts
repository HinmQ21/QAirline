import { RegisterRequest, User } from "../schemes/auth";
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

const register = async (data: RegisterRequest): Promise<User> => {
  const res = await clientAxios.post("/auth/register", data);
  return res.data.data;
}

const logout = () => {
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
  localStorage.removeItem("user");
}

const updateProfile = async (profileData: {
  email?: string;
  full_name?: string;
  phone?: string;
  address?: string;
}): Promise<User> => {
  const res = await clientAxios.put("/auth/profile", profileData);
  return res.data.data;
}

const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await clientAxios.put("/auth/change-password", {
    currentPassword,
    newPassword
  });
}

const deleteAccount = async (): Promise<void> => {
  await clientAxios.delete("/auth/account");
  // Clear local storage after deleting account
  localStorage.removeItem("userAccessToken");
  localStorage.removeItem("userRefreshToken");
  localStorage.removeItem("user");
}

export const authApiObject = {
  me: me,
  login: login,
  logout: logout,
  updateProfile: updateProfile,
  changePassword: changePassword,
  deleteAccount: deleteAccount,
  register: register,
};
