"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { formContainer, fieldReveal, fadeIn } from "@/lib/motion";

// ─── types ───────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

interface Fields {
  nombre: string;
  correo: string;
  empresa: string;
  mensaje: string;
  website: string; // honeypot — must stay empty
}

interface FieldError {
  nombre?: string;
  correo?: string;
  empresa?: string;
  mensaje?: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): FieldError {
  const e: FieldError = {};
  if (!f.nombre.trim())                     e.nombre  = "El nombre es requerido.";
  if (!f.correo.trim())                     e.correo  = "El correo es requerido.";
  else if (!EMAIL_RE.test(f.correo.trim())) e.correo  = "Ingresa un correo válido.";
  if (!f.mensaje.trim())                    e.mensaje = "El mensaje es requerido.";
  return e;
}

// ─── shared input style — underline only ─────────────────────────────────────

const inputBase: React.CSSProperties = {
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 0,
  color: "#FFFFFF",
  fontSize: 15,
  padding: "12px 0",
  width: "100%",
  outline: "none",
  boxShadow: "none",
  transition: "border-bottom-color 0.15s, box-shadow 0.15s",
};

// Contraste mejorado: #A89DC0 (3.8:1) → #C3B9D6 (~5.8:1) sobre #0E0B14
const labelStyle: React.CSSProperties = {
  color: "#C3B9D6",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  id, label, error, children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" style={{ color: "#E07B30", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── ContactForm ─────────────────────────────────────────────────────────────
// Renders as a plain div — lives inside CtaFinal, not as an independent section.

export function ContactForm() {
  const rm = useReducedMotion();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [fields, setFields]     = useState<Fields>({ nombre: "", correo: "", empresa: "", mensaje: "", website: "" });
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errors, setErrors]     = useState<FieldError>({});
  const [formState, setFormState] = useState<FormState>("idle");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function bottomBorderColor(field: keyof FieldError, focused: boolean) {
    if (errors[field] || focused) return "#E07B30";
    return "rgba(255,255,255,0.15)";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = Object.keys(errs)[0] as keyof FieldError;
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Honeypot — si el campo oculto tiene valor, es un bot; simular éxito
    if (fields.website) {
      setFormState("success");
      return;
    }

    setFormState("submitting");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:  fields.nombre.trim(),
          correo:  fields.correo.trim(),
          empresa: fields.empresa.trim(),
          mensaje: fields.mensaje.trim(),
          website: fields.website,
        }),
      });
      if (!res.ok) throw new Error("non-ok");
      setSubmittedEmail(fields.correo.trim());
      setFormState("success");
      setFields({ nombre: "", correo: "", empresa: "", mensaje: "", website: "" });
    } catch {
      setFormState("error");
    }
  }

  function handleRetry() {
    setFormState("idle");
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  }

  return (
    <div
      id="contacto-form"
      style={{ width: "100%" }}
    >
      <AnimatePresence mode="wait">
        {formState === "success" ? (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            variants={rm ? undefined : fadeIn}
            initial={rm ? false : "initial"}
            animate="animate"
            exit="exit"
            className="flex items-start"
            style={{
              border: "1px solid #E07B3066",
              borderRadius: 6,
              padding: "20px 24px",
              gap: 14,
            }}
          >
            <span aria-hidden style={{ color: "#E07B30", fontSize: 18, lineHeight: 1 }}>✓</span>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <p className="font-semibold" style={{ color: "#FFFFFF", fontSize: 15 }}>Recibido.</p>
              <p style={{ color: "#C3B9D6", fontSize: 14, lineHeight: 1.6 }}>
                Te respondemos a{" "}
                <a
                  href={`mailto:${submittedEmail}`}
                  className="underline hover:text-white transition-colors"
                  style={{ color: "#E07B30" }}
                >
                  {submittedEmail}
                </a>{" "}
                en las próximas horas.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={rm ? undefined : formContainer}
            initial={rm ? false : "hidden"}
            animate="show"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col"
            style={{ gap: 28 }}
          >
            {/* Indicador de campos requeridos */}
            <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 12, margin: 0 }}>
              Los campos marcados con <span aria-hidden style={{ color: "#E07B30" }}>*</span>
              <span className="sr-only">asterisco</span> son obligatorios.
            </p>

            {/* NOMBRE + CORREO */}
            <motion.div
              variants={rm ? undefined : fieldReveal}
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 24 }}
            >
              <Field id="cf-nombre" label="Nombre *" error={errors.nombre}>
                <input
                  ref={firstFieldRef}
                  id="cf-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  value={fields.nombre}
                  onChange={handleChange}
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? "cf-nombre-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: errors.nombre
                      ? "#E07B30"
                      : "rgba(255,255,255,0.15)",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderBottomColor = "#E07B30"; e.target.style.boxShadow = "0 2px 0 0 #E07B30"; }}
                  onBlur={(e) => { e.target.style.borderBottomColor = bottomBorderColor("nombre", false); e.target.style.boxShadow = "none"; }}
                  placeholder="Ej: Ana García"
                />
              </Field>

              <Field id="cf-correo" label="Correo electrónico *" error={errors.correo}>
                <input
                  id="cf-correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={fields.correo}
                  onChange={handleChange}
                  aria-invalid={!!errors.correo}
                  aria-describedby={errors.correo ? "cf-correo-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: errors.correo
                      ? "#E07B30"
                      : "rgba(255,255,255,0.15)",
                  }}
                  spellCheck={false}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderBottomColor = "#E07B30"; e.target.style.boxShadow = "0 2px 0 0 #E07B30"; }}
                  onBlur={(e) => { e.target.style.borderBottomColor = bottomBorderColor("correo", false); e.target.style.boxShadow = "none"; }}
                  placeholder="tu@empresa.co"
                />
              </Field>
            </motion.div>

            {/* EMPRESA */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <Field id="cf-empresa" label="Empresa (opcional)" error={errors.empresa}>
                <input
                  id="cf-empresa"
                  name="empresa"
                  type="text"
                  autoComplete="organization"
                  value={fields.empresa}
                  onChange={handleChange}
                  style={{
                    ...inputBase,
                    borderBottomColor: errors.empresa
                      ? "#E07B30"
                      : "rgba(255,255,255,0.15)",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderBottomColor = "#E07B30"; e.target.style.boxShadow = "0 2px 0 0 #E07B30"; }}
                  onBlur={(e) => { e.target.style.borderBottomColor = bottomBorderColor("empresa", false); e.target.style.boxShadow = "none"; }}
                  placeholder="Ej: Acme S.A.S."
                />
              </Field>
            </motion.div>

            {/* MENSAJE */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <Field id="cf-mensaje" label="Mensaje *" error={errors.mensaje}>
                <textarea
                  id="cf-mensaje"
                  name="mensaje"
                  rows={4}
                  value={fields.mensaje}
                  onChange={handleChange}
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? "cf-mensaje-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: errors.mensaje
                      ? "#E07B30"
                      : "rgba(255,255,255,0.15)",
                    resize: "none",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderBottomColor = "#E07B30"; (e.target as HTMLTextAreaElement).style.boxShadow = "0 2px 0 0 #E07B30"; }}
                  onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderBottomColor = bottomBorderColor("mensaje", false); (e.target as HTMLTextAreaElement).style.boxShadow = "none"; }}
                  placeholder="¿En qué estás trabajando o qué quieres entender?…"
                />
              </Field>
            </motion.div>

            {/* Error global */}
            {formState === "error" && (
              <motion.div
                role="alert"
                variants={rm ? undefined : fadeIn}
                initial={rm ? false : "initial"}
                animate="animate"
                className="flex items-center justify-between"
                style={{
                  border: "1px solid #E07B3066",
                  borderRadius: 4,
                  padding: "12px 16px",
                  gap: 12,
                }}
              >
                <p style={{ color: "#C3B9D6", fontSize: 13 }}>
                  Algo salió mal. Escríbenos a{" "}
                  <a href="mailto:data@yetibi.com" className="underline" style={{ color: "#E07B30" }}>
                    data@yetibi.com
                  </a>.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="shrink-0 text-sm font-medium underline hover:no-underline"
                  style={{ color: "#E07B30" }}
                >
                  Reintentar
                </button>
              </motion.div>
            )}

            {/* Honeypot — off-screen (más efectivo que display:none para bots modernos) */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={fields.website}
              onChange={handleChange}
              style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
            />

            {/* Submit */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <button
                type="submit"
                disabled={formState === "submitting"}
                aria-busy={formState === "submitting"}
                className="inline-flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#E07B30",
                  color: "#1c1426",
                  fontSize: 15,
                  padding: "14px 28px",
                  gap: 10,
                  boxShadow: "0 8px 24px -6px #E07B3099",
                }}
              >
                {formState === "submitting" ? (
                  <>
                    <span
                      aria-hidden
                      className="inline-block"
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid #1c142644",
                        borderTopColor: "#1c1426",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar mensaje
                    <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
