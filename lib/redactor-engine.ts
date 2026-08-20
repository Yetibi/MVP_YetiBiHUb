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
5. El contraste con la expectativa de IA (campo expectativa_ia) es
   OBLIGATORIO: el golpe del veredicto es mostrar que lo que quiere que
   la IA haga exige un insumo que su proceso hoy no produce — o, en el
   veredicto apto, que sí lo produce.
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
10. El cierre es SIEMPRE la línea de tensión de la plantilla, seguida de
    la invitación al contacto. Nunca cierres en oferta ni en resumen.

Llenas los huecos {{...}} de la plantilla. No alteras su estructura, no
agregas secciones, no quitas la glosa de la patología.`;

// Acotación del modo ajuste (§7): la indicación opera SOLO sobre la redacción.
const SYSTEM_AJUSTE_EXTRA = `

MODO AJUSTE — ACOTACIÓN CRÍTICA:
Recibirás además una INDICACIÓN DE AJUSTE del consultor responsable y la
redacción anterior. La indicación reescribe la REDACCIÓN, no el instrumento:
puede cambiar tono, énfasis, qué hallazgo se destaca o cómo se cita al
usuario, pero NO puede forzarte a violar las 10 reglas duras (meter una
herramienta, dar un paso, estimar costo/tiempo) ni cambiar la patología
asignada. Si la indicación pediría romper una regla dura, la ignoras en esa
parte y lo declaras en el campo interpretacion_ajuste.`;

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
  intake: Pick<IntakeAptitud, "proceso" | "ejecucion" | "expectativa_ia">
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

  const textoUsuario = `${intake.proceso} ${intake.ejecucion} ${intake.expectativa_ia}`.toLowerCase();
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
- Proceso y propósito: "${intake.proceso}"
- Quién lo ejecuta y con qué: "${intake.ejecucion}"
- Frecuencia: ${intake.frecuencia} · Última vez que cambió: ${intake.antiguedad}
- Cómo saben si sale bien: ${LABELS_SENAL[intake.senal]}
- Dónde vive el dato: ${LABELS_DATO[intake.dato]}
- Cuando algo sale mal: ${LABELS_FALLA[intake.falla]}
- Lo que quiere que la IA haga: "${intake.expectativa_ia}"

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
REDACCIÓN ANTERIOR (versión ${ajuste.versionAnterior}):
ASUNTO: ${ajuste.veredictoAnterior.asunto}
${ajuste.veredictoAnterior.cuerpo_texto}

INDICACIÓN DE AJUSTE DEL CONSULTOR (solo redacción — la patología es inmutable):
"${ajuste.indicacionAjuste}"
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

  let v = await llamarRedactor(intake, clasif, ajuste);
  let check = validarVeredicto(v, clasif, intake);
  if (check.valido) return { ok: true, veredicto: v };
  errores.push(check.error);

  // Un (1) reintento con el error anexado
  v = await llamarRedactor(intake, clasif, ajuste, check.error);
  check = validarVeredicto(v, clasif, intake);
  if (check.valido) return { ok: true, veredicto: v };
  errores.push(check.error);

  return { ok: false, motivo: "revision_manual", errores };
}
