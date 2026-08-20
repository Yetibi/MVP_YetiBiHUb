// ─── Copy del formulario de Aptitud del Proceso para IA · v1.0 ───────────────
// Labels literales del insumo de construcción §1. Los `value` son el contrato
// con lib/clasificador.ts — no se renombran sin migrar el motor.

import type {
  Senal,
  Dato,
  Frecuencia,
  Antiguedad,
  Falla,
} from "@/types/aptitud";

export const SECTORS = [
  "Manufactura e industria",
  "Comercio y retail",
  "Servicios profesionales",
  "Salud y ciencias de la vida",
  "Educación",
  "Construcción e inmobiliaria",
  "Logística y transporte",
  "Tecnología y software",
  "Agropecuario",
  "Financiero y seguros",
  "Ong's y fundaciones",
  "Otro",
] as const;

// ── Campos libres ──

export const CAMPO_PROCESO = {
  label: "¿Qué proceso quieres evaluar, y para qué existe?",
  ayuda:
    "En una o dos frases. Ej.: 'Agendamiento de citas — para que ninguna silla se quede vacía'.",
  min: 10,
  max: 300,
} as const;

export const CAMPO_EJECUCION = {
  label: "¿Quién lo ejecuta y con qué herramientas?",
  ayuda:
    "Personas, roles y lo que usan de verdad: Excel, WhatsApp, un sistema, papel.",
  max: 300,
} as const;

export const CAMPO_EXPECTATIVA = {
  label: "¿Qué te gustaría que la IA hiciera en este proceso?",
  ayuda: "En tus palabras. No hay respuesta incorrecta.",
  max: 300,
} as const;

// ── Opciones cerradas (discriminadores) ──

export const SENAL_OPTIONS: { value: Senal; label: string }[] = [
  { value: "queja", label: "Nos damos cuenta cuando alguien se queja o algo falla" },
  { value: "cabeza", label: "La persona que lo ejecuta lo sabe, pero no queda registrado" },
  { value: "registro_muerto", label: "Queda registro, pero casi nunca lo revisamos" },
  { value: "indicadores", label: "Tenemos indicadores que revisamos con frecuencia" },
];

export const DATO_OPTIONS: { value: Dato; label: string }[] = [
  { value: "no_existe", label: "No queda registrada — está en la cabeza de quien lo hace" },
  { value: "suelta", label: "En papel, WhatsApp o correos sueltos" },
  {
    value: "dispersa",
    label: "En varios Excel o sistemas que no se hablan; alguien los cruza a mano",
  },
  { value: "unica", label: "En un solo sistema o base ordenada" },
];

export const FRECUENCIA_OPTIONS: { value: Frecuencia; label: string }[] = [
  { value: "varias_veces_dia", label: "Varias veces al día" },
  { value: "diario", label: "Todos los días" },
  { value: "semanal", label: "Cada semana" },
  { value: "mensual_o_menos", label: "Una vez al mes o menos" },
];

export const ANTIGUEDAD_OPTIONS: { value: Antiguedad; label: string }[] = [
  { value: "reciente", label: "Hace menos de un año" },
  { value: "hace_anios", label: "Hace 1–3 años" },
  { value: "fosil", label: "Hace más de 3 años" },
  { value: "nunca", label: "Nunca ha cambiado desde que existe" },
];

export const FALLA_OPTIONS: { value: Falla; label: string }[] = [
  { value: "cada_quien", label: "Cada quien lo resuelve a su manera" },
  { value: "tarde", label: "Nos enteramos tarde, cuando ya no se puede corregir" },
  { value: "repetido", label: "Se repite el mismo error aunque ya lo conocemos" },
  { value: "controlado", label: "Se detecta y corrige rápido; hay un responsable claro" },
];
