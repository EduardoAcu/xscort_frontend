"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import ClientSidebar from "@/components/ClientSidebar";

export default function ClientPanelLayout({ children }) {
  return (
    <ProtectedRoute requireClient>
      <div className="min-h-screen flex bg-[#120912] text-white">
        <ClientSidebar />
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
