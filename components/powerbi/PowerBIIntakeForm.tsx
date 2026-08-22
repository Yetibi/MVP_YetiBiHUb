"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { formContainer, fieldReveal, fadeIn } from "@/lib/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ─── config ──────────────────────────────────────────────────────────────────

const CAL_BOOKING_URL = "https://cal.com/julian-atehortua-aguilar-e53fae/diagnostico-power-bi";

// ─── data ────────────────────────────────────────────────────────────────────

const FREE_EMAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const SECTOR_OPTIONS = [
  "Comercio y retail",
  "Servicios profesionales (contables, jurídicos, consultoría)",
  "Manufactura e industria",
  "Alimentos y bebidas",
  "Construcción e inmobiliario",
  "Salud y bienestar",
  "Logística y transporte",
  "Agropecuario y agroindustria",
  "Tecnología y software",
  "Educación y formación",
  "Hotelería, turismo y restaurantes",
  "Financiero y seguros",
  "Energía y minería",
  "Entretenimiento y medios",
  "ONG o fundación",
  "Gobierno o sector público",
  "Proyecto personal o independiente",
  "Otro (¿cuál?)",
] as const;

const SECTOR_OTRO = "Otro (¿cuál?)";

const FUENTES_GRUPOS = [
  {
    titulo: "HOJAS DE CÁLCULO Y ARCHIVOS",
    opciones: ["Excel o Google Sheets", "Archivos sueltos (PDF, Word, correos)"],
  },
  {
    titulo: "BASES DE DATOS VISUALES Y COLABORACIÓN",
    opciones: ["Airtable o Notion", "Base de datos propia (PostgreSQL, MySQL, MongoDB, etc.)"],
  },
  {
    titulo: "CONTABILIDAD Y FACTURACIÓN",
    opciones: ["Siigo", "Alegra", "World Office", "Otro software contable"],
  },
  {
    titulo: "ERP (SISTEMA INTEGRADO DE GESTIÓN)",
    opciones: ["SAP", "Odoo", "Microsoft Dynamics", "Otro ERP"],
  },
  {
    titulo: "CRM (GESTIÓN DE CLIENTES)",
    opciones: ["HubSpot", "Salesforce", "Zoho", "DataCRM", "Otro CRM"],
  },
  {
    titulo: "OTRAS FUENTES",
    opciones: [
      "Software a la medida o desarrollo propio",
      "WhatsApp y canales informales",
      "Plataformas de e-commerce (Shopify, MercadoLibre, etc.)",
      "Sin sistema — todo es manual o en papel",
    ],
  },
  {
    titulo: "INTEGRACIÓN",
    opciones: ["Varias fuentes sin conectar entre sí"],
  },
] as const;

const HERRAMIENTAS_OPTIONS = [
  "No, nunca",
  "Sí, con Power BI",
  "Sí, con otra herramienta",
  "Tenemos licencias sin usar",
] as const;

const HERRAMIENTA_OTRA_TRIGGER = "Sí, con otra herramienta";

// ─── types ───────────────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

interface Fields {
  nombre: string;
  correo: string;
  empresa: string;
  sector: string;
  sector_otro: string;
  fuentes_datos: string[];
  decision_bloqueada: string;
  herramientas_previas: string;
  herramienta_otra: string;
  resultado_ideal: string;
  website: string; // honeypot — must stay empty
}

