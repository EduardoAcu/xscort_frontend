import api from "@/lib/api";

// Solicitar verificación para ser modelo (nuevo endpoint)
export const requestModelVerification = (ciudadId) => 
  api.post("/api/request-model-verification/", { ciudad_id: ciudadId });

// Alias para mantener compatibilidad (deprecado)
export const becomeModel = requestModelVerification;
