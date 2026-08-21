"use client";

import { motion } from "@/lib/motion";

interface ConfirmationScreenProps {
  email: string;
}

export function ConfirmationScreen({ email }: ConfirmationScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Ícono */}
      <div className="w-16 h-16 rounded-full bg-(--primary)/15 border border-(--primary)/30 flex items-center justify-center text-2xl mb-8">
        ✓
      </div>

      {/* Título */}
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-(--primary) mb-4">
        Tu veredicto está en camino.
      </h1>

      {/* Subtítulo — el HITL como argumento de valor */}
      <p className="text-base text-white/100 max-w-sm leading-relaxed mb-10">
        Tu veredicto está en camino a{" "}
        <span className="text-(--warning)">{email}</span>. Lo revisa un
        ingeniero antes de salir.
      </p>

      {/* Separador */}
      <div className="w-8 h-px bg-(--primary)/40 mb-8" />

      {/* Próximos pasos */}
      <div className="text-left max-w-sm w-full space-y-4">
        <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">
          Qué sigue
        </p>

        {[
          { n: "01", text: "El motor evalúa tu proceso con reglas de ingeniería, no con opinión." },
          { n: "02", text: "Un ingeniero de Yeti BI revisa y aprueba el veredicto." },
          { n: "03", text: "Recibes el correo con el veredicto de aptitud de tu proceso." },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-start gap-4">
            <span className="text-xs font-black text-(--primary)/60 tabular-nums mt-0.5">
              {n}
            </span>
            <p className="text-sm text-white/50">{text}</p>
          </div>
        ))}
      </div>

      {/* Botón para volver al Home */}
      <a
        href="/"
        className="mt-12 inline-block bg-(--primary) text-(--primary-foreground) font-semibold text-sm px-6 py-3 rounded-lg hover:bg-(--primary-hover) transition-colors"
      >
        Volver al Home
      </a>
    </motion.div>
  );
}
