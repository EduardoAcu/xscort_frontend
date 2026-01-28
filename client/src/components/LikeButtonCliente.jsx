"use client";
import { useState } from "react";
import api from "@/lib/api";
import useAuthStore from "@/store/auth";

export default function LikeButtonCliente({ perfilId, initialLiked = false, initialCount = 0 }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = async () => {
    if (!isAuthenticated) {
      setError("Inicia sesión para dar like");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (liked) {
        await api.delete(`/api/profiles/${perfilId}/unlike/`);
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await api.post(`/api/profiles/${perfilId}/like/`);
        setLiked(true);
        setCount((c) => c + 1);
      }
    } catch (err) {
      const apiError = err?.response?.data?.error || "No se pudo registrar el like";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={loading}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition border ${
          liked ? "bg-pink-600 text-white border-pink-600" : "bg-[color:var(--color-card)/0.1] text-pink-100 hover:bg-[color:var(--color-card)/0.2] border-pink-500"
        } disabled:opacity-60`}
      >
        {liked ? "Quitar like" : "Dar like"}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
