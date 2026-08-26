import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type {
  Antiguedad,
  Clasificacion,
  Dato,
  Falla,
  Frecuencia,
  IntakeAptitud,
  Senal,
  Veredicto,
} from "@/types/aptitud";
import { PLANTILLAS, lineaTensionPara, plantillaPara } from "@/lib/plantillas-veredicto";

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
y las respuestas del usuario (proceso, cómo funciona hoy, ejecución y
lo que quiere lograr).

PRONÓSTICO — CLASIFICACIÓN INTERNA, NUNCA IMPRESA:
Clasifica internamente el proceso en UNO de estos tres pronósticos. La
clasificación NUNCA se nombra en el reporte — ni la palabra "pronóstico",
ni "tipo A/B/C", ni la letra. Gobierna CÓMO rematas; no aparece como
etiqueta ni como categoría.

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

El efecto debe verse SOLO en el remate. En un proceso A, la conclusión es
que probablemente ni siquiera necesita IA sino integración entre sistemas
o una fuente única — dilo sin rodeos: en ese caso NO copies la línea de
tensión de la plantilla; en su lugar escribe un remate propio de una o
dos frases, con el mismo tono y extensión, cuya idea sea exactamente esa:
el proceso no necesita inteligencia sino que sus sistemas se hablen o una
sola fuente, y automatizar el cruce a mano solo lo haría más rápido.
Formúlalo con tus palabras y con los detalles de este caso; no copies
esta descripción. En B y C, la línea de tensión de la plantilla se usa
tal cual y sin frases introductorias pegadas a ella.
No apliques la advertencia contra automatizar a los tres casos por igual:
en un proceso A, advertir contra la automatización hace que el
diagnóstico se lea como postura genérica en lugar de análisis del caso;
cuando el proceso es candidato, decirlo genera más credibilidad que
advertir.

CALIBRA LA PROFUNDIDAD SEGÚN LA EVIDENCIA QUE RECIBISTE.
Antes de redactar, evalúa qué tan sustancial es el insumo: la extensión y
el detalle de cómo funciona hoy, si hay ampliaciones (señal, dato, intento
previo), y qué tan específico es lo que quiere lograr.

- Evidencia RICA (relato de hoy detallado con pasos, actores y herramientas, más
  una o más ampliaciones): 280–320 palabras. Puedes nombrar tres hallazgos
  y sostener el movimiento del contraste con detalle del propio relato.
- Evidencia MEDIA (relato de hoy presente pero general, sin ampliaciones):
  190–220 palabras, dos hallazgos.
- Evidencia ESCASA (relato de hoy de una o dos frases, campos de selección casi
  solos): 140–170 palabras y dos hallazgos como máximo. Un reporte corto
  y honesto vale más que uno largo construido con inferencias.

NUNCA estires para llenar el esqueleto. Si el material no da para tres
hallazgos, entrega dos. Si no da para un párrafo de contraste extenso,
hazlo breve. Rellenar con generalidades destruye la credibilidad del
diagnóstico completo.

ESA EXTENSIÓN ES PARA EL REPORTE COMPLETO, NO POR MOVIMIENTO. Los cinco
movimientos comparten ese presupuesto: son cinco bloques BREVES, no cinco
párrafos desarrollados. Como referencia, en el tramo alto: la lectura de
dónde está hoy 2–3 frases, cada viñeta UNA a dos frases, el contraste un
párrafo corto, la distancia 2–3 frases, el remate lo que fija la
plantilla. Si al terminar te pasaste, no recortes un movimiento entero:
comprime cada uno. Una viñeta de cuatro frases es un ensayo, no un
hallazgo.

LO QUE FALTA ES UN HALLAZGO, NO UN HUECO:
Cuando el usuario no pueda darte algo —no sabe cuánto tarda, no sabe con
qué frecuencia falla, no hay registro de nada— eso es información, no una
carencia del reporte. Nómbralo como hallazgo. Por ejemplo: que no se sepa
cuántas veces al mes ocurre algo significa que el proceso no está siendo
medido, y lo que no se mide no se puede mejorar sobre evidencia.
Nunca inventes el dato faltante ni lo estimes. Nunca escribas como si lo
tuvieras.

