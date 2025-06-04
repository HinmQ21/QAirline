import axios from "axios";
import { API_BASE_URL } from "@/constants/env";

export const adminAxios = axios.create({ baseURL: API_BASE_URL });

adminAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("adminAccessToken");
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

adminAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("adminRefreshToken");

        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = res.data;
        localStorage.setItem("adminRefreshToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminAxios(originalRequest);
      } catch (e) {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        window.location.href = "/admin";
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);