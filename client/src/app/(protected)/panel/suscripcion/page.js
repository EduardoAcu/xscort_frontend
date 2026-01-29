"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Feedback visual
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { ChevronDown, Landmark, BanknoteArrowUp, CloudUpload, CircleCheckBig, History, Receipt, Eye, Calendar } from "lucide-react";

export default function SuscripcionPage() {
  const [planes, setPlanes] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [comprobanteFile, setComprobanteFile] = useState(null);
  
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  useEffect(() => {
    fetchPlanes();
    fetchSolicitudes();
  }, []);

  const fetchPlanes = async () => {
    try {
      setLoadingPlanes(true);
      const res = await api.get("/api/subscriptions/planes/");
      setPlanes(res.data || []);
    } catch (err) {
      console.error("Error al cargar planes", err);
      toast.error("No se pudieron cargar los planes disponibles.");
    } finally {
      setLoadingPlanes(false);
    }
  };

  const fetchSolicitudes = async () => {
    try {
      setLoadingSolicitudes(true);
      const res = await api.get("/api/subscriptions/solicitudes/mias/");
      setSolicitudes(res.data || []);
    } catch (err) {
      console.error("Error al cargar historial", err);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlanId) {
      toast.warning("Por favor selecciona un plan.");
      return;
    }
    if (!comprobanteFile) {
      toast.warning("Debes adjuntar el comprobante de la transferencia.");
      return;
    }

    const formData = new FormData();
    formData.append("plan_id", selectedPlanId);
    formData.append("comprobante_pago", comprobanteFile);

    try {
      setSubmitting(true);
      await api.post("/api/subscriptions/solicitudes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Solicitud enviada con éxito. Un administrador la revisará pronto.");
      
      // Resetear formulario
      setSelectedPlanId("");
      setComprobanteFile(null);
      // Resetear input file visualmente (truco para limpiar el value del input)
      document.getElementById("fileInput").value = ""; 

      await fetchSolicitudes();
    } catch (err) {
      console.error("Error al enviar solicitud", err);
      const errorMsg = err?.response?.data?.detail || "Error al enviar la solicitud.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEstado = (estado) => {
    const estilos = {
      pendiente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      aprobada: "bg-green-500/10 text-green-500 border-green-500/20",
      rechazada: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    
    const clase = estilos[estado] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
    
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${clase}`}>
        {estado}
      </span>
    );
  };

  return (
    <ProtectedRoute requireModel>
      <div className="min-h-screen bg-[#120912] text-white font-montserrat">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm uppercase text-pink-200 font-semibold tracking-wider">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">Mi Suscripción</h1>
            <p className="text-pink-100 mt-2 text-sm sm:text-base opacity-80">
              Gestiona tu membresía para mantener tu perfil visible.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Columna Izquierda: Datos + Formulario */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Tarjeta Bancaria */}
              <div className="rounded-2xl bg-gradient-to-br from-[#2a1225] to-[#1b0d18] p-6 shadow-xl border border-white/5 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
                
                <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-pink-500" />
                  Datos de Transferencia
                </h2>
                
                <div className="space-y-3 text-sm text-pink-100/90 relative z-10">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">Banco</span>
                    <span className="font-semibold text-white">Banco de Chile</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">Tipo</span>
                    <span className="font-semibold text-white">Cuenta Corriente</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">N° Cuenta</span>
                    <span className="font-semibold text-white font-mono tracking-wider">123456789</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">RUT</span>
                    <span className="font-semibold text-white">11.111.111-1</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="opacity-60">Titular</span>
                    <span className="font-semibold text-white">Xscort SpA</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="opacity-60">Email</span>
                    <span className="font-semibold text-pink-400">pagos@xscort.cl</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Envío */}
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-xl border border-white/5">
                <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                  <BanknoteArrowUp className="w-5 h-5" />
                  Reportar Pago
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300">Seleccionar Plan</label>
                    <div className="relative">
                        <select
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            disabled={loadingPlanes}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white appearance-none hover:border-pink-500/50 focus:border-pink-500 focus:outline-none transition cursor-pointer"
                        >
                            <option value="">-- Elige un plan --</option>
                            {planes.map((plan) => (
                            <option key={plan.id} value={plan.id} className="text-black">
                                {plan.nombre} ({plan.dias_contratados} días) — ${plan.precio.toLocaleString("es-CL")}
                            </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-pink-500">
                            <ChevronDown className="w-5 h-5"/>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-300">Comprobante (Imagen/PDF)</label>
                    <div className="relative">
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className={`
                            w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all
                            ${comprobanteFile 
                                ? "border-green-500/50 bg-green-500/10" 
                                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-500/30"
                            }
                        `}>
                            {comprobanteFile ? (
                                <div className="flex flex-col items-center text-green-400">
                                    <CircleCheckBig className="w-6 h-6" />
                                    <span className="text-xs font-medium truncate max-w-full px-2">
                                        {comprobanteFile.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <CloudUpload className="w-6 h-6" />
                                    <span className="text-xs">Click para subir comprobante</span>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || loadingPlanes}
                    className="w-full rounded-xl bg-[#ff007f] px-4 py-3 text-white font-bold hover:bg-pink-600 disabled:opacity-50 transition shadow-lg shadow-pink-600/20 flex justify-center items-center gap-2"
                  >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Enviando...
                        </>
                    ) : (
                        "Enviar Solicitud"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Columna Derecha: Historial */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-xl border border-white/5 h-full">
                <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2 border-b border-white/10 pb-4">
                  <History className="w-5 h-5" />
                  Historial de Solicitudes
                </h2>

                {loadingSolicitudes ? (
                   <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p>Cargando historial...</p>
                   </div>
                ) : solicitudes.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <Receipt className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                    <p className="text-pink-200 font-medium">No tienes solicitudes registradas.</p>
                    <p className="text-gray-500 text-sm">Cuando envíes un comprobante, aparecerá aquí.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solicitudes.map((sol) => (
                      <div
                        key={sol.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] p-4 transition-all"
                      >
                        <div className="mb-3 md:mb-0">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-white text-lg">
                                {sol.plan?.nombre || "Plan Desconocido"}
                             </span>
                             <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {sol.plan?.dias_contratados} días
                             </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(sol.fecha_creacion).toLocaleDateString("es-CL", {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {sol.comprobante_pago && (
                            <a
                              href={sol.comprobante_pago}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 text-pink-400 hover:text-pink-300 transition border border-pink-500/30 px-3 py-1.5 rounded-lg hover:bg-pink-500/10"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Comprobante
                            </a>
                          )}
                          
                          {renderEstado(sol.estado)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}