ORDEN DE ANÁLISIS — PROPÓSITO → ACTORES → FLUJO:
Analiza el proceso en tres niveles y en este orden:
1. PROPÓSITO — ¿para qué existe este paso o este proceso? Si la respuesta
   del usuario sugiere que algo se hace "porque siempre se ha hecho así",
   ese es el hallazgo más valioso que puedes entregar.
2. ACTORES — ¿quién hace qué, y tiene sentido que lo haga esa persona?
   (Ver AUDITORÍA DE ACTORES, más abajo: es obligatoria.)
3. FLUJO — el orden de los pasos y los tiempos. Es la capa más visible y
   por eso la más intervenida, pero rara vez es donde está el problema
   real.
Si dos de los tres niveles tienen hallazgo, prioriza el más profundo:
propósito antes que actores, actores antes que flujo.

AUDITORÍA DE ACTORES — OBLIGATORIA ANTES DE REDACTAR:
Lista mentalmente cada persona que aparece en el relato del usuario y
responde por cada una:
- ¿Qué aporta que otro no podría aportar? Si solo cambia el dato de
  formato —transcribe, copia, reenvía— es un actor mal asignado.
- ¿Decide algo de verdad? Si aprueba pero nunca rechaza, ese paso existe
  por control formal, no por criterio. ESTE ES EL HALLAZGO DE MAYOR VALOR
  QUE PUEDES ENTREGAR.
- ¿Es el único que puede hacerlo? Si alguien concentra un conocimiento o
  un archivo que nadie más tiene, ahí hay un punto único de falla.
- ¿Está haciendo trabajo que no le corresponde por su rol? Un operario
  llenando papeles, un técnico persiguiendo firmas.

Si el usuario nombró TRES O MÁS actores, al menos uno de tus hallazgos
debe ser de este nivel. La mayoría de las ineficiencias viven en la
asignación de actores, no en el orden de los pasos.

DIMENSIONA LA BRECHA — TIENE MOVIMIENTO PROPIO Y ES OBLIGATORIO:
Es el movimiento 4 de la plantilla, después del párrafo de contraste y
antes del remate. NO lo mezcles con el contraste: ese párrafo dice qué
impide llegar; este dice QUÉ TAN LEJOS está. Dos o tres frases, sin
cifras, sin tiempos, sin costos. El lector debe salir sabiendo si tiene
enfrente un paso o una reconstrucción. Usa las señales del intake:
- Proceso reciente + falla controlada → está agregando un paso a algo que
  apenas empieza. Dilo: es mucho más barato que desarmar años de
  complejidad, y saberlo cambia la decisión.
- Proceso de más de cinco años + error repetido → hay complejidad
  acumulada que hay que desarmar antes de agregar nada encima.
- Si declaró un intento previo → alguien ya trató y no funcionó. Eso es
  evidencia de primera: úsala para explicar por qué el próximo intento
  necesita algo distinto.
Cuando la brecha sea corta, dilo sin rodeos. Decir que esto sí se
resuelve, y que el lugar donde ponerlo probablemente ya existe, genera
más autoridad que advertir en todos los casos.

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
5. El contraste entre COMO FUNCIONA HOY y LO QUE QUIERE LOGRAR es
   OBLIGATORIO: el golpe del diagnóstico es mostrar que el resultado que
   quiere lograr exige un insumo que su proceso hoy no produce — o, en el
   diagnóstico apto, que sí lo produce. Si el usuario mencionó IA o
   tecnología en lo que quiere lograr, es decisión suya: puedes
   reflejarlo; nunca se la sugieras tú.
6. Usa las palabras del usuario para nombrar su proceso. Si escribió
   "agendar citas", el correo dice "tu proceso de agendar citas".
7. Cada término técnico lleva su explicación llana pegada en la misma
   frase, la primera vez (principio P·07). El nombre de la patología
   siempre va con su glosa.
8. Tono: ingeniero que le habla al dueño del negocio. Directo, sin
   condescendencia, sin jerga suelta, sin lenguaje de vendedor. Prohibido:
   "solución integral", "transformación digital", "quedo atento",
   "espero que estés bien".
