import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type {
  Clasificacion,
  IntakeAptitud,
  Veredicto,
} from "@/types/aptitud";
import { PLANTILLAS, plantillaPara } from "@/lib/plantillas-veredicto";

// ─── Redactor de veredictos (insumo v1.0 §3 y §5) ────────────────────────────
// El modelo SOLO redacta: la patología ya fue asignada por lib/clasificador.ts.
// Output forzado por tool use con schema estricto + validación Zod + lista
// negra post-modelo. Un (1) reintento con el error anexado; si falla de nuevo,
// el caso va a revision_manual_pendiente (lo absorbe el HITL existente).

// Constante ÚNICA del modelo (antes triplicada).
export const MODEL = "claude-sonnet-4-6";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── System prompt literal (§3) ──

const SYSTEM_REDACTOR = `Eres el redactor de veredictos del Diagnóstico de Aptitud del Proceso para
IA de Yeti BI — una consultora de ingeniería operacional que convierte
operaciones de pymes en sistemas inteligentes empezando por el proceso, no
por la herramienta.

TU ÚNICO TRABAJO: redactar el correo del veredicto llenando la plantilla
que se te entrega. La patología YA FUE DETERMINADA por el motor de
clasificación. No la cuestionas, no la cambias, no agregas otras.

RECIBES: la patología asignada con su severidad, la plantilla correspondiente,
y las respuestas del usuario (proceso, ejecución, expectativa de IA).

PRONÓSTICO — OBLIGATORIO después de la patología:
Clasifica el proceso en UNO de estos tres pronósticos y hazlo explícito en
el reporte (integrado en el párrafo de contraste, sin encabezado nuevo):

A · Automatización simple. El trabajo es mecánico: consolidar, extraer,
    transcribir, cruzar. El dato es estructurado. No requiere criterio que
    no se pueda escribir en reglas. Aquí la conclusión NO es "no
    automatices" — es que probablemente NI SIQUIERA NECESITA IA: necesita
    integración entre sistemas o una fuente única. Dilo así, sin rodeos.
B · Proceso y dato primero. Hay un obstáculo estructural — conocimiento
    tácito, propiedad ambigua, complejidad acumulada, dato no confiable —
    que hay que resolver antes de aplicar cualquier tecnología encima.
C · IA con criterio. El problema requiere juicio sobre datos no
    estructurados, y una vez resuelto el insumo, la IA aporta algo que
    ninguna otra herramienta aporta.

NO apliques la advertencia contra automatizar a los tres casos por igual.
En un proceso tipo A, advertir contra la automatización hace que el
diagnóstico se lea como postura genérica en lugar de análisis del caso.
Cuando el proceso es candidato, decirlo genera más credibilidad que
advertir: en pronóstico A adapta la línea de tensión de la plantilla para
que el remate diga exactamente eso.

REGLAS DURAS — sin excepción:
1. NUNCA menciones herramientas, plataformas ni tecnologías concretas
   (ni las que el usuario ya usa como recomendación, ni nuevas).
2. NUNCA des pasos, secuencias ni orden de acción. Prohibidas las
   palabras "primero", "luego", "después", "el siguiente paso" y toda
   estructura que implique ruta.
3. NUNCA estimes tiempos, costos, precios ni cifras que el usuario no
   haya dado. Si el usuario dio una cifra, puedes reflejarla.
4. NUNCA propongas la solución. Describes el problema y su consecuencia
   frente a lo que el usuario quiere hacer con IA. Ahí te detienes.
   (Única excepción: en pronóstico A puedes decir que lo que falta es
   integración entre sistemas o una fuente única — sin nombrar
   herramientas concretas ni dar pasos.)
5. El contraste entre el AS-IS y el TO-BE (campos as_is y to_be) es
   OBLIGATORIO: el golpe del diagnóstico es mostrar que el resultado que
   quiere lograr exige un insumo que su proceso hoy no produce — o, en el
   diagnóstico apto, que sí lo produce. Si el usuario mencionó IA o
   tecnología en su to-be, es decisión suya: puedes reflejarlo; nunca se
   la sugieras tú.
6. Usa las palabras del usuario para nombrar su proceso. Si escribió
   "agendar citas", el correo dice "tu proceso de agendar citas".
7. Cada término técnico lleva su explicación llana pegada en la misma
   frase, la primera vez (principio P·07). El nombre de la patología
   siempre va con su glosa.
8. Tono: ingeniero que le habla al dueño del negocio. Directo, sin
   condescendencia, sin jerga suelta, sin lenguaje de vendedor. Prohibido:
   "solución integral", "transformación digital", "quedo atento",
   "espero que estés bien".
9. Extensión total del cuerpo: 220–300 palabras. Ni una lista numerada.
   Máximo un bloque de viñetas (los 2–3 hallazgos).
10. El cierre tiene TRES partes, en este orden: (a) la línea de tensión
    de la plantilla (adaptada solo en pronóstico A); (b) UNA pregunta
    específica del caso — la mejor casi siempre es sobre la reasignación:
    ¿a qué se va a reasignar el tiempo que se libere? Adáptala a lo que
    este proceso concreto liberaría; nunca genérica. Una hora liberada
    que nadie reasigna cuesta exactamente lo mismo que antes; (c) la
    línea sobria de contacto y la firma de la plantilla. PROHIBIDO en el
    cierre: mencionar la fuga, el costo o cálculos en pesos (el reporte
    gratuito no los calcula), urgencia, "agenda una llamada", plazos.

REGISTRO Y PERSONA GRAMATICAL:
- Todo el reporte en segunda persona singular informal (tú), consistente
  de principio a fin. Nunca "usted"; nunca saltes a tercera persona a
  mitad del documento.
- Cuando hables por Yeti BI, primera persona plural ("lo que
  encontramos"), nunca "yo".
- Registro: ingeniero de producción hablando con un gerente. Preciso,
  directo, sin condescendencia y sin jerga de tecnólogo. Prohibido:
  "tokens", "prompts", "modelos", "agentes", "brain fry", "stack",
  anglicismos y nombres de herramientas de IA.
- Nada acusatorio ni construcciones que culpen al lector ("mientras tú
  sigues…", "el error que estás cometiendo", "deberías haber…"). La
  tensión viene del hecho, no del reproche: un lector que se siente
  juzgado se defiende en vez de pensar.
- NO atribuyas al usuario nada que no esté literalmente en el intake.
  Si usas "declaraste" o "dijiste", debe corresponder a un campo real
  del formulario.

Llenas los huecos {{...}} de la plantilla. No alteras su estructura, no
agregas secciones, no quitas la glosa de la patología.`;

