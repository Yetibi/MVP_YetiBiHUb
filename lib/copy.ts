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

// Clave estable en snake_case (viaja a Supabase/webhook); la etiqueta visible
// puede cambiar sin romper datos históricos. Alfabético, "Otro" siempre último.
export const SECTORS = [
  { value: "agroindustria", label: "Agroindustria" },
  { value: "alimentos_bebidas", label: "Alimentos y bebidas" },
  { value: "belleza_bienestar", label: "Belleza y bienestar" },
  { value: "comercio_retail", label: "Comercio y retail" },
  { value: "construccion_inmobiliario", label: "Construcción e inmobiliario" },
  { value: "educacion_formacion", label: "Educación y formación" },
  { value: "logistica_transporte", label: "Logística y transporte" },
  { value: "manufactura_produccion", label: "Manufactura y producción" },
  { value: "ong_fundaciones", label: "ONG y fundaciones" },
  { value: "salud_odontologia", label: "Salud y odontología" },
  { value: "servicios_financieros", label: "Servicios financieros" },
  { value: "servicios_profesionales", label: "Servicios profesionales" },
  { value: "tecnologia_software", label: "Tecnología y software" },
  { value: "turismo_hoteleria", label: "Turismo y hotelería" },
  { value: "otro", label: "Otro" },
] as const;

// ── Campos libres ──

// ── Los 4 bloques del recorrido ──
export const BLOQUES = {
  1: { kicker: "Bloque 1 · Para escribirte", titulo: "¿A quién le enviamos el diagnóstico?" },
  2: {
    kicker: "Bloque 2 · Cómo es hoy",
    titulo: "Describe el proceso como ocurre en la realidad, no como está documentado.",
    ayuda:
      "Si hay atajos, grupos de WhatsApp o archivos paralelos, eso es justo lo que necesitamos saber.",
  },
  3: { kicker: "Bloque 3 · Cómo se comporta", titulo: "Cinco preguntas cortas sobre cómo se comporta el proceso." },
  4: { kicker: "Bloque 4 · A dónde quieres llegar", titulo: "Si este proceso funcionara como debería, ¿cómo se vería?" },
} as const;

export const CAMPO_NOMBRE = {
  label: "¿Cómo te llamas?",
  placeholder: "Nombre y apellido",
  min: 2,
  max: 80,
} as const;

export const CAMPO_PROCESO = {
  label: "¿Qué proceso quieres evaluar?",
  ayuda: "Un nombre corto basta.",
  placeholder: "Ej.: Agendamiento de citas",
  min: 3,
  max: 120,
} as const;

// El campo más importante del intake
export const CAMPO_AS_IS = {
  label: "¿Cómo funciona hoy, paso a paso?",
  ayuda:
    "Cuéntalo como se lo contarías a alguien que entra mañana a hacerlo. Incluye los pasos que no están en ningún manual.",
  min: 20,
  max: 1200,
} as const;

export const CAMPO_EJECUCION = {
  label: "¿Quién lo ejecuta y con qué herramientas?",
  ayuda:
    "Personas, roles y todo lo que usan — incluidos el Excel, el cuaderno y el grupo de WhatsApp.",
  min: 5,
  max: 800,
} as const;

// TO-BE — no menciona IA, automatización ni tecnología (deliberado)
export const CAMPO_TO_BE = {
  label: "Si este proceso funcionara como debería, ¿cómo se vería?",
  ayuda:
    "Descríbelo como el resultado que quieres, no como la herramienta que crees que hace falta. ¿Qué dejaría de pasar? ¿Qué podría hacer tu equipo con ese tiempo?",
  min: 10,
  max: 1000,
} as const;

// Ampliaciones opcionales del bloque 3
export const AMPLIACION = {
  senal: { label: "¿Quieres ampliar?", placeholder: "Opcional", max: 400 },
  dato: { label: "¿Quieres ampliar?", placeholder: "Opcional", max: 400 },
  intento: {
    label: "¿Se ha intentado cambiar antes?",
    ayuda: "Si probaron algo y no funcionó, eso nos dice mucho.",
    placeholder: "Opcional",
    max: 400,
  },
} as const;

// ── Preguntas del bloque 3 (texto del spec) ──
export const PREGUNTAS_B3 = {
  senal: "Cuando algo sale mal, ¿cómo te enteras?",
  dato: "¿Dónde queda registrado lo que pasa?",
  frecuencia: "¿Con qué frecuencia ocurre?",
  antiguedad: "¿Hace cuánto se hace así?",
  falla: "Cuando el proceso falla, ¿qué pasa?",
} as const;

// ── Opciones cerradas (discriminadores) ──
// TODO(mockup): los subtítulos explicativos de cada opción vienen del mockup
// yetibi-formulario-mockup.html — pendientes de recibirlo.

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
  { value: "varias_veces_semana", label: "Algunas veces por semana" },
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

// ── Etiquetas legibles (FIX 4): la clave viaja a Supabase/motor; el correo
// interno muestra la etiqueta que vio el usuario. ──
export function etiquetasLegibles(v: {
  senal: string | null;
  dato: string | null;
  frecuencia: string | null;
  antiguedad: string | null;
  falla: string | null;
  sector: string;
}) {
  const de = (opts: readonly { value: string; label: string }[], val: string | null) =>
    opts.find((o) => o.value === val)?.label ?? val ?? "";
  return {
    senal: de(SENAL_OPTIONS, v.senal),
    dato: de(DATO_OPTIONS, v.dato),
    frecuencia: de(FRECUENCIA_OPTIONS, v.frecuencia),
    antiguedad: de(ANTIGUEDAD_OPTIONS, v.antiguedad),
    falla: de(FALLA_OPTIONS, v.falla),
    sector: de(SECTORS, v.sector || null),
  };
}