9. Extensión total del cuerpo: la que fije el bloque de CALIBRA LA
   PROFUNDIDAD según la evidencia recibida (140–170, 190–220 o 280–320
   palabras). Ni una lista numerada. Máximo un bloque de viñetas (los 2–3
   hallazgos, y solo los que el material sostenga).
10. El cierre tiene TRES partes, en este orden: (a) la línea de tensión
    de la plantilla (adaptada solo en pronóstico A); (b) UNA pregunta
    específica del caso — la mejor casi siempre es sobre la reasignación:
    ¿a qué se va a reasignar el tiempo que se libere? Adáptala a lo que
    este proceso concreto liberaría; nunca genérica. Una hora liberada
    que nadie reasigna cuesta exactamente lo mismo que antes; (c) la
    línea sobria de contacto y la firma de la plantilla. PROHIBIDO en el
    cierre: mencionar la fuga, el costo o cálculos en pesos (el reporte
    gratuito no los calcula), urgencia, "agenda una llamada", plazos.
11. La línea de tensión de la plantilla aparece UNA SOLA VEZ en todo el
    reporte, exclusivamente en el cierre. No la anticipes, no la
    parafrasees ni la cites dentro del cuerpo. Si la idea que expresa ya
    hace falta antes, formúlala con otras palabras y reserva la línea
    literal para el remate.
12. El nombre técnico de la patología aparece SOLO en la etiqueta fija con
    su glosa. En el resto del cuerpo no se repite: habla del hecho (el
    dato repartido, la manera de cada quien, la señal que llega tarde),
    no de la categoría.
13. NUNCA escribas "as-is", "to-be" ni ningún otro término en inglés en el
    reporte. Son nombres internos de campos, no vocabulario de cara al
    cliente. Para referirte a lo que el usuario quiere lograr, escribe
    "lo que quieres lograr", "donde quieres llegar" o "el resultado que
    buscas". Para referirte a cómo funciona hoy, "como funciona hoy" o
    "lo que describes". Prohibido cualquier anglicismo evitable:
    workflow, dashboard, insight, stack, core, pipeline, gap, feedback,
    approach.
14. VISIBILIDAD NO ES RECUPERACIÓN. Si el hallazgo es que algo no se ve
    —no hay registro, nadie se entera, el dato llega tarde— no insinúes
    que verlo lo resuelve. Ver el problema y cerrarlo son cosas
    distintas: un tablero que muestra la fuga no la detiene. (Esto no te
    autoriza a proponer el mecanismo de cierre: la regla 4 sigue
    vigente. Solo evita sugerir que la visibilidad basta.)

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
        description:
          "Versión texto plano. La extensión la fija el bloque CALIBRA LA PROFUNDIDAD del system según la evidencia del intake (140-170, 190-220 o 280-320 palabras).",
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
  // Taxonomía interna de calibración: nunca al lector (regla 12 / pronóstico).
  "pronóstico",
];

// "tipo A/B/C" con límite de palabra: "tipo asistencial" o "prototipo a" no
// deben disparar el rechazo.
const RE_TIPO_ABC = /\btipo [abc]\b/;

// Anglicismos: nombres internos de campo y jerga que no va al cliente.
// "as is"/"to be" con separadores flexibles (guion, espacio o guion bajo).
// Los nombres técnicos de patología van en NOMBRES_PATOLOGIA, no aquí.
const RE_ANGLICISMOS: { re: RegExp; termino: string }[] = [
  { re: /\bas[\s_-]is\b/, termino: "as-is" },
  { re: /\bto[\s_-]be\b/, termino: "to-be" },
  { re: /\bworkflow(s)?\b/, termino: "workflow" },
  { re: /\bdashboard(s)?\b/, termino: "dashboard" },
  { re: /\binsight(s)?\b/, termino: "insight" },
  { re: /\bpipeline(s)?\b/, termino: "pipeline" },
  { re: /\bgap(s)?\b/, termino: "gap" },
  { re: /\bfeedback\b/, termino: "feedback" },
  { re: /\bstack\b/, termino: "stack" },
  { re: /\bapproach\b/, termino: "approach" },
];