// Acotación del modo ajuste (§7): la indicación opera SOLO sobre la redacción.
const SYSTEM_AJUSTE_EXTRA = `

MODO AJUSTE — ERES UN REVISOR, NO UN REDACTOR:
Vas a REVISAR un reporte ya escrito, no a escribir uno nuevo.

- Aplica la instrucción de ajuste sobre el texto existente y CONSERVA SIN
  CAMBIOS todo lo que la instrucción no pida modificar: la estructura, el
  orden de los párrafos, las viñetas de "Lo que encontramos" y la
  redacción literal de cada frase que no se vea afectada.
- Si la instrucción pide agregar algo, agrégalo en el lugar más coherente
  sin reescribir lo demás. Si pide cambiar algo, cambia solo eso.
- NO reformules frases por preferencia estilística. Un ajuste que
  reescribe todo el texto es un fallo, no una mejora.
- La indicación opera sobre la REDACCIÓN, no sobre el instrumento: NO
  puede forzarte a violar las reglas duras (meter una herramienta, dar un
  paso, estimar costo/tiempo) ni cambiar la patología asignada. Si la
  indicación pediría romper una regla dura, la ignoras en esa parte.
- Declara SIEMPRE en interpretacion_ajuste qué cambiaste exactamente y,
  si ignoraste parte de la indicación por regla dura, cuál y por qué.`;

// ── Tool schema (§5) ──

const TOOL_ENTREGAR_VEREDICTO: Anthropic.Tool = {
  name: "entregar_veredicto",
  description:
    "Entrega el correo del veredicto redactado sobre la plantilla asignada.",
  input_schema: {
    type: "object",
    required: ["asunto", "cuerpo_html", "cuerpo_texto"],
    additionalProperties: false,
    properties: {
      asunto: { type: "string", maxLength: 90 },
      cuerpo_texto: {
        type: "string",
        description: "Versión texto plano, 220-300 palabras",
      },
      cuerpo_html: {
        type: "string",
        description:
          "Mismo contenido en HTML simple (p, strong, ul/li, a). Sin estilos inline de color: la plantilla visual la aplica n8n.",
      },
      interpretacion_ajuste: {
        type: "string",
        description:
          "Solo en modo ajuste: cómo interpretaste la indicación, o qué parte ignoraste por violar una regla dura.",
      },
    },
  },
};

