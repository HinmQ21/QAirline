import axios from "axios";
import { API_BASE_URL } from "@/constants/env";

export const clientAxios = axios.create({ baseURL: API_BASE_URL });

clientAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("userAccessToken");
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

clientAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("userRefreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token is not available");
        }

        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = res.data;
        localStorage.setItem("userAccessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return clientAxios(originalRequest);
      } catch (e) {
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("userRefreshToken");
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);
