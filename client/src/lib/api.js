import axios from "axios";

// Axios instance centralizada con soporte para cookies HttpOnly
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  // CRÍTICO: Enviar cookies automáticamente con cada request
  withCredentials: true,
});
// Interceptor: si el access_token expira (401), intenta refrescar (una sola vez compartida) y reintenta
let refreshPromise = null;
// Interceptor: si el access_token expira (401), intenta refrescar y reintenta una sola vez
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const url = originalRequest?.url || "";
    const isRefreshCall = url.includes("/api/token/refresh/");
    const isAuthCall = url.includes("/api/token/") || url.includes("/api/register/");

    // Solo intentar refresh si es 401, no es la llamada de refresh en sí, y no es login/register
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
