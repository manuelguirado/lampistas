import axios from "axios";
import type { UserType } from "../types/userType";
import { API_BASE_URL } from "../config/baseUrl";
import {
  getAccessTokenKey,
  getRefreshTokenKey,
  getIdKey,
  setTokens,
  getLoginRoute,
} from "../api/helpers";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Interceptar request
api.interceptors.request.use((config) => {
  const userType = (localStorage.getItem("userType") || "company") as UserType;
  const token = getAccessTokenKey(userType);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Interceptar response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userType = (localStorage.getItem("userType") ||
          "company") as UserType;
        const refreshToken = getRefreshTokenKey(userType);
        const userID = getIdKey(userType);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        if (!userID) {
          throw new Error("No user id available");
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refreshToken`,
          {
            token: refreshToken,
            userType: userType,
            id: Number(userID),
          }
        );

        // ✅ Guardar nuevos tokens
        setTokens(userType, data.accessToken, data.refreshToken, Number(userID));

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Error renovando token:", refreshError);

        const userType = (localStorage.getItem("userType") ||
          "company") as UserType;
        localStorage.clear();
        window.location.href = getLoginRoute(userType);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;