"use client";

import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";
import { SECTORS } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface StepEmailProps {
  data: IntakeFormData;
  update: UpdateFn;
  showErrors: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StepEmail({ data, update, showErrors }: StepEmailProps) {
  const emailInvalid = !EMAIL_RE.test(data.email);

  return (
    <section aria-labelledby="step8-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase mb-3">
        Último paso
      </p>
      <h2
        id="step8-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        ¿A qué correo enviamos tu veredicto?
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        El resultado no se muestra en pantalla: un ingeniero revisa el
        veredicto de tu proceso y te lo envía por correo.
      </p>

      <div className="space-y-8">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Correo electrónico *
          </label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tu@empresa.com"
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-(--primary)"
            aria-required="true"
            aria-invalid={showErrors && emailInvalid}
          />
          <AnimatePresence>
            {showErrors && emailInvalid && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Escribe un correo válido para recibir el veredicto.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label
            htmlFor="sector"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Sector{" "}
            <span className="text-white/30 font-normal">(opcional)</span>
          </label>
          <select
            id="sector"
            value={data.sector}
            onChange={(e) => update("sector", e.target.value)}
            className="w-full h-10 rounded-md border border-white/15 bg-transparent px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) [&>option]:bg-(--background)"
          >
            <option value="">Selecciona tu sector…</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
