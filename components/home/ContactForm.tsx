"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { listContainer, fadeUp, formContainer, fieldReveal, fadeIn } from "@/lib/motion";

// ─── types ───────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

interface Fields {
  nombre: string;
  correo: string;
  mensaje: string;
}

interface FieldError {
  nombre?: string;
  correo?: string;
  mensaje?: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields): FieldError {
  const e: FieldError = {};
  if (!f.nombre.trim())          e.nombre  = "El nombre es requerido.";
  if (!f.correo.trim())          e.correo  = "El correo es requerido.";
  else if (!EMAIL_RE.test(f.correo.trim())) e.correo = "Ingresa un correo válido.";
  if (!f.mensaje.trim())         e.mensaje = "El mensaje es requerido.";
  return e;
}

// ─── shared input styles ─────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  backgroundColor: "#372E4D",
  border: "1px solid #453960",
  borderRadius: 6,
  color: "#FFFFFF",
  fontSize: 15,
  padding: "14px 16px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s",
};

// ─── ContactForm ─────────────────────────────────────────────────────────────

export function ContactForm() {
  const rm = useReducedMotion();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState<Fields>({ nombre: "", correo: "", mensaje: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [formState, setFormState] = useState<FormState>("idle");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // clear field error on change
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // focus first invalid field
      const first = Object.keys(errs)[0] as keyof FieldError;
      const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }

    setFormState("submitting");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: fields.nombre.trim(),
          correo: fields.correo.trim(),
          mensaje: fields.mensaje.trim(),
        }),
      });
      if (!res.ok) throw new Error("non-ok");
      setFormState("success");
      setFields({ nombre: "", correo: "", mensaje: "" });
    } catch {
      setFormState("error");
    }
  }

  function handleRetry() {
    setFormState("idle");
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  }

  return (
    <section
      id="contacto-form"
      className="w-full px-5 md:px-10 lg:px-20"
      style={{ backgroundColor: "#1A1428", paddingTop: 100, paddingBottom: 100 }}
    >
      {/* Header */}
      <motion.div
        variants={rm ? undefined : listContainer}
        initial={rm ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col"
        style={{ gap: 16, marginBottom: 56 }}
      >
        <motion.p
          variants={rm ? undefined : fadeUp}
          className="font-normal uppercase tracking-[0.3em]"
          style={{ color: "#A89EC0", fontSize: 12 }}
        >
          CONTACTO
        </motion.p>
        <motion.h2
          variants={rm ? undefined : fadeUp}
          className="font-bold font-[family-name:var(--font-heading)]"
          style={{ color: "#FFFFFF", fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.15, maxWidth: 640 }}
        >
          ¿Tienes una pregunta antes de empezar?
        </motion.h2>
      </motion.div>

      {/* Form area — max 640 for readability */}
      <div style={{ maxWidth: 640 }}>
        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <motion.div
              key="success"
              variants={rm ? undefined : fadeIn}
              initial={rm ? false : "initial"}
              animate="animate"
              exit="exit"
              className="flex items-start"
              style={{
                backgroundColor: "#2A2040",
                border: "1px solid #E07B3066",
                borderRadius: 8,
                padding: "24px 28px",
                gap: 16,
              }}
            >
              <span aria-hidden style={{ color: "#E07B30", fontSize: 20, lineHeight: 1 }}>✓</span>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <p className="font-semibold" style={{ color: "#FFFFFF", fontSize: 16 }}>
                  Recibido.
                </p>
                <p style={{ color: "#C3B9D6", fontSize: 15, lineHeight: 1.6 }}>
                  Te respondemos a{" "}
                  <a
                    href="mailto:data@yetibi.co"
                    className="underline hover:text-white transition-colors"
                    style={{ color: "#E07B30" }}
                  >
                    data@yetibi.co
                  </a>
                  {" "}en las próximas horas.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={rm ? undefined : formContainer}
              initial={rm ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col"
              style={{ gap: 24 }}
            >
              {/* Nombre */}
              <motion.div variants={rm ? undefined : fieldReveal} className="flex flex-col" style={{ gap: 8 }}>
                <label htmlFor="cf-nombre" style={{ color: "#C3B9D6", fontSize: 14, fontWeight: 500 }}>
                  Nombre
                </label>
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
                    borderColor: errors.nombre ? "#E07B30" : "#453960",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = "#E07B30")}
                  onBlur={(e) => (e.target.style.borderColor = errors.nombre ? "#E07B30" : "#453960")}
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p id="cf-nombre-err" role="alert" style={{ color: "#E07B30", fontSize: 13 }}>
                    {errors.nombre}
                  </p>
                )}
              </motion.div>

              {/* Correo */}
              <motion.div variants={rm ? undefined : fieldReveal} className="flex flex-col" style={{ gap: 8 }}>
                <label htmlFor="cf-correo" style={{ color: "#C3B9D6", fontSize: 14, fontWeight: 500 }}>
                  Correo electrónico
                </label>
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
                    borderColor: errors.correo ? "#E07B30" : "#453960",
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = "#E07B30")}
                  onBlur={(e) => (e.target.style.borderColor = errors.correo ? "#E07B30" : "#453960")}
                  placeholder="tu@empresa.co"
                />
                {errors.correo && (
                  <p id="cf-correo-err" role="alert" style={{ color: "#E07B30", fontSize: 13 }}>
                    {errors.correo}
                  </p>
                )}
              </motion.div>

              {/* Mensaje */}
              <motion.div variants={rm ? undefined : fieldReveal} className="flex flex-col" style={{ gap: 8 }}>
                <label htmlFor="cf-mensaje" style={{ color: "#C3B9D6", fontSize: 14, fontWeight: 500 }}>
                  Mensaje
                </label>
                <textarea
                  id="cf-mensaje"
                  name="mensaje"
                  rows={5}
                  value={fields.mensaje}
                  onChange={handleChange}
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? "cf-mensaje-err" : undefined}
                  style={{
                    ...inputBase,
                    borderColor: errors.mensaje ? "#E07B30" : "#453960",
                    resize: "vertical",
                    minHeight: 120,
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => (e.target.style.borderColor = "#E07B30")}
                  onBlur={(e) => (e.target.style.borderColor = errors.mensaje ? "#E07B30" : "#453960")}
                  placeholder="Cuéntanos en qué estás trabajando o qué quieres entender..."
                />
                {errors.mensaje && (
                  <p id="cf-mensaje-err" role="alert" style={{ color: "#E07B30", fontSize: 13 }}>
                    {errors.mensaje}
                  </p>
                )}
              </motion.div>

              {/* Error global */}
              {formState === "error" && (
                <motion.div
                  variants={rm ? undefined : fadeIn}
                  initial={rm ? false : "initial"}
                  animate="animate"
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: "#2A2040",
                    border: "1px solid #E07B3066",
                    borderRadius: 6,
                    padding: "14px 18px",
                    gap: 12,
                  }}
                >
                  <p style={{ color: "#C3B9D6", fontSize: 14 }}>
                    Algo salió mal. Inténtalo de nuevo o escríbenos a{" "}
                    <a href="mailto:data@yetibi.co" className="underline" style={{ color: "#E07B30" }}>
                      data@yetibi.co
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="shrink-0 text-sm font-medium underline hover:no-underline transition-all"
                    style={{ color: "#E07B30" }}
                  >
                    Reintentar
                  </button>
                </motion.div>
              )}

              {/* Submit */}
              <motion.div variants={rm ? undefined : fieldReveal}>
                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="inline-flex items-center rounded-md font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#E07B30",
                    color: "#1c1426",
                    fontSize: 16,
                    padding: "16px 32px",
                    gap: 10,
                    boxShadow: "0 8px 30px -8px #E07B3099",
                  }}
                >
                  {formState === "submitting" ? (
                    <>
                      <span
                        aria-hidden
                        className="inline-block"
                        style={{
                          width: 16,
                          height: 16,
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
    </section>
  );
}
