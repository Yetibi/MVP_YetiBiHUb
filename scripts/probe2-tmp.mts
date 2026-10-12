// Reproduce EXACTAMENTE la llamada del motor (mismo system, misma plantilla,
// mismo user message) para ver stop_reason y qué claves entrega.
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { clasificar } from "../lib/clasificador";
import { buildUserMessage, MODEL } from "../lib/redactor-engine";
import type { IntakeAptitud } from "../types/aptitud";

const env = readFileSync(".env.local", "utf-8");
const key = env.split("\n").find(l => l.startsWith("ANTHROPIC_API_KEY"))!.split("=").slice(1).join("=").trim();
const src = readFileSync("lib/redactor-engine.ts", "utf-8");
const sys = src.split("const SYSTEM_REDACTOR = `")[1].split("`;")[0];
const c = new Anthropic({ apiKey: key });

const intake = {
  proceso: "consolidación del informe diario de despachos",
  as_is: "Cada mañana el coordinador descarga del sistema de transporte el listado de guías del día anterior, exporta del sistema de facturación las remisiones, y del WMS el listado de picking. Cruza los tres archivos en Excel con BUSCARV para armar el informe de cumplimiento de despachos por cliente y lo envía por correo a gerencia a las 9 a.m.",
  ejecucion: "El coordinador de logística. Sistema de transporte, sistema de facturación, WMS y Excel.",
  senal: "registro_muerto", dato: "dispersa",
  dato_detalle: "Cada sistema tiene su parte; ninguno tiene la foto completa del despacho.",
  frecuencia: "diario", antiguedad: "hace_anios", falla: "repetido",
  to_be: "Que el informe se arme solo y esté listo a las 7 a.m. sin que el coordinador gaste hora y media cruzando archivos.",
  email: "x@y.com",
} as IntakeAptitud;

const tool = { name: "entregar_veredicto", description: "x", input_schema: { type: "object" as const, required: ["asunto","cuerpo_html","cuerpo_texto"], properties: { asunto:{type:"string",maxLength:90}, cuerpo_texto:{type:"string"}, cuerpo_html:{type:"string"} } } };
const clasif = clasificar(intake);
for (const mt of [1500, 2500]) {
  const r = await c.messages.create({ model: MODEL, max_tokens: mt, system: sys, tools: [tool as never], tool_choice: { type:"tool", name:"entregar_veredicto" }, messages: [{ role:"user", content: buildUserMessage(intake, clasif) }] });
  const tu = r.content.find(b => b.type === "tool_use") as { input: Record<string, string> } | undefined;
  const ct = tu?.input?.cuerpo_texto ?? "";
  console.log(`max_tokens=${mt} → stop=${r.stop_reason} · output=${r.usage.output_tokens} · claves=[${tu?Object.keys(tu.input).join(","):"—"}] · palabras cuerpo_texto=${ct.split(/\s+/).filter(Boolean).length}`);
}
