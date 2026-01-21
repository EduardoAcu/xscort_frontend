// ============================================================
// COMPONENTE SIDEBAR RESPONSIVE
// ============================================================
// Usar esto en paneles de usuario, galería, etc.

export default function ResponsiveSidebar({ children, sidebar }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 md:p-8">
      {/* Sidebar - Colapsable en móvil */}
      <aside className="w-full lg:w-56 xl:w-64 flex-shrink-0 order-2 lg:order-1">
        <div className="sticky top-20 space-y-3">
          {sidebar}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 min-w-0 order-1 lg:order-2">
        {children}
      </main>
    </div>
  );
}

// ============================================================
// COMPONENTE GRID ADAPTABLE
// ============================================================
// Para galería de fotos, perfiles, resultados de búsqueda

export function ResponsiveGrid({ items, renderItem, columns = "lg:grid-cols-3" }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 ${columns} gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
      {items.map((item, index) => (
        <div key={index} className="min-w-0">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// Uso:
// <ResponsiveGrid
//   items={perfiles}
//   renderItem={(perfil) => <PerfilCard perfil={perfil} />}
//   columns="lg:grid-cols-4"
// />

// ============================================================
// COMPONENTE TARJETA RESPONSIVE
// ============================================================

export function ResponsiveCard({ image, title, subtitle, badges, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#1a0f1a] shadow-xl hover:-translate-y-1 transition cursor-pointer"
    >
      {/* Imagen */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden bg-gray-900">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Contenido */}
      <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 line-clamp-1">
          {subtitle}
        </p>
        {badges && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 text-pink-400 text-xs sm:text-xs px-2 py-1"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE FORMULARIO RESPONSIVE
// ============================================================

export function ResponsiveForm({ fields, onSubmit, submitText = "Enviar" }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Campos en dos columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.fullWidth ? "md:col-span-2" : ""}
          >
            <label className="block text-sm sm:text-base font-semibold mb-2">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none h-32 sm:h-40 md:h-48"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold bg-pink-500 hover:bg-pink-600 rounded-lg transition text-white"
      >
        {submitText}
      </button>
    </form>
  );
}

// ============================================================
// COMPONENTE NAVEGACIÓN RESPONSIVE CON MÓVIL
// ============================================================

import { useState } from "react";

export function ResponsiveNav({ logo, links, ctaButtons }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 z-50 border-b border-gray-800">
      <div className="flex justify-between items-center h-16 sm:h-20">
        {/* Logo */}
        <div className="flex-shrink-0 w-20 sm:w-24">
          {logo}
        </div>

        {/* Menú Hamburguesa (Móvil) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
        >
          <span className="text-2xl">☰</span>
        </button>

        {/* Menú Desktop */}
        <div className="hidden md:flex gap-4 lg:gap-8 items-center text-sm lg:text-base ml-auto">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-pink-500 transition text-gray-300 font-semibold"
            >
              {link.label}
            </a>
          ))}
          <div className="h-6 w-px bg-gray-700 mx-2 lg:mx-4"></div>
          <div className="flex gap-2">
            {ctaButtons}
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800 py-4 space-y-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-2 hover:bg-white/5 rounded-lg transition text-sm"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-800">
            {ctaButtons}
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// COMPONENTE HERO RESPONSIVE
// ============================================================

export function ResponsiveHero({ 
  title, 
  subtitle, 
  backgroundImage, 
  cta,
  align = "center" 
}) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  }[align];

  return (
    <div
      className="relative pt-20 px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-20 md:py-24 lg:py-32 min-h-screen flex flex-col justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 sm:bg-black/50"></div>

      <div className={`max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 relative z-10 flex flex-col ${alignClass}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl">
          {title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          {cta}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE MODAL RESPONSIVE
// ============================================================

export function ResponsiveModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-[#1a0f1a] rounded-lg sm:rounded-2xl max-w-md sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-4 sm:p-6 border-b border-white/10 bg-[#1a0f1a]">
          <h2 className="text-lg sm:text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-pink-500 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
