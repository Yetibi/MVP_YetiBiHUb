// ─── Diagnóstico de Aptitud del Proceso para IA · v1.0 ───────────────────────
// Contrato del nuevo instrumento. El modelo NO clasifica: la patología la
// asigna el motor determinista (lib/clasificador.ts) sobre estos campos
// cerrados; el modelo solo redacta el veredicto (lib/redactor-engine.ts).

// ── Campos cerrados (discriminadores) ──

export type Senal = "queja" | "cabeza" | "registro_muerto" | "indicadores";

export type Dato = "no_existe" | "suelta" | "dispersa" | "unica";

export type Frecuencia =
  | "varias_veces_dia"
  | "diario"
  | "varias_veces_semana"
  | "semanal"
  | "mensual_o_menos";

export type Antiguedad = "reciente" | "hace_anios" | "fosil" | "nunca";

export type Falla = "cada_quien" | "tarde" | "repetido" | "cliente" | "controlado";

// ── El intake del instrumento ──

export interface IntakeAptitud {
  proceso: string;        // libre · nombre corto del proceso
  as_is: string;          // libre · cómo funciona hoy, paso a paso (el AS-IS)
  ejecucion: string;      // libre · quién lo ejecuta y con qué
  senal: Senal;           // discriminador
  senal_detalle?: string | null; // ampliación opcional
  dato: Dato;             // discriminador principal
  dato_detalle?: string | null;  // ampliación opcional
  frecuencia: Frecuencia; // pondera redacción, no clasifica
  antiguedad: Antiguedad; // discriminador
  intento_previo?: string | null; // ¿se ha intentado cambiar antes? (opcional)
  falla: Falla;           // discriminador
  to_be: string;          // libre · cómo se vería si funcionara (el TO-BE) — el gancho
  email: string;
  nombre?: string | null;
  sector?: string | null; // opcional, solo contexto
}

// ── Clasificación (salida del motor determinista) ──

export type Patologia =
  | "inercia_activa"
  | "ghost_data"
  | "patchwork"
  | "variabilidad_artesanal"
  | "fuga_de_decision";

export type Severidad = "alta" | "media" | "baja";

export interface Clasificacion {
  patologia: Patologia;
  severidad: Severidad;
  cmmiEstimado: 1 | 2 | 3;
  /** Señales que no ganan pero se registran — uso interno / notificación
      a Julián. Nunca van al correo del prospecto. */
  senalesSecundarias: Patologia[];
}

// ── Veredicto (salida del redactor, validada con Zod) ──

export interface Veredicto {
  asunto: string;
  cuerpo_texto: string;
  cuerpo_html: string;
}