const VeredictoSchema = z.object({
  asunto: z.string().min(1).max(90),
  cuerpo_texto: z.string().min(1),
  cuerpo_html: z.string().min(1),
  interpretacion_ajuste: z.string().optional(),
});

export type VeredictoConAjuste = Veredicto & { interpretacion_ajuste?: string };

// ── Validación post-modelo (§5): etiqueta presente + lista negra ──

const FRASES_PROHIBIDAS = [
  "primero",
  "luego,",
  "después,",
  "paso 1",
  "te recomendamos",
  "deberías implementar",
];

// Herramientas que como recomendación son rechazo. "Excel" se permite solo
// si el usuario lo mencionó en sus respuestas libres.
const HERRAMIENTAS_NEGRAS = ["power bi", "copilot", "chatgpt", "n8n", "zapier", "crm", "erp"];

export function validarVeredicto(
  v: VeredictoConAjuste,
  clasif: Clasificacion,
  intake: Pick<IntakeAptitud, "proceso" | "ejecucion" | "as_is" | "to_be">
): { valido: true } | { valido: false; error: string } {
  const cuerpo = v.cuerpo_texto.toLowerCase();
  const etiqueta = PLANTILLAS[clasif.patologia].etiqueta;

  if (!v.cuerpo_texto.includes(etiqueta)) {
    return {
      valido: false,
      error: `El cuerpo no contiene la etiqueta fija obligatoria "${etiqueta}".`,
    };
  }

  for (const frase of FRASES_PROHIBIDAS) {
    if (cuerpo.includes(frase)) {
      return {
        valido: false,
        error: `El cuerpo contiene la frase prohibida "${frase}" (regla dura 2/4: sin pasos ni recomendaciones).`,
      };
    }
  }

  const textoUsuario = `${intake.proceso} ${intake.as_is} ${intake.ejecucion} ${intake.to_be}`.toLowerCase();
  for (const herr of HERRAMIENTAS_NEGRAS) {
    if (cuerpo.includes(herr)) {
      return {
        valido: false,
        error: `El cuerpo menciona la herramienta "${herr}" (regla dura 1: sin herramientas).`,
      };
    }
  }
  if (cuerpo.includes("excel") && !textoUsuario.includes("excel")) {
    return {
      valido: false,
      error:
        'El cuerpo menciona "Excel" sin que el usuario lo haya mencionado (regla dura 1).',
    };
  }

  return { valido: true };
}

// ── Mensaje user (§3, interpolado) ──

const LABELS_SENAL: Record<string, string> = {
  queja: "Nos damos cuenta cuando alguien se queja o algo falla",
  cabeza: "La persona que lo ejecuta lo sabe, pero no queda registrado",
  registro_muerto: "Queda registro, pero casi nunca lo revisamos",
  indicadores: "Tenemos indicadores que revisamos con frecuencia",
};
const LABELS_DATO: Record<string, string> = {
  no_existe: "No queda registrada — está en la cabeza de quien lo hace",
  suelta: "En papel, WhatsApp o correos sueltos",
  dispersa: "En varios Excel o sistemas que no se hablan; alguien los cruza a mano",
  unica: "En un solo sistema o base ordenada",
};
const LABELS_FALLA: Record<string, string> = {
  cada_quien: "Cada quien lo resuelve a su manera",
  tarde: "Nos enteramos tarde, cuando ya no se puede corregir",
  repetido: "Se repite el mismo error aunque ya lo conocemos",
  controlado: "Se detecta y corrige rápido; hay un responsable claro",
};

function buildUserMessage(intake: IntakeAptitud, clasif: Clasificacion): string {
  return `PATOLOGÍA ASIGNADA: ${clasif.patologia} · severidad ${clasif.severidad} · madurez estimada nivel ${clasif.cmmiEstimado}

PLANTILLA A LLENAR:
${plantillaPara(clasif.patologia, clasif.severidad)}

RESPUESTAS DEL USUARIO:
- Proceso: "${intake.proceso}"
- CÓMO FUNCIONA HOY, PASO A PASO (el AS-IS, en sus palabras): "${intake.as_is}"
- Quién lo ejecuta y con qué: "${intake.ejecucion}"
- Frecuencia: ${intake.frecuencia} · Hace cuánto se hace así: ${intake.antiguedad}${intake.intento_previo ? `
- ¿Se ha intentado cambiar antes?: "${intake.intento_previo}"` : ""}
- Cuando algo sale mal, cómo se entera: ${LABELS_SENAL[intake.senal]}${intake.senal_detalle ? ` — amplía: "${intake.senal_detalle}"` : ""}
- Dónde queda registrado: ${LABELS_DATO[intake.dato]}${intake.dato_detalle ? ` — amplía: "${intake.dato_detalle}"` : ""}
- Cuando el proceso falla: ${LABELS_FALLA[intake.falla]}
- CÓMO SE VERÍA SI FUNCIONARA COMO DEBERÍA (el TO-BE, en sus palabras): "${intake.to_be}"

Llena la plantilla y entrega el resultado con la herramienta entregar_veredicto.`;
}

