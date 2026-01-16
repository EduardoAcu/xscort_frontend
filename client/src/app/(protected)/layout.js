"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import ModelSidebar from "@/components/ModelSidebar";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute requireModel>
      <div className="min-h-screen flex bg-[#140411] text-white">
        <ModelSidebar />
        <main className="flex-1 px-6 py-8 sm:px-10 lg:px-16">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
