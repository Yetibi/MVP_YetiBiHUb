import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, DiagnosticoResult, ContextoAjuste } from "@/types/diagnostico";
import type { DocumentoPreparado } from "@/lib/preparar-documentos";

const MODEL = "claude-sonnet-4-6";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildContextoAjusteBloque(ctx: ContextoAjuste): string {
  return `Eres un consultor experto en mejora de procesos organizacionales.

CONTEXTO: REVISIÓN CON FEEDBACK HUMANO (versión ${ctx.versionAnterior + 1})

Este no es un diagnóstico nuevo desde cero. Ya existe una versión previa
(versión ${ctx.versionAnterior}) que fue revisada por el consultor responsable.

DIAGNÓSTICO ANTERIOR (versión ${ctx.versionAnterior}) — referencia:
${JSON.stringify(ctx.diagnosticoAnterior, null, 2)}

════════════════════════════════════════════════
INDICACIÓN DE AJUSTE DEL CONSULTOR — PRIORIDAD MÁXIMA
════════════════════════════════════════════════

"${ctx.indicacionAjuste}"

════════════════════════════════════════════════

INSTRUCCIÓN CRÍTICA:
La indicación de ajuste del consultor tiene PRIORIDAD ABSOLUTA sobre
cualquier recomendación del diagnóstico anterior. Si el consultor pide
cambiar una herramienta (por ejemplo, de Looker Studio a Power BI),
DEBES cambiarla sin cuestionar. Si pide agregar ejemplos, DEBES
agregarlos. Si pide cambiar el enfoque, DEBES cambiarlo.

El diagnóstico anterior es solo CONTEXTO — la indicación del consultor
es la ORDEN. Genera el diagnóstico ajustado incorporando explícitamente
lo que la indicación pide, manteniendo coherencia en lo que NO fue
cuestionado.

Si la indicación es ambigua, declara cómo la interpretaste en un campo
"interpretacion_ajuste" dentro de tu respuesta JSON.
`;
}

