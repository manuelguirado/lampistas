import type { UserType } from '../types/userType';
import {
  getAccessTokenKey,
  getIdKey,
  getLoginRoute,
  getRefreshTokenKey,
  setTokens,
} from '../api/helpers';

import dotenv from 'dotenv';
dotenv.config();
/// <reference types="vite/client" />
let navigateFn: ((path: string) => void) | null = null;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

// Configuración por tipo de usuario
const USER_CONFIG = {
  admin: {
    refreshTokenKey: 'adminRefreshToken',
  },
  company: {
    refreshTokenKey: 'companyRefreshToken',
  },
  worker: {
    refreshTokenKey: 'workerRefreshToken',
  },
  user: {
    refreshTokenKey: 'userRefreshToken',
  },
};

// Utilidad para refrescar el token de cualquier tipo de usuario
export async function refreshToken(userType: UserType): Promise<string | null> {
  const refreshTokenValue = getRefreshTokenKey(userType);
  const userID = getIdKey(userType);
  const currentAccessToken = getAccessTokenKey(userType);
  
  if (!refreshTokenValue || !userID) {
    console.error(`Missing refresh credentials for ${userType}`);
    return null;
  }

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(currentAccessToken ? { Authorization: `Bearer ${currentAccessToken}` } : {}),
      },
      body: JSON.stringify({
        token: refreshTokenValue,
        userType,
        id: Number(userID),
      }),
    });

    type RefreshResponse = { accessToken?: string; refreshToken?: string; message?: string };
    const data = (await response.json()) as RefreshResponse;

    if (response.ok && data.accessToken && data.refreshToken) {
      setTokens(userType, data.accessToken, data.refreshToken, Number(userID));
      return data.accessToken;
    } else {
      console.error(`❌ Error al refrescar ${userType} token:`, data.message ?? data);
    
        localStorage.clear();
        if (navigateFn) {
          navigateFn(getLoginRoute(userType));
        }
     
      return null;
    }
  } catch (error) {
    console.error(`❌ Error de conexión al refrescar ${userType} token:`, error);
    if (navigateFn) {
      navigateFn(getLoginRoute(userType));
    }
    return null;
  }
}

// Interceptor para manejar respuestas 401 (no autorizado)
export async function fetchWithTokenRefresh(
  url: string,
  userType: UserType,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessTokenKey(userType);
  
  // Agregar token a los headers si existe
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  let response = await fetch(url, { ...options, headers });

  // Si recibimos 401, intentar refrescar el token y reintentar
  if (response.status === 401) {
    
    const newToken = await refreshToken(userType);
    
    if (newToken) {
      // Reintentar la petición con el nuevo token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });
    }
  }

  return response;
}

// Configurar refresh automático cada 50 minutos (antes de que expire en 1 hora)
export function setupAutoRefresh(userType: UserType) {
  const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutos en milisegundos
  const config = USER_CONFIG[userType];

  const intervalId = setInterval(async () => {
    const token = localStorage.getItem(config.refreshTokenKey);
    if (token) {
     
      await refreshToken(userType);
    } else {
      // Si no hay token, detener el intervalo
      clearInterval(intervalId);
    }
  }, REFRESH_INTERVAL);

  // Retornar función de limpieza
  return () => clearInterval(intervalId);
}

// Configurar auto-refresh para todos los tipos de usuario activos
export function setupAllAutoRefresh() {
  const cleanupFunctions: Array<() => void> = [];

  // Verificar cada tipo de usuario y configurar auto-refresh si está logueado
  (['admin', 'company', 'worker', 'user'] as UserType[]).forEach((userType) => {
    const config = USER_CONFIG[userType];
    const token = localStorage.getItem(config.refreshTokenKey);
    if (token) {
      const cleanup = setupAutoRefresh(userType);
      cleanupFunctions.push(cleanup);
    }
  });

  // Retornar función que limpia todos los intervalos
  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
  };
}
