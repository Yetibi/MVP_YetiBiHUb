"use client";

import { useState } from "react";
import type { IntakeFormData, FormStep, StepDirection } from "@/types/intake";
import { submitIntake } from "@/lib/submit-intake";

const initialData: IntakeFormData = {
  profile: null,
  sector: "",
  scope: "",
  email: "",
  painType: [],
  painDetail: "",
  files: [],
  toBe: "",
  maturityTarget: null,
  technology: [],
  metric: "",
  capacityQ1: "",
  capacityQ2: "",
  capacityQ3: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useIntakeForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [data, setData] = useState<IntakeFormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K]
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return data.profile !== null;
      case 2:
        return (
          !!data.sector &&
          !!data.scope.trim() &&
          EMAIL_RE.test(data.email) &&
          data.painType.length > 0
        );
      case 3:
        return data.files.length >= 1;
      case 4:
        return !!data.toBe.trim();
      case 5:
        return true; // 100% opcional
      case 6:
        return true;
      default:
        return false;
    }
  }

  function next() {
    if (!canProceed()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setDirection("forward");
    setStep((prev) => (prev < 6 ? ((prev + 1) as FormStep) : prev));
  }

  function back() {
    setShowErrors(false);
    setDirection("backward");
    setStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev));
  }

  async function submit() {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitIntake(data);

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  return {
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
  };
}