// Nombres técnicos de patología: taxonomía interna, NUNCA de cara al cliente.
// Desde que las etiquetas son lenguaje llano ("SISTEMAS QUE NO SE HABLAN"),
// ninguna los contiene, así que ya no hay excepción: se prohíben en todo el
// cuerpo. Se sigue midiendo sobre el texto sin la etiqueta ni la línea de
// tensión por si una plantilla futura vuelve a introducirlos.
const NOMBRES_PATOLOGIA = [
  "ghost data",
  "patchwork",
  "inercia activa",
  "variabilidad artesanal",
  "fuga de decisión",
];

// Herramientas que como recomendación son rechazo. "Excel" se permite solo
// si el usuario lo mencionó en sus respuestas libres.
const HERRAMIENTAS_NEGRAS = ["power bi", "copilot", "chatgpt", "n8n", "zapier", "crm", "erp"];

function contarOcurrencias(texto: string, frase: string): number {
  if (!frase) return 0;
  return texto.split(frase).length - 1;
}

/** Palabras del cuerpo, descontando el texto fijo que impone la plantilla
    (etiqueta+glosa, encabezados y firma): lo que se calibra es la redacción
    del modelo, no el boilerplate del esqueleto. */
export function palabrasLibres(cuerpo: string, etiquetaGlosa: string): number {
  let t = cuerpo;
  for (const fijo of [
    etiquetaGlosa,
    "Lo que encontramos:",
    "Responde este correo, o yetibi.com.",
    "Yeti BI · Ingeniería de procesos y datos",
  ]) {
    t = t.split(fijo).join(" ");
  }
  return t.split(/\s+/).filter(Boolean).length;
}

