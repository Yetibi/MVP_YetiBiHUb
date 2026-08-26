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

const TOTAL = 4;

export function NavigationButtons({
  step,
  canProceed,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: NavigationButtonsProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-(--background)/95 backdrop-blur-sm border-t border-white/5">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        {/* Atrás */}
        <div className="w-24">
          {step > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--primary) rounded px-2 py-1"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Siguiente / Enviar */}
        <div className="w-44 flex justify-end">
          {step < TOTAL && (
            <Button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              className="bg-(--primary) text-(--background) hover:bg-(--primary-hover) disabled:opacity-40 disabled:cursor-not-allowed font-semibold tracking-wide transition-colors"
            >
              Siguiente →
            </Button>
          )}

          {step === TOTAL && (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="rounded-md border border-[rgba(242,143,107,.55)] bg-[rgba(242,143,107,.08)] text-[#F28F6B] hover:bg-[#F28F6B] hover:text-[#0B1420] disabled:opacity-60 disabled:cursor-not-allowed text-[12px] tracking-[.1em] transition-colors min-w-[200px]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {isSubmitting ? "ENVIANDO…" : "RECIBIR MI DIAGNÓSTICO →"}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