function buildContent(
  data: IntakeData,
  documentos?: DocumentoPreparado[],
  contextoAjuste?: ContextoAjuste
): string | Anthropic.MessageParam["content"] {
  const encabezado = contextoAjuste
    ? buildContextoAjusteBloque(contextoAjuste)
    : `Eres YetibiEngine, el motor de diagnóstico de Yeti BI — una consultora de ingeniería operacional
especializada en habilitar procesos para automatización e IA.

TU FILOSOFÍA DE DIAGNÓSTICO:
- Los procesos se degradan y quedan obsoletos. Antes de aplicar tecnología, hay que habilitarlos.
- La IA amplifica lo que encuentra. Si encuentra caos, lo escala. Si encuentra proceso sano, lo potencia.
- Todo proyecto que no impacte el ROI medible no cumple su propósito.
- Mides relaciones sistémicas, no eventos aislados.

TU CADENA DE VALOR (evalúa en qué punto está el cliente):
1. PROCESO habilitado → 2. DATO confiable → 3. AUTOMATIZACIÓN (70-80% de los casos) → 4. IA QUE DECIDE (15-20%, solo si se justifica) → 5. ROI MEDIBLE

REGLAS DE DIAGNÓSTICO:
- Cuantifica SIEMPRE el impacto económico de cada fuga encontrada. Si el CSV tiene datos de costos/ventas/márgenes, calcula el monto perdido.
- Diferencia entre el proceso como está DOCUMENTADO vs como se EJECUTA realmente.
- No recomiendes IA si el cliente no tiene proceso habilitado ni dato confiable. La automatización viene primero.
- Cada recomendación debe ser ejecutable por alguien sin experiencia técnica avanzada.
- Usa el framework CMMI pero tradúcelo al lenguaje del gerente de pyme: no digas "alcanzar CMMI Nivel 2", di qué significa operativamente.
- Cuantifica SIEMPRE la fuga de valor en pesos colombianos. Si el CSV tiene precio_venta, costo_producto, costo_envio, calcula: total perdido por devoluciones, total de costos de envío absorbidos sin registro, diferencia de margen entre el canal más y menos rentable. Si no hay datos suficientes para calcular, estima el rango y explica el supuesto.
- Ubica al cliente en la cadena de valor Yeti BI: ¿tiene proceso habilitado? ¿dato confiable? ¿automatización? ¿IA? Indica explícitamente en el resumen ejecutivo en qué eslabón está y cuál es el siguiente.
- El cliente puede declarar su nivel de madurez analítica objetivo (1: Descriptivo, 2: Diagnóstico, 3: Predictivo, 4: Prescriptivo). Si lo declaró, evalúa la brecha entre su estado actual (As-Is) y ese objetivo (To-Be). Si NO lo declaró (valor null o "no especificado"), TÚ debes evaluar con la evidencia disponible en qué nivel se encuentra actualmente y recomendar cuál es el siguiente nivel alcanzable de forma realista. Nunca sugieras saltar niveles — la madurez analítica es secuencial.

ESTRUCTURA DEL RESUMEN EJECUTIVO (obligatoria):
1. SITUACIÓN: qué encontraste — con datos y cifras del CSV/intake
2. FUGA DE VALOR: cuánto pierde o deja de ganar — cuantificado en pesos si hay datos
3. CAUSA RAÍZ: por qué pasa — proceso, dato o ambos
4. RUTA: qué hacer primero, segundo y tercero — concreto y secuencial
5. IMPACTO ESPERADO: qué cambia si implementa la ruta

Analiza el siguiente intake y genera un resultado estructurado en JSON.

`;

  const textoIntake = `${encabezado}DATOS DEL INTAKE:
- Perfil: ${data.perfil}
- Sector: ${data.sector}
- Alcance: ${data.alcance}
- Dolores declarados (puede haber varios, considéralos en conjunto): ${data.dolor_declarado.length > 0 ? data.dolor_declarado.join("; ") : "no especificado"}
- Objetivo (To-Be): ${data.to_be_objetivo}
- Nivel de madurez objetivo (CMMI): ${data.to_be_nivel ?? "no especificado"}
- Tecnología visible (puede haber varias): ${data.tecnologia_visible && data.tecnologia_visible.length > 0 ? data.tecnologia_visible.join("; ") : "no especificada"}
- Métrica declarada: ${data.metrica_declarada ?? "no especificada"}
- Detalle del dolor: ${data.respuestas_capacidad.painDetail ?? "no proporcionado"}
- Capacidad Q1: ${data.respuestas_capacidad.capacityQ1 ?? "no proporcionado"}
- Capacidad Q2: ${data.respuestas_capacidad.capacityQ2 ?? "no proporcionado"}
- Capacidad Q3: ${data.respuestas_capacidad.capacityQ3 ?? "no proporcionado"}`;

  const textoDocumentosIntro = documentos && documentos.length > 0
    ? `\n\nDOCUMENTOS ADJUNTOS (${documentos.length} archivo${documentos.length > 1 ? "s" : ""}):\nA continuación se incluye el contenido real de los documentos adjuntos por el cliente. Considera este contenido como evidencia adicional al texto del formulario al evaluar la suficiencia y generar el diagnóstico.`
    : "";

  // El schema JSON incluye interpretacion_ajuste solo en modo ajuste
  const campoInterpretacion = contextoAjuste
    ? `  "interpretacion_ajuste": "<cómo interpretaste la indicación y qué decidiste — o 'Indicación clara, sin ambigüedad relevante'>",\n`
    : "";

  const textoInstrucciones = `

INSTRUCCIONES:

Primero, evalúa la suficiencia de la evidencia disponible usando tu propio criterio como consultor:
- ¿El dolor declarado es específico y diagnósticable, o es tan vago que no permite análisis?
- ¿El objetivo To-Be es concreto y medible, o es aspiracional sin sustancia?
- ¿Hay métricas reales que permitan cuantificar el problema y el éxito?
- ¿Las respuestas de capacidad revelan contexto operativo real (recursos, datos, restricciones)?
- ¿Hay suficiente información para hacer recomendaciones accionables, o solo hipótesis genéricas?
${documentos && documentos.length > 0 ? "- ¿El contenido de los documentos adjuntos aporta datos concretos (métricas, procesos, tablas, registros reales)? Si aportan, eleva el score de sustancialidad en consecuencia. Si no aportan contenido legible o relevante, no los uses para inflar el score." : ""}

Evalúa esto con criterio consultivo real: un texto largo pero vago no es evidencia rica. Una frase corta pero con una métrica concreta puede ser más valiosa que un párrafo de generalidades.

Genera ÚNICAMENTE un objeto JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
${campoInterpretacion}  "suficiencia": {
    "evidencia_suficiente": <true si hay suficiente evidencia para diagnóstico accionable, false si no>,
    "score_sustancialidad": <número 0-10 que tú derives basado en la calidad y especificidad de la evidencia, no en la cantidad de campos llenos>,
    "nivel": <"rica" si score >= 7 y la evidencia permite diagnóstico preciso, "intermedia" si score 4-6 y permite hipótesis razonables, "pobre" si score <= 3 y solo permite suposiciones genéricas>,
    "razonamiento": "<explicación específica de este caso: qué evidencia concreta está presente o ausente, por qué clasificas así — nunca una frase genérica>"
  },
  "cmmi": {
    "nivel_actual_estimado": <número 1-5>,
    "nivel_objetivo": <número 1-5 o null>,
    "brecha": <número o null>,
    "descripcion": "<descripción breve del nivel actual y la brecha>"
  },
  "mudas": {
    "identificadas": [<lista de mudas: "sobreproduccion"|"espera"|"transporte"|"sobreprocesamiento"|"inventario"|"movimiento"|"defectos"|"talento_no_utilizado">],
    "descripcion": "<descripción de las mudas identificadas>"
  },
  "oportunidades": {
    "lista": ["<oportunidad 1>", "<oportunidad 2>", "<oportunidad 3>"],
    "prioridad_sugerida": "<cuál abordar primero y por qué>"
  },
  "hoja_de_ruta": [
    {
      "paso": <número secuencial empezando en 1>,
      "nombre": "<nombre corto del paso>",
      "descripcion": "<qué hacer, concreto y ejecutable>",
      "duracion_estimada": "<ej: '1 semana', '2-3 días'>",
      "prerequisito": "<nombre del paso anterior del que depende, o null si no depende de ninguno>",
      "entregable": "<qué queda listo al terminar este paso>"
    }
  ],
  "resumen_ejecutivo": "<Estructura obligatoria:
1. HALLAZGO: qué encontraste con datos y cifras concretas del CSV/intake
2. FUGA DE VALOR: cuánto pierde o deja de ganar en COP — cuantificado
3. POSICIÓN EN CADENA: en qué eslabón está (proceso/dato/automatización/IA) y cuál sigue
4. RUTA: qué hacer primero, segundo y tercero — concreto, con plazos y herramientas
5. COSTO DE INACCIÓN: qué pasa si no hace nada en los próximos 90 días>"
}`;

  // Sin documentos: devuelve string simple (retrocompatible con Sub-etapa 1)
  if (!documentos || documentos.length === 0) {
    return textoIntake + textoInstrucciones;
  }

  // Con documentos: construye array de bloques de contenido
  const bloques: Anthropic.ContentBlockParam[] = [];

  bloques.push({ type: "text", text: textoIntake + textoDocumentosIntro });

  for (const doc of documentos) {
    if (doc.tipo === "imagen") {
      bloques.push({
        type: "image",
        source: { type: "base64", media_type: doc.media_type, data: doc.base64 },
      });
      bloques.push({ type: "text", text: `[Imagen: ${doc.nombre}]` });
    } else if (doc.tipo === "pdf") {
      bloques.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: doc.base64 },
      });
      bloques.push({ type: "text", text: `[PDF: ${doc.nombre}]` });
    } else {
      bloques.push({ type: "text", text: `[Documento: ${doc.nombre}]\n${doc.contenido}` });
    }
  }

  bloques.push({ type: "text", text: textoInstrucciones });

  return bloques;
}

export async function generarDiagnostico(
  data: IntakeData,
  documentos?: DocumentoPreparado[],
  contextoAjuste?: ContextoAjuste
): Promise<DiagnosticoResult> {
  const content = buildContent(data, documentos, contextoAjuste);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    messages: [{ role: "user", content: content as Anthropic.MessageParam["content"] }],
  });

  const rawText = (message.content[0] as { type: string; text: string }).text.trim();

  // Claude a veces envuelve el JSON en ```json ... ``` — lo extraemos
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  let result: DiagnosticoResult;
  try {
    result = JSON.parse(jsonText);
  } catch {
    const truncado = message.stop_reason === "max_tokens" || !jsonText.trimEnd().endsWith("}");
    throw new Error(
      truncado
        ? `Respuesta truncada — aumentar max_tokens (stop_reason: ${message.stop_reason})`
        : `Claude no devolvió JSON válido. Respuesta cruda:\n${rawText}`
    );
  }

  return result;
}
