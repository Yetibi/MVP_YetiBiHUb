"use client";

import { useIntakeForm } from "@/hooks/use-intake-form";
import { ProgressBar } from "@/components/intake/ProgressBar";
import { NavigationButtons } from "@/components/intake/NavigationButtons";
import { ConfirmationScreen } from "@/components/intake/ConfirmationScreen";
import { Step1Profile } from "@/components/intake/steps/Step1Profile";
import { Step2Essential } from "@/components/intake/steps/Step2Essential";
import { Step3Evidence } from "@/components/intake/steps/Step3Evidence";
import { Step4AsisToBe } from "@/components/intake/steps/Step4AsisToBe";
import { Step5Optional } from "@/components/intake/steps/Step5Optional";
import { Step6Review } from "@/components/intake/steps/Step6Review";
import { motion, AnimatePresence, stepVariants, fadeIn } from "@/lib/motion";

export function IntakeForm() {
  const {
    step,
    direction,
    data,
    update,
    next,
    back,
    submit,
    submitted,
    canProceed,
    showErrors,
    isSubmitting,
    submitError,
  } = useIntakeForm();

  if (submitted) {
    return <ConfirmationScreen />;
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <Step1Profile data={data} update={update} />;
      case 2:
        return (
          <Step2Essential data={data} update={update} showErrors={showErrors} />
        );
      case 3:
        return (
          <Step3Evidence data={data} update={update} showErrors={showErrors} />
        );
      case 4:
        return (
          <Step4AsisToBe data={data} update={update} showErrors={showErrors} />
        );
      case 5:
        return <Step5Optional data={data} update={update} />;
      case 6:
        return <Step6Review data={data} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#2E2640]">
      <ProgressBar step={step} />

      <main
        id="main-content"
        className="max-w-2xl mx-auto px-6 pt-28 pb-36"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Banner de error de envío — visible sobre el footer */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-20 left-0 right-0 z-50 px-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="max-w-2xl mx-auto bg-red-950/95 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
              <span className="text-red-400 text-lg shrink-0 mt-0.5" aria-hidden>
                ⚠
              </span>
              <div>
                <p className="text-sm font-semibold text-red-300 mb-0.5">
                  No se pudo enviar
                </p>
                <p className="text-xs text-red-400/80 leading-relaxed">
                  {submitError}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons
        step={step}
        canProceed={canProceed()}
        isSubmitting={isSubmitting}
        onBack={back}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  );
}
