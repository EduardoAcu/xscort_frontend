"use client";
import React from "react";
import useAuthGuard from "@/hooks/useAuthGuard";

function DefaultLoader() {
  return <div style={{ padding: 12 }}>Cargando…</div>;
}

export default function ProtectedRoute({ children, redirectTo = "/login", loader = <DefaultLoader />, requireModel = false, requireClient = false }) {
  const { isAuthenticated, isReady } = useAuthGuard({ redirectTo, withNext: true, requireModel, requireClient });

  if (!isReady) return loader;
  if (!isAuthenticated) return null; // redirección en hook

  return children;
}
