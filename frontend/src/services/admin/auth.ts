import { adminApi } from "@/lib/axios/admin";

export const adminLogin = async (username: string, password: string) => {
  const res = await adminApi.post("/auth/admin/login", { username, password });

  const { accessToken, refreshToken, data } = res.data;

  console.log(`admin access token: ${accessToken}`);
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data));

  return res.data;
};

export const adminMe = async () => {
  return await adminApi.get("/auth/admin/me");
};