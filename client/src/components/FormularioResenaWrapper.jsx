"use client";
import { useRouter } from "next/navigation";
import FormularioResena from "./FormularioResena";

export default function FormularioResenaWrapper({ perfilId }) {
  const router = useRouter();

  const handleReviewSubmitted = () => {
    // Refresca la data del servidor (Server Components) sin recargar la página completa
    router.refresh();
  };

  return (
    <FormularioResena
      perfilId={perfilId}
      onReviewSubmitted={handleReviewSubmitted}
    />
  );
}