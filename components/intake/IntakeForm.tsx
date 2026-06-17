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
import { motion, AnimatePresence, stepVariants } from "@/lib/motion";

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

      <NavigationButtons
        step={step}
        canProceed={canProceed()}
        onBack={back}
        onNext={next}
        onSubmit={submit}
      />
    </div>
  );
}