interface FieldError {
  nombre?: string;
  correo?: string;
  empresa?: string;
  sector?: string;
  sector_otro?: string;
  fuentes_datos?: string;
  decision_bloqueada?: string;
  herramientas_previas?: string;
  herramienta_otra?: string;
  resultado_ideal?: string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFields: Fields = {
  nombre: "",
  correo: "",
  empresa: "",
  sector: "",
  sector_otro: "",
  fuentes_datos: [],
  decision_bloqueada: "",
  herramientas_previas: "",
  herramienta_otra: "",
  resultado_ideal: "",
  website: "",
};

function validate(f: Fields): FieldError {
  const e: FieldError = {};
  if (!f.nombre.trim()) e.nombre = "El nombre es requerido.";
  if (!f.correo.trim()) e.correo = "El correo es requerido.";
  else if (!EMAIL_RE.test(f.correo.trim())) e.correo = "Ingresa un correo válido.";
  if (!f.empresa.trim()) e.empresa = "La empresa es requerida.";
  if (!f.sector) e.sector = "Selecciona un sector.";
  if (f.sector === SECTOR_OTRO && !f.sector_otro.trim())
    e.sector_otro = "Especifica el sector.";
  if (f.fuentes_datos.length === 0)
    e.fuentes_datos = "Selecciona al menos una fuente de datos.";
  if (f.decision_bloqueada.trim().length < 10)
    e.decision_bloqueada = "Cuéntanos un poco más (mínimo 10 caracteres).";
  if (!f.herramientas_previas) e.herramientas_previas = "Selecciona una opción.";
  if (f.herramientas_previas === HERRAMIENTA_OTRA_TRIGGER && !f.herramienta_otra.trim())
    e.herramienta_otra = "Especifica cuál herramienta.";
  if (f.resultado_ideal.trim().length < 10)
    e.resultado_ideal = "Cuéntanos un poco más (mínimo 10 caracteres).";
  return e;
}

function esCorreoGratuito(correo: string): boolean {
  const domain = correo.trim().split("@")[1]?.toLowerCase();
  return !!domain && FREE_EMAIL_DOMAINS.includes(domain);
}

// ─── shared styles ───────────────────────────────────────────────────────────

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

const labelStyle: React.CSSProperties = {
  color: "#8B95A5",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};

const groupHeaderStyle: React.CSSProperties = {
  color: "#5D6B7A",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p style={{ color: "#5D6B7A", fontSize: 13, fontStyle: "italic" }}>{hint}</p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" style={{ color: "#4FD1E0", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── PowerBIIntakeForm ───────────────────────────────────────────────────────

export function PowerBIIntakeForm() {
  const rm = useReducedMotion();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<FieldError>({});
  const [formState, setFormState] = useState<FormState>("idle");

  // Inicializa el script del embed de Cal.com — requerido por @calcom/embed-react
  // antes de que <Cal inline> renderice algo dentro del contenedor.
  useEffect(() => {
    if (formState !== "success") return;
    (async () => {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#4FD1E0" } },
      });
    })();
  }, [formState]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function setField<K extends keyof Fields>(field: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function toggleFuente(opcion: string, checked: boolean) {
    setFields((prev) => ({
      ...prev,
      fuentes_datos: checked
        ? [...prev.fuentes_datos, opcion]
        : prev.fuentes_datos.filter((v) => v !== opcion),
    }));
    if (errors.fuentes_datos) {
      setErrors((prev) => ({ ...prev, fuentes_datos: undefined }));
    }
  }

  function bottomBorderColor(field: keyof FieldError, focused: boolean) {
    if (errors[field] || focused) return "#4FD1E0";
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
      const res = await fetch("/api/powerbi-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: fields.nombre.trim(),
          correo: fields.correo.trim(),
          empresa: fields.empresa.trim(),
          sector: fields.sector,
          sector_otro: fields.sector === SECTOR_OTRO ? fields.sector_otro.trim() : undefined,
          fuentes_datos: fields.fuentes_datos,
          decision_bloqueada: fields.decision_bloqueada.trim(),
          herramientas_previas: fields.herramientas_previas,
          herramienta_otra:
            fields.herramientas_previas === HERRAMIENTA_OTRA_TRIGGER
              ? fields.herramienta_otra.trim()
              : undefined,
          resultado_ideal: fields.resultado_ideal.trim(),
          website: fields.website,
        }),
      });
      if (!res.ok) throw new Error("non-ok");
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  function handleRetry() {
    setFormState("idle");
    setTimeout(() => firstFieldRef.current?.focus(), 50);
  }

