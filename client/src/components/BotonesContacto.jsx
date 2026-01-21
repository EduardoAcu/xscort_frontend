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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-green-500 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-green-600 transition w-full sm:w-auto"
        >
          WhatsApp
        </a>
      )}
      
      {telegramUrl && (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[color:var(--color-primary)] px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-[color:var(--color-primary)/0.9] transition w-full sm:w-auto"
        >
          Telegram
        </a>
      )}
    </div>
  );
}
