"use client";

import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  step: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function NavigationButtons({
  step,
  canProceed,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#2E2640]/95 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        {/* Atrás */}
        <div className="w-24">
          {step > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B30] rounded px-2 py-1"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Centro: saltar (solo paso 5) */}
        <div className="flex-1 flex justify-center">
          {step === 5 && (
            <button
              type="button"
              onClick={onNext}
              className="text-xs text-white/40 hover:text-white/60 underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07B30] rounded px-2 py-1"
            >
              Saltar este paso
            </button>
          )}
        </div>

        {/* Siguiente / Enviar */}
        <div className="w-40 flex justify-end">
          {step < 6 && (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              className="bg-[#E07B30] text-white hover:bg-[#C96B22] disabled:opacity-40 disabled:cursor-not-allowed font-semibold tracking-wide transition-colors"
            >
              {step === 5 ? "Continuar →" : "Siguiente →"}
            </Button>
          )}

          {step === 6 && (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-[#E07B30] text-white hover:bg-[#C96B22] disabled:opacity-60 disabled:cursor-not-allowed font-semibold tracking-wide transition-colors min-w-[160px]"
            >
              {isSubmitting ? "Enviando…" : "Enviar diagnóstico"}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
