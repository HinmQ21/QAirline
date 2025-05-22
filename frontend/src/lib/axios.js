// src/lib/axiosClient.js
import axios from "axios";
import { API_BASE_URL } from "@/constants/env";

export const api = axios.create({ baseURL: API_BASE_URL });
export const adminApi = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("userAccessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

adminApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("adminAccessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("userRefreshToken");

        const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = res.data;
        localStorage.setItem("userAccessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return clientApi(originalRequest);
      } catch (e) {
        // TODO: is it safe to do this?
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);

adminApi.interceptors.response.use(
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
        return clientApi(originalRequest);
      } catch (e) {
        // TODO: is it safe to do this?
        localStorage.clear();
        window.location.href = "/admin";
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);