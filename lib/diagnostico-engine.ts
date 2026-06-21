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
(versión ${ctx.versionAnterior}) que fue revisada por el consultor responsable,
quien dejó la siguiente indicación de ajuste:

INDICACIÓN DE AJUSTE:
"${ctx.indicacionAjuste}"

DIAGNÓSTICO ANTERIOR (versión ${ctx.versionAnterior}) — referencia para el ajuste:
${JSON.stringify(ctx.diagnosticoAnterior, null, 2)}

INSTRUCCIÓN:
Genera una nueva versión del diagnóstico incorporando explícitamente el
feedback anterior. No ignores el trabajo previo — toma como base lo que
ya estaba bien, y ajusta específicamente lo que la indicación señala.
Si el feedback pide cambiar el enfoque de una recomendación, cámbialo.
Si pide agregar un elemento que faltaba, agrégalo. Si pide bajar el tono
en alguna sección, hazlo. El resultado debe ser coherente con el diagnóstico
anterior en lo que no fue cuestionado, y notablemente diferente en lo que sí.

Si la indicación de ajuste es ambigua o no especifica claramente
qué cambiar (por ejemplo, "hazlo más corto" sin decir qué sección
recortar, o "mejóralo" sin precisar en qué sentido), DEBES declarar
explícitamente cómo la interpretaste en un campo nuevo
"interpretacion_ajuste" dentro de tu respuesta JSON — describe en
1-2 oraciones qué entendiste de la indicación y qué decisión
tomaste al respecto. Si la indicación fue clara y no requirió
interpretación, ese campo puede decir "Indicación clara, sin
ambigüedad relevante".

`;
}

function buildContent(
  data: IntakeData,
  documentos?: DocumentoPreparado[],
  contextoAjuste?: ContextoAjuste
): string | Anthropic.MessageParam["content"] {
  const encabezado = contextoAjuste
    ? buildContextoAjusteBloque(contextoAjuste)
    : "Eres un consultor experto en mejora de procesos organizacionales. Analiza el siguiente intake de diagnóstico empresarial y genera un resultado estructurado en JSON.\n\n";

  const textoIntake = `${encabezado}DATOS DEL INTAKE:
- Perfil: ${data.perfil}
- Sector: ${data.sector}
- Alcance: ${data.alcance}
- Dolor declarado: ${data.dolor_declarado}
- Objetivo (To-Be): ${data.to_be_objetivo}
- Nivel de madurez objetivo (CMMI): ${data.to_be_nivel ?? "no especificado"}
- Tecnología visible: ${data.tecnologia_visible ?? "no especificada"}
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
  "resumen_ejecutivo": "<párrafo de 2-3 oraciones con el diagnóstico ejecutivo>"
}`;

  // Sin documentos: devuelve string simple (retrocompatible con Sub-etapa 1)
  if (!documentos || documentos.length === 0) {
    return textoIntake + textoInstrucciones;
  }

  // Con documentos: construye array de bloques de contenido
  const bloques: Anthropic.MessageParam["content"] = [];

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
      } as Anthropic.MessageParam["content"][number]);
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
    max_tokens: 2048,
    messages: [{ role: "user", content: content as Anthropic.MessageParam["content"] }],
  });

  const rawText = (message.content[0] as { type: string; text: string }).text.trim();

  // Claude a veces envuelve el JSON en ```json ... ``` — lo extraemos
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  let result: DiagnosticoResult;
  try {
    result = JSON.parse(jsonText);
  } catch {
    throw new Error(`Claude no devolvió JSON válido. Respuesta cruda:\n${rawText}`);
  }

  return result;
}
