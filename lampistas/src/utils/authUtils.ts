import type { UserType } from '../types/userType';

// Configuración por tipo de usuario
const USER_CONFIG = {
  admin: {
    tokenKey: 'adminToken',
    refreshUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/admin/refreshToken`,
    loginUrl: '/admin',
  },
  company: {
    tokenKey: 'companyToken',
    refreshUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/company/refreshToken`,
    loginUrl: '/company/companyLogin',
  },
  worker: {
    tokenKey: 'workerToken',
    refreshUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/worker/refreshToken`,
    loginUrl: '/worker/workerLogin',
  },
  user: {
    tokenKey: 'userToken',
    refreshUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user/refreshToken`,
    loginUrl: '/user/userLogin',
  },
};

// Utilidad para refrescar el token de cualquier tipo de usuario
export async function refreshToken(userType: UserType): Promise<string | null> {
  const config = USER_CONFIG[userType];
  const currentToken = localStorage.getItem(config.tokenKey);
  
  if (!currentToken) {
    console.error(`No ${userType} token found to refresh`);
    return null;
  }

  try {
    const response = await fetch(config.refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ token: currentToken }),
    });

    const data = await response.json();

    if (data.token) {
      // Guardar el nuevo token
      localStorage.setItem(config.tokenKey, data.token);
    
      return data.token;
    } else {
      console.error(`❌ Error al refrescar ${userType} token:`, data.message);
      // Si falla el refresh, limpiar el token y redirigir al login
      localStorage.removeItem(config.tokenKey);
      window.location.href = config.loginUrl;
      return null;
    }
  } catch (error) {
    console.error(`❌ Error de conexión al refrescar ${userType} token:`, error);
    localStorage.removeItem(config.tokenKey);
    window.location.href = config.loginUrl;
    return null;
  }
}

// Interceptor para manejar respuestas 401 (no autorizado)
export async function fetchWithTokenRefresh(
  url: string,
  userType: UserType,
  options: RequestInit = {}
): Promise<Response> {
  const config = USER_CONFIG[userType];
  const token = localStorage.getItem(config.tokenKey);
  
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
    const token = localStorage.getItem(config.tokenKey);
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
    const token = localStorage.getItem(config.tokenKey);
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
