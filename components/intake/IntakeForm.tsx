"use client";

import { useIntakeForm } from "@/hooks/use-intake-form";
import { ProgressBar } from "@/components/intake/ProgressBar";
import { NavigationButtons } from "@/components/intake/NavigationButtons";
import { ConfirmationScreen } from "@/components/intake/ConfirmationScreen";
import { Bloque1Contacto } from "@/components/intake/bloques/Bloque1Contacto";
import { Bloque2AsIs } from "@/components/intake/bloques/Bloque2AsIs";
import { Bloque3Comportamiento } from "@/components/intake/bloques/Bloque3Comportamiento";
import { Bloque4ToBe } from "@/components/intake/bloques/Bloque4ToBe";
import { motion, AnimatePresence, stepVariants, fadeIn } from "@/lib/motion";

// Recorrido en 4 bloques: quién eres → cómo es hoy → cómo se comporta → a dónde quieres llegar.
export function IntakeForm() {
  const { step, direction, data, update, next, back, submit, submitted, canProceed, showErrors, isSubmitting, submitError } = useIntakeForm();

  if (submitted) return <ConfirmationScreen email={data.email} />;

  function renderStep() {
    const p = { data, update, showErrors };
    switch (step) {
      case 1: return <Bloque1Contacto {...p} />;
      case 2: return <Bloque2AsIs {...p} />;
      case 3: return <Bloque3Comportamiento {...p} />;
      case 4: return <Bloque4ToBe {...p} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-(--background)">
      <ProgressBar step={step} />
      <main id="main-content" className="max-w-2xl mx-auto px-6 pt-28 pb-36" aria-live="polite" aria-atomic="false">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={stepVariants} initial="initial" animate="animate" exit="exit">
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {submitError && (
          <motion.div variants={fadeIn} initial="initial" animate="animate" exit="exit"
            className="fixed bottom-20 left-0 right-0 z-50 px-4" role="alert" aria-live="assertive">
            <div className="max-w-2xl mx-auto bg-red-950/95 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-400 text-lg shrink-0 mt-0.5" aria-hidden>⚠</span>
              <div>
                <p className="text-sm font-semibold text-red-300 mb-0.5">No se pudo enviar</p>
                <p className="text-xs text-red-400/80 leading-relaxed">{submitError}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <NavigationButtons step={step} canProceed={canProceed()} isSubmitting={isSubmitting} onBack={back} onNext={next} onSubmit={submit} />
    </div>
  );
}
