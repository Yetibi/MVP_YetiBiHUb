"use client";

interface ProgressBarProps {
  step: number;
}

const TOTAL = 4;

export function ProgressBar({ step }: ProgressBarProps) {
  const pct = (step / TOTAL) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#243447]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.2em] text-(--primary) uppercase">
          Yeti BI
        </span>

        <span className="text-xs text-white/50 tabular-nums">
          <span className="text-white/80 font-semibold">Bloque {step}</span> de{" "}
          {TOTAL} · Evaluación de proceso
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-[2px] bg-white/5">
        <div
          className="h-full bg-(--primary) transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-label={`Bloque ${step} de ${TOTAL}`}
        />
      </div>
    </header>
  );
}
