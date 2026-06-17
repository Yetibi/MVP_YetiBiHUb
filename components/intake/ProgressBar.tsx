"use client";

interface ProgressBarProps {
  step: number;
}

export function ProgressBar({ step }: ProgressBarProps) {
  // Las capas van del paso 2 al 6 (5 capas en total)
  const capaActual = Math.max(0, step - 1);
  const pct = (capaActual / 5) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#241E38]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.2em] text-[#E07B30] uppercase">
          Yeti BI
        </span>

        {step > 1 && (
          <span className="text-xs text-white/50 tabular-nums">
            <span className="text-white/80 font-semibold">{capaActual}</span>{" "}
            de 5 capas evaluadas
          </span>
        )}

        {step === 1 && (
          <span className="text-xs text-white/40">
            Diagnóstico AI Readiness
          </span>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="h-[2px] bg-white/5">
        <div
          className="h-full bg-[#E07B30] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={capaActual}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`${capaActual} de 5 capas evaluadas`}
        />
      </div>
    </header>
  );
}
