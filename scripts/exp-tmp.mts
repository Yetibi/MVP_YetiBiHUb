// ¿La longitud la impone el esqueleto o el material? Comparo el caso rico
// con instrucciones de compresión cada vez más explícitas en el user message.
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { clasificar } from "../lib/clasificador";
import { buildUserMessage, MODEL, palabrasLibres } from "../lib/redactor-engine";
import { PLANTILLAS } from "../lib/plantillas-veredicto";
import type { IntakeAptitud } from "../types/aptitud";
const env = readFileSync(".env.local","utf-8");
const key = env.split("\n").find(l=>l.startsWith("ANTHROPIC_API_KEY"))!.split("=").slice(1).join("=").trim();
const sys = readFileSync("lib/redactor-engine.ts","utf-8").split("const SYSTEM_REDACTOR = `")[1].split("`;")[0];
const c = new Anthropic({ apiKey: key });
const intake = JSON.parse(readFileSync("/tmp/intake-prov.json","utf-8")) as IntakeAptitud;
const clasif = clasificar(intake);
const pl = PLANTILLAS[clasif.patologia];
const tool = { name:"entregar_veredicto", description:"x", input_schema:{ type:"object" as const, required:["asunto","cuerpo_html","cuerpo_texto"], properties:{ asunto:{type:"string",maxLength:90}, cuerpo_texto:{type:"string"}, cuerpo_html:{type:"string"} } } };
const base = buildUserMessage(intake, clasif);
const variantes: [string,string][] = [
  ["sin refuerzo", ""],
  ["límite por frases", "\n\nLÍMITE ESTRICTO DE COMPOSICIÓN: la lectura de hoy máximo 3 frases; CADA viñeta máximo 2 frases; el contraste máximo 3 frases; la distancia máximo 3 frases. Cuenta las frases antes de entregar. Un bloque que se pase es un fallo."],
];
for (const [nombre, extra] of variantes) {
  const r = await c.messages.create({ model: MODEL, max_tokens: 2500, system: sys, tools:[tool as never], tool_choice:{type:"tool",name:"entregar_veredicto"}, messages:[{role:"user",content: base + extra}] });
  const tu = r.content.find(b=>b.type==="tool_use") as { input: { cuerpo_texto: string } };
  const t = tu.input.cuerpo_texto;
  console.log(`${nombre.padEnd(22)} → ${palabrasLibres(t, `${pl.etiqueta} — ${pl.glosa}`)} palabras libres · viñetas ${(t.match(/^\s*[•-]\s/gm)||[]).length}`);
}
