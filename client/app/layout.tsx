import type { Metadata } from "next";
// 1. IMPORTA Plus_Jakarta_Sans y QUITA Geist
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css"; // Esto carga tu CSS de Tailwind v4

// 2. CONFIGURA la nueva fuente con sus pesos y variable CSS
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans", // La variable que usa tu CSS
  subsets: ["latin"],
  weight: ['400', '500', '700', '800'], // Los pesos de tu boceto
});

// Mantenemos Geist Mono para la variable --font-mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 3. ACTUALIZA tus metadata
export const metadata: Metadata = {
  title: "xscort.cl - Modelos Verificadas en Chile",
  description: "Explora perfiles y contacta directamente por WhatsApp o Telegram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. APLICA las variables de fuente, el idioma 'es' y el modo 'dark'
    <html lang="es" className={`${plusJakarta.variable} ${geistMono.variable} dark`}>
      {/* El <body> ya no necesita clases. 
        Tu archivo 'globals.css' (con @theme) se encarga 
        de aplicar el fondo y la fuente al body.
      */}
      <body>
        {children}
      </body>
    </html>
  );
}
