"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

export default function SuscripcionPage() {
  const [planes, setPlanes] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setError("No se pudieron cargar los planes");
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
      console.error("Error al cargar solicitudes de suscripción", err);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPlanId) {
      setError("Debes seleccionar un plan");
      return;
    }
    if (!comprobanteFile) {
      setError("Debes adjuntar el comprobante de pago");
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
      setSuccess("Solicitud enviada correctamente. Nuestro equipo revisará tu comprobante.");
      setSelectedPlanId("");
      setComprobanteFile(null);
      await fetchSolicitudes();
    } catch (err) {
      console.error("Error al enviar solicitud de suscripción", err);
      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "object"
          ? Object.values(err?.response?.data)[0]?.[0]
          : null) ||
        "Error al enviar la solicitud";
      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">Pendiente</span>;
      case "aprobada":
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Aprobada</span>;
      case "rechazada":
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">Rechazada</span>;
      default:
        return <span className="text-xs text-pink-200">{estado}</span>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#120912] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-10">
          <div>
            <p className="text-sm uppercase text-pink-200 text-montserrat font-semibold">xscort.cl</p>
            <h1 className="text-3xl sm:text-4xl text-montserrat font-black tracking-tight">Mi Suscripción</h1>
            <p className="text-pink-100 text-montserrat mt-1 text-sm sm:text-base">Elige un plan, realiza la transferencia y sube tu comprobante para activarlo.</p>
          </div>

          <div className="mt-8 grid gap-6 text-montserrat lg:grid-cols-3">
            {/* Columna izquierda: datos de transferencia + formulario */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <h2 className="text-xl font-bold mb-2 text-white">Datos de transferencia</h2>
                <p className="text-pink-100 mb-4">
                  Realiza la transferencia a la siguiente cuenta y luego adjunta el comprobante en el formulario.
                </p>
                {/* TODO: Ajusta estos datos bancarios a los reales de tu negocio */}
                <dl className="space-y-2 text-sm text-pink-100">
                  <div>
                    <dt className="font-semibold">Banco</dt>
                    <dd>Banco de Chile</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Tipo de cuenta</dt>
                    <dd>Cuenta Corriente</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Número de cuenta</dt>
                    <dd>123456789</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">RUT</dt>
                    <dd>11.111.111-1</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Titular</dt>
                    <dd>Xscort SpA</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Correo para avisos</dt>
                    <dd>pagos@xscort.cl</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md ">
                <h2 className="text-lg font-bold mb-4 text-white">Enviar comprobante</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Plan</label>
                    {loadingPlanes ? (
                      <p className="text-sm text-pink-200">Cargando planes...</p>
                    ) : (
                      <select
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full rounded-md border px-4 py-2 bg-transparent text-white [&>option]:text-black [&>option]:bg-white"
                        required
                      >
                        <option value="">Selecciona un plan</option>
                        {planes.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.nombre} - {plan.dias_contratados} días - ${plan.precio}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Comprobante de pago</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
                      className="w-full rounded-md border px-3 py-2 text-sm bg-transparent text-white"
                      required
                    />
                    <p className="text-xs text-pink-200">Formatos aceptados: imagen o PDF.</p>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {success && <p className="text-sm text-green-600">{success}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-[#ff007f] px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
                  >
                    {submitting ? "Enviando..." : "Enviar solicitud"}
                  </button>
                </form>
              </div>
            </div>

            {/* Columna derecha: historial de solicitudes */}
            <div className="lg:col-span-2 text-montserrat">
              <div className="rounded-2xl bg-[#1b0d18] p-6 shadow-md">
                <h2 className="text-lg font-bold mb-4 text-white">Historial de solicitudes</h2>
                {loadingSolicitudes ? (
                  <p className="text-sm text-pink-200">Cargando solicitudes...</p>
                ) : solicitudes.length === 0 ? (
                  <p className="text-sm text-pink-200">Aún no has enviado ninguna solicitud de suscripción.</p>
                ) : (
                  <div className="space-y-3 text-sm text-pink-100">
                    {solicitudes.map((sol) => (
                      <div
                        key={sol.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border px-3 py-2 gap-2"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {sol.plan?.nombre} ({sol.plan?.dias_contratados} días)
                          </p>
                          <p className="text-pink-200">
                            Enviada el {new Date(sol.fecha_creacion).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderEstado(sol.estado)}
                          {sol.comprobante_pago && (
                            <a
                              href={sol.comprobante_pago}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-pink-200 hover:underline"
                            >
                              Ver comprobante
                            </a>
                          )}
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