export function validarVeredicto(
  v: VeredictoConAjuste,
  clasif: Clasificacion,
  intake: Pick<IntakeAptitud, "proceso" | "ejecucion" | "as_is" | "to_be"> &
    Partial<Pick<IntakeAptitud, "senal_detalle" | "dato_detalle" | "intento_previo">>
): { valido: true } | { valido: false; error: string } {
  const cuerpo = v.cuerpo_texto.toLowerCase();
  const plantilla = PLANTILLAS[clasif.patologia];
  const etiqueta = plantilla.etiqueta;
  const tension = lineaTensionPara(clasif.patologia, clasif.severidad);

  if (!v.cuerpo_texto.includes(etiqueta)) {
    return {
      valido: false,
      error: `El cuerpo no contiene la etiqueta fija obligatoria "${etiqueta}".`,
    };
  }

  // Regla 9 / calibración: la extensión escala con la evidencia. Solo se
  // rechaza el exceso (un reporte más corto que el tramo es aceptable si el
  // material no daba); se descuenta el texto fijo de la plantilla y se deja
  // un 10% de tolerancia para no rebotar por dos o tres palabras.
  // Tolerancia 30% sobre el rango PEDIDO. El prompt pide ~15% menos de lo que
  // se busca (corrección del sesgo del modelo), así que el techo cae cerca del
  // objetivo real. Medición: un reporte rico con los 5 movimientos aterriza en
  // 406-443 palabras sin tope; con la instrucción de comprimir baja a ~355. El
  // techo atrapa el desborde real sin mandar a revisión manual reportes que
  // solo exceden por el movimiento nuevo.
  const ev = evaluarEvidencia(intake as IntakeAptitud);
  const libres = palabrasLibres(v.cuerpo_texto, `${etiqueta} — ${plantilla.glosa}`);
  const techo = Math.round(ev.max * 1.3);
  if (libres > techo) {
    return {
      valido: false,
      error: `El cuerpo tiene ${libres} palabras (sin contar el texto fijo de la plantilla). La evidencia de este intake es ${ev.tramo.toUpperCase()}: el máximo son ${ev.max}. Recorta a ${ev.min}–${ev.max} sin agregar inferencias — elimina desarrollo, no hechos del intake.`,
    };
  }

  // Regla 11: la línea de tensión va EXACTAMENTE una vez y en el cierre.
  // El pronóstico A es la única excepción al "exactamente una": ahí el
  // modelo escribe un remate propio, así que 0 se acepta solo si no hay
  // ninguna paráfrasis (una paráfrasis dentro del cuerpo sí es violación).
  const vecesTension = contarOcurrencias(v.cuerpo_texto, tension);
  if (vecesTension > 1) {
    return {
      valido: false,
      error: `La línea de tensión aparece ${vecesTension} veces; debe aparecer una sola vez, en el cierre (regla dura 11).`,
    };
  }
  if (vecesTension === 0) {
    // Al parafrasear, el modelo reescribe una parte de la línea y conserva
    // otra casi literal (no siempre la misma). Si CUALQUIER oración completa
    // de la línea aparece en el cuerpo, la usó sin citarla entera.
    const parafraseada = tension
      .split(/(?<=[.!?])\s+/)
      .map((f) => f.trim())
      .some((f) => f.length > 20 && v.cuerpo_texto.includes(f));
    return {
      valido: false,
      error: parafraseada
        ? `La línea de tensión está PARAFRASEADA, no citada. Debe aparecer literal, palabra por palabra, y como remate: "${tension}"`
        : `Falta la línea de tensión obligatoria. Debe cerrar el reporte, literal: "${tension}"`,
    };
  }
  // Posición: debe ser el remate. La proporción del cuerpo no sirve como
  // métrica (penaliza los reportes cortos); lo que importa es cuánto texto
  // queda DESPUÉS de la línea: por diseño del esqueleto, solo la pregunta de
  // cierre. Un párrafo entero después significa que se usó como argumento
  // dentro del contraste. 400 caracteres ≈ una pregunta larga con holgura.
  const MAX_COLA = 400;
  const cuerpoSinFirma = v.cuerpo_texto
    .split("Responde este correo")[0]
    .trimEnd();
  const posicion = cuerpoSinFirma.indexOf(tension);
  const cola = posicion >= 0 ? cuerpoSinFirma.length - (posicion + tension.length) : 0;
  if (posicion >= 0 && cola > MAX_COLA) {
    return {
      valido: false,
      error: `La línea de tensión no es el remate: quedan ${cola} caracteres de texto después de ella (solo debe seguirle la pregunta de cierre). Va al final, después del párrafo de contraste (regla dura 11).`,
    };
  }

  for (const frase of FRASES_PROHIBIDAS) {
    if (cuerpo.includes(frase)) {
      return {
        valido: false,
        error: `El cuerpo contiene la frase prohibida "${frase}" (regla dura 2/4: sin pasos ni recomendaciones; la clasificación interna no se nombra).`,
      };
    }
  }
  if (RE_TIPO_ABC.test(cuerpo)) {
    return {
      valido: false,
      error: 'El cuerpo nombra la clasificación interna ("tipo A/B/C"); el pronóstico gobierna el remate, no se imprime.',
    };
  }

  // Regla 12: nombre técnico solo en la etiqueta. Se excluyen primero la
  // etiqueta y la línea de tensión, y se busca en el resto del cuerpo.
  const cuerpoSinFijos = v.cuerpo_texto
    .split(etiqueta).join(" ")
    .split(tension).join(" ")
    .toLowerCase();

  // Regla 13: sin anglicismos. Se mide sobre el cuerpo SIN los textos fijos,
  // por la misma razón que la regla 12.
  for (const { re, termino } of RE_ANGLICISMOS) {
    if (re.test(cuerpoSinFijos)) {
      return {
        valido: false,
        error: `El cuerpo usa el anglicismo "${termino}" (regla dura 13). Escríbelo en español: "lo que quieres lograr" / "como funciona hoy" según corresponda.`,
      };
    }
  }
  for (const nombre of NOMBRES_PATOLOGIA) {
    if (cuerpoSinFijos.includes(nombre)) {
      return {
        valido: false,
        error: `El cuerpo repite el nombre técnico "${nombre}" fuera de la etiqueta con glosa (regla dura 12).`,
      };
    }
  }

  // Con límite de palabra: "erp" como subcadena rechazaba "cuerpo",
  // "interpretar" o "superpuesto"; "excel" rechazaba "excelente".
  const textoUsuario = `${intake.proceso} ${intake.as_is} ${intake.ejecucion} ${intake.to_be}`.toLowerCase();
  for (const herr of HERRAMIENTAS_NEGRAS) {
    if (new RegExp(`\\b${herr}\\b`).test(cuerpo)) {
      return {
        valido: false,
        error: `El cuerpo menciona la herramienta "${herr}" (regla dura 1: sin herramientas).`,
      };
    }
  }
  if (/\bexcel\b/.test(cuerpo) && !/\bexcel\b/.test(textoUsuario)) {
    return {
      valido: false,
      error:
        'El cuerpo menciona "Excel" sin que el usuario lo haya mencionado (regla dura 1).',
    };
  }

  return { valido: true };
}

