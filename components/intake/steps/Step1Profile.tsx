"use client";

import type { IntakeFormData, ProfileType, UpdateFn } from "@/types/intake";
import { PROFILE_LABELS } from "@/lib/copy";

interface Step1Props {
  data: IntakeFormData;
  update: UpdateFn;
}

const PROFILES: { value: ProfileType; label: string; sub: string }[] = [
  {
    value: "business",
    label: PROFILE_LABELS.business,
    sub: "Quiero evaluar cómo está mi empresa o negocio.",
  },
  {
    value: "leader",
    label: PROFILE_LABELS.leader,
    sub: "Quiero analizar un proceso o área específica.",
  },
  {
    value: "entrepreneur",
    label: PROFILE_LABELS.entrepreneur,
    sub: "Quiero evaluar una idea o proyecto propio.",
  },
];

export function Step1Profile({ data, update }: Step1Props) {
  return (
    <section aria-labelledby="step1-title">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#E07B30] uppercase mb-3">
        Perfil
      </p>
      <h2
        id="step1-title"
        className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2"
      >
        ¿Desde qué perspectiva vas a hacer el diagnóstico?
      </h2>
      <p className="text-sm text-white/50 mb-10 max-w-md leading-relaxed">
        Esto no cambia el proceso ni filtra el acceso — solo adapta el
        lenguaje para que las preguntas tengan más sentido para ti.
      </p>

      <fieldset>
        <legend className="sr-only">Selecciona tu perfil</legend>
        <div className="space-y-3" role="radiogroup">
          {PROFILES.map(({ value, label, sub }) => {
            const selected = data.profile === value;
            return (
              <label
                key={value}
                className={`
                  flex items-start gap-4 p-5 rounded-xl border cursor-pointer
                  transition-all duration-200 group
                  focus-within:ring-2 focus-within:ring-[#E07B30]
                  ${selected
                    ? "border-[#E07B30] bg-[#E07B30]/10"
                    : "border-white/10 bg-white/3 hover:border-white/25"
                  }
                `}
              >
                <input
                  type="radio"
                  name="profile"
                  value={value}
                  checked={selected}
                  onChange={() => update("profile", value)}
                  className="sr-only"
                  aria-describedby={`profile-sub-${value}`}
                />

                {/* Indicador de selección */}
                <div
                  className={`
                    mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 transition-colors
                    flex items-center justify-center
                    ${selected
                      ? "border-[#E07B30] bg-[#E07B30]"
                      : "border-white/30"
                    }
                  `}
                  aria-hidden
                >
                  {selected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                {/* Texto */}
                <div>
                  <p
                    className={`text-base font-semibold transition-colors ${
                      selected ? "text-white" : "text-white/70"
                    }`}
                  >
                    {label}
                  </p>
                  <p
                    id={`profile-sub-${value}`}
                    className={`text-sm mt-0.5 transition-colors ${
                      selected ? "text-white/60" : "text-white/35"
                    }`}
                  >
                    {sub}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
