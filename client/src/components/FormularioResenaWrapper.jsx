"use client";
import { useRouter } from "next/navigation";
import FormularioResena from "./FormularioResena";

/**
 * Wrapper client para FormularioResena que maneja la recarga de la página
 * después de enviar una reseña.
 */
export default function FormularioResenaWrapper({ perfilId }) {
  const router = useRouter();

  const handleReviewSubmitted = () => {
    // Recargar la página para mostrar la nueva reseña
    // Next.js revalidará los datos del servidor
    router.refresh();
  };

  return (
    <FormularioResena
      perfilId={perfilId}
      onReviewSubmitted={handleReviewSubmitted}
    />
  );
}