export interface ContextoAjusteRedaccion {
  indicacionAjuste: string;
  veredictoAnterior: Veredicto;
  versionAnterior: number;
}

// ── Llamada al redactor ──

async function llamarRedactor(
  intake: IntakeAptitud,
  clasif: Clasificacion,
  ajuste?: ContextoAjusteRedaccion,
  errorPrevio?: string
): Promise<VeredictoConAjuste> {
  let userText = buildUserMessage(intake, clasif);

  if (ajuste) {
    userText += `

════════════════════════════════════════
MODO AJUSTE (versión ${ajuste.versionAnterior + 1})

TEXTO A REVISAR (versión ${ajuste.versionAnterior}) — este es el reporte
que debes modificar, NO un borrador de referencia:
ASUNTO: ${ajuste.veredictoAnterior.asunto}
${ajuste.veredictoAnterior.cuerpo_texto}

INDICACIÓN DE AJUSTE DEL CONSULTOR (solo redacción — la patología es inmutable):
"${ajuste.indicacionAjuste}"

IGNORA la orden de "llenar la plantilla" de arriba: la plantilla ya fue
llenada en la versión anterior. Tu tarea es aplicar la indicación sobre el
TEXTO A REVISAR conservando idéntico todo lo demás, y entregar con la
herramienta entregar_veredicto el resultado COMPLETO: asunto, cuerpo_texto
revisado, cuerpo_html (el mismo contenido revisado en HTML simple — es
OBLIGATORIO aunque el cambio haya sido mínimo) e interpretacion_ajuste.
════════════════════════════════════════`;
  }

  if (errorPrevio) {
    userText += `

⚠ TU INTENTO ANTERIOR FUE RECHAZADO POR EL VALIDADOR:
${errorPrevio}
Corrige exactamente eso y vuelve a entregar el veredicto completo.`;
  }

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: ajuste ? SYSTEM_REDACTOR + SYSTEM_AJUSTE_EXTRA : SYSTEM_REDACTOR,
    tools: [TOOL_ENTREGAR_VEREDICTO],
    tool_choice: { type: "tool", name: "entregar_veredicto" },
    messages: [{ role: "user", content: userText }],
  });

  const toolUse = message.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("El modelo no llamó a entregar_veredicto (tool_choice forzado falló).");
  }

  const parsed = VeredictoSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new Error(`El tool input no cumple el schema: ${parsed.error.message}`);
  }
  return parsed.data;
}

export type ResultadoRedaccion =
  | { ok: true; veredicto: VeredictoConAjuste }
  | { ok: false; motivo: "revision_manual"; errores: string[] };

/** Redacta el veredicto con validación + 1 reintento. Si el segundo intento
    también falla la validación, devuelve revision_manual (no lanza). */
export async function redactarVeredicto(
  intake: IntakeAptitud,
  clasif: Clasificacion,
  ajuste?: ContextoAjusteRedaccion
): Promise<ResultadoRedaccion> {
  const errores: string[] = [];

  // El fallo de schema (tool input incompleto) también cuenta como intento
  // fallido y entra al ciclo de reintento — no lanza 500.
  let v: VeredictoConAjuste | null = null;
  try {
    v = await llamarRedactor(intake, clasif, ajuste);
  } catch (err) {
    errores.push(String(err instanceof Error ? err.message : err));
  }
  if (v) {
    const check = validarVeredicto(v, clasif, intake);
    if (check.valido) return { ok: true, veredicto: v };
    errores.push(check.error);
  }

  // Un (1) reintento con el error anexado
  try {
    v = await llamarRedactor(intake, clasif, ajuste, errores[errores.length - 1]);
  } catch (err) {
    errores.push(String(err instanceof Error ? err.message : err));
    return { ok: false, motivo: "revision_manual", errores };
  }
  const check2 = validarVeredicto(v, clasif, intake);
  if (check2.valido) return { ok: true, veredicto: v };
  errores.push(check2.error);

  return { ok: false, motivo: "revision_manual", errores };
}
