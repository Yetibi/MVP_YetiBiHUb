// ¿Cuánto mide realmente un reporte RICO bien hecho con 5 movimientos?
// Se desactiva el tope pidiendo la redacción sin validar longitud.
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
const tool = { name:"entregar_veredicto", description:"x", input_schema:{ type:"object" as const, required:["asunto","cuerpo_html","cuerpo_texto"], properties:{ asunto:{type:"string",maxLength:90}, cuerpo_texto:{type:"string"}, cuerpo_html:{type:"string"} } } };
const largos: number[] = [];
for (let i=0;i<3;i++){
  const r = await c.messages.create({ model: MODEL, max_tokens: 2500, system: sys, tools:[tool as never], tool_choice:{type:"tool",name:"entregar_veredicto"}, messages:[{role:"user",content: buildUserMessage(intake, clasif)}] });
  const tu = r.content.find(b=>b.type==="tool_use") as { input: { cuerpo_texto: string } };
  const pl = PLANTILLAS[clasif.patologia];
  const n = palabrasLibres(tu.input.cuerpo_texto, `${pl.etiqueta} — ${pl.glosa}`);
  largos.push(n);
  console.log(`corrida ${i+1}: ${n} palabras libres`);
}
console.log(`\nmedia: ${Math.round(largos.reduce((a,b)=>a+b,0)/largos.length)} · mín ${Math.min(...largos)} · máx ${Math.max(...largos)}`);
console.log(`pedido actual: 240-270 (techo 338)`);