// ── Mensaje user (§3, interpolado) ──

// Diccionarios clave → etiqueta que vio el usuario (lib/copy.ts: label + sub).
// Tipados con la unión completa: si types/aptitud.ts gana una clave y aquí
// falta, `tsc`/`next build` fallan. scripts/test-etiquetas.ts verifica además
// que coincidan con las opciones del formulario. NUNCA se inyecta la clave cruda.
export const LABELS_SENAL: Record<Senal, string> = {
  cabeza: "Alguien lo nota y avisa — depende de que una persona esté atenta",
  registro_muerto: "Aparece en un reporte o tablero — hay una revisión periódica",
  indicadores: "El sistema alerta solo — salta una alarma sin que nadie la busque",
  queja: "Nos enteramos por el cliente — cuando ya reclamó",
};
export const LABELS_DATO: Record<Dato, string> = {
  // Sin nombres de herramientas: la opción que ve el usuario dice "Excel, PDF,
  // correos, carpetas", pero inyectar esa marca aquí empujaba al modelo a
  // escribirla y luego la regla dura 1 rechazaba el veredicto.
  suelta: "En archivos sueltos — documentos, correos y carpetas, cada uno por su lado",
  dispersa: "Repartido en varias herramientas — cada una tiene su parte",
  unica: "En un sistema único — todo queda en el mismo lugar",
  no_existe: "Casi nada queda registrado — vive en la memoria y en conversaciones",
};
export const LABELS_FRECUENCIA: Record<Frecuencia, string> = {
  varias_veces_dia: "Varias veces al día",
  diario: "Todos los días",
  varias_veces_semana: "Varias veces por semana",
  semanal: "Cada semana", // clave del formulario anterior; sobrevive en filas históricas
  mensual_o_menos: "Algunas veces al mes",
};
export const LABELS_ANTIGUEDAD: Record<Antiguedad, string> = {
  reciente: "Menos de un año",
  hace_anios: "Entre uno y cinco años",
  fosil: "Más de cinco años",
  nunca: "Nunca ha cambiado desde que existe", // clave del formulario anterior
};
export const LABELS_FALLA: Record<Falla, string> = {
  repetido: "Hay que rehacer el trabajo",
  tarde: "Se descubre tarde, cuando ya no hay margen",
  cliente: "Se generan errores que llegan al cliente",
  cada_quien: "Alguien lo resuelve por fuera del proceso",
  controlado: "Se detecta y corrige rápido; hay un responsable claro", // clave del formulario anterior
};

/** Traduce una clave cerrada a su etiqueta. Una clave sin traducción (fila
    con un valor fuera del contrato) lanza en vez de imprimir "undefined";
    el error entra al ciclo de reintento y termina en revisión manual. */
export function etiquetaDe<K extends string>(
  dict: Record<K, string>,
  clave: string,
  campo: string
): string {
  const label = (dict as Record<string, string>)[clave];
  if (label === undefined) {
    throw new Error(
      `Clave "${clave}" del campo "${campo}" no tiene etiqueta en el motor (fuera del contrato del instrumento).`
    );
  }
  return label;
}

/** Tramo de evidencia del intake. Se calcula en código y se inyecta como
    instrucción explícita: dejarlo solo al criterio del modelo dentro del
    system hacía que todos los reportes salieran en el rango largo. */
export type TramoEvidencia = "rica" | "media" | "escasa";

