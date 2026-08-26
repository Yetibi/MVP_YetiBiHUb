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
  1: { kicker: "01 · Para escribirte", titulo: "Evalúa un proceso de tu operación.",
       lead: "Ocho preguntas. Te devolvemos un diagnóstico escrito de ese proceso: qué encontramos, qué lo está frenando y qué haría falta antes de automatizarlo.",
       nota: "Responde pensando en un solo proceso concreto. Entre más específico, más útil el diagnóstico." },
  2: { kicker: "02 · Cómo es hoy",
       desc: "Describe el proceso como ocurre en la realidad, no como está documentado. Si hay atajos, grupos de WhatsApp o archivos paralelos, eso es justo lo que necesitamos saber." },
  3: { kicker: "03 · Cómo se comporta", desc: "Cinco preguntas rápidas sobre el pulso del proceso." },
  4: { kicker: "04 · A dónde quieres llegar", desc: "La última, y la más importante." },
} as const;

export const CAMPO_NOMBRE = {
  label: "¿Cómo te llamas?",
  placeholder: "Nombre y apellido",
  min: 2,
  max: 80,
} as const;

export const CAMPO_CORREO = { label: "¿A qué correo enviamos el diagnóstico?", placeholder: "tu@empresa.com" } as const;
export const CAMPO_SECTOR = { label: "¿En qué sector opera tu empresa?", placeholder: "Selecciona una opción" } as const;

export const CAMPO_PROCESO = {
  label: "¿Qué proceso quieres evaluar?",
  ayuda: "Un nombre corto basta.",
  placeholder: "Ej: agendamiento de citas, cotización de pedidos, cierre de inventario",
  min: 3,
  max: 120,
} as const;

// El campo más importante del intake
export const CAMPO_AS_IS = {
  label: "¿Cómo funciona hoy, paso a paso?",
  ayuda:
    "Cuéntalo como se lo contarías a alguien que entra mañana a hacerlo. Incluye los pasos que no están en ningún manual.",
  placeholder: "Empieza por lo que dispara el proceso y sigue hasta que termina…",
  min: 20,
  max: 1200,
} as const;

export const CAMPO_EJECUCION = {
  label: "¿Quién lo ejecuta y con qué herramientas?",
  ayuda:
    "Personas, roles y todo lo que usan — incluidos el Excel, el cuaderno y el grupo de WhatsApp.",
  placeholder: "Ej: la recepcionista agenda en un Excel compartido y también en una agenda de papel…",
  min: 5,
  max: 800,
} as const;

// TO-BE — no menciona IA, automatización ni tecnología (deliberado)
export const CAMPO_TO_BE = {
  label: "Si este proceso funcionara como debería, ¿cómo se vería?",
  ayuda:
    "Descríbelo como el resultado que quieres, no como la herramienta que crees que hace falta. ¿Qué dejaría de pasar? ¿Qué podría hacer tu equipo con ese tiempo?",
  placeholder: "Ej: que la información llegue antes de que haya que decidir, que nadie tenga que rehacer nada, que el equipo deje de estar pendiente de esto…",
  min: 10,
  max: 1000,
} as const;

// Ampliaciones opcionales del bloque 3
export const AMPLIACION = {
  senal: { label: "¿Quieres ampliar?", placeholder: "Cuéntanos el matiz, si tu caso no encaja del todo en ninguna.", max: 400 },
  dato: { label: "¿Quieres ampliar?", placeholder: "Si hay más de un caso, o si depende del día, dínoslo aquí.", max: 400 },
  intento: { label: "¿Se ha intentado cambiar antes?", placeholder: "Si probaron algo y no funcionó, eso nos dice mucho.", max: 400 },
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
// Opciones y subtítulos: yetibi-formulario-mockup.html (fuente de verdad).
// Las claves son las del motor; nunca renombrar sin migrar el clasificador.

export const SENAL_OPTIONS: { value: Senal; label: string; sub?: string }[] = [
  { value: "cabeza", label: "Alguien lo nota y avisa", sub: "Depende de que una persona esté atenta" },
  { value: "registro_muerto", label: "Aparece en un reporte o tablero", sub: "Hay una revisión periódica" },
  { value: "indicadores", label: "El sistema alerta solo", sub: "Salta una alarma sin que nadie la busque" },
  { value: "queja", label: "Nos enteramos por el cliente", sub: "Cuando ya reclamó" },
];

export const DATO_OPTIONS: { value: Dato; label: string; sub?: string }[] = [
  { value: "suelta", label: "En archivos sueltos", sub: "Excel, PDF, correos, carpetas" },
  { value: "dispersa", label: "Repartido en varias herramientas", sub: "Cada una tiene su parte" },
  { value: "unica", label: "En un sistema único", sub: "Todo queda en el mismo lugar" },
  { value: "no_existe", label: "Casi nada queda registrado", sub: "Vive en la memoria y en conversaciones" },
];

export const FRECUENCIA_OPTIONS: { value: Frecuencia; label: string; sub?: string }[] = [
  { value: "varias_veces_dia", label: "Varias veces al día" },
  { value: "diario", label: "Todos los días" },
  { value: "varias_veces_semana", label: "Varias veces por semana" },
  { value: "mensual_o_menos", label: "Algunas veces al mes" },
];

export const ANTIGUEDAD_OPTIONS: { value: Antiguedad; label: string; sub?: string }[] = [
  { value: "reciente", label: "Menos de un año" },
  { value: "hace_anios", label: "Entre uno y cinco años" },
  { value: "fosil", label: "Más de cinco años" },
];

export const FALLA_OPTIONS: { value: Falla; label: string; sub?: string }[] = [
  { value: "repetido", label: "Hay que rehacer el trabajo" },
  { value: "tarde", label: "Se descubre tarde, cuando ya no hay margen" },
  { value: "cliente", label: "Se generan errores que llegan al cliente" },
  { value: "cada_quien", label: "Alguien lo resuelve por fuera del proceso" },
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
