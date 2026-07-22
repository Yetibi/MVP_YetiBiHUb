"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence, fadeIn } from "@/lib/motion";
import { SECTORS, PAIN_OPTIONS, PROFILE_COPY } from "@/lib/copy";
import type { IntakeFormData, UpdateFn } from "@/types/intake";

interface Step2Props {
  data: IntakeFormData;
  update: UpdateFn;
  showErrors: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Step2Essential({ data, update, showErrors }: Step2Props) {
  const copy = data.profile ? PROFILE_COPY[data.profile] : PROFILE_COPY.business;

  return (
    <section aria-labelledby="step2-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase mb-3">
        Capa 1 — Lo esencial
      </p>
      <h2
        id="step2-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        {copy.step2Title}
      </h2>
      <p className="text-sm text-white/50 mb-10">
        Solo los campos marcados con * son obligatorios en este paso.
      </p>

      <div className="space-y-6">
        {/* Sector */}
        <div>
          <label
            htmlFor="sector"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            Sector *
          </label>
          <Select
            value={data.sector}
            onValueChange={(v) => update("sector", v ?? "")}
          >
            <SelectTrigger
              id="sector"
              className="w-full border-white/15 text-white bg-transparent focus:ring-[#E07B30]"
              aria-required="true"
            >
              <SelectValue placeholder="Selecciona el sector" />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatePresence>
            {showErrors && !data.sector && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Selecciona un sector para continuar.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Alcance */}
        <div>
          <label
            htmlFor="scope"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            {copy.scopeLabel} *
          </label>
          <Input
            id="scope"
            value={data.scope}
            onChange={(e) => update("scope", e.target.value)}
            placeholder={copy.scopePlaceholder}
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30]"
            aria-required="true"
          />
          <AnimatePresence>
            {showErrors && !data.scope.trim() && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Describe el alcance del diagnóstico.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
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
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="tucorreo@empresa.com"
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30]"
            aria-required="true"
          />
          <AnimatePresence>
            {showErrors && !EMAIL_RE.test(data.email) && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Ingresa un correo válido.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Dolor principal */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            {copy.painLabel} *
          </label>
          <p className="text-xs text-white/40 mb-2.5">
            Puedes seleccionar más de una opción.
          </p>
          <div
            role="group"
            aria-required="true"
            className="space-y-2.5"
          >
            {PAIN_OPTIONS.map((o) => {
              const checked = data.painType.includes(o.value);
              return (
                <label
                  key={o.value}
                  htmlFor={`painType-${o.value}`}
                  className="flex items-start gap-2.5 cursor-pointer"
                >
                  <Checkbox
                    id={`painType-${o.value}`}
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      update(
                        "painType",
                        isChecked
                          ? [...data.painType, o.value]
                          : data.painType.filter((v) => v !== o.value)
                      );
                    }}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-white/80">{o.label}</span>
                </label>
              );
            })}
          </div>
          <AnimatePresence>
            {showErrors && data.painType.length === 0 && (
              <motion.p
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-xs text-red-400 mt-1.5"
                role="alert"
              >
                Selecciona al menos un dolor principal para continuar.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Detalle del dolor (opcional) */}
        <div>
          <label
            htmlFor="painDetail"
            className="block text-sm font-medium text-white/80 mb-1.5"
          >
            ¿Puedes contarnos un poco más?{" "}
            <span className="text-white/30 font-normal">(opcional)</span>
          </label>
          <Textarea
            id="painDetail"
            value={data.painDetail}
            onChange={(e) => update("painDetail", e.target.value)}
            placeholder="Un ejemplo concreto, un número, una situación que se repite…"
            rows={3}
            className="border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#E07B30] resize-none"
          />
        </div>
      </div>
    </section>
  );
}