export function evaluarEvidencia(intake: IntakeAptitud): {
  tramo: TramoEvidencia;
  min: number;
  max: number;
  hallazgos: string;
} {
  const ampliaciones = [
    intake.senal_detalle,
    intake.dato_detalle,
    intake.intento_previo,
  ].filter((v) => typeof v === "string" && v.trim().length > 0).length;
  const asIs = (intake.as_is ?? "").trim().length;
  const toBe = (intake.to_be ?? "").trim().length;

  if (asIs >= 400 && ampliaciones >= 1) {
    return { tramo: "rica", min: 280, max: 320, hallazgos: "tres" };
  }
  if (asIs < 120 && ampliaciones === 0 && toBe < 120) {
    return { tramo: "escasa", min: 140, max: 170, hallazgos: "dos como máximo" };
  }
  return { tramo: "media", min: 190, max: 220, hallazgos: "dos" };
}

export function buildUserMessage(intake: IntakeAptitud, clasif: Clasificacion): string {
  const senal = etiquetaDe(LABELS_SENAL, intake.senal, "senal");
  const dato = etiquetaDe(LABELS_DATO, intake.dato, "dato");
  const frecuencia = etiquetaDe(LABELS_FRECUENCIA, intake.frecuencia, "frecuencia");
  const antiguedad = etiquetaDe(LABELS_ANTIGUEDAD, intake.antiguedad, "antiguedad");
  const falla = etiquetaDe(LABELS_FALLA, intake.falla, "falla");

  const ev = evaluarEvidencia(intake);

  return `PATOLOGÍA ASIGNADA: ${clasif.patologia} · severidad ${clasif.severidad} · madurez estimada nivel ${clasif.cmmiEstimado}

EVIDENCIA DE ESTE INTAKE: ${ev.tramo.toUpperCase()}
→ Extensión OBLIGATORIA del cuerpo: ${ev.min}–${ev.max} palabras. Hallazgos: ${ev.hallazgos}.
${ev.tramo === "escasa"
  ? "El usuario dio muy poco material. NO estires: un reporte corto y honesto vale más que uno largo construido con inferencias. Lo que no te dijo es un hallazgo (no está medido), no un hueco que debas rellenar."
  : ev.tramo === "rica"
    ? "Hay material abundante: usa las ampliaciones que declaró, no las ignores."
    : "Material suficiente pero general: no inventes detalle que no está."}

PLANTILLA A LLENAR:
${plantillaPara(clasif.patologia, clasif.severidad)}

RESPUESTAS DEL USUARIO:
- Proceso: "${intake.proceso}"
- CÓMO FUNCIONA HOY, PASO A PASO (en sus palabras): "${intake.as_is}"
- Quién lo ejecuta y con qué: "${intake.ejecucion}"
- Frecuencia: ${frecuencia} · Hace cuánto se hace así: ${antiguedad}${intake.intento_previo ? `
- ¿Se ha intentado cambiar antes?: "${intake.intento_previo}"` : ""}
- Cuando algo sale mal, cómo se entera: ${senal}${intake.senal_detalle ? ` — amplía: "${intake.senal_detalle}"` : ""}
- Dónde queda registrado: ${dato}${intake.dato_detalle ? ` — amplía: "${intake.dato_detalle}"` : ""}
- Cuando el proceso falla: ${falla}
- CÓMO SE VERÍA SI FUNCIONARA COMO DEBERÍA — lo que quiere lograr (en sus palabras): "${intake.to_be}"

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
Corrige exactamente eso y vuelve a entregar el veredicto completo.
Al corregir, NO rompas lo que ya cumplías: sin herramientas ni marcas
(tampoco al recortar), sin "primero/luego/después" ni pasos, la línea de
tensión una sola vez y solo en el cierre, el nombre técnico de la
patología solo en la etiqueta, y cuerpo_html obligatorio.`;
  }

  const message = await client.messages.create({
    model: MODEL,
    // 2500, no 1500: el cuerpo (hasta 320 palabras) viaja DOS veces —
    // cuerpo_texto y cuerpo_html. Con 1500 el modelo se quedaba sin
    // presupuesto antes de emitir cuerpo_html y el schema fallaba con
    // "expected string, received undefined" → revisión manual.
    max_tokens: 2500,
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
