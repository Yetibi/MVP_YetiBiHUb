"use client";

import { Dropzone } from "@/components/intake/Dropzone";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Step3Props {
  data: IntakeFormData;
  update: UpdateFn;
  showErrors: boolean;
}

export function Step3Evidence({ data, update, showErrors }: Step3Props) {
  return (
    <section aria-labelledby="step3-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase mb-3">
        Capa 2 — Evidencia
      </p>
      <h2
        id="step3-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        Trae evidencia de cómo funciona hoy
      </h2>
      <p className="text-sm text-white/50 mb-3 max-w-md leading-relaxed">
        No tienes que tener un documento formal. Una captura de pantalla, un
        reporte de Excel, una foto de un tablero o de un proceso físico — todo
        sirve. Lo que necesitamos es ver el estado real.
      </p>
      <p className="text-xs text-white/30 mb-8">
        Mínimo 1 archivo · PDF, XLSX, CSV, DOCX, JPG, PNG
      </p>

      <Dropzone
        files={data.files}
        onChange={(files) => update("files", files)}
      />

      {/* Error cuando intentan avanzar sin archivos */}
      <AnimatePresence>
        {showErrors && data.files.length === 0 && (
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-xs text-red-400 mt-4 flex items-center gap-1.5"
            role="alert"
          >
            <span aria-hidden>⚠</span>
            Sube al menos un archivo para continuar.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
