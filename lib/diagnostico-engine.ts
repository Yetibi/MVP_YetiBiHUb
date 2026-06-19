import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, DiagnosticoResult } from "@/types/diagnostico";

const MODEL = "claude-sonnet-4-6";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildPrompt(data: IntakeData): string {
  return `Eres un consultor experto en mejora de procesos organizacionales. Analiza el siguiente intake de diagnóstico empresarial y genera un resultado estructurado en JSON.

DATOS DEL INTAKE:
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
- Capacidad Q3: ${data.respuestas_capacidad.capacityQ3 ?? "no proporcionado"}

INSTRUCCIONES:

Primero, evalúa la suficiencia de la evidencia disponible usando tu propio criterio como consultor:
- ¿El dolor declarado es específico y diagnósticable, o es tan vago que no permite análisis?
- ¿El objetivo To-Be es concreto y medible, o es aspiracional sin sustancia?
- ¿Hay métricas reales que permitan cuantificar el problema y el éxito?
- ¿Las respuestas de capacidad revelan contexto operativo real (recursos, datos, restricciones)?
- ¿Hay suficiente información para hacer recomendaciones accionables, o solo hipótesis genéricas?

Evalúa esto con criterio consultivo real: un texto largo pero vago no es evidencia rica. Una frase corta pero con una métrica concreta puede ser más valiosa que un párrafo de generalidades.

Genera ÚNICAMENTE un objeto JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
  "suficiencia": {
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
}

export async function generarDiagnostico(data: IntakeData): Promise<DiagnosticoResult> {
  const prompt = buildPrompt(data);

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
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
