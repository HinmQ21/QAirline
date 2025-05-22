import { adminApi } from "@/lib/axios";

export const adminLogin = async (username, password) => {
  const res = await adminApi.post("/auth/admin/login", { username, password });

  const { accessToken, refreshToken, data } = res.data;

  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data));

  return res.data;
};
