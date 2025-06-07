import { adminAxios } from "@/lib/axios/admin";

const login = async (username: string, password: string) => {
  const res = await adminAxios.post("/auth/admin/login", { username, password });

  const { accessToken, refreshToken, data } = res.data;

  console.log(`admin access token: ${accessToken}`);
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data));

  return data;
};

const me = async () => {
  return await adminAxios.get("/auth/admin/me");
};

const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("adminRefreshToken");
    if (refreshToken) {
      // Call server logout endpoint to invalidate refresh token
      await adminAxios.post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Error calling server logout:", error);
    // Continue with local logout even if server call fails
  } finally {
    // Always clear local storage
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
  }
};

export const authApiObject = {
  me: me,
  login: login,
  logout: logout
}
