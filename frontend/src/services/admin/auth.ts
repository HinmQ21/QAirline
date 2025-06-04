import { adminAxios } from "@/lib/axios/admin";

const login = async (username: string, password: string) => {
  const res = await adminAxios.post("/auth/admin/login", { username, password });

  const { accessToken, refreshToken, data } = res.data;

  console.log(`admin access token: ${accessToken}`);
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data));

  return res.data;
};

const me = async () => {
  return await adminAxios.get("/auth/admin/me");
};

export const authApiObject = {
  me: me,
  login: login
}
