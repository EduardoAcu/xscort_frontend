import axios from "axios";

// Axios instance centralizada con soporte para cookies HttpOnly
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.26:8000",
  headers: {
    "Content-Type": "application/json",
  },
  // CRÍTICO: Enviar cookies automáticamente con cada request
  withCredentials: true,
});

// Contador para reintentos de 429
const retryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
};

// Interceptor: si el access_token expira (401), intenta refrescar (una sola vez compartida) y reintenta
let refreshPromise = null;

// Interceptor: manejo de 401 (refresh token) y 429 (rate limiting)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const url = originalRequest?.url || "";
    const isRefreshCall = url.includes("/api/token/refresh/");
    const isAuthCall = url.includes("/api/token/") || url.includes("/api/register/");

    // MANEJO DE 429 (TOO MANY REQUESTS - RATE LIMITING)
    if (status === 429) {
      const retryCount = originalRequest.__retryCount || 0;
      if (retryCount < retryConfig.maxRetries) {
        originalRequest.__retryCount = retryCount + 1;
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = retryConfig.initialDelayMs * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return api(originalRequest);
      }
      // Si se agotaron los reintentos, rechazar con mensaje claro
      const error429 = new Error(
        "El servidor está muy ocupado. Por favor, intenta de nuevo en unos momentos."
      );
      error429.status = 429;
      return Promise.reject(error429);
    }

    // MANEJO DE 401 (ACCESO NO AUTORIZADO - REFRESCAR TOKEN)
    if (status === 401 && !isRefreshCall && !isAuthCall && !originalRequest.__isRetry) {
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/api/token/refresh/");
        }
        await refreshPromise;
        refreshPromise = null;
        originalRequest.__isRetry = true;
        return api(originalRequest);
      } catch (refreshErr) {
        refreshPromise = null;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
