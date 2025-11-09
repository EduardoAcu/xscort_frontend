"use client";

export default function BotonesContacto({ perfil }) {
  const whatsappUrl = perfil?.whatsapp
    ? `https://wa.me/${perfil.whatsapp.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(perfil.nombre_publico)}`
    : null;

  const telegramUrl = perfil?.telegram
    ? `https://t.me/${perfil.telegram.replace("@", "")}`
    : null;

  if (!whatsappUrl && !telegramUrl) {
    return null;
  }

  return (
    <div className="flex gap-4">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-white font-semibold hover:bg-green-600 transition"
        >
          <span>💬</span> WhatsApp
        </a>
      )}
      
      {telegramUrl && (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white font-semibold hover:bg-blue-600 transition"
        >
          <span>✈️</span> Telegram
        </a>
      )}
    </div>
  );
}
