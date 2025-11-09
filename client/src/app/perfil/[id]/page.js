"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axiosConfig";
import CabeceraPerfil from "@/components/CabeceraPerfil";
import BotonesContacto from "@/components/BotonesContacto";
import Tabs from "@/components/Tabs";
import FormularioResena from "@/components/FormularioResena";

export default function PerfilPage() {
  const params = useParams();
  const id = params.id;

  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfilData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile
        const perfilRes = await axios.get(`/api/profiles/${id}/`);
        setPerfil(perfilRes.data);

        // Fetch services
        try {
          const serviciosRes = await axios.get(`/api/profiles/${id}/servicios/`);
          setServicios(serviciosRes.data || []);
        } catch (err) {
          console.log("No services endpoint available");
        }

        // Fetch gallery
        try {
          const galeriaRes = await axios.get(`/api/profiles/${id}/galeria/`);
          setGaleria(galeriaRes.data || []);
        } catch (err) {
          console.log("No gallery endpoint available");
        }

        // Fetch reviews
        try {
          const resenasRes = await axios.get(`/api/reviews/?perfil=${id}`);
          setResenas(resenasRes.data || []);
        } catch (err) {
          console.log("No reviews endpoint available");
        }
      } catch (err) {
        setError("No se pudo cargar el perfil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPerfilData();
    }
  }, [id]);

  const handleReviewSubmitted = async () => {
    try {
      const resenasRes = await axios.get(`/api/reviews/?perfil=${id}`);
      setResenas(resenasRes.data || []);
    } catch (err) {
      console.error("Error refreshing reviews", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12 sm:px-12 lg:px-24">
        <div className="text-center">Cargando perfil...</div>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-12 sm:px-12 lg:px-24">
        <div className="text-center text-red-600">{error || "Perfil no encontrado"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con foto y info */}
      <div className="bg-white px-6 py-12 sm:px-12 lg:px-24 shadow-sm">
        <CabeceraPerfil perfil={perfil} />
        
        {/* Contact buttons */}
        <div className="mt-6">
          <BotonesContacto perfil={perfil} />
        </div>
      </div>

      {/* Tabs content */}
      <div className="px-6 py-12 sm:px-12 lg:px-24">
        <Tabs
          perfil={perfil}
          servicios={servicios}
          galeria={galeria}
          resenas={resenas}
        />
      </div>

      {/* Review form */}
      <div className="px-6 py-12 sm:px-12 lg:px-24 bg-white">
        <FormularioResena
          perfilId={id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
    </div>
  );
}
