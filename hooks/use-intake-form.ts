"use client";

import { useState } from "react";
import type { IntakeFormData, FormStep, StepDirection } from "@/types/intake";
import {
  CAMPO_AS_IS,
  CAMPO_EJECUCION,
  CAMPO_NOMBRE,
  CAMPO_PROCESO,
  CAMPO_TO_BE,
} from "@/lib/copy";
import { submitIntake } from "@/lib/submit-intake";

const initialData: IntakeFormData = {
  nombre: "",
  email: "",
  sector: "",
  proceso: "",
  asIs: "",
  ejecucion: "",
  senal: null,
  senalDetalle: "",
  dato: null,
  datoDetalle: "",
  frecuencia: null,
  antiguedad: null,
  intentoPrevio: "",
  falla: null,
  toBe: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 4;

export function useIntakeForm() {
  const [step, setStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [data, setData] = useState<IntakeFormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  // Validación por bloque — replicada en app/actions/submit-intake.ts
  function canProceed(): boolean {
    switch (step) {
      case 1:
        return data.nombre.trim().length >= CAMPO_NOMBRE.min && EMAIL_RE.test(data.email);
      case 2:
        return (
          data.proceso.trim().length >= CAMPO_PROCESO.min &&
          data.asIs.trim().length >= CAMPO_AS_IS.min &&
          data.ejecucion.trim().length >= CAMPO_EJECUCION.min
        );
      case 3:
        return (
          data.senal !== null &&
          data.dato !== null &&
          data.frecuencia !== null &&
          data.antiguedad !== null &&
          data.falla !== null
        );
      case 4:
        return data.toBe.trim().length >= CAMPO_TO_BE.min;
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

  return { step, direction, data, update, next, back, submit, submitted, canProceed, showErrors, isSubmitting, submitError };
}
