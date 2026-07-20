"use client";

import { motion } from "@/lib/motion";

export function ConfirmationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Ícono */}
      <div className="w-16 h-16 rounded-full bg-[#E07B30]/15 border border-[#E07B30]/30 flex items-center justify-center text-2xl mb-8">
        ✓
      </div>

      {/* Título */}
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[#FF6600] mb-4">
        Información recibida.
      </h1>

      {/* Subtítulo */}
      <p className="text-base text-white/100 max-w-sm leading-relaxed mb-10">
        Tu información quedó guardada. El diagnóstico{" "}
        <span className="text-[#FFA07A]">aún no se ha procesado</span> —
        eso ocurre en la siguiente etapa, donde el motor de análisis evalúa
        tus respuestas y genera el reporte de AI Readiness.
      </p>

      {/* Separador */}
      <div className="w-8 h-px bg-[#E07B30]/40 mb-8" />

      {/* Próximos pasos */}
      <div className="text-left max-w-sm w-full space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">
          Qué sigue
        </p>

        {[
          { n: "01", text: "Revisamos que tu información esté completa." },
          {
            n: "02",
            text: "El motor analiza tus 5 capas y genera el diagnóstico.",
          },
          {
            n: "03",
            text: "Recibirás el reporte con el score y las recomendaciones.",
          },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-start gap-4">
            <span className="text-xs font-black text-[#E07B30]/60 tabular-nums mt-0.5">
              {n}
            </span>
            <p className="text-sm text-white/50">{text}</p>
          </div>
        ))}
      </div>

      {/* Nota de datos en memoria */}
      <p className="text-xs text-white/20 mt-12 max-w-xs"></p>

      {/* Botón para volver al Home */}
      <a
        href="https://yetibi.com/"
        className="mt-8 inline-block bg-[#FF6600] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#E05500] transition-colors"
      >
        Volver al Home
      </a>
    </motion.div>
  );
}