  return (
    <div style={{ width: "100%" }}>
      <AnimatePresence mode="wait">
        {formState === "success" ? (
          <motion.div
            key="confirmacion"
            variants={rm ? undefined : fadeIn}
            initial={rm ? false : "initial"}
            animate="animate"
            exit="exit"
            role="status"
            aria-live="polite"
            className="flex flex-col"
            style={{ gap: 24 }}
          >
            <div className="flex items-start" style={{ gap: 14 }}>
              <span
                aria-hidden
                style={{ color: "#4FD1E0", fontSize: 22, lineHeight: 1 }}
              >
                ✓
              </span>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <p
                  className="font-semibold"
                  style={{ color: "#FFFFFF", fontSize: 20 }}
                >
                  ¡Listo! Ahora elige el horario que mejor te funcione
                </p>
                <p style={{ color: "#5D6B7A", fontSize: 14 }}>
                  Reunión de diagnóstico · 30 minutos · Virtual
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#141F2E",
                borderRadius: 8,
                overflow: "hidden",
                minHeight: 500,
              }}
            >
              <Cal
                calLink={CAL_BOOKING_URL.replace("https://cal.com/", "")}
                style={{ width: "100%", height: "100%", minHeight: 500 }}
                config={{
                  name: fields.nombre,
                  email: fields.correo,
                  theme: "dark",
                }}
              />
            </div>

            <p style={{ color: "#5D6B7A", fontSize: 13 }}>
              ¿Problemas para ver el calendario?{" "}
              <a
                href={CAL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition-colors"
                style={{ color: "#4FD1E0" }}
              >
                Agenda directamente aquí →
              </a>
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="formulario"
            variants={rm ? undefined : formContainer}
            initial={rm ? false : "hidden"}
            animate="show"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col"
            style={{ gap: 28 }}
          >
            <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 12, margin: 0 }}>
              Todos los campos son obligatorios.
            </p>

