"use client";
import { Toaster } from "sonner";

export default function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      expand
      toastOptions={{ duration: 3000 }}
    />
  );
}
