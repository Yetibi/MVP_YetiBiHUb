"use client";

import { useIntakeForm } from "@/hooks/use-intake-form";
import { ProgressBar } from "@/components/intake/ProgressBar";
import { NavigationButtons } from "@/components/intake/NavigationButtons";
import { ConfirmationScreen } from "@/components/intake/ConfirmationScreen";
import { StepLibre } from "@/components/intake/steps/StepLibre";
import { StepOpcion } from "@/components/intake/steps/StepOpcion";
import { StepPeso } from "@/components/intake/steps/StepPeso";
import { StepEmail } from "@/components/intake/steps/StepEmail";
import {
  CAMPO_PROCESO,
  CAMPO_EJECUCION,
  CAMPO_EXPECTATIVA,
  SENAL_OPTIONS,
  DATO_OPTIONS,
  FALLA_OPTIONS,
} from "@/lib/copy";
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
    return <ConfirmationScreen email={data.email} />;
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <StepLibre
            id="proceso"
            kicker="Paso 1 · El proceso"
            titulo={CAMPO_PROCESO.label}
            ayuda={CAMPO_PROCESO.ayuda}
            value={data.proceso}
            onChange={(v) => update("proceso", v)}
            maxLength={CAMPO_PROCESO.max}
            minLength={CAMPO_PROCESO.min}
            placeholder="Ej: Agendamiento de citas — para que ninguna silla se quede vacía…"
            showErrors={showErrors}
            errorMsg={`Describe el proceso en al menos ${CAMPO_PROCESO.min} caracteres.`}
          />
        );
      case 2:
        return (
          <StepLibre
            id="ejecucion"
            kicker="Paso 2 · La ejecución"
            titulo={CAMPO_EJECUCION.label}
            ayuda={CAMPO_EJECUCION.ayuda}
            value={data.ejecucion}
            onChange={(v) => update("ejecucion", v)}
            maxLength={CAMPO_EJECUCION.max}
            placeholder="Ej: La recepcionista, con una agenda en Excel y confirmaciones por WhatsApp…"
            showErrors={showErrors}
            errorMsg="Cuéntanos quién lo ejecuta para continuar."
          />
        );
      case 3:
        return (
          <StepOpcion
            id="senal"
            kicker="Paso 3 · La señal"
            titulo="¿Cómo saben si el proceso salió bien o salió mal?"
            options={SENAL_OPTIONS}
            value={data.senal}
            onChange={(v) => update("senal", v)}
            showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar."
          />
        );
      case 4:
        return (
          <StepOpcion
            id="dato"
            kicker="Paso 4 · El dato"
            titulo="¿Dónde vive la información de este proceso?"
            options={DATO_OPTIONS}
            value={data.dato}
            onChange={(v) => update("dato", v)}
            showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar."
          />
        );
      case 5:
        return <StepPeso data={data} update={update} showErrors={showErrors} />;
      case 6:
        return (
          <StepOpcion
            id="falla"
            kicker="Paso 6 · La falla"
            titulo="Cuando algo sale mal en este proceso, ¿qué pasa casi siempre?"
            options={FALLA_OPTIONS}
            value={data.falla}
            onChange={(v) => update("falla", v)}
            showErrors={showErrors}
            errorMsg="Selecciona una opción para continuar."
          />
        );
      case 7:
        return (
          <StepLibre
            id="expectativaIa"
            kicker="Paso 7 · La expectativa"
            titulo={CAMPO_EXPECTATIVA.label}
            ayuda={CAMPO_EXPECTATIVA.ayuda}
            value={data.expectativaIa}
            onChange={(v) => update("expectativaIa", v)}
            maxLength={CAMPO_EXPECTATIVA.max}
            placeholder="Ej: Que me avise cuando una cita esté en riesgo de no llenarse…"
            showErrors={showErrors}
            errorMsg="Cuéntanos qué esperas de la IA para continuar."
          />
        );
      case 8:
        return <StepEmail data={data} update={update} showErrors={showErrors} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-(--background)">
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
