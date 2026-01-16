import api from "@/lib/api";

// Solicitar verificación para ser modelo (nuevo endpoint)
export const requestModelVerification = () => api.post("/api/request-model-verification/");

// Alias para mantener compatibilidad (deprecado)
export const becomeModel = requestModelVerification;
