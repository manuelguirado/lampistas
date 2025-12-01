import axios from "axios";
import type { UserType } from "../../../backend/src/utils/types/userType";
import {
  getAccessTokenKey,
  getRefreshTokenKey,
  getIdKey,
  setTokens,
  getLoginRoute,
} from "../api/helpers";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// ✅ Interceptar request
api.interceptors.request.use((config) => {
  const userType = (localStorage.getItem("userType") || "company") as UserType;
  const token = getAccessTokenKey(userType);
  console.log("Usando token para:", userType, "Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("token guardado" + token);
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
        console.log("userType en el interceptor de response:", userType);
        const refreshToken = getRefreshTokenKey(userType);
        console.log("Intentando renovar token para:", userType);
           const getUserID = getIdKey(userType);
           console.log("id del usuario" , getUserID)

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        console.log(`🔄 Token expirado para ${userType}, renovando...`);

        const { data } = await axios.post(
          "http://localhost:3000/auth/refreshToken",
          {
            token: refreshToken,
            userType: userType,
            id: Number(getUserID),
          }
        );
     
      

        // ✅ Guardar nuevos tokens
        setTokens(userType, data.accessToken, data.refreshToken,data.userID);
      

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