            {/* Nombre + correo */}
            <motion.div
              variants={rm ? undefined : fieldReveal}
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 24 }}
            >
              <Field id="pbi-nombre" label="Nombre completo" error={errors.nombre}>
                <input
                  ref={firstFieldRef}
                  id="pbi-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  value={fields.nombre}
                  onChange={handleChange}
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? "pbi-nombre-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: bottomBorderColor("nombre", false),
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = "#4FD1E0";
                    e.target.style.boxShadow = "0 2px 0 0 #4FD1E0";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = bottomBorderColor("nombre", false);
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Ej: Ana García"
                />
              </Field>

              <Field
                id="pbi-correo"
                label="Correo electrónico"
                error={errors.correo}
                hint={
                  fields.correo && esCorreoGratuito(fields.correo)
                    ? "Si tienes correo corporativo, úsalo — nos ayuda a preparar mejor tu reunión."
                    : undefined
                }
              >
                <input
                  id="pbi-correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={fields.correo}
                  onChange={handleChange}
                  aria-invalid={!!errors.correo}
                  aria-describedby={errors.correo ? "pbi-correo-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: bottomBorderColor("correo", false),
                  }}
                  spellCheck={false}
                  className="focus-visible:outline-none"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = "#4FD1E0";
                    e.target.style.boxShadow = "0 2px 0 0 #4FD1E0";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = bottomBorderColor("correo", false);
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="tu@empresa.co"
                />
              </Field>
            </motion.div>

            {/* Empresa + sector */}
            <motion.div
              variants={rm ? undefined : fieldReveal}
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 24 }}
            >
              <Field id="pbi-empresa" label="Empresa" error={errors.empresa}>
                <input
                  id="pbi-empresa"
                  name="empresa"
                  type="text"
                  autoComplete="organization"
                  value={fields.empresa}
                  onChange={handleChange}
                  aria-invalid={!!errors.empresa}
                  aria-describedby={errors.empresa ? "pbi-empresa-err" : undefined}
                  style={{
                    ...inputBase,
                    borderBottomColor: bottomBorderColor("empresa", false),
                  }}
                  className="focus-visible:outline-none"
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = "#4FD1E0";
                    e.target.style.boxShadow = "0 2px 0 0 #4FD1E0";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = bottomBorderColor("empresa", false);
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="Ej: Acme S.A.S."
                />
              </Field>

              <Field id="pbi-sector" label="Sector" error={errors.sector}>
                <Select
                  value={fields.sector}
                  onValueChange={(v) => setField("sector", v ?? "")}
                >
                  <SelectTrigger
                    id="pbi-sector"
                    className="w-full border-white/15 text-white bg-transparent"
                    aria-required="true"
                  >
                    <SelectValue placeholder="Selecciona el sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTOR_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </motion.div>

            {/* Sector otro (condicional) */}
            <AnimatePresence>
              {fields.sector === SECTOR_OTRO && (
                <motion.div
                  key="sector-otro"
                  variants={rm ? undefined : fadeIn}
                  initial={rm ? false : "initial"}
                  animate="animate"
                  exit="exit"
                >
                  <Field
                    id="pbi-sector-otro"
                    label="¿Cuál sector?"
                    error={errors.sector_otro}
                  >
                    <input
                      id="pbi-sector-otro"
                      name="sector_otro"
                      type="text"
                      value={fields.sector_otro}
                      onChange={handleChange}
                      aria-invalid={!!errors.sector_otro}
                      style={{
                        ...inputBase,
                        borderBottomColor: bottomBorderColor("sector_otro", false),
                      }}
                      className="focus-visible:outline-none"
                      onFocus={(e) => {
                        e.target.style.borderBottomColor = "#4FD1E0";
                        e.target.style.boxShadow = "0 2px 0 0 #4FD1E0";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderBottomColor = bottomBorderColor(
                          "sector_otro",
                          false
                        );
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="Especifica el sector"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fuentes de datos */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <div className="flex flex-col" style={{ gap: 4, marginBottom: 14 }}>
                <label style={labelStyle}>
                  ¿Dónde viven los datos de su operación hoy?
                </label>
                <p style={{ color: "#5D6B7A", fontSize: 13 }}>
                  Seleccione todas las que apliquen
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: 20 }}>
                {FUENTES_GRUPOS.map((grupo) => (
                  <div key={grupo.titulo} className="flex flex-col" style={{ gap: 10 }}>
                    <p className="font-mono" style={groupHeaderStyle}>
                      {grupo.titulo}
                    </p>
                    <div className="flex flex-col" style={{ gap: 10 }}>
                      {grupo.opciones.map((opcion) => {
                        const checked = fields.fuentes_datos.includes(opcion);
                        return (
                          <label
                            key={opcion}
                            htmlFor={`fuente-${opcion}`}
                            className="flex items-start gap-2.5 cursor-pointer"
                          >
                            <Checkbox
                              id={`fuente-${opcion}`}
                              checked={checked}
                              onCheckedChange={(isChecked) =>
                                toggleFuente(opcion, !!isChecked)
                              }
                              className="mt-0.5"
                            />
                            <span className="text-sm" style={{ color: "#FFFFFF" }}>
                              {opcion}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {errors.fuentes_datos && (
                <p role="alert" style={{ color: "#4FD1E0", fontSize: 13, marginTop: 12 }}>
                  {errors.fuentes_datos}
                </p>
              )}
            </motion.div>

            {/* Decisión bloqueada */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <Field
                id="pbi-decision"
                label="¿Qué decisión necesita tomar y hoy no puede tomar con datos?"
                error={errors.decision_bloqueada}
              >
                <textarea
                  id="pbi-decision"
                  name="decision_bloqueada"
                  rows={3}
                  value={fields.decision_bloqueada}
                  onChange={handleChange}
                  aria-invalid={!!errors.decision_bloqueada}
                  aria-describedby={
                    errors.decision_bloqueada ? "pbi-decision-err" : undefined
                  }
                  style={{
                    ...inputBase,
                    borderBottomColor: bottomBorderColor("decision_bloqueada", false),
                    resize: "none",
                  }}
                  className="focus-visible:outline-none placeholder:italic"
                  onFocus={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor = "#4FD1E0";
                    (e.target as HTMLTextAreaElement).style.boxShadow = "0 2px 0 0 #4FD1E0";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor =
                      bottomBorderColor("decision_bloqueada", false);
                    (e.target as HTMLTextAreaElement).style.boxShadow = "none";
                  }}
                  placeholder="Ej: No sé cuáles productos me dan margen real, o tardo 3 días en armar el informe de ventas"
                />
              </Field>
            </motion.div>

            {/* Herramientas previas */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <label style={{ ...labelStyle, display: "block", marginBottom: 14 }}>
                ¿Han trabajado con herramientas de visualización o análisis de datos?
              </label>
              <div role="radiogroup" className="flex flex-col" style={{ gap: 10 }}>
                {HERRAMIENTAS_OPTIONS.map((opcion) => (
                  <label
                    key={opcion}
                    htmlFor={`herramienta-${opcion}`}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      id={`herramienta-${opcion}`}
                      name="herramientas_previas"
                      value={opcion}
                      checked={fields.herramientas_previas === opcion}
                      onChange={() => setField("herramientas_previas", opcion)}
                      style={{ accentColor: "#4FD1E0", width: 16, height: 16 }}
                    />
                    <span className="text-sm" style={{ color: "#FFFFFF" }}>
                      {opcion}
                    </span>
                  </label>
                ))}
              </div>
              {errors.herramientas_previas && (
                <p role="alert" style={{ color: "#4FD1E0", fontSize: 13, marginTop: 10 }}>
                  {errors.herramientas_previas}
                </p>
              )}
            </motion.div>

            {/* Herramienta otra (condicional) */}
            <AnimatePresence>
              {fields.herramientas_previas === HERRAMIENTA_OTRA_TRIGGER && (
                <motion.div
                  key="herramienta-otra"
                  variants={rm ? undefined : fadeIn}
                  initial={rm ? false : "initial"}
                  animate="animate"
                  exit="exit"
                >
                  <Field id="pbi-herramienta-otra" label="¿Cuál?" error={errors.herramienta_otra}>
                    <input
                      id="pbi-herramienta-otra"
                      name="herramienta_otra"
                      type="text"
                      value={fields.herramienta_otra}
                      onChange={handleChange}
                      aria-invalid={!!errors.herramienta_otra}
                      style={{
                        ...inputBase,
                        borderBottomColor: bottomBorderColor("herramienta_otra", false),
                      }}
                      className="focus-visible:outline-none"
                      onFocus={(e) => {
                        e.target.style.borderBottomColor = "#4FD1E0";
                        e.target.style.boxShadow = "0 2px 0 0 #4FD1E0";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderBottomColor = bottomBorderColor(
                          "herramienta_otra",
                          false
                        );
                        e.target.style.boxShadow = "none";
                      }}
                      placeholder="Nombre de la herramienta"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resultado ideal */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <Field
                id="pbi-resultado"
                label="¿Cómo se imagina el resultado ideal de este proyecto?"
                error={errors.resultado_ideal}
              >
                <textarea
                  id="pbi-resultado"
                  name="resultado_ideal"
                  rows={3}
                  value={fields.resultado_ideal}
                  onChange={handleChange}
                  aria-invalid={!!errors.resultado_ideal}
                  aria-describedby={
                    errors.resultado_ideal ? "pbi-resultado-err" : undefined
                  }
                  style={{
                    ...inputBase,
                    borderBottomColor: bottomBorderColor("resultado_ideal", false),
                    resize: "none",
                  }}
                  className="focus-visible:outline-none placeholder:italic"
                  onFocus={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor = "#4FD1E0";
                    (e.target as HTMLTextAreaElement).style.boxShadow = "0 2px 0 0 #4FD1E0";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLTextAreaElement).style.borderBottomColor =
                      bottomBorderColor("resultado_ideal", false);
                    (e.target as HTMLTextAreaElement).style.boxShadow = "none";
                  }}
                  placeholder="Ej: Abrir un tablero y en 5 minutos saber cómo va el mes sin depender de nadie"
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
                  border: "1px solid #4FD1E066",
                  borderRadius: 4,
                  padding: "12px 16px",
                  gap: 12,
                }}
              >
                <p style={{ color: "#8B95A5", fontSize: 13 }}>
                  Algo salió mal. Escríbenos a{" "}
                  <a
                    href="mailto:data@yetibi.com"
                    className="underline"
                    style={{ color: "#4FD1E0" }}
                  >
                    data@yetibi.com
                  </a>
                  .
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
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            {/* Submit */}
            <motion.div variants={rm ? undefined : fieldReveal}>
              <button
                type="submit"
                disabled={formState === "submitting"}
                aria-busy={formState === "submitting"}
                className="btn-primary inline-flex w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontSize: 15,
                  padding: "14px 28px",
                  gap: 10,
                  justifyContent: "center",
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
                        border: "2px solid rgba(242,143,107,0.3)",
                        borderTopColor: "currentColor",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Enviando…
                  </>
                ) : (
                  <>
                    Agendar reunión de diagnóstico
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
