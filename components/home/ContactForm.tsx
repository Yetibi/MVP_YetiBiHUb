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
  backgroundColor: "#0B1420",
  border: "1px solid #1C2836",
  borderRadius: 8,
  color: "#F2F6F9",
  fontSize: 14,
  padding: "10px 12px",
  width: "100%",
  minHeight: 44,
  boxSizing: "border-box",
  outline: "none",
  boxShadow: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

// Contraste mejorado: #5D6B7A (3.8:1) → #8B95A5 (~5.8:1) sobre #0B1420
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  color: "#8B95A5",
  fontSize: 10.5,
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
    <div className="flex flex-col" style={{ gap: 5 }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" style={{ color: "#F2921D", fontSize: 13 }}>
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
    if (errors[field]) return "#F2921D";
    if (focused) return "#4FD1E0";
    return "#1C2836";
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
              border: "1px solid #4FD1E066",
              borderRadius: 6,
              padding: "20px 24px",
              gap: 14,
            }}
          >
            <span aria-hidden style={{ color: "#4FD1E0", fontSize: 18, lineHeight: 1 }}>✓</span>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <p className="font-semibold" style={{ color: "#FFFFFF", fontSize: 15 }}>Recibido.</p>
              <p style={{ color: "#8B95A5", fontSize: 14, lineHeight: 1.6 }}>
                Te respondemos a{" "}
                <a
                  href={`mailto:${submittedEmail}`}
                  className="underline hover:text-white transition-colors"
                  style={{ color: "#4FD1E0" }}
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
            style={{ gap: 12 }}
          >
            {/* Indicador de campos requeridos */}
            <p style={{ fontFamily: "var(--font-geist-mono)", color: "#5D6B7A", fontSize: 11, margin: 0 }}>
              Los campos con <span aria-hidden style={{ color: "#F2921D" }}>*</span>
              <span className="sr-only">asterisco</span> son obligatorios.
            </p>

            {/* NOMBRE + CORREO */}
            <motion.div
              variants={rm ? undefined : fieldReveal}
              className="grid grid-cols-1 min-[480px]:grid-cols-2"
              style={{ gap: 12 }}
            >
              <Field id="cf-nombre" label="Nombre *" error={errors.nombre}>
                <input
                  ref={firstFieldRef}
                  id="cf-nombre"
                  name="nombre"
                  required
                  aria-required="true"
                  type="text"
                  autoComplete="name"
                  value={fields.nombre}
                  onChange={handleChange}
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? "cf-nombre-err" : undefined}
                  style={{
                    ...inputBase,
                    borderColor: errors.nombre ? "#F2921D" : "#1C2836",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = "#4FD1E0"; e.target.style.boxShadow = "0 0 0 1px #4FD1E0"; }}
                  onBlur={(e) => { e.target.style.borderColor = bottomBorderColor("nombre", false); e.target.style.boxShadow = "none"; }}
                  placeholder="Ej: Ana García"
                />
              </Field>

              <Field id="cf-correo" label="Correo *" error={errors.correo}>
                <input
                  id="cf-correo"
                  name="correo"
                  required
                  aria-required="true"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={fields.correo}
                  onChange={handleChange}
                  aria-invalid={!!errors.correo}
                  aria-describedby={errors.correo ? "cf-correo-err" : undefined}
                  style={{
                    ...inputBase,
                    borderColor: errors.correo ? "#F2921D" : "#1C2836",
                  }}
                  spellCheck={false}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = "#4FD1E0"; e.target.style.boxShadow = "0 0 0 1px #4FD1E0"; }}
                  onBlur={(e) => { e.target.style.borderColor = bottomBorderColor("correo", false); e.target.style.boxShadow = "none"; }}
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
                    borderColor: errors.empresa ? "#F2921D" : "#1C2836",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = "#4FD1E0"; e.target.style.boxShadow = "0 0 0 1px #4FD1E0"; }}
                  onBlur={(e) => { e.target.style.borderColor = bottomBorderColor("empresa", false); e.target.style.boxShadow = "none"; }}
                  placeholder="Ej: Acme S.A.S."
                />
              </Field>
            </motion.div>

            {/* MENSAJE */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <Field id="cf-mensaje" label="¿Qué proceso quieres evaluar? *" error={errors.mensaje}>
                <textarea
                  id="cf-mensaje"
                  name="mensaje"
                  required
                  aria-required="true"
                  rows={3}
                  value={fields.mensaje}
                  onChange={handleChange}
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? "cf-mensaje-err" : undefined}
                  // Enter inserta salto de línea; ⌘/Ctrl+Enter envía, para no
                  // obligar a tabular hasta el botón desde un campo multilínea.
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  style={{
                    ...inputBase,
                    borderColor: errors.mensaje ? "#F2921D" : "#1C2836",
                    height: 64,
                    resize: "none",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#4FD1E0"; (e.target as HTMLTextAreaElement).style.boxShadow = "0 0 0 1px #4FD1E0"; }}
                  onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = bottomBorderColor("mensaje", false); (e.target as HTMLTextAreaElement).style.boxShadow = "none"; }}
                  placeholder="Ej: nuestro proceso de facturación / agendamiento / compras…"
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
                  border: "1px solid #F2921D66",
                  borderRadius: 4,
                  padding: "12px 16px",
                  gap: 12,
                }}
              >
                <p style={{ color: "#8B95A5", fontSize: 13 }}>
                  Algo salió mal. Escríbenos a{" "}
                  <a href="mailto:data@yetibi.com" className="underline" style={{ color: "#4FD1E0" }}>
                    data@yetibi.com
                  </a>.
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="shrink-0 text-sm font-medium underline hover:no-underline"
                  style={{ color: "#4FD1E0" }}
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
                className="form-submit disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "#F2921D",
                  color: "#0B1420",
                  fontFamily: "var(--font-space-grotesk), var(--font-geist-sans)",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "13px 20px",
                  minHeight: 48,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
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
                        border: "2px solid rgba(11,20,32,0.3)",
                        borderTopColor: "#0B1420",
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
