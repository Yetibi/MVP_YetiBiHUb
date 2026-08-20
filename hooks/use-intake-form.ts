"use client";

import { useState } from "react";
import type { IntakeFormData, FormStep, StepDirection } from "@/types/intake";
import { CAMPO_PROCESO } from "@/lib/copy";
import { submitIntake } from "@/lib/submit-intake";

const initialData: IntakeFormData = {
  proceso: "",
  ejecucion: "",
  senal: null,
  dato: null,
  frecuencia: null,
  antiguedad: null,
  falla: null,
  expectativaIa: "",
  email: "",
  sector: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 8;

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
        return data.proceso.trim().length >= CAMPO_PROCESO.min;
      case 2:
        return data.ejecucion.trim().length > 0;
      case 3:
        return data.senal !== null;
      case 4:
        return data.dato !== null;
      case 5:
        return data.frecuencia !== null && data.antiguedad !== null;
      case 6:
        return data.falla !== null;
      case 7:
        return data.expectativaIa.trim().length > 0;
      case 8:
        return EMAIL_RE.test(data.email);
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
    setStep((prev) => (prev < TOTAL_STEPS ? ((prev + 1) as FormStep) : prev));
  }

  function back() {
    setShowErrors(false);
    setDirection("backward");
    setStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev));
  }

  async function submit() {
    if (!canProceed()) {
      setShowErrors(true);
      return;
    }
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
