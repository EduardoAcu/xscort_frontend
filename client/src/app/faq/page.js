import Link from "next/link";
import NavBar from "@/components/NavBar";
import { HelpCircle, ChevronRight, MessageCircle } from "lucide-react";

// ============================================================
// 1. METADATA SEO
// ============================================================
export const metadata = {
  title: "Preguntas Frecuentes (FAQ) | xscort",
  description: "Resuelve todas tus dudas sobre cómo funciona xscort. Información para clientes sobre cómo contactar modelos y para acompañantes sobre cómo publicar un aviso.",
  alternates: {
    canonical: "https://xscort.cl/faq",
  },
};

// ============================================================
// 2. DATOS DE LAS PREGUNTAS
// ============================================================
const faqClientes = [
  {
    pregunta: "¿Cómo sé si las fotos de los perfiles son reales?",
    respuesta: "En xscort.cl la autenticidad es nuestra prioridad. Contamos con un sistema de verificación donde nuestro equipo revisa que las fotografías coincidan con la identidad de la modelo. Busca el sello de Perfil Verificado para tener la máxima seguridad en tu encuentro."
  },
  {
    pregunta: "⁠¿Cómo contacto a una modelo?",
    respuesta: "El contacto es 100% directo y sin intermediarios. Dentro del perfil de cada escort, encontrarás un botón de WhatsApp o un número telefónico. Solo debes hacer clic para iniciar una conversación privada con ella y coordinar los detalles."
  },
  {
    pregunta: "¿El sitio es discreto?",
    respuesta: "Absolutamente. xscort.cl es una plataforma de anuncios clasificados que respeta la privacidad de sus usuarios. No solicitamos registros obligatorios para navegar y no guardamos información personal de quienes visitan el directorio."
  },
  { pregunta: "⁠¿Qué ciudades cubre xscort.cl?",
    respuesta: "Actualmente tenemos presencia en las principales ciudades de Chile, incluyendo Santiago, Concepción, Los Ángeles, Castro y muchas más. Estamos en constante crecimiento para ofrecerte la mejor selección de acompañantes en todo el país."
  }
];

const faqModelos = [
  {
    pregunta: "¿Cómo puedo publicar mi anuncio?",
    respuesta: "Es muy sencillo. Solo debes hacer clic en Publicar Aviso, completar tus datos básicos, subir tus mejores fotos y redactar una descripción atractiva. Una vez enviado, nuestro equipo revisará el perfil para activarlo a la brevedad."
  },
  {
    pregunta: "⁠¿Tiene algún costo publicar en xscort?",
    respuesta: "Contamos con diferentes planes diseñados para ajustarse a tus necesidades, desde opciones básicas hasta posicionamiento VIP para aparecer en los primeros lugares de tu ciudad. No cobramos comisiones por tus citas, el 100% de lo que generes es para ti."
  },
  {
    pregunta: "⁠ ⁠¿Puedo cambiar mi ciudad si estoy de viaje?",
    respuesta: "¡Sí! Tu perfil es totalmente dinámico. Desde tu Panel de Socia, puedes actualizar tu ubicación en tiempo real. Esto es ideal para modelos que realizan giras o se mueven entre ciudades como Santiago, Viña del Mar o el sur de Chile."
  },
  {
    pregunta:"¿Cómo protegen mi privacidad?",
    respuesta:"Tú decides qué información mostrar. Recomendamos usar un nombre artístico y un número de contacto exclusivo para el trabajo. Además, nuestro sitio cuenta con protocolos de seguridad avanzados para proteger la integridad de la plataforma."
  }
];

// ============================================================
// 3. COMPONENTE ACORDEÓN (Sin JS, puro HTML5 + Tailwind)
// ============================================================
function AccordionItem({ pregunta, respuesta }) {
  return (
    <details className="group bg-[#120912] border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer hover:bg-white/[0.02] transition-colors">
        <h3 className="text-white font-bold font-fancy text-lg">{pregunta}</h3>
        <span className="transition duration-300 group-open:-rotate-90 text-pink-500">
          <ChevronRight className="w-5 h-5 transform rotate-90" />
        </span>
      </summary>
      <div className="p-6 pt-0 text-gray-400 font-light font-montserrat leading-relaxed border-t border-white/5 mt-2 bg-[#0a050a]/50">
        <p>{respuesta}</p>
      </div>
    </details>
  );
}

// ============================================================
// 4. PÁGINA PRINCIPAL
// ============================================================
export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#050205] text-white selection:bg-pink-500 selection:text-white pb-24">
      {/* Fondo estético */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/10 via-[#050205] to-[#050205] -z-10 pointer-events-none" />

      <div className="flex justify-between items-center h-16 sm:h-20">
        <NavBar />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-20">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-pink-500/10 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-fancy text-white mb-4">
            Preguntas <span className="text-pink-500">Frecuentes</span>
          </h1>
          <p className="text-gray-400 font-montserrat font-light text-lg">
            Todo lo que necesitas saber sobre cómo funciona xscort.
          </p>
        </div>

        {/* Sección Clientes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-fancy text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-pink-500"></span>
            Para Clientes
          </h2>
          <div className="space-y-4">
            {faqClientes.map((item, index) => (
              <AccordionItem key={index} pregunta={item.pregunta} respuesta={item.respuesta} />
            ))}
          </div>
        </section>

        {/* Sección Modelos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-fancy text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-purple-500"></span>
            Para Modelos
          </h2>
          <div className="space-y-4">
            {faqModelos.map((item, index) => (
              <AccordionItem key={index} pregunta={item.pregunta} respuesta={item.respuesta} />
            ))}
          </div>
        </section>

        {/* Caja de Contacto Directo */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#1a0b16] to-[#0a050a] border border-green-500/20 text-center">
          <h3 className="text-xl font-bold text-white mb-3">¿Aún tienes dudas?</h3>
          <p className="text-gray-400 font-light mb-6">
            Nuestro equipo de soporte está disponible en WhatsApp para ayudarte con cualquier consulta de forma rápida y discreta.
          </p>
          <a 
            // REEMPLAZA ESTE NÚMERO POR EL TUYO (Recuerda poner el código de país, ej: 569 para Chile)
            href="https://wa.me/56950195662" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-[#1EBE5D] transition-all hover:scale-105 shadow-lg shadow-green-900/30"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar Soporte
          </a>
        </div>

      </main>
    </div>
  );
}