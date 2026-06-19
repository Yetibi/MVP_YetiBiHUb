import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData, DiagnosticoResult } from "@/types/diagnostico";

const MODEL = "claude-sonnet-4-6";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function evaluarSuficiencia(data: IntakeData): {
  nivel: "rica" | "intermedia" | "pobre";
  score: number;
} {
  let score = 0;

  if (data.dolor_declarado && data.dolor_declarado.trim().length > 20) score += 2;
  if (data.to_be_objetivo && data.to_be_objetivo.trim().length > 20) score += 2;
  if (data.to_be_nivel !== null) score += 1;
  if (data.tecnologia_visible && data.tecnologia_visible.trim().length > 0) score += 1;
  if (data.metrica_declarada && data.metrica_declarada.trim().length > 0) score += 1;
  if (data.respuestas_capacidad.painDetail && data.respuestas_capacidad.painDetail.trim().length > 20) score += 1;
  if (data.respuestas_capacidad.capacityQ1 && data.respuestas_capacidad.capacityQ1.trim().length > 10) score += 1;
  if (data.respuestas_capacidad.capacityQ2 && data.respuestas_capacidad.capacityQ2.trim().length > 10) score += 1;
  if (data.respuestas_capacidad.capacityQ3 && data.respuestas_capacidad.capacityQ3.trim().length > 10) score += 1;

  const nivel = score >= 8 ? "rica" : score >= 5 ? "intermedia" : "pobre";
  return { nivel, score };
}

function buildPrompt(data: IntakeData, suficiencia: { nivel: string; score: number }): string {
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

SUFICIENCIA DE EVIDENCIA PRE-CALCULADA:
- Nivel: ${suficiencia.nivel} (score: ${suficiencia.score}/11)

Genera ÚNICAMENTE un objeto JSON válido (sin markdown, sin texto extra) con esta estructura exacta:
{
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
  const { nivel, score } = evaluarSuficiencia(data);

  const suficienciaRazon =
    nivel === "rica"
      ? "El intake contiene datos detallados en dolor, objetivo, métricas y respuestas de capacidad."
      : nivel === "intermedia"
      ? "El intake tiene información básica pero faltan métricas o detalles de capacidad."
      : "El intake carece de detalle suficiente para un diagnóstico preciso; se estimarán rangos amplios.";

  const prompt = buildPrompt(data, { nivel, score });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = (message.content[0] as { type: string; text: string }).text.trim();

  // Claude a veces envuelve el JSON en ```json ... ``` — lo extraemos
  const jsonText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();

  let claudeResult: Omit<DiagnosticoResult, "suficiencia">;
  try {
    claudeResult = JSON.parse(jsonText);
  } catch {
    throw new Error(`Claude no devolvió JSON válido. Respuesta cruda:\n${rawText}`);
  }

  return {
    suficiencia: { nivel, score, razon: suficienciaRazon },
    ...claudeResult,
  };
}
